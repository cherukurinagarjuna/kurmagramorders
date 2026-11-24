require('dotenv').config();
const { getPool } = require('../netlify/functions/lib/db');

async function fixConstraint() {
  const pool = getPool();
  const client = await pool.connect();
  try {
    console.log('Updating orders_status_check constraint on orders table...');
    await client.query(`
      ALTER TABLE orders 
      DROP CONSTRAINT IF EXISTS orders_status_check;
    `);

    await client.query(`
      ALTER TABLE orders 
      ADD CONSTRAINT orders_status_check 
      CHECK (status IN ('received', 'processing', 'placed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'));
    `);

    console.log('Successfully updated orders_status_check constraint!');
  } finally {
    client.release();
    await pool.end();
  }
}

fixConstraint().catch(err => {
  console.error('Error fixing constraint:', err);
  process.exit(1);
});
