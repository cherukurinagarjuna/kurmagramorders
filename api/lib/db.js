'use strict';

const { Pool } = require('pg');
require('dotenv').config();

// Singleton pool — reused across warm Lambda invocations
let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        // Neon / most hosted Postgres providers require SSL.
        // rejectUnauthorized: false only if the host uses a self-signed cert.
        rejectUnauthorized: true,
      },
      max: 5,                // keep connection count low in serverless
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });

    pool.on('error', (err) => {
      console.error('[db] Unexpected pool error', err);
    });
  }
  return pool;
}

module.exports = { getPool };
