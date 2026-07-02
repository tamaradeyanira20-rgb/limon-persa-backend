const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const CONFIG = {
  MERCHANT_CODE: process.env.MERCHANT_CODE || "S820260530014033000013",
  PRIVATE_KEY: process.env.RSA_PRIVATE_KEY || process.env.PRIVATE_KEY || process.env.TOPPAY_PRIVATE_KEY || "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAIHRs9uWfIRJ2OfT+7fYTaYnpg5ytDG1VzfS2QwTgJw2Gbe4fE/7Qi/cwNUxXl8HsvN5ITGpdlp8Uw358QclrG8dWKT7ppwzC7xIhBrqgm9teKK1sn997RUlqho0q8VnTxJ+89SMvj5svYsxhcH+bV9lr3PkDDogjdlKSUfj+DwnAgMBAAECgYA9W+Cm6XnxDPZ4nLldK9+HqTXTnmONGykeOYpdKtqe+vMs4wXex+OAu9Zo7eys/faXHamSz4YhPqIC+R/zQNs+9VXt172UYymQG1XxxWDvgVhZMoFSe/u4xZpu0aUpOSQLp59q1nBztet4pMxGtbXJg7mpnmdG0Q7Cc7I/bK+gAQJBAPbBV8Hng7W/bAYFZKUQ87b1ia10S+PtYqmms3YNnTsamdCttQ69rxaUTGtx75wfSllCYa7B5AOn7gA7dAXpiBcCQQCGrtAFjYp3fzISDFsR+5/s7TFF6HlxJ3Wlo8LxOsLlv4oJ83VDEN9qiBEm1IUk+oS0mSBKTsoCzW1iel0h5mZxAkEAwpbh/9X09gTIyU7DebCOoT+snQ7TMiFn5uXBLF28Gnn1xqzV1ZQcWTAFu82T6Yh7dzx0D/5zM7bgZ2p7KpZpbQJAbOXf8P123hQMaidvY2Tu9GT8mCfWObXMHDgDIYV/nMB4Xn9pauaznrGSHLFtTm746gV95Fc8Y3OyZBPIRebDIQJAZVAnLLWMBgNoPdmaP3KtaiOTnZq86wZ1a7MdZOkcXbLYmgz0gb9NJ4R0xerWo/0Je6A5FwpelxaI4s/qoi+6pg==",
  TOPPAY_PUBLIC_KEY: process.env.TOPPAY_PUBLIC_KEY || "",
  TOPPAY_BASE_URL: process.env.TOPPAY_API_URL || "https://globalpay.mx-checkout.com",
  PORT: process.env.PORT || 3000,
  CY_SUPABASE_URL: process.env.SUPABASE_URL || "https://xwhvwoncnvbdtaztrgvl.supabase.co",
  CY_SUPABASE_KEY: process.env.SUPABASE_SERVICE_KEY || "",
  CY_NOTIFY_URL: process.env.CY_NOTIFY_URL || "https://limon-persa-backend-production.up.railway.app/cy/notify",
  CY_PAYOUT_NOTIFY_URL: process.env.CY_PAYOUT_NOTIFY_URL || "https://limon-persa-backend-production.up.railway.app/cy/notify/payout",
};

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

const sbCY = (path, options = {}) => sbRequest(CONFIG.CY_SUPABASE_URL, CONFIG.CY_SUPABASE_KEY, path, options);

// ─── RSA FIRMA ────────────────────────────────────────────────
// TopPay: concatenar valores ordenados por key ASCII, sin separadores
const buildSignStr = (params) => {
  const str = Object.keys(params)
    .filter(k => k !== 'sign' && params[k] !== null && params[k] !== undefined && params[k] !== '')
    .sort()
    .map(k => String(params[k]))
    .join('');
  console.log("signStr:", str);
  return str;
};

const formatKey = (key, type) => {
  if (!key) throw new Error(`Llave ${type} no configurada`);
  if (key.includes('-----BEGIN')) return key;
  const clean = key.replace(/[\s\r\n]/g, '');
  const lines = [];
  for (let i = 0; i < clean.length; i += 64) lines.push(clean.slice(i, i + 64));
  if (type === 'private') {
    const isPKCS8 = clean.startsWith('MIICdg') || clean.startsWith('MIIEvA') || 
                    clean.startsWith('MIIEow') || clean.startsWith('MIICdw') && clean.includes('AQEFAA');
    const header = isPKCS8 ? 'PRIVATE KEY' : 'RSA PRIVATE KEY';
    console.log("KEY FORMAT:", header, "starts:", clean.substring(0, 10));
    return `-----BEGIN ${header}-----\n${lines.join('\n')}\n-----END ${header}-----`;
  }
  return `-----BEGIN PUBLIC KEY-----\n${lines.join('\n')}\n-----END PUBLIC KEY-----`;
};

const signRSA = (signStr) => {
  const privateKey = formatKey(CONFIG.PRIVATE_KEY, 'private');
  // TopPay usa cifrado RSA por bloques con llave privada (código oficial TopPay Node.js)
  const buffer = Buffer.from(signStr, 'utf8');
  const maxBlockSize = 117;
  let offset = 0;
  let encryptedBuffer = Buffer.alloc(0);
  while (offset < buffer.length) {
    const block = buffer.slice(offset, Math.min(offset + maxBlockSize, buffer.length));
    const encryptedBlock = crypto.privateEncrypt(
      { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
      block
    );
    encryptedBuffer = Buffer.concat([encryptedBuffer, encryptedBlock]);
    offset += block.length;
  }
  return encryptedBuffer.toString('base64');
};

const verifyRSA = (signStr, signature) => {
  try {
    const publicKey = formatKey(CONFIG.TOPPAY_PUBLIC_KEY, 'public');
    const verify = crypto.createVerify("SHA1");
    verify.update(signStr);
    return verify.verify(publicKey, signature, "base64");
  } catch { return false; }
};

const genOrderNum = (prefix = "CY") => `${prefix}${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

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
    console.log("CY payin response:", JSON.stringify(data));

    if (data.platRespCode !== "SUCCESS") return res.json({ ok: false, error: data.platRespMessage || JSON.stringify(data) });

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
    }).catch((e) => console.error("Error guardando depósito:", e));

    const payData = data.payData || data.data?.payData || data.data?.payUrl || '';
    const bankName = data.orgName || data.data?.orgName || 'STP';
    res.json({ ok: true, orderNum, clabe: payData, bankName });
  } catch (e) {
    console.error("cy/create-payin error:", e.message);
    res.json({ ok: false, error: e.message });
  }
});

app.post("/cy/notify", async (req, res) => {
  try {
    const body = req.body;
    console.log("CY deposit callback:", JSON.stringify(body));
    const { platSign, ...rest } = body;
    const signStr = buildSignStr(rest);
    const valid = verifyRSA(signStr, platSign);
    if (!valid) { console.error("CY: Firma inválida"); return res.send("FAIL"); }
    const { orderNum, status, payMoney } = body;
    if (status !== "SUCCESS") return res.send("SUCCESS");
    const deposits = await sbCY(`deposits?folio=eq.${orderNum}&status=eq.pending&select=*`);
    if (!deposits || deposits.length === 0) return res.send("SUCCESS");
    const deposit = deposits[0];
    const users = await sbCY(`users?id=eq.${deposit.user_id}&select=id,balance`);
    if (!users || users.length === 0) return res.send("SUCCESS");
    const user = users[0];
    await sbCY(`deposits?id=eq.${deposit.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "approved", approved_at: new Date().toISOString() }),
      prefer: "return=minimal",
    });
    const newBalance = Number(user.balance) + Number(payMoney);
    await sbCY(`users?id=eq.${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ balance: newBalance }),
      prefer: "return=minimal",
    });
    await sbCY("transactions", {
      method: "POST",
      body: JSON.stringify({ user_id: user.id, amount: Number(payMoney), type: "deposit", description: `Depósito SPEI (${orderNum})` }),
    }).catch(() => {});
    console.log(`✅ CY: $${payMoney} acreditados a ${user.id}`);
    res.send("SUCCESS");
  } catch (e) {
    console.error("cy/notify error:", e);
    res.send("SUCCESS");
  }
});

app.post("/cy/send-payout", async (req, res) => {
  try {
    const { withdrawalId } = req.body;
    if (!withdrawalId) return res.json({ ok: false, error: "Falta withdrawalId" });
    const withdrawals = await sbCY(`withdrawals?id=eq.${withdrawalId}&select=*`);
    if (!withdrawals || withdrawals.length === 0) return res.json({ ok: false, error: "Retiro no encontrado" });
    const wd = withdrawals[0];
    if (wd.status !== "pending") return res.json({ ok: false, error: "Ya procesado" });
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
    console.log("CY payout response:", JSON.stringify(data));
    if (data.platRespCode !== "SUCCESS") return res.json({ ok: false, error: data.platRespMessage || JSON.stringify(data) });
    await sbCY(`withdrawals?id=eq.${withdrawalId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "processing", processed_at: new Date().toISOString() }),
      prefer: "return=minimal",
    });
    res.json({ ok: true, orderNum, message: "Retiro enviado" });
  } catch (e) {
    console.error("cy/send-payout error:", e.message);
    res.json({ ok: false, error: e.message });
  }
});

app.post("/cy/notify/payout", async (req, res) => {
  try {
    const body = req.body;
    const { platSign, ...rest } = body;
    if (body.status === "SUCCESS") console.log(`✅ CY: Retiro ${body.orderNum} completado`);
    res.send("SUCCESS");
  } catch (e) { res.send("SUCCESS"); }
});

app.get("/", (req, res) => res.json({
  ok: true, service: "CaféYield + Limón Persa Backend", version: "2.0.0",
  routes: ["POST /cy/create-payin", "POST /cy/notify", "POST /cy/send-payout", "POST /cy/notify/payout"]
}));

app.listen(CONFIG.PORT, () => console.log(`☕ Backend corriendo en puerto ${CONFIG.PORT}`));

process.on('uncaughtException', (err) => console.error('Error:', err.message));
process.on('unhandledRejection', (reason) => console.error('Rejected:', reason));
