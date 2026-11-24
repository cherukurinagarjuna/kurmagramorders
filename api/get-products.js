'use strict';
const { handler } = require('../netlify/functions/get-products');
const { vercelAdapter } = require('./lib/adapter');
module.exports = vercelAdapter(handler);
