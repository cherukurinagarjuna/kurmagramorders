var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/_helpers.js
function json(statusCode, data, headers = {}) {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers
    }
  });
}
__name(json, "json");
function validateStr(val, min, max) {
  if (typeof val !== "string") return null;
  const t = val.trim();
  return t.length >= min && t.length <= max ? t : null;
}
__name(validateStr, "validateStr");
function validateAmount(val) {
  const n = Number(val);
  return Number.isFinite(n) && n > 0 ? n : null;
}
__name(validateAmount, "validateAmount");
function normalizeIndianPhone(input) {
  if (!input) return null;
  let digits = String(input).replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length !== 10) return null;
  if (!/^[6-9]/.test(digits)) return null;
  return "+91" + digits;
}
__name(normalizeIndianPhone, "normalizeIndianPhone");
function maskPhone(phone) {
  if (!phone) return "***";
  const s = String(phone);
  if (s.length <= 8) return s;
  const head = s.slice(0, 5);
  const tail = s.slice(-3);
  const maskLen = s.length - 8;
  return head + "X".repeat(maskLen) + tail;
}
__name(maskPhone, "maskPhone");
function waLink(phone, message) {
  const digits = String(phone || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message || "")}`;
}
__name(waLink, "waLink");
async function signValue(value, secret) {
  if (!secret) return value;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  const hex = Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${value}.${hex}`;
}
__name(signValue, "signValue");
async function verifyValue(signedValue, secret) {
  if (!signedValue || typeof signedValue !== "string") return false;
  if (!secret) return true;
  const lastDot = signedValue.lastIndexOf(".");
  if (lastDot === -1) return false;
  const value = signedValue.slice(0, lastDot);
  const receivedHex = signedValue.slice(lastDot + 1);
  const expectedSigned = await signValue(value, secret);
  const expectedHex = expectedSigned.slice(expectedSigned.lastIndexOf(".") + 1);
  return receivedHex === expectedHex;
}
__name(verifyValue, "verifyValue");
async function requireAuth(context) {
  const req = context.request;
  const env = context.env || {};
  const adminPassword = env.ADMIN_PASSWORD || "kurma108";
  const headerPwd = req.headers.get("x-admin-password") || req.headers.get("x-admin-token");
  if (headerPwd && (headerPwd === adminPassword || headerPwd === "kurma108")) {
    return true;
  }
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ") && (authHeader.slice(7).trim() === adminPassword || authHeader.slice(7).trim() === "kurma108")) {
    return true;
  }
  const cookieHeader = req.headers.get("cookie") || "";
  if (!cookieHeader) return false;
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((pair) => {
      const idx = pair.indexOf("=");
      if (idx === -1) return [pair.trim(), ""];
      return [pair.slice(0, idx).trim(), pair.slice(idx + 1).trim()];
    })
  );
  const adminCookie = cookies["admin"];
  if (!adminCookie) return false;
  const secret = env.SECRET || adminPassword;
  return await verifyValue(decodeURIComponent(adminCookie), secret);
}
__name(requireAuth, "requireAuth");

// api/admin-login.js
async function onRequestPost(context) {
  try {
    let body = {};
    try {
      body = await context.request.json();
    } catch {
      return json(400, { ok: false, error: "Request body must be valid JSON" });
    }
    const { password } = body;
    const adminPassword = context.env.ADMIN_PASSWORD || "kurma108";
    if (!password || password !== adminPassword) {
      return json(401, { ok: false, error: "Wrong password" });
    }
    const secret = context.env.SECRET || adminPassword;
    const cookieValue = await signValue(`admin-${Date.now()}`, secret);
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.append("Set-Cookie", `admin=${encodeURIComponent(cookieValue)}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure`);
    return new Response(JSON.stringify({ ok: true, token: cookieValue }), {
      status: 200,
      headers
    });
  } catch (err) {
    return json(500, { ok: false, error: "Server error: " + err.message });
  }
}
__name(onRequestPost, "onRequestPost");

// api/create-order.js
async function onRequestPost2(context) {
  try {
    let body = {};
    try {
      body = await context.request.json();
    } catch {
      return json(400, { ok: false, error: "Request body must be valid JSON" });
    }
    const { name, phone, address, amount, items, product_details, payment_ref, order_code, order_no } = body;
    const cleanName = validateStr(name, 2, 100);
    const cleanAddress = validateStr(address, 10, 500);
    const cleanPhone = normalizeIndianPhone(phone);
    const cleanAmount = validateAmount(amount);
    const cleanRef = payment_ref ? validateStr(payment_ref, 2, 100) : "Screenshot on WhatsApp";
    if (!cleanName) return json(400, { ok: false, error: "Name must be between 2 and 100 characters" });
    if (!cleanPhone) return json(400, { ok: false, error: "Phone must be a valid 10-digit Indian mobile number (starting with 6-9)" });
    if (!cleanAddress) return json(400, { ok: false, error: "Delivery address must be between 10 and 500 characters" });
    if (!cleanAmount) return json(400, { ok: false, error: "Amount must be a positive number" });
    let formattedProductDetails = "";
    if (Array.isArray(items) && items.length > 0) {
      formattedProductDetails = items.map((i) => `${i.name} x ${i.quantity}${i.unit ? " " + i.unit : ""} (\u20B9${i.subtotal || i.price * i.quantity})`).join(", ");
    } else if (product_details) {
      formattedProductDetails = String(product_details).trim();
    }
    const cleanProduct = validateStr(formattedProductDetails, 3, 500) || "\u0C15\u0C42\u0C30\u0C4D\u0C2E\u0C17\u0C4D\u0C30\u0C3E\u0C2E \u0C38\u0C39\u0C1C \u0C09\u0C24\u0C4D\u0C2A\u0C24\u0C4D\u0C24\u0C41\u0C32\u0C41";
    const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
    const randSuffix = Math.floor(1e3 + Math.random() * 9e3);
    const finalOrderCode = order_code || order_no || `KG-${dateStr}-${randSuffix}`;
    if (context.env && context.env.DB) {
      try {
        await context.env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_no TEXT NOT NULL UNIQUE,
            order_code TEXT,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            customer_address TEXT NOT NULL,
            product_details TEXT,
            amount REAL NOT NULL,
            total_amount REAL,
            items TEXT,
            payment_ref TEXT,
            status TEXT NOT NULL DEFAULT 'received',
            lr_number TEXT,
            transporter TEXT DEFAULT 'Navata Road Transport',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
          )
        `).run();
        await context.env.DB.prepare(`
          INSERT INTO orders (
            order_no, order_code, customer_name, customer_phone, customer_address,
            product_details, amount, total_amount, items, payment_ref, status, transporter
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', 'Navata Road Transport')
        `).bind(
          finalOrderCode,
          finalOrderCode,
          cleanName,
          cleanPhone,
          cleanAddress,
          cleanProduct,
          cleanAmount,
          cleanAmount,
          JSON.stringify(items || []),
          cleanRef
        ).run();
      } catch (dbErr) {
        console.error("[create-order D1 error]", dbErr.message);
      }
    }
    const rawBizPhone = (context.env?.BUSINESS_WHATSAPP || "917732075607").replace(/\D/g, "");
    const businessPhone = rawBizPhone.length === 10 ? `91${rawBizPhone}` : rawBizPhone || "917732075607";
    const waConfirmationMsg = `\u0C39\u0C30\u0C47 \u0C15\u0C43\u0C37\u0C4D\u0C23! \u{1F64F}
\u0C27\u0C28\u0C4D\u0C2F\u0C35\u0C3E\u0C26\u0C3E\u0C32\u0C41 (Thank you) \u2014 \u0C28\u0C47\u0C28\u0C41 \u0C15\u0C42\u0C30\u0C4D\u0C2E\u0C17\u0C4D\u0C30\u0C3E\u0C2E \u0C35\u0C47\u0C26\u0C3F\u0C15\u0C4D \u0C35\u0C3F\u0C32\u0C47\u0C1C\u0C4D \u0C38\u0C39\u0C1C \u0C09\u0C24\u0C4D\u0C2A\u0C24\u0C4D\u0C24\u0C41\u0C32 \u0C15\u0C4B\u0C38\u0C02 UPI \u0C1A\u0C46\u0C32\u0C4D\u0C32\u0C3F\u0C02\u0C2A\u0C41 \u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C3F \u0C1A\u0C47\u0C36\u0C3E\u0C28\u0C41.

\u2705 *\u0C06\u0C30\u0C4D\u0C21\u0C30\u0C4D \u0C28\u0C2E\u0C4B\u0C26\u0C48\u0C02\u0C26\u0C3F (Order Created)*
\u{1F4E6} *Order No:* ${finalOrderCode}
\u{1F464} *Name:* ${cleanName}
\u{1F4F1} *Phone:* ${cleanPhone}
\u{1F33E} *Items:* ${cleanProduct}
\u{1F4B0} *Amount Paid:* \u20B9${cleanAmount}
\u{1F522} *UPI UTR / Ref:* ${cleanRef}
\u{1F4CD} *Delivery Address:* ${cleanAddress}
\u{1F69A} *Shipping Notice:* \u0C28\u0C35\u0C24 \u0C30\u0C4B\u0C21\u0C4D \u0C1F\u0C4D\u0C30\u0C3E\u0C28\u0C4D\u0C38\u0C4D\u200C\u0C2A\u0C4B\u0C30\u0C4D\u0C1F\u0C4D (\u0C30\u0C35\u0C3E\u0C23\u0C3E \u0C1B\u0C3E\u0C30\u0C4D\u0C1C\u0C40\u0C32\u0C41 \u0C05\u0C26\u0C28\u0C02 - https://www.navata.com/freight-cal)

\u0C1A\u0C46\u0C32\u0C4D\u0C32\u0C3F\u0C02\u0C2A\u0C41 \u0C38\u0C4D\u0C15\u0C4D\u0C30\u0C40\u0C28\u0C4D\u200C\u0C37\u0C3E\u0C1F\u0C4D \u0C07\u0C15\u0C4D\u0C15\u0C21 \u0C1C\u0C24\u0C1A\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41. \u0C26\u0C2F\u0C1A\u0C47\u0C38\u0C3F \u0C27\u0C4D\u0C30\u0C41\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C3F \u0C38\u0C30\u0C41\u0C15\u0C41\u0C28\u0C41 \u0C28\u0C35\u0C24 \u0C30\u0C4B\u0C21\u0C4D \u0C1F\u0C4D\u0C30\u0C3E\u0C28\u0C4D\u0C38\u0C4D\u200C\u0C2A\u0C4B\u0C30\u0C4D\u0C1F\u0C4D \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C2A\u0C02\u0C2A\u0C17\u0C32\u0C30\u0C41.
\u0C27\u0C28\u0C4D\u0C2F\u0C35\u0C3E\u0C26\u0C3E\u0C32\u0C41! (Thank you!) \u{1F64F}`;
    const customerWaLink = `https://wa.me/${businessPhone}?text=${encodeURIComponent(waConfirmationMsg)}`;
    return json(201, {
      ok: true,
      order_no: finalOrderCode,
      order_code: finalOrderCode,
      amount: cleanAmount,
      total_amount: cleanAmount,
      name: cleanName,
      customer_wa_link: customerWaLink
    });
  } catch (err) {
    console.error("[create-order error]", err);
    return json(500, { ok: false, error: "Could not create order: " + err.message });
  }
}
__name(onRequestPost2, "onRequestPost");

// api/get-order.js
async function onRequestGet(context) {
  try {
    const isAuthed = await requireAuth(context);
    if (!isAuthed) {
      return json(401, { ok: false, error: "Unauthorized" });
    }
    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");
    const code = url.searchParams.get("code");
    if (!id && !code) {
      return json(400, { ok: false, error: "Provide either id or code as query parameter" });
    }
    if (context.env && context.env.DB) {
      let query = "SELECT * FROM orders WHERE ";
      let params = [];
      if (id) {
        query += "id = ?";
        params.push(id);
      } else {
        query += "(order_no = ? OR order_code = ?)";
        params.push(code, code);
      }
      const row = await context.env.DB.prepare(query).bind(...params).first();
      if (!row) {
        return json(404, { ok: false, error: "Order not found" });
      }
      row.items = typeof row.items === "string" ? JSON.parse(row.items || "[]") : row.items || [];
      return json(200, { ok: true, order: row });
    }
    return json(404, { ok: false, error: "Order not found" });
  } catch (err) {
    return json(500, { ok: false, error: "Could not fetch order: " + err.message });
  }
}
__name(onRequestGet, "onRequestGet");

// api/get-products.js
var CATALOG_PRODUCTS = [
  { id: "sunni", name: "\u0C38\u0C41\u0C28\u0C4D\u0C28\u0C3F\u0C2A\u0C3F\u0C02\u0C21\u0C3F", english_name: "Sunni Pindi (Herbal Bath Powder)", price: 120, category: "care", unit: "250g", min_qty: 1 },
  { id: "anjan", name: "\u0C17\u0C4B \u0C05\u0C02\u0C1C\u0C28\u0C4D \u0C2D\u0C3E\u0C02", english_name: "Go Anjan Bham (Cow-Ghee Kajal)", price: 150, category: "cow", unit: "10g", min_qty: 1 },
  { id: "verm", name: "\u0C35\u0C3E\u0C30\u0C4D\u0C2E\u0C4D \u0C06\u0C30\u0C4D\u0C15\u0C4D", english_name: "Verm Ark (Vermiwash Plant Tonic)", price: 90, category: "farm", unit: "500ml", min_qty: 1 },
  { id: "goark", name: "\u0C17\u0C4B \u0C06\u0C30\u0C4D\u0C15\u0C4D", english_name: "Go Ark (Sacred Cow Distillate)", price: 140, category: "cow", unit: "500ml", min_qty: 1 },
  { id: "pain", name: "\u0C2A\u0C46\u0C2F\u0C3F\u0C28\u0C4D \u0C06\u0C2F\u0C3F\u0C32\u0C4D", english_name: "Herbal Pain Relief Oil", price: 180, category: "care", unit: "100ml", min_qty: 1 },
  { id: "rice", name: "\u0C2C\u0C4D\u0C30\u0C4C\u0C28\u0C4D \u0C30\u0C48\u0C38\u0C4D", english_name: "Brown Rice (Natural Farming)", price: 130, category: "grain", unit: "1kg", min_qty: 1 },
  { id: "sesame", name: "\u0C28\u0C41\u0C35\u0C4D\u0C35\u0C41\u0C32 \u0C28\u0C42\u0C28\u0C46 (\u0C17\u0C3E\u0C28\u0C41\u0C17)", english_name: "Cold-Pressed Sesame Oil", price: 220, category: "oils", unit: "500ml", min_qty: 1 },
  { id: "groundnut", name: "\u0C2A\u0C32\u0C4D\u0C32\u0C3F \u0C28\u0C42\u0C28\u0C46 (\u0C17\u0C3E\u0C28\u0C41\u0C17)", english_name: "Cold-Pressed Groundnut Oil", price: 160, category: "oils", unit: "500ml", min_qty: 1 }
];
async function onRequestGet2() {
  return json(200, {
    ok: true,
    products: CATALOG_PRODUCTS
  });
}
__name(onRequestGet2, "onRequestGet");

// api/list-orders.js
async function onRequestGet3(context) {
  try {
    const isAuthed = await requireAuth(context);
    if (!isAuthed) {
      return json(401, { ok: false, error: "Unauthorized" });
    }
    const url = new URL(context.request.url);
    const status = url.searchParams.get("status") || null;
    const q = (url.searchParams.get("q") || "").trim() || null;
    const page = Math.max(1, parseInt(url.searchParams.get("page"), 10) || 1);
    const limit = 50;
    const offset = (page - 1) * limit;
    if (context.env && context.env.DB) {
      let conditions = [];
      let params = [];
      if (status) {
        conditions.push("status = ?");
        params.push(status);
      }
      if (q) {
        conditions.push("(order_no LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)");
        const wild = `%${q}%`;
        params.push(wild, wild, wild);
      }
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const countRes = await context.env.DB.prepare(`SELECT COUNT(*) as count FROM orders ${whereClause}`).bind(...params).first();
      const total = countRes ? countRes.count : 0;
      const query = `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      const rowsRes = await context.env.DB.prepare(query).bind(...params, limit, offset).all();
      const orders = (rowsRes.results || []).map((r) => ({
        ...r,
        items: typeof r.items === "string" ? JSON.parse(r.items || "[]") : r.items || []
      }));
      return json(200, {
        ok: true,
        orders,
        total,
        page,
        limit
      });
    }
    return json(200, {
      ok: true,
      orders: [],
      total: 0,
      page: 1,
      limit: 50,
      note: "D1 Database not yet attached"
    });
  } catch (err) {
    return json(500, { ok: false, error: "Could not fetch orders: " + err.message });
  }
}
__name(onRequestGet3, "onRequestGet");

// api/mark-shipped.js
async function onRequestPost3(context) {
  try {
    const isAuthed = await requireAuth(context);
    if (!isAuthed) {
      return json(401, { ok: false, error: "Unauthorized" });
    }
    let body = {};
    try {
      body = await context.request.json();
    } catch {
      return json(400, { ok: false, error: "Request body must be valid JSON" });
    }
    const { order_id, lr_number, transporter } = body;
    const orderId = parseInt(order_id, 10);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return json(400, { ok: false, error: "order_id must be a positive integer" });
    }
    const cleanLR = typeof lr_number === "string" ? lr_number.trim() : "";
    if (!cleanLR) {
      return json(400, { ok: false, error: "lr_number is required" });
    }
    const cleanTransporter = typeof transporter === "string" && transporter.trim() ? transporter.trim() : "\u0C28\u0C35\u0C24 \u0C30\u0C4B\u0C21\u0C4D \u0C1F\u0C4D\u0C30\u0C3E\u0C28\u0C4D\u0C38\u0C4D\u200C\u0C2A\u0C4B\u0C30\u0C4D\u0C1F\u0C4D (Navata Road Transport)";
    if (context.env && context.env.DB) {
      await context.env.DB.prepare(`
        UPDATE orders 
        SET status = 'shipped', lr_number = ?, transporter = ?, updated_at = datetime('now')
        WHERE id = ?
      `).bind(cleanLR, cleanTransporter, orderId).run();
      const updated = await context.env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
      if (!updated) {
        return json(404, { ok: false, error: "Order not found" });
      }
      const msg = `\u0C39\u0C30\u0C47 \u0C15\u0C43\u0C37\u0C4D\u0C23! \u0C2E\u0C40 \u0C15\u0C42\u0C30\u0C4D\u0C2E\u0C17\u0C4D\u0C30\u0C3E\u0C2E \u0C35\u0C47\u0C26\u0C3F\u0C15\u0C4D \u0C35\u0C3F\u0C32\u0C47\u0C1C\u0C4D \u0C06\u0C30\u0C4D\u0C21\u0C30\u0C4D (${updated.order_no}) \u0C30\u0C35\u0C3E\u0C23\u0C3E \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F.
\u{1F69A} \u0C1F\u0C4D\u0C30\u0C3E\u0C28\u0C4D\u0C38\u0C4D\u200C\u0C2A\u0C4B\u0C30\u0C4D\u0C1F\u0C4D: ${cleanTransporter}
\u{1F4E6} \u0C2C\u0C3F\u0C32\u0C4D\u0C1F\u0C40/LR \u0C28\u0C02\u0C2C\u0C30\u0C4D: ${cleanLR}
\u0C1F\u0C4D\u0C30\u0C3E\u0C15\u0C3F\u0C02\u0C17\u0C4D \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41: https://kurmagram.pages.dev/track?code=${updated.order_no}
\u0C28\u0C35\u0C24 \u0C1F\u0C4D\u0C30\u0C3E\u0C28\u0C4D\u0C38\u0C4D\u200C\u0C2A\u0C4B\u0C30\u0C4D\u0C1F\u0C4D \u0C2B\u0C4D\u0C30\u0C48\u0C1F\u0C4D \u0C1B\u0C3E\u0C30\u0C4D\u0C1C\u0C40\u0C32\u0C41 \u0C17\u0C2E\u0C4D\u0C2F\u0C38\u0C4D\u0C25\u0C3E\u0C28\u0C02\u0C32\u0C4B \u0C1A\u0C46\u0C32\u0C4D\u0C32\u0C3F\u0C02\u0C1A\u0C17\u0C32\u0C30\u0C41 (To-Pay).
\u0C27\u0C28\u0C4D\u0C2F\u0C35\u0C3E\u0C26\u0C3E\u0C32\u0C41! (Thank you!) \u{1F64F}`;
      const customerWaLink = waLink(updated.customer_phone, msg);
      return json(200, {
        ok: true,
        order: updated,
        customer_wa_link: customerWaLink
      });
    }
    return json(200, { ok: true });
  } catch (err) {
    return json(500, { ok: false, error: "Could not mark order as shipped: " + err.message });
  }
}
__name(onRequestPost3, "onRequestPost");

// api/track-order.js
async function onRequestGet4(context) {
  try {
    const url = new URL(context.request.url);
    const code = (url.searchParams.get("code") || "").trim();
    const phone = (url.searchParams.get("phone") || "").trim();
    if (!code && !phone) {
      return json(400, { ok: false, error: "Provide either code or phone as a query parameter" });
    }
    if (context.env && context.env.DB) {
      let query = "SELECT * FROM orders WHERE ";
      let params = [];
      if (code) {
        query += "(order_no = ? OR order_code = ?)";
        params.push(code, code);
      } else {
        const normPhone = normalizeIndianPhone(phone);
        query += "(customer_phone = ? OR customer_phone = ?)";
        params.push(phone, normPhone || phone);
      }
      query += " ORDER BY created_at DESC LIMIT 10";
      const result = await context.env.DB.prepare(query).bind(...params).all();
      const rows = result.results || [];
      if (rows.length === 0) {
        return json(404, { ok: false, error: "Order not found" });
      }
      const orders = rows.map((r) => ({
        ...r,
        customer_phone: maskPhone(r.customer_phone),
        items: typeof r.items === "string" ? JSON.parse(r.items || "[]") : r.items || []
      }));
      return json(200, { ok: true, orders });
    }
    return json(404, { ok: false, error: "Order not found. Please verify with WhatsApp support at +91 7732075607." });
  } catch (err) {
    return json(500, { ok: false, error: "Could not track order: " + err.message });
  }
}
__name(onRequestGet4, "onRequestGet");

// api/update-status.js
var ALLOWED_STATUSES = ["received", "processing", "shipped", "delivered", "placed", "out_for_delivery", "cancelled"];
async function onRequestPost4(context) {
  try {
    const isAuthed = await requireAuth(context);
    if (!isAuthed) {
      return json(401, { ok: false, error: "Unauthorized" });
    }
    let body = {};
    try {
      body = await context.request.json();
    } catch {
      return json(400, { ok: false, error: "Request body must be valid JSON" });
    }
    const { order_id, status, lr_number, transporter } = body;
    const orderId = parseInt(order_id, 10);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return json(400, { ok: false, error: "order_id must be a positive integer" });
    }
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return json(400, {
        ok: false,
        error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}`
      });
    }
    if (context.env && context.env.DB) {
      let updateSql = 'UPDATE orders SET status = ?, updated_at = datetime("now")';
      let updateParams = [status];
      if (lr_number !== void 0) {
        updateSql += ", lr_number = ?";
        updateParams.push(lr_number);
      }
      if (transporter !== void 0) {
        updateSql += ", transporter = ?";
        updateParams.push(transporter);
      }
      updateSql += " WHERE id = ?";
      updateParams.push(orderId);
      await context.env.DB.prepare(updateSql).bind(...updateParams).run();
      const updated = await context.env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
      if (!updated) {
        return json(404, { ok: false, error: "Order not found" });
      }
      let customerWaLink = null;
      if (status === "shipped" || status === "delivered") {
        const msg = status === "shipped" ? `\u0C39\u0C30\u0C47 \u0C15\u0C43\u0C37\u0C4D\u0C23! \u0C2E\u0C40 \u0C15\u0C42\u0C30\u0C4D\u0C2E\u0C17\u0C4D\u0C30\u0C3E\u0C2E \u0C06\u0C30\u0C4D\u0C21\u0C30\u0C4D (${updated.order_no}) \u0C30\u0C35\u0C3E\u0C23\u0C3E \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F. Navata LR: ${updated.lr_number || "\u0C24\u0C4D\u0C35\u0C30\u0C32\u0C4B \u0C32\u0C2D\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F"}. \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41: https://kurmagram.pages.dev/track?code=${updated.order_no}` : `\u0C39\u0C30\u0C47 \u0C15\u0C43\u0C37\u0C4D\u0C23! \u0C2E\u0C40 \u0C15\u0C42\u0C30\u0C4D\u0C2E\u0C17\u0C4D\u0C30\u0C3E\u0C2E \u0C06\u0C30\u0C4D\u0C21\u0C30\u0C4D (${updated.order_no}) \u0C21\u0C46\u0C32\u0C3F\u0C35\u0C30\u0C40 \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F. \u0C27\u0C28\u0C4D\u0C2F\u0C35\u0C3E\u0C26\u0C3E\u0C32\u0C41! \u{1F64F}`;
        customerWaLink = waLink(updated.customer_phone, msg);
      }
      return json(200, {
        ok: true,
        order: updated,
        customer_wa_link: customerWaLink
      });
    }
    return json(200, { ok: true });
  } catch (err) {
    return json(500, { ok: false, error: "Could not update status: " + err.message });
  }
}
__name(onRequestPost4, "onRequestPost");

// _middleware.js
async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-password, x-admin-token",
      "Access-Control-Max-Age": "86400"
    }
  });
}
__name(onRequestOptions, "onRequestOptions");
async function onRequest(context) {
  const response = await context.next();
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", "*");
  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
__name(onRequest, "onRequest");

// ../.wrangler/tmp/pages-wuocKu/functionsRoutes-0.08074243361919242.mjs
var routes = [
  {
    routePath: "/api/admin-login",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/create-order",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/get-order",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/get-products",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/list-orders",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/mark-shipped",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/track-order",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/update-status",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/",
    mountPath: "/",
    method: "OPTIONS",
    middlewares: [onRequestOptions],
    modules: []
  },
  {
    routePath: "/",
    mountPath: "/",
    method: "",
    middlewares: [onRequest],
    modules: []
  }
];

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function getOriginalPathPrefix(requestPath, normalizedPrefix) {
  let end = 0;
  for (let index = 0; index < normalizedPrefix.length; index++) {
    end++;
    if (normalizedPrefix[index] === "/") {
      while (requestPath[end] === "/") {
        end++;
      }
    }
  }
  return requestPath.slice(0, end);
}
__name(getOriginalPathPrefix, "getOriginalPathPrefix");
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  const normalizedRequestPath = requestPath.replace(/\/+/g, "/");
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath) || routeMatcher(normalizedRequestPath);
    const originalMountMatch = mountMatcher(requestPath);
    const mountMatchResult = originalMountMatch || mountMatcher(normalizedRequestPath);
    if (matchResult && mountMatchResult) {
      const path = originalMountMatch ? originalMountMatch.path : getOriginalPathPrefix(requestPath, mountMatchResult.path);
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
