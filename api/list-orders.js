'use strict';
const { handler } = require('../netlify/functions/list-orders');
const { vercelAdapter } = require('./lib/adapter');
module.exports = vercelAdapter(handler);
