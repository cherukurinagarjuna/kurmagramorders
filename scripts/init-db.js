'use strict';

/**
 * scripts/init-db.js
 * ------------------
 * Applies schema.sql to the Postgres database defined in DATABASE_URL.
 *
 * Usage:
 *   npm run db:init
 *
 * The script is idempotent: all DDL statements use
 * CREATE … IF NOT EXISTS / CREATE OR REPLACE, so it is safe to
 * run multiple times without destroying existing data.
 */

require('dotenv').config();

const path = require('path');
const fs   = require('fs');
const { Client } = require('pg');

async function main() {
  // ── 1. Read schema.sql ────────────────────────────────────────
  const schemaPath = path.join(__dirname, '..', 'schema.sql');

  if (!fs.existsSync(schemaPath)) {
    console.error('❌  schema.sql not found at', schemaPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');

  // ── 2. Validate env ───────────────────────────────────────────
  if (!process.env.DATABASE_URL) {
    console.error('❌  DATABASE_URL is not set. Add it to your .env file.');
    process.exit(1);
  }

  console.log('🌾  Rice Order Tracker — DB Init');
  console.log('   Connecting to database…');

  // ── 3. Connect ────────────────────────────────────────────────
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('   Connected ✅');

  // ── 4. Apply schema ───────────────────────────────────────────
  console.log('   Applying schema.sql…');
  await client.query(sql);

  console.log('\n✅  Schema applied successfully.\n');
  console.log('   Tables created (if not already present):');
  console.log('     • orders');
  console.log('     • notification_log');
  console.log('\n   Indexes:');
  console.log('     • idx_orders_customer_phone');
  console.log('     • idx_orders_order_code');
  console.log('     • idx_orders_status');
  console.log('\n   Trigger:');
  console.log('     • trg_orders_updated_at  (auto-sets updated_at on UPDATE)\n');

  await client.end();
}

main().catch((err) => {
  console.error('\n❌  db:init failed:', err.message);
  process.exit(1);
});
