require('dotenv').config();
const { getPool } = require('../netlify/functions/lib/db');

async function clearOrders() {
  const pool = getPool();
  const client = await pool.connect();
  try {
    console.log('Clearing all order records and notification logs...');
    
    // Disable or handle foreign keys with CASCADE
    await client.query('BEGIN');
    
    await client.query('TRUNCATE TABLE notification_log CASCADE;');
    await client.query('TRUNCATE TABLE orders CASCADE;');
    
    // Reset sequences back to 1
    console.log('Resetting sequences...');
    await client.query("ALTER SEQUENCE order_code_seq RESTART WITH 1;");
    
    try {
      await client.query("ALTER SEQUENCE orders_id_seq RESTART WITH 1;");
    } catch (e) {
      console.log('Note on orders_id_seq:', e.message);
    }

    try {
      await client.query("ALTER SEQUENCE notification_log_id_seq RESTART WITH 1;");
    } catch (e) {
      console.log('Note on notification_log_id_seq:', e.message);
    }

    await client.query('COMMIT');

    const oRes = await client.query('SELECT COUNT(*) FROM orders');
    const nRes = await client.query('SELECT COUNT(*) FROM notification_log');
    const seqRes = await client.query("SELECT last_value, is_called FROM order_code_seq");

    console.log('✅ Orders table count:', oRes.rows[0].count);
    console.log('✅ Notification log count:', nRes.rows[0].count);
    console.log('✅ Sequence status:', seqRes.rows[0]);
    console.log('All order data cleared successfully. Ready for fresh orders starting from 0001!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error clearing order data:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

clearOrders();
