-- =============================================================
-- Products Table + Sample Data for Kurmagramamu
-- Run this in your Neon SQL Editor
-- =============================================================

-- ── Products table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL,
  category    TEXT NOT NULL,
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category  ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active);

-- ── Sample products ───────────────────────────────────────────

INSERT INTO products (name, description, price, category, image_url) VALUES
  ('Sona Masoori Rice (25kg)',
   'Traditional hand-pounded Sona Masoori rice grown with natural farming methods. No pesticides, no chemicals.',
   1500.00, 'Rice', NULL),
  ('Ponni Raw Rice (25kg)',
   'Premium quality Ponni raw rice from our organic paddy fields. Perfect for daily cooking.',
   1400.00, 'Rice', NULL),
  ('Brown Rice (10kg)',
   'Unpolished brown rice packed with nutrients and dietary fiber. A healthier choice for your family.',
   800.00, 'Rice', NULL),
  ('Wood-Pressed Coconut Oil (1L)',
   'Pure coconut oil extracted using traditional wooden ghani. Retains natural aroma and nutrients. Great for cooking and hair care.',
   600.00, 'Ganuga Oils', NULL),
  ('Cold-Pressed Sesame Oil (1L)',
   'Nuvvula Nune — Traditional sesame oil cold-pressed in wooden ghani. Rich flavor, ideal for pickles, cooking and Ayurvedic use.',
   450.00, 'Ganuga Oils', NULL),
  ('Wood-Pressed Groundnut Oil (1L)',
   'Verusanaga Nune — Pure groundnut oil extracted using a traditional wooden press. No heat, no chemicals, no refining.',
   500.00, 'Ganuga Oils', NULL),
  ('Cold-Pressed Castor Oil (500ml)',
   'Aamudamu — Traditional castor oil for skin, hair and Ayurvedic remedies. 100% pure and unrefined.',
   350.00, 'Ganuga Oils', NULL),
  ('Herbal Hair Oil (250ml)',
   'A blend of traditional Ayurvedic herbs infused in pure sesame oil. Strengthens roots, prevents hair fall and promotes growth.',
   350.00, 'Ayurvedic', NULL),
  ('Cow Ghee — Desi A2 (500g)',
   'Pure A2 cow ghee made from bilona method (hand-churned curd). From our Goshala desi cows.',
   750.00, 'Ayurvedic', NULL),
  ('Turmeric Powder — Organic (250g)',
   'Pasupu — Sun-dried, stone-ground turmeric with high curcumin content. Grown naturally without any chemicals.',
   200.00, 'Ayurvedic', NULL);
