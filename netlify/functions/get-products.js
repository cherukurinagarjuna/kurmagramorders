'use strict';

const { getPool }  = require('./lib/db');
const { json }     = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/get-products
// Public endpoint — returns all active products.
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  const pool = getPool();
  let client;

  try {
    client = await pool.connect();
    const result = await client.query(
      'SELECT id, name, description, price, category, unit, min_qty, image_url FROM products WHERE is_active = true ORDER BY id'
    );

    return json(200, {
      ok: true,
      products: result.rows,
    });
  } catch (err) {
    console.error('[get-products] DB error:', err.message);
    return json(500, { ok: false, error: 'Could not fetch products' });
  } finally {
    if (client) client.release();
  }
};
