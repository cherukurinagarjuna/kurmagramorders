'use strict';

const { getPool }                       = require('./lib/db');
const { json, requireAuth, waLink }     = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/mark-shipped
// Marks an order as shipped and returns a wa.me click-to-chat link
// for the admin to send the customer a manual WhatsApp notification.
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  // ── Auth guard ────────────────────────────────────────────────
  if (!requireAuth(event)) {
    return json(401, { ok: false, error: 'Unauthorized' });
  }

  // ── Parse body ────────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Request body must be valid JSON' });
  }

  const { order_id, lr_number, transporter } = body;

  // ── Validate inputs ───────────────────────────────────────────
  const orderId = parseInt(order_id, 10);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return json(400, { ok: false, error: 'order_id must be a positive integer' });
  }

  const cleanLR = typeof lr_number === 'string' ? lr_number.trim() : '';
  if (!cleanLR) {
    return json(400, { ok: false, error: 'lr_number is required' });
  }

  const cleanTransporter = (
    typeof transporter === 'string' && transporter.trim()
  ) ? transporter.trim() : 'Navata';

  // ── Database transaction ──────────────────────────────────────
  const pool = getPool();
  let client;

  try {
    client = await pool.connect();
    await client.query('BEGIN');

    // 1. Update order status
    const updateResult = await client.query(
      `UPDATE orders
       SET
         status      = 'shipped',
         lr_number   = $1,
         transporter = $2,
         shipped_at  = NOW(),
         updated_at  = NOW()
       WHERE id = $3
       RETURNING order_code, customer_name, customer_phone`,
      [cleanLR, cleanTransporter, orderId]
    );

    if (updateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return json(404, { ok: false, error: 'Order not found' });
    }

    const { order_code, customer_name, customer_phone } = updateResult.rows[0];

    // 2. Build WhatsApp shipping notification message
    const businessName = process.env.BUSINESS_NAME || 'Your Rice Store';
    const siteUrl      = (process.env.SITE_URL || '').replace(/\/$/, '');
    const trackUrl     = `${siteUrl}/track.html?code=${order_code}`;

    const message =
      `Hi ${customer_name}, your rice order ${order_code} has been shipped via ` +
      `${cleanTransporter}. LR number: ${cleanLR}. ` +
      `Track: ${trackUrl} — ${businessName}`;

    // 3. Log notification (pending — admin sends manually via the wa.me link)
    await client.query(
      `INSERT INTO notification_log
         (order_id, channel, message_type, phone, message_body, status)
       VALUES ($1, 'whatsapp', 'shipping_notice', $2, $3, 'pending')`,
      [orderId, customer_phone, message]
    );

    await client.query('COMMIT');

    // 4. Return the wa.me click-to-chat link
    return json(200, {
      ok:      true,
      wa_link: waLink(customer_phone, message),
    });

  } catch (err) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('[mark-shipped] DB error:', err.message);
    return json(500, { ok: false, error: 'Could not mark order as shipped' });
  } finally {
    if (client) client.release();
  }
};
