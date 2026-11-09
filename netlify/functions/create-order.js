'use strict';

const { getPool }                            = require('./lib/db');
const { json, normalizeIndianPhone, waLink } = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// Validation helpers
// ─────────────────────────────────────────────────────────────────────────────

function validateStr(val, min, max) {
  if (typeof val !== 'string') return null;
  const t = val.trim();
  return t.length >= min && t.length <= max ? t : null;
}

function validateAmount(val) {
  const n = Number(val);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler
// Accepts single item or multi-item cart order:
// Body format:
// {
//   name: string,
//   phone: string,
//   address: string,
//   product_details?: string,
//   amount: number,
//   items?: Array<{ name: string, quantity: number, price: number, unit?: string, subtotal: number }>
// }
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Request body must be valid JSON' });
  }

  const { name, phone, address, product_details, amount, items } = body;

  const cleanName    = validateStr(name, 2, 100);
  const cleanAddress = validateStr(address, 10, 500);
  const cleanPhone   = normalizeIndianPhone(phone);
  const cleanAmount  = validateAmount(amount);

  if (!cleanName) {
    return json(400, { ok: false, error: 'Name must be between 2 and 100 characters' });
  }
  if (!cleanPhone) {
    return json(400, { ok: false, error: 'Phone must be a valid 10-digit Indian mobile number (starting with 6-9)' });
  }
  if (!cleanAddress) {
    return json(400, { ok: false, error: 'Address must be between 10 and 500 characters' });
  }
  if (!cleanAmount) {
    return json(400, { ok: false, error: 'Amount must be a positive number' });
  }

  // Format product_details from items list if provided
  let formattedProductDetails = '';
  if (Array.isArray(items) && items.length > 0) {
    formattedProductDetails = items
      .map((item) => `${item.name} x ${item.quantity}${item.unit ? ' ' + item.unit : ''} (₹${item.subtotal || (item.price * item.quantity)})`)
      .join(', ');
  } else if (product_details) {
    formattedProductDetails = String(product_details).trim();
  }

  const cleanProduct = validateStr(formattedProductDetails, 3, 500);
  if (!cleanProduct) {
    return json(400, { ok: false, error: 'Product details or items are required' });
  }

  // Database transaction
  const pool = getPool();
  let client;

  try {
    client = await pool.connect();
    await client.query('BEGIN');

    // 1. Get sequence value
    const seqResult = await client.query("SELECT nextval('order_code_seq') AS n");
    const n = Number(seqResult.rows[0].n);

    // 2. Build human-readable order code
    const year = new Date().getFullYear();
    const order_code = `RICE-${year}-${String(n).padStart(4, '0')}`;

    // 3. Insert into orders table
    const insertOrder = await client.query(
      `INSERT INTO orders
         (order_code, customer_name, customer_phone, delivery_address,
          product_details, amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'placed')
       RETURNING id`,
      [order_code, cleanName, cleanPhone, cleanAddress, cleanProduct, cleanAmount]
    );
    const orderId = insertOrder.rows[0].id;

    // 4. Build WhatsApp confirmation message with Navata notice
    const businessName = process.env.BUSINESS_NAME || 'కూర్మగ్రామము (Kurmagramamu)';
    const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '');
    const trackLink = siteUrl ? `${siteUrl}/track.html?code=${order_code}` : '';

    const message =
      `హరే కృష్ణ! 🙏\n\n` +
      `Hi ${cleanName}, thank you for your order with ${businessName}.\n\n` +
      `📦 *Order Code:* ${order_code}\n` +
      `🌾 *Items:* ${cleanProduct}\n` +
      `💰 *Items Subtotal:* ₹${cleanAmount}\n\n` +
      `🚚 *Shipping Notice:* Shipping charges are extra and calculated based on Navata Transport freight rates (Volume-based). We will update you with the dispatch & LR details soon.\n\n` +
      (trackLink ? `🔍 *Track Order:* ${trackLink}\n\n` : '') +
      `ధన్యవాదాలు!`;

    // 5. Notification log
    await client.query(
      `INSERT INTO notification_log
         (order_id, channel, message_type, phone, message_body, status)
       VALUES ($1, 'whatsapp', 'order_confirmation', $2, $3, 'pending')`,
      [orderId, cleanPhone, message]
    );

    await client.query('COMMIT');

    return json(201, {
      ok: true,
      order_code,
      wa_link: waLink(cleanPhone, message),
    });
  } catch (err) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('[create-order] DB error:', err.message);
    return json(500, { ok: false, error: 'Could not create order' });
  } finally {
    if (client) client.release();
  }
};
