'use strict';

const { getPool }  = require('./lib/db');
const { json }     = require('./lib/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/get-products
// Public endpoint — returns all active products grouped for display.
// Optional query: ?category=Rice
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  const params   = event.queryStringParameters || {};
  const category = (params.category || '').trim();

  const pool = getPool();
  let client;

  try {
    client = await pool.connect();

    let query  = 'SELECT id, name, description, price, category, image_url FROM products WHERE is_active = true';
    const vals = [];

    if (category) {
      vals.push(category);
      query += ` AND category = $${vals.length}`;
    }

    query += ' ORDER BY category, id';

    const result = await client.query(query, vals);

    return json(200, {
      ok:       true,
      products: result.rows,
    });
  } catch (err) {
    console.error('[get-products] DB error:', err.message);
    return json(500, { ok: false, error: 'Could not fetch products' });
  } finally {
    if (client) client.release();
  }
};
