'use strict';

const { getPool }                               = require('./lib/db');
const { json, normalizeIndianPhone, maskPhone } = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// publicView — Strip sensitive fields before sending to the customer.
// Exposes only what the customer needs to track their order.
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {object} row  Raw DB row from the orders table
 * @returns {object}    Safe public projection
 */
function publicView(row) {
  return {
    order_code:      row.order_code,
    status:          row.status,
    product_details: row.product_details,
    amount:          row.amount,
    lr_number:       row.lr_number   || null,
    transporter:     row.transporter || null,
    created_at:      row.created_at  || null,
    shipped_at:      row.shipped_at  || null,
    // Mask phone — show only +9198XXXXX210 style
    customer_phone:  maskPhone(row.customer_phone),
    // First word of name only — e.g. "Ramesh Kumar" → "Ramesh"
    customer_name:   (row.customer_name || '').split(/\s+/)[0],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler
// GET /api/track-order?code=RICE-2026-0001
// GET /api/track-order?phone=9876543210
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  const params = event.queryStringParameters || {};
  const code   = (params.code  || '').trim();
  const phone  = (params.phone || '').trim();

  // ── Require at least one param ────────────────────────────────
  if (!code && !phone) {
    return json(400, { ok: false, error: 'Provide either code or phone as a query parameter' });
  }

  const pool = getPool();
  let client;

  try {
    client = await pool.connect();

    // ── Lookup by order_code ──────────────────────────────────────
    if (code) {
      const result = await client.query(
        `SELECT
           order_code, status, product_details, amount,
           lr_number, transporter,
           created_at, shipped_at,
           customer_phone, customer_name
         FROM orders
         WHERE order_code = $1`,
        [code.toUpperCase()]
      );

      if (result.rows.length === 0) {
        return json(404, { ok: false, error: 'Order not found' });
      }

      return json(200, {
        ok:     true,
        orders: result.rows.map(publicView),
      });
    }

    // ── Lookup by phone ───────────────────────────────────────────
    const normalizedPhone = normalizeIndianPhone(phone);
    if (!normalizedPhone) {
      return json(400, { ok: false, error: 'Invalid phone number' });
    }

    const result = await client.query(
      `SELECT
         order_code, status, product_details, amount,
         lr_number, transporter,
         created_at, shipped_at,
         customer_phone, customer_name
       FROM orders
       WHERE customer_phone = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [normalizedPhone]
    );

    if (result.rows.length === 0) {
      return json(404, { ok: false, error: 'No orders found for this phone number' });
    }

    return json(200, {
      ok:     true,
      orders: result.rows.map(publicView),
    });

  } catch (err) {
    console.error('[track-order] DB error:', err.message);
    return json(500, { ok: false, error: 'Could not fetch order' });
  } finally {
    if (client) client.release();
  }
};
