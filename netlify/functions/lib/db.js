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
        rejectUnauthorized: false,
      },
      max: 2,
      idleTimeoutMillis: 5_000,
      connectionTimeoutMillis: 2_000,
    });

    pool.on('error', (err) => {
      // Prevent uncaught errors from crashing process on disconnect
      console.warn('[db pool non-fatal]', err.message);
    });
  }
  return pool;
}

module.exports = { getPool };
