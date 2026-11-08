'use strict';

const { getPool }       = require('./lib/db');
const { json, requireAuth } = require('./lib/helpers');

const PAGE_SIZE = 20;

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/list-orders
// Returns a paginated list of orders for the admin dashboard.
// Query params:
//   status  — filter by order status (placed|shipped|delivered|cancelled)
//   q       — search string matched against order_code, customer_name, customer_phone
//   page    — page number, 1-based (default 1)
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  // ── Auth guard ────────────────────────────────────────────────
  if (!requireAuth(event)) {
    return json(401, { ok: false, error: 'Unauthorized' });
  }

  // ── Parse query params ────────────────────────────────────────
  const params = event.queryStringParameters || {};
  const status = params.status || null;
  const q      = (params.q || '').trim() || null;
  const page   = Math.max(1, parseInt(params.page, 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  // ── Build dynamic WHERE clause ────────────────────────────────
  const conditions = [];
  const values     = [];

  if (status) {
    values.push(status);
    conditions.push(`o.status = $${values.length}`);
  }

  if (q) {
    const like = `%${q}%`;
    values.push(like);
    const idx = values.length;
    conditions.push(
      `(o.order_code ILIKE $${idx} OR o.customer_name ILIKE $${idx} OR o.customer_phone ILIKE $${idx})`
    );
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // ── Query ─────────────────────────────────────────────────────
  const pool = getPool();
  let client;

  try {
    client = await pool.connect();

    // Total count for pagination
    const countResult = await client.query(
      `SELECT COUNT(*) AS total FROM orders o ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Paginated rows — push LIMIT and OFFSET as the final params
    values.push(PAGE_SIZE);
    const limitIdx = values.length;
    values.push(offset);
    const offsetIdx = values.length;

    const ordersResult = await client.query(
      `SELECT
         o.id,
         o.order_code,
         o.customer_name,
         o.customer_phone,
         o.delivery_address,
         o.product_details,
         o.amount,
         o.status,
         o.lr_number,
         o.transporter,
         o.created_at,
         o.shipped_at,
         o.updated_at
       FROM orders o
       ${where}
       ORDER BY o.created_at DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      values
    );

    return json(200, {
      ok:     true,
      orders: ordersResult.rows,
      total,
      page,
      limit:  PAGE_SIZE,
    });

  } catch (err) {
    console.error('[list-orders] DB error:', err.message);
    return json(500, { ok: false, error: 'Could not fetch orders' });
  } finally {
    if (client) client.release();
  }
};
