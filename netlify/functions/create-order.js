'use strict';

const { getPool }                                        = require('./lib/db');
const { json, normalizeIndianPhone, waLink }             = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// Validation helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a trimmed string if it's within [min, max] chars, else null.
 * @param {unknown} val
 * @param {number}  min
 * @param {number}  max
 * @returns {string|null}
 */
function validateStr(val, min, max) {
  if (typeof val !== 'string') return null;
  const t = val.trim();
  return t.length >= min && t.length <= max ? t : null;
}

/**
 * Returns the number if it is a finite positive number, else null.
 * Accepts numeric strings too (the JSON body parser already coerces, but
 * the front-end sometimes sends a string from <input type="number">).
 * @param {unknown} val
 * @returns {number|null}
 */
function validateAmount(val) {
  const n = Number(val);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  // ── Method guard ──────────────────────────────────────────────
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  // ── Parse body ────────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Request body must be valid JSON' });
  }

  const { name, phone, address, product_details, amount } = body;

  // ── Validate fields ───────────────────────────────────────────
  const cleanName    = validateStr(name,            2,   100);
  const cleanAddress = validateStr(address,         10,  500);
  const cleanProduct = validateStr(product_details, 3,   300);
  const cleanPhone   = normalizeIndianPhone(phone);
  const cleanAmount  = validateAmount(amount);

  if (!cleanName) {
    return json(400, { ok: false, error: 'name must be between 2 and 100 characters' });
  }
  if (!cleanPhone) {
    return json(400, { ok: false, error: 'phone must be a valid 10-digit Indian mobile number (starting with 6-9)' });
  }
  if (!cleanAddress) {
    return json(400, { ok: false, error: 'address must be between 10 and 500 characters' });
  }
  if (!cleanProduct) {
    return json(400, { ok: false, error: 'product_details must be between 3 and 300 characters' });
  }
  if (!cleanAmount) {
    return json(400, { ok: false, error: 'amount must be a positive number' });
  }

  // ── Database transaction ──────────────────────────────────────
  const pool = getPool();
  let client;

  try {
    client = await pool.connect();
    await client.query('BEGIN');

    // 1. Get next sequence value
    const seqResult = await client.query("SELECT nextval('order_code_seq') AS n");
    const n         = Number(seqResult.rows[0].n);

    // 2. Build human-readable order code
    const year       = new Date().getFullYear();
    const order_code = `RICE-${year}-${String(n).padStart(4, '0')}`;

    // 3. Insert order
    const insertOrder = await client.query(
      `INSERT INTO orders
         (order_code, customer_name, customer_phone, delivery_address,
          product_details, amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'placed')
       RETURNING id`,
      [order_code, cleanName, cleanPhone, cleanAddress, cleanProduct, cleanAmount]
    );
    const orderId = insertOrder.rows[0].id;

    // 4. Build WhatsApp confirmation message
    const businessName = process.env.BUSINESS_NAME || 'Your Rice Store';
    const message =
      `Hi ${cleanName}, your rice order ${order_code} has been received. ` +
      `Amount: Rs.${cleanAmount}. ` +
      `We'll notify you when it ships. — ${businessName}`;

    // 5. Log notification (pending — admin sends it manually via wa.me link)
    await client.query(
      `INSERT INTO notification_log
         (order_id, channel, message_type, phone, message_body, status)
       VALUES ($1, 'whatsapp', 'order_confirmation', $2, $3, 'pending')`,
      [orderId, cleanPhone, message]
    );

    await client.query('COMMIT');

    // 6. Return order code + wa.me click-to-chat link
    return json(201, {
      ok:         true,
      order_code,
      wa_link:    waLink(cleanPhone, message),
    });

  } catch (err) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('[create-order] DB error:', err.message);
    return json(500, { ok: false, error: 'Could not create order' });
  } finally {
    if (client) client.release();
  }
};
