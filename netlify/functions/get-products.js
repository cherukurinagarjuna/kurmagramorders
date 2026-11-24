'use strict';

const { getPool }  = require('./lib/db');
const { json }     = require('./lib/helpers');

const CATALOG_PRODUCTS = [
  { id: 'sunni', name: 'సున్నిపిండి', description: 'Sunni Pindi (Herbal Bath Powder)', price: 120, category: 'care', unit: '250g', min_qty: 1 },
  { id: 'anjan', name: 'గో అంజన్ భాం', description: 'Go Anjan Bham (Cow-Ghee Kajal)', price: 150, category: 'cow', unit: '10g', min_qty: 1 },
  { id: 'verm', name: 'వార్మ్ ఆర్క్', description: 'Verm Ark (Vermiwash Plant Tonic)', price: 90, category: 'farm', unit: '500ml', min_qty: 1 },
  { id: 'goark', name: 'గో ఆర్క్', description: 'Go Ark (Sacred Cow Distillate)', price: 140, category: 'cow', unit: '500ml', min_qty: 1 },
  { id: 'pain', name: 'పెయిన్ ఆయిల్', description: 'Herbal Pain Relief Oil', price: 180, category: 'care', unit: '100ml', min_qty: 1 },
  { id: 'rice', name: 'బ్రౌన్ రైస్', description: 'Brown Rice (Natural Farming)', price: 130, category: 'grain', unit: '1kg', min_qty: 1 },
  { id: 'sesame', name: 'నువ్వుల నూనె (గానుగ)', description: 'Cold-Pressed Sesame Oil', price: 220, category: 'oils', unit: '500ml', min_qty: 1 },
  { id: 'groundnut', name: 'పల్లి నూనె (గానుగ)', description: 'Cold-Pressed Groundnut Oil', price: 160, category: 'oils', unit: '500ml', min_qty: 1 }
];

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/get-products
// Public endpoint — returns all active products with fallback.
// ─────────────────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  if (process.env.DATABASE_URL) {
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
      console.warn('[get-products] DB fallback to static catalog:', err.message);
    } finally {
      if (client) client.release();
    }
  }

  return json(200, {
    ok: true,
    products: CATALOG_PRODUCTS,
  });
};
