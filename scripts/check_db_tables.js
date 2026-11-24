require('dotenv').config();
const { getPool } = require('../netlify/functions/lib/db');

async function checkTables() {
  const pool = getPool();
  const client = await pool.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log('Tables:', res.rows.map(r => r.table_name));

  const seq = await client.query("SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public'");
  console.log('Sequences:', seq.rows.map(r => r.sequence_name));

  const cols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders'");
  console.log('Orders columns:', cols.rows);

  const sample = await client.query("SELECT * FROM orders ORDER BY id DESC LIMIT 1");
  console.log('Latest order:', sample.rows[0]);

  client.release();
  await pool.end();
}
checkTables().catch(console.error);
