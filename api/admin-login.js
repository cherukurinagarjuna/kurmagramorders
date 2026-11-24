'use strict';
const { handler } = require('../netlify/functions/admin-login');
const { vercelAdapter } = require('./lib/adapter');
module.exports = vercelAdapter(handler);
