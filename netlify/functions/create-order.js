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
// Accepts:
// {
//   name: string,
//   phone: string,
//   address: string,
//   amount: number,
//   payment_ref: string,  // UTR / Transaction reference or confirmation
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

  const { name, phone, address, amount, items, product_details, payment_ref } = body;

  const cleanName    = validateStr(name, 2, 100);
  const cleanAddress = validateStr(address, 10, 500);
  const cleanPhone   = normalizeIndianPhone(phone);
  const cleanAmount  = validateAmount(amount);
  const cleanRef     = validateStr(payment_ref, 3, 100);

  if (!cleanName) {
    return json(400, { ok: false, error: 'Name must be between 2 and 100 characters' });
  }
  if (!cleanPhone) {
    return json(400, { ok: false, error: 'Phone must be a valid 10-digit Indian mobile number (starting with 6-9)' });
  }
  if (!cleanAddress) {
    return json(400, { ok: false, error: 'Delivery address must be between 10 and 500 characters' });
  }
  if (!cleanAmount) {
    return json(400, { ok: false, error: 'Amount must be a positive number' });
  }
  if (!cleanRef) {
    return json(400, { ok: false, error: 'Please enter your UPI Transaction Ref / UTR number or Payment screenshot note' });
  }

  // Format product_details
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

    // 3. Insert into orders table with payment_ref
    const insertOrder = await client.query(
      `INSERT INTO orders
         (order_code, customer_name, customer_phone, delivery_address,
          product_details, amount, status, payment_ref, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'placed', $7, 'pending_verification')
       RETURNING id`,
      [order_code, cleanName, cleanPhone, cleanAddress, cleanProduct, cleanAmount, cleanRef]
    );
    const orderId = insertOrder.rows[0].id;

    // 4. Build WhatsApp notification link for customer
    const businessPhone = (process.env.BUSINESS_WHATSAPP || '').replace(/\D/g, '');
    const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '');
    const trackLink = siteUrl ? `${siteUrl}/track.html?code=${order_code}` : '';

    const waConfirmationMsg =
      `హరే కృష్ణ! 🙏\n\n` +
      `I have made the UPI payment for my order.\n\n` +
      `📦 *Order Code:* ${order_code}\n` +
      `👤 *Name:* ${cleanName}\n` +
      `📱 *Phone:* ${cleanPhone}\n` +
      `🌾 *Items:* ${cleanProduct}\n` +
      `💰 *Amount Paid:* ₹${cleanAmount}\n` +
      `🔢 *UPI UTR / Ref:* ${cleanRef}\n` +
      `📍 *Delivery Address:* ${cleanAddress}\n\n` +
      `Please find my attached payment screenshot. Kindly verify and confirm dispatch!`;

    const customerWaLink = `https://wa.me/${businessPhone}?text=${encodeURIComponent(waConfirmationMsg)}`;

    // 5. Audit log
    await client.query(
      `INSERT INTO notification_log
         (order_id, channel, message_type, phone, message_body, status)
       VALUES ($1, 'whatsapp', 'order_confirmation', $2, $3, 'pending')`,
      [orderId, cleanPhone, waConfirmationMsg]
    );

    await client.query('COMMIT');

    return json(201, {
      ok: true,
      order_code,
      amount: cleanAmount,
      name: cleanName,
      customer_wa_link: customerWaLink,
    });
  } catch (err) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('[create-order] DB error:', err.message);
    return json(500, { ok: false, error: 'Could not create order' });
  } finally {
    if (client) client.release();
  }
};
