-- =============================================================
-- Shopping Cart & Updated Products for Kurmagramamu
-- Run this in your Neon SQL Editor
-- =============================================================

-- Add unit and min_qty columns if not already existing
ALTER TABLE products ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'kg';
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_qty INTEGER DEFAULT 1;

-- Clear previous products and seed the two active rice products
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, description, price, category, unit, min_qty) VALUES
  ('Premium Rice (5kg Minimum)',
   'Pure traditional natural rice grown without chemicals or pesticides. Flexible quantity with a 5kg minimum order (₹130/kg).',
   130.00,
   'Rice',
   'kg',
   5),
  ('Premium Rice (25kg Bag)',
   'Complete 25kg bulk bag of natural farm-fresh rice. Specially packaged for long-lasting freshness.',
   3000.00,
   'Rice',
   'bag',
   1);

-- ── Cart Items Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id          SERIAL PRIMARY KEY,
  session_id  TEXT NOT NULL,
  product_id  INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(session_id);
