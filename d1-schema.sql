-- =============================================================================
-- KURMAGRAM VEDIC VILLAGE — CLOUDFLARE D1 (SQLITE) DATABASE SCHEMA
-- Free Serverless SQL Database for Cloudflare Pages Functions
-- Execute via Cloudflare Dashboard D1 Console or Wrangler CLI:
--   npx wrangler d1 execute <database-name> --file=./d1-schema.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT NOT NULL UNIQUE,
  order_code TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  product_details TEXT,
  amount REAL NOT NULL,
  total_amount REAL,
  items TEXT DEFAULT '[]',
  payment_ref TEXT,
  payment_status TEXT DEFAULT 'pending_verification',
  status TEXT NOT NULL DEFAULT 'received',
  lr_number TEXT,
  transporter TEXT DEFAULT 'Navata Road Transport',
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
