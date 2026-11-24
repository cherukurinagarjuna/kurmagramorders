require('dotenv').config();
const { getPool } = require('../netlify/functions/lib/db');

async function syncSchema() {
  const pool = getPool();
  const client = await pool.connect();
  try {
    console.log('Adding Supabase-compatible columns to orders table...');
    await client.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS order_no TEXT,
      ADD COLUMN IF NOT EXISTS customer_address TEXT,
      ADD COLUMN IF NOT EXISTS items JSONB,
      ADD COLUMN IF NOT EXISTS total_amount INTEGER;
    `);

    await client.query(`
      UPDATE orders 
      SET 
        order_no = COALESCE(order_no, order_code),
        customer_address = COALESCE(customer_address, delivery_address),
        total_amount = COALESCE(total_amount, ROUND(amount * 100)::integer)
      WHERE order_no IS NULL OR customer_address IS NULL OR total_amount IS NULL;
    `);

    console.log('Schema migration completed successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

syncSchema().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
