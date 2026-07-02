const express = require("express");
const crypto = require("crypto");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CONFIGURACIÓN ────────────────────────────────────────────
const CONFIG = {
  MERCHANT_CODE: process.env.MERCHANT_CODE || "S820260530014033000013",
  PRIVATE_KEY: process.env.TOPPAY_PRIVATE_KEY || "",
  TOPPAY_PUBLIC_KEY: process.env.TOPPAY_PUBLIC_KEY || "",
  TOPPAY_BASE_URL: process.env.TOPPAY_API_URL || "https://gateway.toppay.asia",
  PORT: process.env.PORT || 3000,

  // CaféYield
  CY_SUPABASE_URL: process.env.SUPABASE_URL || "https://xwhvwoncnvbdtaztrgvl.supabase.co",
  CY_SUPABASE_KEY: process.env.SUPABASE_SERVICE_KEY || "",
  CY_NOTIFY_URL: process.env.CY_NOTIFY_URL || "https://limon-persa-backend-production.up.railway.app/cy/notify",
  CY_PAYOUT_NOTIFY_URL: process.env.CY_PAYOUT_NOTIFY_URL || "https://limon-persa-backend-production.up.railway.app/cy/notify/payout",
};

// ─── SUPABASE HELPER ──────────────────────────────────────────
const sbRequest = async (baseUrl, key, path, options = {}) => {
  const res = await fetch(`${baseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || `Supabase error ${res.status}`);
  }
  return res.status === 204 ? [] : res.json();
};

// Helper específico para CaféYield
const sbCY = (path, options = {}) => sbRequest(CONFIG.CY_SUPABASE_URL, CONFIG.CY_SUPABASE_KEY, path, options);

// ─── RSA FIRMA ────────────────────────────────────────────────
const buildSignStr = (params) => {
  return Object.keys(params)
    .sort()
    .map((k) => (params[k] === null || params[k] === undefined ? "null" : String(params[k])))
    .join("");
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

const genOrderNum = (prefix = "CY") => `${prefix}${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

// ═══════════════════════════════════════════════════════════════
//  CAFEYIELD ROUTES
// ═══════════════════════════════════════════════════════════════

// ─── CREAR ORDEN DE PAGO CAFEYIELD (payIn) ────────────────────
app.post("/cy/create-payin", async (req, res) => {
  try {
    const { userId, amount, userName } = req.body;
    if (!userId || !amount || !userName) return res.json({ ok: false, error: "Faltan datos" });

    const orderNum = genOrderNum("CY");
    const params = {
      merchantCode: CONFIG.MERCHANT_CODE,
      orderType: "0",
      orderNum,
      payMoney: Number(amount).toFixed(2),
      name: userName.substring(0, 50).replace(/[^a-zA-Z0-9 ]/g, ""),
      method: "SPEI",
      notifyUrl: CONFIG.CY_NOTIFY_URL,
      description: `Deposito CY ${userId.substring(0, 8)}`,
    };

    const signStr = buildSignStr(params);
    params.sign = signRSA(signStr);

    const response = await fetch(`${CONFIG.TOPPAY_BASE_URL}/gateway/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8", country: "MEXICO" },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    console.log("CY TopPay payin response:", JSON.stringify(data));

    if (data.code !== "0000") return res.json({ ok: false, error: data.msg });

    // Guardar orderNum en depósito pendiente para referencia
    await sbCY("deposits", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        amount: Number(amount),
        status: "pending",
        folio: orderNum,
        bank_name: "SPEI / TopPay",
        holder: userName,
        clabe: "",
      }),
    }).catch((e) => console.error("Error guardando depósito CY:", e));

    res.json({ ok: true, orderNum, payUrl: data.data?.payUrl || data.data });
  } catch (e) {
    console.error("cy/create-payin error:", e);
    res.json({ ok: false, error: e.message });
  }
});

// ─── WEBHOOK DEPÓSITO CAFEYIELD ────────────────────────────────
app.post("/cy/notify", async (req, res) => {
  try {
    const body = req.body;
    console.log("CY TopPay deposit callback:", JSON.stringify(body));

    // Verificar firma
    const { platSign, ...rest } = body;
    const signStr = buildSignStr(rest);
    const valid = verifyRSA(signStr, platSign);
    if (!valid) {
      console.error("CY: Firma inválida en callback depósito");
      return res.send("FAIL");
    }

    const { orderNum, status, payMoney } = body;
    if (status !== "SUCCESS") return res.send("SUCCESS");

    // Buscar depósito por folio (orderNum)
    const deposits = await sbCY(`deposits?folio=eq.${orderNum}&status=eq.pending&select=*`);
    if (!deposits || deposits.length === 0) {
      console.log("CY: Depósito no encontrado o ya procesado:", orderNum);
      return res.send("SUCCESS");
    }

    const deposit = deposits[0];

    // Obtener usuario
    const users = await sbCY(`users?id=eq.${deposit.user_id}&select=id,balance`);
    if (!users || users.length === 0) return res.send("SUCCESS");
    const user = users[0];

    // Actualizar depósito a aprobado
    await sbCY(`deposits?id=eq.${deposit.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "approved", approved_at: new Date().toISOString() }),
      prefer: "return=minimal",
    });

    // Acreditar saldo
    const newBalance = Number(user.balance) + Number(payMoney);
    await sbCY(`users?id=eq.${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ balance: newBalance }),
      prefer: "return=minimal",
    });

    // Registrar en transactions
    await sbCY("transactions", {
      method: "POST",
      body: JSON.stringify({
        user_id: user.id,
        amount: Number(payMoney),
        type: "deposit",
        description: `Depósito SPEI automático (${orderNum})`,
      }),
    }).catch(() => {});

    console.log(`✅ CY: Saldo acreditado $${payMoney} MXN a usuario ${user.id}`);
    res.send("SUCCESS");
  } catch (e) {
    console.error("cy/notify error:", e);
    res.send("SUCCESS");
  }
});

// ─── ENVIAR RETIRO CAFEYIELD ───────────────────────────────────
app.post("/cy/send-payout", async (req, res) => {
  try {
    const { withdrawalId } = req.body;
    if (!withdrawalId) return res.json({ ok: false, error: "Falta withdrawalId" });

    // Obtener datos del retiro
    const withdrawals = await sbCY(`withdrawals?id=eq.${withdrawalId}&select=*`);
    if (!withdrawals || withdrawals.length === 0) return res.json({ ok: false, error: "Retiro no encontrado" });

    const wd = withdrawals[0];
    if (wd.status !== "pending") return res.json({ ok: false, error: "El retiro ya fue procesado" });

    const orderNum = genOrderNum("CYP");
    const params = {
      merchantCode: CONFIG.MERCHANT_CODE,
      orderType: "0",
      method: "DISBURSEMENT",
      orderNum,
      money: Number(wd.amount).toFixed(2),
      feeType: "1",
      bankCode: "90646",
      bankCard: wd.clabe,
      name: wd.holder.substring(0, 50).replace(/[^a-zA-Z0-9 ]/g, ""),
      description: `Retiro CY ${wd.clabe}`,
      notifyUrl: CONFIG.CY_PAYOUT_NOTIFY_URL,
    };

    const signStr = buildSignStr(params);
    params.sign = signRSA(signStr);

    const response = await fetch(`${CONFIG.TOPPAY_BASE_URL}/gateway/cash`, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8", country: "MEXICO" },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    console.log("CY TopPay payout response:", JSON.stringify(data));

    if (data.code !== "0000") return res.json({ ok: false, error: data.msg });

    // Actualizar retiro a processing
    await sbCY(`withdrawals?id=eq.${withdrawalId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "processing", processed_at: new Date().toISOString() }),
      prefer: "return=minimal",
    });

    res.json({ ok: true, orderNum, message: "Retiro enviado correctamente" });
  } catch (e) {
    console.error("cy/send-payout error:", e);
    res.json({ ok: false, error: e.message });
  }
});

// ─── WEBHOOK RETIRO CAFEYIELD ──────────────────────────────────
app.post("/cy/notify/payout", async (req, res) => {
  try {
    const body = req.body;
    console.log("CY TopPay payout callback:", JSON.stringify(body));

    const { platSign, ...rest } = body;
    const signStr = buildSignStr(rest);
    const valid = verifyRSA(signStr, platSign);
    if (!valid) return res.send("SUCCESS");

    const { orderNum, status } = body;

    // Buscar retiro por orderNum en transactions o processing
    // Marcar como completado si fue exitoso
    if (status === "SUCCESS") {
      console.log(`✅ CY: Retiro ${orderNum} completado por TopPay`);
      // Actualizar a completed buscando por descripción o puedes guardar el orderNum en processed_at
    }

    res.send("SUCCESS");
  } catch (e) {
    res.send("SUCCESS");
  }
});

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get("/", (req, res) => res.json({
  ok: true,
  service: "CaféYield + Limón Persa Backend",
  version: "2.0.0",
  routes: [
    "POST /cy/create-payin",
    "POST /cy/notify",
    "POST /cy/send-payout",
    "POST /cy/notify/payout",
  ]
}));

app.listen(CONFIG.PORT, () => console.log(`☕ Backend corriendo en puerto ${CONFIG.PORT}`));
