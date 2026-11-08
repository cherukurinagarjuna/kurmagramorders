-- =============================================================
-- Rice Order Tracker — Postgres Schema
-- Apply with: npm run db:init
-- =============================================================

-- ── Sequence for human-readable order codes ───────────────────
-- Generates codes like ORD-000001, ORD-000002, …
CREATE SEQUENCE IF NOT EXISTS order_code_seq
  START 1
  INCREMENT 1
  NO MAXVALUE
  CACHE 1;

-- ── orders ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,

  -- Human-readable code shown to customers, e.g. ORD-000042
  order_code       TEXT UNIQUE NOT NULL,

  -- Customer details
  customer_name    TEXT        NOT NULL,
  customer_phone   TEXT        NOT NULL,   -- stored as +91XXXXXXXXXX
  delivery_address TEXT        NOT NULL,

  -- Order contents
  product_details  TEXT        NOT NULL,   -- free-text: variety + quantity
  amount           NUMERIC(10, 2) NOT NULL,

  -- Workflow state
  status           TEXT        NOT NULL DEFAULT 'placed'
                   CHECK (status IN ('placed', 'shipped', 'delivered', 'cancelled')),

  -- Logistics
  lr_number        TEXT,                   -- Lorry Receipt / consignment number
  transporter      TEXT        NOT NULL DEFAULT 'Navata',

  -- Timestamps
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  shipped_at       TIMESTAMPTZ,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── notification_log ──────────────────────────────────────────
-- Audit trail for every WhatsApp message the admin sends.
CREATE TABLE IF NOT EXISTS notification_log (
  id           SERIAL PRIMARY KEY,

  order_id     INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  channel      TEXT NOT NULL DEFAULT 'whatsapp',
  message_type TEXT NOT NULL
               CHECK (message_type IN ('order_confirmation', 'shipping_notice')),
  phone        TEXT,
  message_body TEXT,

  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'sent', 'failed')),

  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone
  ON orders (customer_phone);

CREATE INDEX IF NOT EXISTS idx_orders_order_code
  ON orders (order_code);

CREATE INDEX IF NOT EXISTS idx_orders_status
  ON orders (status);

-- ── Auto-update updated_at on row change ──────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
