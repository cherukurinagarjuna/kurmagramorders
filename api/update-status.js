'use strict';
const { handler } = require('../netlify/functions/update-status');
const { vercelAdapter } = require('./lib/adapter');
module.exports = vercelAdapter(handler);
