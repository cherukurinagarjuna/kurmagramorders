/* =============================================================
   assets/app.js  — Shared vanilla JS for all pages
   Phase 1: stubs + wiring only. Business logic in Phase 2.
   ============================================================= */

'use strict';

/* ── Tiny helpers ─────────────────────────────────────────── */

/**
 * Parse query-string parameters from the current URL.
 * @returns {URLSearchParams}
 */
function qs() {
  return new URLSearchParams(window.location.search);
}

/**
 * POST JSON to a local API endpoint and return the parsed response.
 * @param {string} path   e.g. '/api/create-order'
 * @param {object} body
 * @returns {Promise<{ok: boolean, [key: string]: any}>}
 */
async function apiPost(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
  return data;
}

/**
 * GET from a local API endpoint and return the parsed response.
 * @param {string} path   e.g. '/api/list-orders?status=received'
 * @returns {Promise<{ok: boolean, [key: string]: any}>}
 */
async function apiGet(path) {
  const res = await fetch(path, { credentials: 'include' });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
  return data;
}

/**
 * Show a Bootstrap invalid-feedback for a form control.
 * @param {HTMLElement} el
 * @param {string} message
 */
function setInvalid(el, message) {
  el.classList.add('is-invalid');
  const fb = el.closest('.mb-3')?.querySelector('.invalid-feedback');
  if (fb && message) fb.textContent = message;
}

/** Remove all is-invalid classes inside a form. */
function clearValidation(form) {
  form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
}

/* ── PAGE: index.html — Order form ────────────────────────── */

function initOrderForm() {
  const form      = document.getElementById('orderForm');
  const submitBtn = document.getElementById('submitBtn');
  const errBanner = document.getElementById('formError');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearValidation(form);
    errBanner.classList.add('d-none');

    // Basic HTML5 validation
    if (!form.checkValidity()) {
      form.querySelectorAll(':invalid').forEach((el) => el.classList.add('is-invalid'));
      return;
    }

    const payload = {
      name:     form.name.value.trim(),
      phone:    form.phone.value.trim(),
      address:  form.address.value.trim(),
      riceType: form.riceType.value,
      quantity: Number(form.quantity.value),
      notes:    form.notes.value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Placing order…';

    try {
      const data = await apiPost('/api/create-order', payload);
      // Build query string for thank-you page
      const p = new URLSearchParams({
        orderId:  data.orderId  || '',
        token:    data.token    || '',
        riceType: payload.riceType,
        quantity: payload.quantity,
        phone:    data.maskedPhone || '',
      });
      window.location.href = `thank-you.html?${p.toString()}`;
    } catch (err) {
      errBanner.textContent = err.message || 'Something went wrong. Please try again.';
      errBanner.classList.remove('d-none');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Place Order';
    }
  });
}

/* ── PAGE: thank-you.html ──────────────────────────────────── */

function initThankYou() {
  const params  = qs();
  const orderId = params.get('orderId');
  const token   = params.get('token');

  const sumCard = document.getElementById('orderSummary');
  const trackLink = document.getElementById('trackLink');

  if (orderId || token) {
    // Populate summary
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
    set('sumOrderId',  orderId);
    set('sumRiceType', params.get('riceType'));
    set('sumQuantity', params.get('quantity') ? params.get('quantity') + ' kg' : '—');
    set('sumPhone',    params.get('phone'));
    sumCard?.classList.remove('d-none');

    // Deep-link to track page
    if (trackLink && token) {
      trackLink.href = `track.html?token=${encodeURIComponent(token)}`;
    }
  }
}

/* ── PAGE: track.html ─────────────────────────────────────── */

/**
 * Render the status timeline in track.html.
 * @param {object} order  The order object returned by /api/track-order
 */
function renderTrackStatus(order) {
  const statusCard = document.getElementById('statusCard');
  const lookupCard = document.getElementById('lookupCard');

  if (!statusCard) return;
  lookupCard?.classList.add('d-none');
  statusCard.classList.remove('d-none');

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
  set('stOrderId',  order.id);
  set('stPhone',    order.maskedPhone);
  set('stRiceType', order.riceType);
  set('stQuantity', order.quantity ? order.quantity + ' kg' : '—');

  // Badge
  const badge = document.getElementById('stBadge');
  if (badge) {
    const labels = { received: 'Received', confirmed: 'Confirmed', shipped: 'Shipped', delivered: 'Delivered' };
    const classes = {
      received:  'bg-primary',
      confirmed: 'bg-warning text-dark',
      shipped:   'bg-info text-dark',
      delivered: 'bg-success',
    };
    badge.textContent = labels[order.status] || order.status;
    badge.className   = 'badge ' + (classes[order.status] || 'bg-secondary');
  }

  // Timeline steps: each step is [liId, atId, statusesToActivate]
  const steps = [
    ['tlReceived',  'tlReceivedAt',  ['received', 'confirmed', 'shipped', 'delivered'], order.receivedAt],
    ['tlConfirmed', 'tlConfirmedAt', ['confirmed', 'shipped', 'delivered'],             order.confirmedAt],
    ['tlShipped',   'tlShippedAt',   ['shipped', 'delivered'],                          order.shippedAt],
    ['tlDelivered', 'tlDeliveredAt', ['delivered'],                                     order.deliveredAt],
  ];

  const statusOrder = ['received', 'confirmed', 'shipped', 'delivered'];
  const currentIdx  = statusOrder.indexOf(order.status);

  steps.forEach(([liId, atId, doneStatuses, timestamp], i) => {
    const li   = document.getElementById(liId);
    const atEl = document.getElementById(atId);
    if (!li) return;

    if (i < currentIdx) {
      li.classList.add('done');
    } else if (i === currentIdx) {
      li.classList.add('active');
    }

    if (atEl) {
      atEl.textContent = timestamp
        ? new Date(timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        : (i <= currentIdx ? 'Now' : 'Pending');
    }
  });
}

function initTrackPage() {
  const trackForm  = document.getElementById('trackForm');
  const tokenInput = document.getElementById('tokenInput');
  const trackError = document.getElementById('trackError');

  if (!trackForm) return;

  // Auto-load if token in URL
  const token = qs().get('token');
  if (token) {
    loadOrder(token);
  }

  trackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    trackError?.classList.add('d-none');
    const t = tokenInput?.value.trim();
    if (!t) return;
    // Update URL for shareable link
    history.replaceState(null, '', `?token=${encodeURIComponent(t)}`);
    loadOrder(t);
  });

  async function loadOrder(token) {
    try {
      const data = await apiGet(`/api/track-order?token=${encodeURIComponent(token)}`);
      if (data.order) {
        renderTrackStatus(data.order);
      } else {
        showTrackError('Order not found. Please check your Order ID.');
      }
    } catch (err) {
      showTrackError(err.message || 'Failed to load order. Please try again.');
    }
  }

  function showTrackError(msg) {
    if (trackError) {
      trackError.textContent = msg;
      trackError.classList.remove('d-none');
    }
  }
}

/* ── PAGE: admin.html ─────────────────────────────────────── */

function initAdminPage() {
  const loginCard  = document.getElementById('loginCard');
  const dashboard  = document.getElementById('dashboard');
  const loginForm  = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  if (!loginForm) return;

  /* ── Login ── */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError?.classList.add('d-none');
    const password = document.getElementById('adminPassword')?.value;

    try {
      await apiPost('/api/admin-login', { password });
      loginCard?.classList.add('d-none');
      dashboard?.classList.remove('d-none');
      loadOrders();
    } catch (err) {
      if (loginError) {
        loginError.textContent = err.message || 'Login failed.';
        loginError.classList.remove('d-none');
      }
    }
  });

  /* ── Logout ── */
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    // Clear cookie client-side by expiring it; server-side clear is TODO in Phase 2
    document.cookie = 'admin_token=; Max-Age=0; path=/';
    dashboard?.classList.add('d-none');
    loginCard?.classList.remove('d-none');
  });

  /* ── Refresh ── */
  document.getElementById('refreshBtn')?.addEventListener('click', loadOrders);
  document.getElementById('applyFilter')?.addEventListener('click', loadOrders);

  /* ── Load orders ── */
  async function loadOrders() {
    const tableLoader  = document.getElementById('tableLoader');
    const tableWrapper = document.getElementById('tableWrapper');
    const tableEmpty   = document.getElementById('tableEmpty');

    tableLoader?.classList.remove('d-none');
    tableWrapper?.classList.add('d-none');
    tableEmpty?.classList.add('d-none');

    const status = document.getElementById('filterStatus')?.value || '';
    const search = document.getElementById('filterSearch')?.value.trim() || '';
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (search) params.set('q', search);

    try {
      const data = await apiGet('/api/list-orders?' + params.toString());
      const orders = data.orders || [];
      renderOrdersTable(orders);
      updateSummaryCards(orders);
    } catch (err) {
      tableLoader?.classList.add('d-none');
      // If 401, show login again
      if (err.status === 401) {
        dashboard?.classList.add('d-none');
        loginCard?.classList.remove('d-none');
      }
    }
  }

  /* ── Render table ── */
  function renderOrdersTable(orders) {
    const tableLoader  = document.getElementById('tableLoader');
    const tableWrapper = document.getElementById('tableWrapper');
    const tableEmpty   = document.getElementById('tableEmpty');
    const tbody        = document.getElementById('ordersBody');

    tableLoader?.classList.add('d-none');

    if (!orders.length) {
      tableEmpty?.classList.remove('d-none');
      return;
    }

    tableWrapper?.classList.remove('d-none');
    if (!tbody) return;

    tbody.innerHTML = orders.map((o) => {
      const statusBadge = {
        received:  '<span class="badge badge-received">Received</span>',
        confirmed: '<span class="badge badge-confirmed">Confirmed</span>',
        shipped:   '<span class="badge badge-shipped">Shipped</span>',
        delivered: '<span class="badge badge-delivered">Delivered</span>',
      }[o.status] || `<span class="badge bg-secondary">${o.status}</span>`;

      const placedAt = o.createdAt
        ? new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
        : '—';

      // Build action buttons based on current status
      const actions = buildActionButtons(o);

      return `
        <tr>
          <td class="font-monospace">${escHtml(o.id)}</td>
          <td>${escHtml(o.name)}</td>
          <td>${escHtml(o.maskedPhone || o.phone || '—')}</td>
          <td>${escHtml(o.riceType)}</td>
          <td>${escHtml(String(o.quantity))}</td>
          <td>${statusBadge}</td>
          <td class="text-muted">${placedAt}</td>
          <td>${actions}</td>
        </tr>`;
    }).join('');

    // Attach action-button listeners
    orders.forEach((o) => {
      document.getElementById(`btn-ship-${o.id}`)?.addEventListener('click', () => openShipModal(o));
    });
  }

  function buildActionButtons(order) {
    const btns = [];
    if (order.status === 'received' || order.status === 'confirmed') {
      btns.push(`<button class="btn btn-sm btn-brand" id="btn-ship-${escHtml(order.id)}">Mark Shipped</button>`);
    }
    // Track link (always)
    btns.push(`<a href="track.html?token=${encodeURIComponent(order.token || order.id)}" target="_blank" class="btn btn-sm btn-outline-secondary">Track</a>`);
    return btns.join(' ');
  }

  /* ── Summary cards ── */
  function updateSummaryCards(orders) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('cntTotal',     orders.length);
    set('cntPending',   orders.filter((o) => o.status === 'received' || o.status === 'confirmed').length);
    set('cntShipped',   orders.filter((o) => o.status === 'shipped').length);
    set('cntDelivered', orders.filter((o) => o.status === 'delivered').length);
  }

  /* ── Ship modal ── */
  let currentShipOrderId = null;
  const shipModal = new bootstrap.Modal(document.getElementById('shipModal'));

  function openShipModal(order) {
    currentShipOrderId = order.id;
    // Reset WA link area
    const waWrapper = document.getElementById('shipWaWrapper');
    if (waWrapper) waWrapper.classList.add('d-none');
    shipModal.show();
  }

  document.getElementById('confirmShipBtn')?.addEventListener('click', async () => {
    if (!currentShipOrderId) return;
    try {
      const data = await apiPost('/api/mark-shipped', { orderId: currentShipOrderId });
      if (data.waLink) {
        const waLink    = document.getElementById('shipWaLink');
        const waWrapper = document.getElementById('shipWaWrapper');
        if (waLink)    waLink.href = data.waLink;
        if (waWrapper) waWrapper.classList.remove('d-none');
      }
      loadOrders(); // Refresh table
    } catch (err) {
      alert('Failed to mark as shipped: ' + (err.message || 'unknown error'));
    }
  });

  /* ── Helpers ── */
  function escHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
