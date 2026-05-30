const express = require("express");
const crypto = require("crypto");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CONFIGURACIÓN ────────────────────────────────────────────
const CONFIG = {
  MERCHANT_CODE: process.env.MERCHANT_CODE || "TU_MERCHANT_CODE",
  PRIVATE_KEY: process.env.PRIVATE_KEY || "TU_LLAVE_PRIVADA_RSA",
  TOPPAY_PUBLIC_KEY: process.env.TOPPAY_PUBLIC_KEY || "LLAVE_PUBLICA_DE_TOPPAY",
  TOPPAY_BASE_URL: process.env.TOPPAY_BASE_URL || "https://api.toppay.asia",
  SUPABASE_URL: process.env.SUPABASE_URL || "https://ylwqubaxjsgfyrmkridc.supabase.co",
  SUPABASE_KEY: process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsd3F1YmF4anNnZnlybWtyaWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NDA2NzYsImV4cCI6MjA5MzUxNjY3Nn0.ENaQkWOjsuj9BDGEnn1MGOXheYddoiUM-3owF2dJ8qg",
  NOTIFY_URL: process.env.NOTIFY_URL || "https://tu-backend.railway.app/notify",
  PORT: process.env.PORT || 3000,
};

// ─── SUPABASE HELPER ──────────────────────────────────────────
const sb = async (path, options = {}) => {
  const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: CONFIG.SUPABASE_KEY,
      Authorization: `Bearer ${CONFIG.SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || "Supabase error");
  }
  return res.status === 204 ? [] : res.json();
};

// ─── RSA FIRMA ────────────────────────────────────────────────
const buildSignStr = (params) => {
  // Ordenar por ASCII, incluir null como "null"
  const sorted = Object.keys(params)
    .sort()
    .map((k) => (params[k] === null || params[k] === undefined ? "null" : String(params[k])));
  return sorted.join("");
};

const signRSA = (signStr) => {
  const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${CONFIG.PRIVATE_KEY}\n-----END RSA PRIVATE KEY-----`;
  const sign = crypto.createSign("SHA1");
  sign.update(signStr);
  return sign.sign(privateKey, "base64");
};

const verifyRSA = (signStr, signature) => {
  try {
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${CONFIG.TOPPAY_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
    const verify = crypto.createVerify("SHA1");
    verify.update(signStr);
    return verify.verify(publicKey, signature, "base64");
  } catch {
    return false;
  }
};

// ─── GENERAR ORDER NUM ÚNICO ──────────────────────────────────
const genOrderNum = () => `LP${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

// ─── RUTA: CREAR ORDEN DE PAGO (payIn) ───────────────────────
// El admin llama esto para generar una URL de pago para el usuario
app.post("/create-payin", async (req, res) => {
  try {
    const { userId, amount, userName } = req.body;
    if (!userId || !amount || !userName) return res.json({ ok: false, error: "Faltan datos" });

    const orderNum = genOrderNum();
    const params = {
      merchantCode: CONFIG.MERCHANT_CODE,
      orderType: "0",
      orderNum,
      payMoney: Number(amount).toFixed(2),
      name: userName.substring(0, 50).replace(/[^a-zA-Z0-9 ]/g, ""),
      method: "SPEI",
      notifyUrl: CONFIG.NOTIFY_URL,
      description: `Deposito LP ${userId.substring(0, 8)}`,
    };

    const signStr = buildSignStr(params);
    params.sign = signRSA(signStr);

    const response = await fetch(`${CONFIG.TOPPAY_BASE_URL}/gateway/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8", country: "MEXICO" },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    if (data.code !== "0000") return res.json({ ok: false, error: data.msg });

    // Guardar el orderNum en Supabase para referencia
    await sb("deposits", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        amount: Number(amount),
        status: "pending",
        concept: orderNum,
        receipt_url: "",
      }),
    }).catch(() => {});

    res.json({ ok: true, orderNum, payUrl: data.data?.payUrl || data.data });
  } catch (e) {
    console.error("create-payin error:", e);
    res.json({ ok: false, error: e.message });
  }
});

// ─── RUTA: WEBHOOK DE TOPPAY (cuando alguien deposita) ────────
app.post("/notify", async (req, res) => {
  try {
    const body = req.body;
    console.log("TopPay callback:", JSON.stringify(body));

    // Verificar firma de TopPay
    const { platSign, ...rest } = body;
    const signStr = buildSignStr(rest);
    const valid = verifyRSA(signStr, platSign);

    if (!valid) {
      console.error("Firma inválida en callback");
      return res.send("FAIL");
    }

    const { orderNum, status, payMoney } = body;

    // Solo procesar si el pago fue exitoso
    if (status !== "SUCCESS") return res.send("SUCCESS");

    // Buscar el depósito en Supabase por concept (orderNum)
    const deposits = await sb(`deposits?concept=eq.${orderNum}&status=eq.pending&select=*,users(id,balance,phone)`);
    if (!deposits || deposits.length === 0) {
      console.log("Depósito no encontrado o ya procesado:", orderNum);
      return res.send("SUCCESS");
    }

    const deposit = deposits[0];
    const user = deposit.users;
    if (!user) return res.send("SUCCESS");

    // Actualizar depósito a confirmado
    await sb(`deposits?id=eq.${deposit.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "confirmed" }),
      prefer: "return=minimal",
    });

    // Acreditar saldo al usuario
    const newBalance = Number(user.balance) + Number(payMoney);
    await sb(`users?id=eq.${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ balance: newBalance }),
      prefer: "return=minimal",
    });

    // Registrar en earnings_history
    await sb("earnings_history", {
      method: "POST",
      body: JSON.stringify({
        user_id: user.id,
        amount: Number(payMoney),
        type: "deposit",
        description: `Depósito SPEI automático (${orderNum})`,
      }),
    }).catch(() => {});

    console.log(`✅ Saldo acreditado: ${payMoney} MXN a usuario ${user.phone}`);
    res.send("SUCCESS");
  } catch (e) {
    console.error("notify error:", e);
    res.send("SUCCESS"); // Siempre responder SUCCESS para que TopPay no reintente
  }
});

// ─── RUTA: ENVIAR RETIRO (payOut) ─────────────────────────────
// El admin llama esto al aprobar un retiro
app.post("/send-payout", async (req, res) => {
  try {
    const { withdrawalId } = req.body;
    if (!withdrawalId) return res.json({ ok: false, error: "Falta withdrawalId" });

    // Obtener datos del retiro
    const withdrawals = await sb(`withdrawals?id=eq.${withdrawalId}&select=*,users(id,phone)`);
    if (!withdrawals || withdrawals.length === 0) return res.json({ ok: false, error: "Retiro no encontrado" });

    const wd = withdrawals[0];
    if (wd.status !== "pending") return res.json({ ok: false, error: "El retiro ya fue procesado" });

    const orderNum = genOrderNum();
    const params = {
      merchantCode: CONFIG.MERCHANT_CODE,
      orderType: "0",
      method: "DISBURSEMENT",
      orderNum,
      money: Number(wd.amount).toFixed(2),
      feeType: "1", // Comisión del saldo del merchant
      bankCode: wd.bank_code || "90646", // CLABE
      bankCard: wd.clabe,
      name: wd.account_holder.substring(0, 50).replace(/[^a-zA-Z0-9 ]/g, ""),
      description: `Retiro LP ${wd.users?.phone || ""}`,
      notifyUrl: `${CONFIG.NOTIFY_URL}/payout`,
    };

    const signStr = buildSignStr(params);
    params.sign = signRSA(signStr);

    const response = await fetch(`${CONFIG.TOPPAY_BASE_URL}/gateway/cash`, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8", country: "MEXICO" },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    console.log("TopPay payout response:", JSON.stringify(data));

    if (data.code !== "0000") {
      return res.json({ ok: false, error: data.msg });
    }

    // Actualizar retiro a "paid"
    await sb(`withdrawals?id=eq.${withdrawalId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "paid" }),
      prefer: "return=minimal",
    });

    res.json({ ok: true, orderNum, message: "Retiro enviado correctamente" });
  } catch (e) {
    console.error("send-payout error:", e);
    res.json({ ok: false, error: e.message });
  }
});

// ─── RUTA: WEBHOOK RETIRO (confirmación de TopPay) ────────────
app.post("/notify/payout", async (req, res) => {
  try {
    const body = req.body;
    const { platSign, ...rest } = body;
    const signStr = buildSignStr(rest);
    const valid = verifyRSA(signStr, platSign);
    if (!valid) return res.send("SUCCESS");

    const { orderNum, statusMsg } = body;
    console.log(`Payout callback: ${orderNum} - ${statusMsg}`);
    res.send("SUCCESS");
  } catch (e) {
    res.send("SUCCESS");
  }
});

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get("/", (req, res) => res.json({ ok: true, service: "Limón Persa Backend", version: "1.0.0" }));

app.listen(CONFIG.PORT, () => console.log(`🍋 Backend corriendo en puerto ${CONFIG.PORT}`));
