'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function run() {
  const sqlPath = path.join(__dirname, '..', 'sql', 'products.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to Neon ✅');

  await client.query(sql);
  console.log('Products table created and seeded! ✅');

  const res = await client.query('SELECT id, name, price, category FROM products ORDER BY id');
  console.table(res.rows);

  await client.end();
}

run().catch((e) => {
  console.error('Failed:', e.message);
  process.exit(1);
});
