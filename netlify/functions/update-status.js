'use strict';

const { getPool }                   = require('./lib/db');
const { json, requireAuth, waLink } = require('./lib/helpers');

const ALLOWED_STATUSES = ['placed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/update-status
// Updates an order status (admin only).
// If status is out_for_delivery or delivered, optionally creates notification
// and returns a pre-filled wa_link.
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

  const { order_id, status } = body;

  const orderId = parseInt(order_id, 10);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return json(400, { ok: false, error: 'order_id must be a positive integer' });
  }

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return json(400, {
      ok: false,
      error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
    });
  }

  // ── Database update ───────────────────────────────────────────
  const pool = getPool();
  let client;

  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const updateResult = await client.query(
      `UPDATE orders
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, order_code, customer_name, customer_phone`,
      [status, orderId]
    );

    if (updateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return json(404, { ok: false, error: 'Order not found' });
    }

    const { order_code, customer_name, customer_phone } = updateResult.rows[0];
    const businessName = process.env.BUSINESS_NAME || 'Your Rice Store';

    let message = null;
    let messageType = null;

    if (status === 'out_for_delivery') {
      message = `Hi ${customer_name}, your rice order ${order_code} is out for delivery today! Please keep your phone handy. — ${businessName}`;
      messageType = 'out_for_delivery_notice';
    } else if (status === 'delivered') {
      message = `Hi ${customer_name}, your rice order ${order_code} has been delivered. Thank you for shopping with us! — ${businessName}`;
      messageType = 'delivery_notice';
    }

    let link = null;
    if (message) {
      link = waLink(customer_phone, message);

      await client.query(
        `INSERT INTO notification_log
           (order_id, channel, message_type, phone, message_body, status)
         VALUES ($1, 'whatsapp', $2, $3, $4, 'pending')`,
        [orderId, messageType, customer_phone, message]
      );
    }

    await client.query('COMMIT');

    return json(200, {
      ok: true,
      status,
      wa_link: link,
    });
  } catch (err) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('[update-status] DB error:', err.message);
    return json(500, { ok: false, error: 'Could not update order status' });
  } finally {
    if (client) client.release();
  }
};
