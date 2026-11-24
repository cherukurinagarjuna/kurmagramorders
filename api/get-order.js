'use strict';
const { handler } = require('../netlify/functions/get-order');
const { vercelAdapter } = require('./lib/adapter');
module.exports = vercelAdapter(handler);
