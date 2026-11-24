'use strict';
const { handler } = require('../netlify/functions/track-order');
const { vercelAdapter } = require('./lib/adapter');
module.exports = vercelAdapter(handler);
