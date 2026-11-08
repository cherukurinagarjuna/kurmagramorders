/* ==========================================================
   public/assets/app.js — Shared frontend logic
   Rice Order Tracker · Phase 7
   ========================================================== */
'use strict';

/* ── API helpers ─────────────────────────────────────────── */

/**
 * POST JSON to a local API route.
 * Throws an Error (with .message set to json.error) on non-2xx.
 * @param {string} url
 * @param {object} data
 * @returns {Promise<object>}
 */
async function postJSON(url, data) {
  const res  = await fetch(url, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

/**
 * GET from a local API route.
 * Throws an Error (with .message set to json.error) on non-2xx.
 * @param {string} url   Full URL including query string
 * @returns {Promise<object>}
 */
async function getJSON(url) {
  const res  = await fetch(url, { credentials: 'include' });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return json;
}

/* ── XSS guard ───────────────────────────────────────────── */

/**
 * Escape HTML special characters to prevent XSS when inserting
 * user-supplied strings into innerHTML.
 * @param {unknown} val
 * @returns {string}
 */
function escapeHtml(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── Status badge helper ─────────────────────────────────── */

const STATUS_BADGE = {
  placed:           'secondary',
  shipped:          'info',
  out_for_delivery: 'warning',
  delivered:        'success',
  cancelled:        'danger',
};

/**
 * Returns a Bootstrap badge element string for a given order status.
 * @param {string} status
 * @returns {string}  HTML string
 */
function statusBadge(status) {
  const colour = STATUS_BADGE[status] || 'secondary';
  const labelMap = {
    placed:           'Placed',
    shipped:          'Shipped',
    out_for_delivery: 'Out for Delivery',
    delivered:        'Delivered',
    cancelled:        'Cancelled',
  };
  const label = labelMap[status] || (status ? status.charAt(0).toUpperCase() + status.slice(1) : '—');
  const textClass = (colour === 'warning' || colour === 'info') ? 'text-dark' : '';
  return `<span class="badge bg-${colour} ${textClass}">${escapeHtml(label)}</span>`;
}

/* ── Date formatter ──────────────────────────────────────── */

/**
 * Format an ISO timestamp to a readable local string, or return '—'.
 * @param {string|null} iso
 * @returns {string}
 */
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

/* ── Alert helper ────────────────────────────────────────── */

/**
 * Render a Bootstrap dismissible alert into a container element.
 * @param {HTMLElement} el      Container to inject into
 * @param {string}      msg     Message text
 * @param {'danger'|'success'|'warning'} type  Bootstrap colour
 */
function showAlert(el, msg, type = 'danger') {
  if (!el) return;
  el.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${escapeHtml(msg)}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   PAGE: index.html — Order form
   ══════════════════════════════════════════════════════════ */

function initOrderForm() {
  const form      = document.getElementById('orderForm');
  const alertBox  = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Placing order…';
    if (alertBox) alertBox.innerHTML = '';

    const payload = {
      name:            form.elements.name.value.trim(),
      phone:           form.elements.phone.value.trim(),
      address:         form.elements.address.value.trim(),
      product_details: form.elements.product_details.value.trim(),
      amount:          parseFloat(form.elements.amount.value),
    };

    try {
      const data = await postJSON('/api/create-order', payload);
      window.location.href = `thank-you.html?code=${encodeURIComponent(data.order_code)}`;
    } catch (err) {
      showAlert(alertBox, err.message || 'Failed to place order. Please try again.');
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Place Order';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   PAGE: thank-you.html
   ══════════════════════════════════════════════════════════ */

function initThankYou() {
  const params    = new URLSearchParams(window.location.search);
  const code      = params.get('code') || '';
  const codeEl    = document.getElementById('orderCode');
  const trackLink = document.getElementById('trackLink');

  if (codeEl)    codeEl.textContent = code || '—';
  if (trackLink && code) {
    trackLink.href = `track.html?code=${encodeURIComponent(code)}`;
  }
}

/* ══════════════════════════════════════════════════════════
   PAGE: track.html — Customer tracking
   ══════════════════════════════════════════════════════════ */

function initTrackPage() {
  const form      = document.getElementById('trackForm');
  const codeInput = document.getElementById('trackCode');
  const phoneInput= document.getElementById('trackPhone');
  const alertBox  = document.getElementById('trackAlert');
  const resultsEl = document.getElementById('trackResults');
  if (!form) return;

  // Auto-fill and auto-submit when ?code= is in URL
  const params = new URLSearchParams(window.location.search);
  const urlCode = params.get('code');
  if (urlCode && codeInput) {
    codeInput.value = urlCode;
    doTrack(urlCode, '');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code  = codeInput  ? codeInput.value.trim()  : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    if (!code && !phone) {
      showAlert(alertBox, 'Please enter an Order Code or Phone number.');
      return;
    }
    doTrack(code, phone);
  });

  async function doTrack(code, phone) {
    if (alertBox)  alertBox.innerHTML  = '';
    if (resultsEl) resultsEl.innerHTML = '<p class="text-muted">Loading…</p>';

    const qs = code
      ? `code=${encodeURIComponent(code.toUpperCase())}`
      : `phone=${encodeURIComponent(phone)}`;

    try {
      const data   = await getJSON(`/api/track-order?${qs}`);
      const orders = data.orders || [];
      renderTrackResults(orders);
    } catch (err) {
      if (resultsEl) resultsEl.innerHTML = '';
      showAlert(alertBox, err.message || 'Could not find order. Please check and try again.');
    }
  }

  function renderTrackResults(orders) {
    if (!resultsEl) return;
    if (!orders.length) {
      resultsEl.innerHTML = '<p class="text-muted">No orders found.</p>';
      return;
    }

    resultsEl.innerHTML = orders.map((o) => {
      const lrLine = o.lr_number
        ? `<li class="list-group-item d-flex justify-content-between">
             <span class="text-muted small">LR / Consignment</span>
             <span class="fw-semibold small">${escapeHtml(o.lr_number)}
               <span class="text-muted">(${escapeHtml(o.transporter || 'N/A')})</span>
             </span>
           </li>`
        : '';

      return `
        <div class="card mb-3 shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span class="fw-bold font-monospace">${escapeHtml(o.order_code)}</span>
            ${statusBadge(o.status)}
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-muted small">Customer</span>
              <span class="small">${escapeHtml(o.customer_name)}&nbsp;
                <span class="text-muted">${escapeHtml(o.customer_phone)}</span>
              </span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-muted small">Product</span>
              <span class="small fw-semibold">${escapeHtml(o.product_details)}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-muted small">Amount</span>
              <span class="small fw-semibold">₹${escapeHtml(String(o.amount))}</span>
            </li>
            ${lrLine}
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-muted small">Placed</span>
              <span class="small">${escapeHtml(fmtDate(o.created_at))}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-muted small">Shipped</span>
              <span class="small">${escapeHtml(fmtDate(o.shipped_at))}</span>
            </li>
          </ul>
        </div>`;
    }).join('');
  }
}

/* ══════════════════════════════════════════════════════════
   PAGE: admin.html — Admin panel
   ══════════════════════════════════════════════════════════ */

function initAdminPage() {
  /* ── DOM refs ── */
  const loginSection  = document.getElementById('loginSection');
  const panelSection  = document.getElementById('panelSection');
  const loginForm     = document.getElementById('loginForm');
  const loginAlert    = document.getElementById('loginAlert');
  const panelAlert    = document.getElementById('panelAlert');
  const statusFilter  = document.getElementById('statusFilter');
  const searchInput   = document.getElementById('searchInput');
  const refreshBtn    = document.getElementById('refreshBtn');
  const logoutBtn     = document.getElementById('logoutBtn');
  const tableBody     = document.getElementById('ordersBody');
  const tableWrapper  = document.getElementById('tableWrapper');
  const tableEmpty    = document.getElementById('tableEmpty');
  const tableLoading  = document.getElementById('tableLoading');

  if (!loginForm) return;

  /* ── Show/hide helpers ── */
  function showPanel()  { loginSection.classList.add('d-none');    panelSection.classList.remove('d-none'); }
  function showLogin()  { panelSection.classList.add('d-none');    loginSection.classList.remove('d-none'); }
  function showLoading(){ tableLoading.classList.remove('d-none'); tableWrapper.classList.add('d-none'); tableEmpty.classList.add('d-none'); }
  function hideLoading(){ tableLoading.classList.add('d-none'); }

  /* ── 401 handler: kick back to login ── */
  function handle401() { showLogin(); }

  /* ── Login ── */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginAlert.innerHTML = '';
    const pwd = document.getElementById('adminPassword').value;
    try {
      await postJSON('/api/admin-login', { password: pwd });
      showPanel();
      loadOrders();
    } catch (err) {
      showAlert(loginAlert, err.message || 'Login failed.');
    }
  });

  /* ── Logout ── */
  logoutBtn && logoutBtn.addEventListener('click', () => {
    // Expire the cookie client-side
    document.cookie = 'admin=; Max-Age=0; path=/; SameSite=Lax';
    document.getElementById('adminPassword').value = '';
    showLogin();
  });

  /* ── Refresh ── */
  refreshBtn && refreshBtn.addEventListener('click', loadOrders);

  /* ── Debounced search ── */
  let debounceTimer;
  searchInput && searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(loadOrders, 350);
  });

  /* ── Status filter ── */
  statusFilter && statusFilter.addEventListener('change', loadOrders);

  /* ── Load orders ── */
  async function loadOrders() {
    if (panelAlert) panelAlert.innerHTML = '';
    showLoading();

    const qs = new URLSearchParams();
    const status = statusFilter ? statusFilter.value : '';
    const q      = searchInput  ? searchInput.value.trim() : '';
    if (status) qs.set('status', status);
    if (q)      qs.set('q', q);

    try {
      const data   = await getJSON(`/api/list-orders?${qs.toString()}`);
      const orders = data.orders || [];
      hideLoading();
      renderTable(orders, data.total || 0);
    } catch (err) {
      hideLoading();
      if (err.status === 401) { handle401(); return; }
      showAlert(panelAlert, err.message || 'Failed to load orders.');
      tableWrapper.classList.add('d-none');
      tableEmpty.classList.add('d-none');
    }
  }

  /* ── Render table ── */
  function renderTable(orders, total) {
    const countEl = document.getElementById('orderCount');
    if (countEl) countEl.textContent = `${total} order${total !== 1 ? 's' : ''}`;

    if (!orders.length) {
      tableWrapper.classList.add('d-none');
      tableEmpty.classList.remove('d-none');
      return;
    }

    tableEmpty.classList.add('d-none');
    tableWrapper.classList.remove('d-none');

    tableBody.innerHTML = orders.map((o) => {
      const actions = buildActions(o);
      return `
        <tr>
          <td class="font-monospace small">${escapeHtml(o.order_code)}</td>
          <td>${escapeHtml(o.customer_name)}</td>
          <td class="small text-muted">${escapeHtml(o.customer_phone)}</td>
          <td>₹${escapeHtml(String(o.amount))}</td>
          <td>${statusBadge(o.status)}</td>
          <td class="small text-muted">${escapeHtml(o.lr_number || '—')}</td>
          <td class="small text-muted">${escapeHtml(fmtDate(o.created_at))}</td>
          <td class="text-nowrap">${actions}</td>
        </tr>`;
    }).join('');

    // Attach action listeners after render
    orders.forEach((o) => {
      const confirmBtn = document.getElementById(`btn-confirm-${o.id}`);
      const shipBtn    = document.getElementById(`btn-ship-${o.id}`);
      const ofdBtn     = document.getElementById(`btn-ofd-${o.id}`);
      const delBtn     = document.getElementById(`btn-del-${o.id}`);

      if (confirmBtn) confirmBtn.addEventListener('click', () => onSendConfirmation(o));
      if (shipBtn)    shipBtn.addEventListener('click',    () => onMarkShipped(o));
      if (ofdBtn)     ofdBtn.addEventListener('click',     () => onUpdateStatus(o, 'out_for_delivery', 'Mark order out for delivery?'));
      if (delBtn)     delBtn.addEventListener('click',     () => onUpdateStatus(o, 'delivered', 'Mark order as delivered?'));
    });
  }

  /* ── Build action buttons per row ── */
  function buildActions(o) {
    const btns = [];
    const printBtn = `<a href="slip.html?id=${encodeURIComponent(o.id)}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-dark me-1" title="Print Courier Slip">
      📄 Print Slip
    </a>`;

    if (o.status === 'placed') {
      btns.push(
        printBtn,
        `<button id="btn-confirm-${escapeHtml(String(o.id))}" class="btn btn-sm btn-outline-success me-1" title="Send WhatsApp confirmation">
           📲 Confirm
         </button>`,
        `<button id="btn-ship-${escapeHtml(String(o.id))}" class="btn btn-sm btn-primary" title="Mark as Shipped">
           🚚 Ship
         </button>`
      );
    } else if (o.status === 'shipped') {
      btns.push(
        printBtn,
        `<button id="btn-ofd-${escapeHtml(String(o.id))}" class="btn btn-sm btn-warning text-dark me-1" title="Out for Delivery">
           🛵 Out for Delivery
         </button>`,
        `<button id="btn-ship-${escapeHtml(String(o.id))}" class="btn btn-sm btn-outline-secondary" title="Update LR / Shipping info">
           ✏️ Edit LR
         </button>`
      );
    } else if (o.status === 'out_for_delivery') {
      btns.push(
        printBtn,
        `<button id="btn-del-${escapeHtml(String(o.id))}" class="btn btn-sm btn-success" title="Mark Delivered">
           ✅ Mark Delivered
         </button>`
      );
    } else {
      btns.push(printBtn);
    }
    return btns.join('') || '<span class="text-muted small">—</span>';
  }

  /* ── Generic update status helper ── */
  async function onUpdateStatus(order, newStatus, promptMsg) {
    if (!window.confirm(`${promptMsg}\nOrder: ${order.order_code}`)) return;

    try {
      const data = await postJSON('/api/update-status', {
        order_id: order.id,
        status:   newStatus,
      });

      if (data.wa_link) {
        window.open(data.wa_link, '_blank', 'noopener,noreferrer');
      }

      await loadOrders();
    } catch (err) {
      if (err.status === 401) { handle401(); return; }
      showAlert(panelAlert, `Failed to update status: ${err.message}`);
    }
  }

  /* ── Send Confirmation (wa.me click-to-chat, opens tab) ── */
  function onSendConfirmation(order) {
    const business = 'Rice Traders'; // falls back; real name in env
    const msg =
      `Hi ${order.customer_name}, your rice order ${order.order_code} has been received. ` +
      `Amount: ₹${order.amount}. We'll notify you when it ships. — ${business}`;
    const phone  = order.customer_phone.replace(/\D/g, '');
    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');
  }

  /* ── Mark Shipped flow ── */
  async function onMarkShipped(order) {
    const lr = window.prompt(
      `Enter LR / Consignment Number for order ${order.order_code}:`
    );
    if (lr === null) return;              // user cancelled
    if (!lr.trim()) {
      alert('LR number is required to mark as shipped.');
      return;
    }

    const transporter = window.prompt(
      'Enter Transporter name:',
      order.transporter || 'Navata'
    );
    if (transporter === null) return;     // user cancelled

    try {
      const data = await postJSON('/api/mark-shipped', {
        order_id:    order.id,
        lr_number:   lr.trim(),
        transporter: transporter.trim() || 'Navata',
      });

      // Open WhatsApp in a new tab so admin can send manually
      if (data.wa_link) {
        window.open(data.wa_link, '_blank', 'noopener,noreferrer');
      }

      await loadOrders();
    } catch (err) {
      if (err.status === 401) { handle401(); return; }
      showAlert(panelAlert, `Failed to mark order as shipped: ${err.message}`);
    }
  }
}
