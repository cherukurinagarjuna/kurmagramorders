'use strict';

const fs = require('fs');
const path = require('path');
const { normalizeIndianPhone, maskPhone } = require('./helpers');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory and file exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

// Read orders from JSON file
function readOrdersFromFile() {
  try {
    ensureDataFile();
    const content = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('[orders-db] Error reading orders file:', err.message);
    return [];
  }
}

// Write orders to JSON file safely
function writeOrdersToFile(orders) {
  try {
    ensureDataFile();
    const tempFile = `${ORDERS_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(orders, null, 2), 'utf8');
    fs.renameSync(tempFile, ORDERS_FILE);
    return true;
  } catch (err) {
    console.error('[orders-db] Error writing orders file:', err.message);
    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
      return true;
    } catch (e) {
      console.error('[orders-db] Fallback write failed:', e.message);
      return false;
    }
  }
}

// Optional PostgreSQL sync with circuit breaker (non-blocking, fails gracefully)
let pgDisabledUntil = 0;

async function syncToPg(order) {
  if (!process.env.DATABASE_URL) return;
  if (Date.now() < pgDisabledUntil) return;

  let client;
  try {
    const { getPool } = require('./db');
    const pool = getPool();
    client = await pool.connect();
    
    // Catch connection errors on client to prevent unhandled error crashes
    client.on('error', (err) => {
      console.warn('[pg-client error caught]', err.message);
    });

    const itemsJson = JSON.stringify(order.items || []);
    await client.query(
      `INSERT INTO orders
         (order_code, order_no, customer_name, customer_phone, delivery_address,
          customer_address, product_details, items, amount, total_amount, status, payment_ref, payment_status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       ON CONFLICT (order_code) DO NOTHING`,
      [
        order.order_code,
        order.order_no,
        order.customer_name,
        order.customer_phone,
        order.delivery_address,
        order.customer_address,
        order.product_details,
        itemsJson,
        order.amount,
        order.total_amount,
        order.status,
        order.payment_ref,
        order.payment_status,
        order.created_at,
        order.updated_at
      ]
    );
  } catch (err) {
    // If PG connection fails, pause attempts for 5 minutes
    pgDisabledUntil = Date.now() + 300000;
  } finally {
    if (client) {
      try { client.release(); } catch (_) {}
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public view projection for customer tracking
// ─────────────────────────────────────────────────────────────────────────────
function publicView(order) {
  return {
    order_code:      order.order_code,
    order_no:        order.order_no,
    status:          order.status,
    product_details: order.product_details,
    amount:          order.amount,
    lr_number:       order.lr_number || null,
    transporter:     order.transporter || null,
    created_at:      order.created_at || null,
    shipped_at:      order.shipped_at || null,
    customer_phone:  maskPhone(order.customer_phone),
    customer_name:   (order.customer_name || '').split(/\s+/)[0],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Order
// ─────────────────────────────────────────────────────────────────────────────
async function createOrder(data) {
  const orders = readOrdersFromFile();

  const maxId = orders.reduce((max, o) => Math.max(max, parseInt(o.id, 10) || 0), 0);
  const newId = maxId + 1;

  // Generate canonical code if not supplied by client
  let code = data.order_code || data.order_no;
  if (!code) {
    const d = new Date();
    const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
    code = `KG-${dateStr}-${String(newId).padStart(4, '0')}`;
  }

  const cleanPhone = normalizeIndianPhone(data.phone || data.customer_phone);
  const now = new Date().toISOString();
  const amount = Number(data.amount) || 0;
  const total_amount = Math.round(amount * 100);

  const newOrder = {
    id: newId,
    order_code: code,
    order_no: code,
    customer_name: (data.name || data.customer_name || '').trim(),
    customer_phone: cleanPhone || String(data.phone || '').trim(),
    delivery_address: (data.address || data.delivery_address || '').trim(),
    customer_address: (data.address || data.customer_address || '').trim(),
    product_details: (data.product_details || '').trim(),
    items: Array.isArray(data.items) ? data.items : [],
    amount,
    total_amount,
    status: data.status || 'received',
    lr_number: data.lr_number || null,
    transporter: data.transporter || 'నవత రోడ్ ట్రాన్స్‌పోర్ట్ (Navata Road Transport)',
    payment_ref: data.payment_ref || 'Screenshot on WhatsApp',
    payment_status: data.payment_status || 'pending_verification',
    created_at: data.created_at || now,
    shipped_at: data.shipped_at || null,
    updated_at: data.updated_at || now
  };

  // Add to beginning of array
  orders.unshift(newOrder);
  writeOrdersToFile(orders);

  // Background sync to PG if available
  syncToPg(newOrder).catch(() => {});

  return newOrder;
}

// ─────────────────────────────────────────────────────────────────────────────
// List Orders (for Admin Dashboard)
// ─────────────────────────────────────────────────────────────────────────────
async function listOrders({ status, q, page = 1, limit = 50 } = {}) {
  let orders = readOrdersFromFile();

  // Filter by status
  if (status) {
    if (status === 'received') {
      orders = orders.filter(o => o.status === 'received' || o.status === 'placed');
    } else {
      orders = orders.filter(o => o.status === status);
    }
  }

  // Filter by search query
  if (q) {
    const term = q.trim().toLowerCase();
    orders = orders.filter(o => {
      const code = (o.order_code || o.order_no || '').toLowerCase();
      const name = (o.customer_name || '').toLowerCase();
      const phone = (o.customer_phone || '').toLowerCase();
      return code.includes(term) || name.includes(term) || phone.includes(term);
    });
  }

  // Sort descending by created_at or id
  orders.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const total = orders.length;
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, parseInt(limit, 10) || 50);
  const offset = (p - 1) * l;
  const paginatedOrders = orders.slice(offset, offset + l);

  return {
    orders: paginatedOrders,
    total,
    page: p,
    limit: l
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Track Order (Customer facing)
// ─────────────────────────────────────────────────────────────────────────────
async function trackOrder({ code, phone }) {
  const orders = readOrdersFromFile();
  let matches = [];

  if (code) {
    const searchCode = code.trim().toUpperCase();
    matches = orders.filter(o => 
      (o.order_code && o.order_code.toUpperCase() === searchCode) ||
      (o.order_no && o.order_no.toUpperCase() === searchCode)
    );
  } else if (phone) {
    const digits = String(phone).replace(/\D/g, '');
    const last10 = digits.length >= 10 ? digits.slice(-10) : digits;
    matches = orders.filter(o => {
      const pDigits = String(o.customer_phone || '').replace(/\D/g, '');
      return pDigits.endsWith(last10);
    });
  }

  return matches.map(publicView);
}

// ─────────────────────────────────────────────────────────────────────────────
// Get Single Order (Admin details)
// ─────────────────────────────────────────────────────────────────────────────
async function getOrder({ id, code }) {
  const orders = readOrdersFromFile();
  if (id) {
    const numId = parseInt(id, 10);
    return orders.find(o => parseInt(o.id, 10) === numId) || null;
  }
  if (code) {
    const searchCode = code.trim().toUpperCase();
    return orders.find(o => 
      (o.order_code && o.order_code.toUpperCase() === searchCode) ||
      (o.order_no && o.order_no.toUpperCase() === searchCode)
    ) || null;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Update Status
// ─────────────────────────────────────────────────────────────────────────────
async function updateStatus({ order_id, status, lr_number, transporter }) {
  const orders = readOrdersFromFile();
  const numId = parseInt(order_id, 10);
  const order = orders.find(o => parseInt(o.id, 10) === numId);

  if (!order) return null;

  order.status = status;
  order.updated_at = new Date().toISOString();

  if (lr_number !== undefined) order.lr_number = lr_number;
  if (transporter !== undefined) order.transporter = transporter;
  if (status === 'shipped' && !order.shipped_at) {
    order.shipped_at = new Date().toISOString();
  }

  writeOrdersToFile(orders);
  return order;
}

module.exports = {
  createOrder,
  listOrders,
  trackOrder,
  getOrder,
  updateStatus,
  readOrdersFromFile,
  writeOrdersToFile,
  publicView
};
