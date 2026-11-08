'use strict';

const { json, requireAuth } = require('./lib/helpers');

/**
 * POST /api/mark-shipped
 * Marks an order as shipped and returns a wa.me click-to-chat link
 * that the admin opens manually to notify the customer via WhatsApp.
 * Business logic will be implemented in Phase 2.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  const authError = requireAuth(event);
  if (authError) return authError;

  // TODO: parse body.orderId, update status in DB,
  //       compose waLink(customerPhone, shipmentMessage), return it
  return json(200, { ok: true, waLink: null });
};
