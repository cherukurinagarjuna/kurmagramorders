'use strict';
const { handler } = require('../netlify/functions/mark-shipped');
const { vercelAdapter } = require('./lib/adapter');
module.exports = vercelAdapter(handler);
