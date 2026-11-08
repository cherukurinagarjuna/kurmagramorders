'use strict';

const { getPool }           = require('./lib/db');
const { json, requireAuth } = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/get-order?id=ORDER_ID
// Returns full details for a single order (admin only).
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  // ── Auth guard ────────────────────────────────────────────────
  if (!requireAuth(event)) {
    return json(401, { ok: false, error: 'Unauthorized' });
  }

  const { id } = event.queryStringParameters || {};
  const orderId = parseInt(id, 10);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return json(400, { ok: false, error: 'id must be a positive integer' });
  }

  const pool = getPool();
  let client;

  try {
    client = await pool.connect();
    const result = await client.query(
      `SELECT
         id,
         order_code,
         customer_name,
         customer_phone,
         delivery_address,
         product_details,
         amount,
         status,
         lr_number,
         transporter,
         created_at,
         shipped_at,
         updated_at
       FROM orders
       WHERE id = $1`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return json(404, { ok: false, error: 'Order not found' });
    }

    return json(200, {
      ok: true,
      order: result.rows[0],
    });
  } catch (err) {
    console.error('[get-order] DB error:', err.message);
    return json(500, { ok: false, error: 'Could not fetch order' });
  } finally {
    if (client) client.release();
  }
};
