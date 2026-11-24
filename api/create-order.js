'use strict';
const { handler } = require('../netlify/functions/create-order');
const { vercelAdapter } = require('./lib/adapter');
module.exports = vercelAdapter(handler);
