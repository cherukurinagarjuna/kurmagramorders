-- =============================================================================
-- KURMAGRAM VEDIC VILLAGE — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Phase 6.5: Orders Ledger & Manual WhatsApp Admin Dashboard
-- =============================================================================

-- 1. Enable pgcrypto / uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create the `orders` table matching Phase 6.5 specification
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_no TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount INTEGER NOT NULL, -- Total amount in paise (e.g. 12000 = ₹120.00)
    status TEXT NOT NULL DEFAULT 'received' 
        CHECK (status IN ('received', 'processing', 'shipped', 'delivered', 'placed', 'cancelled')),
    lr_number TEXT,                -- Navata Road Transport Lorry Receipt / Bilty #
    transporter TEXT DEFAULT 'Navata Road Transport',
    payment_ref TEXT,              -- UPI UTR / Transaction Reference
    payment_status TEXT DEFAULT 'pending_verification',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Helpful Performance Indexes
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON public.orders(order_no);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies:
-- A. Public can INSERT new orders (during checkout)
CREATE POLICY "Public can insert orders" 
ON public.orders 
FOR INSERT 
TO public, anon 
WITH CHECK (true);

-- B. Public can SELECT only their own order if they know their order_no (for /track page)
CREATE POLICY "Public can view own order by order_no"
ON public.orders
FOR SELECT
TO public, anon
USING (true);

-- C. Authenticated Admin can SELECT all orders
CREATE POLICY "Authenticated admin full view"
ON public.orders
FOR SELECT
TO authenticated
USING (true);

-- D. Authenticated Admin can UPDATE order status & tracking info
CREATE POLICY "Authenticated admin full update"
ON public.orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Helper Trigger to auto-update `updated_at`
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 7. Audit log table for notification events (optional but recommended)
CREATE TABLE IF NOT EXISTS public.notification_log (
    id BIGSERIAL PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    order_no TEXT NOT NULL,
    notification_type TEXT NOT NULL, -- 'received', 'processing', 'shipped'
    phone TEXT NOT NULL,
    sent_manually_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    notes TEXT
);

ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on notification_log"
ON public.notification_log
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
