/* ==========================================================
   public/assets/app.js — Shared frontend & Cart logic
   Kurmagramamu · E-Commerce with Cart
   ========================================================== */
'use strict';

/* ── API helpers ─────────────────────────────────────────── */

async function postJSON(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('Non-JSON response from', url, text);
    throw new Error(`Server returned HTML error (${res.status}). Function may be failing or missing.`);
  }

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

async function getJSON(url) {
  const res = await fetch(url, { credentials: 'include' });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('Non-JSON response from', url, text);
    const err = new Error(`Server returned HTML error (${res.status}). Function may be failing or missing.`);
    err.status = res.status;
    throw err;
  }

  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return json;
}

/* ── XSS guard ───────────────────────────────────────────── */

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

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function showAlert(el, msg, type = 'danger') {
  if (!el) return;
  el.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${escapeHtml(msg)}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   SHOPPING CART (localStorage)
   ══════════════════════════════════════════════════════════ */

const CART_STORAGE_KEY = 'kg_cart_v1';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartBadge();
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (Number(item.price) * (item.quantity || 1)), 0);
}

function updateCartBadge() {
  const countEls = document.querySelectorAll('#cart-count, .cart-count-badge');
  const count = getCartCount();
  countEls.forEach(el => {
    el.textContent = count;
  });
}

/**
 * Add or update item in cart
 * @param {object} product - { id, name, price, quantity, unit, min_qty }
 */
function addToCart(product) {
  const cart = getCart();
  const existingIdx = cart.findIndex(item => item.id === product.id);

  if (existingIdx > -1) {
    if (product.replaceQty) {
      cart[existingIdx].quantity = product.quantity;
    } else {
      cart[existingIdx].quantity += product.quantity;
    }
  } else {
    cart.push({
      id:       product.id,
      name:     product.name,
      price:    Number(product.price),
      quantity: Number(product.quantity),
      unit:     product.unit || 'kg',
      min_qty:  product.min_qty || 1,
    });
  }

  saveCart(cart);
  showToast(`Added "${product.name}" (${product.quantity} ${product.unit || ''}) to cart!`);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartItemQty(productId, newQty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    const min = item.min_qty || 1;
    if (newQty < min) {
      alert(`Minimum quantity for ${item.name} is ${min} ${item.unit}.`);
      return false;
    }
    item.quantity = newQty;
    saveCart(cart);
    return true;
  }
  return false;
}

/* ── Minimal Toast Notification ──────────────────────────── */
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;max-width:320px;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.cssText = 'background:#1a3c28;color:#faf6ef;border:1px solid #c9a84c;padding:12px 18px;border-radius:10px;margin-top:8px;box-shadow:0 6px 20px rgba(0,0,0,0.2);font-size:0.9rem;transition:all 0.3s;';
  toast.innerHTML = `🌾 ${escapeHtml(message)}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Auto update badge on page load
document.addEventListener('DOMContentLoaded', updateCartBadge);

/* ══════════════════════════════════════════════════════════
   PAGE: thank-you.html
   ══════════════════════════════════════════════════════════ */

function initThankYou() {
  const params    = new URLSearchParams(window.location.search);
  const code      = params.get('code') || '';
  const codeEl    = document.getElementById('orderCode');
  const trackLink = document.getElementById('trackLink');

  if (codeEl) codeEl.textContent = code || '—';
  if (trackLink && code) {
    trackLink.href = `track.html?code=${encodeURIComponent(code)}`;
  }

  // Clear cart after order is confirmed
  clearCart();
}

/* ══════════════════════════════════════════════════════════
   PAGE: track.html — Customer tracking
   ══════════════════════════════════════════════════════════ */

function initTrackPage() {
  const form       = document.getElementById('trackForm');
  const codeInput  = document.getElementById('trackCode');
  const phoneInput = document.getElementById('trackPhone');
  const alertBox   = document.getElementById('trackAlert');
  const resultsEl  = document.getElementById('trackResults');
  if (!form) return;

  const params  = new URLSearchParams(window.location.search);
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
    if (resultsEl) resultsEl.innerHTML = '<p class="text-muted text-center py-4">Searching for order…</p>';

    const qs = code
      ? `code=${encodeURIComponent(code.toUpperCase())}`
      : `phone=${encodeURIComponent(phone)}`;

    try {
      const data   = await getJSON(`/.netlify/functions/track-order?${qs}`);
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
      resultsEl.innerHTML = '<p class="text-muted text-center py-4">No orders found.</p>';
      return;
    }

    resultsEl.innerHTML = orders.map((o) => {
      const lrLine = o.lr_number
        ? `<li class="list-group-item d-flex justify-content-between">
             <span class="text-muted small">LR / Consignment</span>
             <span class="fw-semibold small">${escapeHtml(o.lr_number)}
               <span class="text-muted">(${escapeHtml(o.transporter || 'Navata')})</span>
             </span>
           </li>`
        : '';

      return `
        <div class="card mb-3 shadow-sm border-0 rounded-4 overflow-hidden">
          <div class="card-header bg-white d-flex justify-content-between align-items-center py-3 border-bottom">
            <span class="fw-bold font-monospace fs-5 text-success">${escapeHtml(o.order_code)}</span>
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
              <span class="text-muted small">Items Ordered</span>
              <span class="small fw-semibold text-end">${escapeHtml(o.product_details)}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-muted small">Subtotal</span>
              <span class="small fw-semibold text-success">₹${escapeHtml(String(o.amount))}</span>
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

  function showPanel()  { loginSection?.classList.add('d-none');    panelSection?.classList.remove('d-none'); }
  function showLogin()  { panelSection?.classList.add('d-none');    loginSection?.classList.remove('d-none'); }
  function showLoading(){ tableLoading?.classList.remove('d-none'); tableWrapper?.classList.add('d-none'); tableEmpty?.classList.add('d-none'); }
  function hideLoading(){ tableLoading?.classList.add('d-none'); }

  function handle401() { showLogin(); }

  /* ── Login ── */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (loginAlert) loginAlert.innerHTML = '';
    const pwd = document.getElementById('adminPassword').value;
    try {
      await postJSON('/.netlify/functions/admin-login', { password: pwd });
      showPanel();
      loadOrders();
    } catch (err) {
      showAlert(loginAlert, err.message || 'Login failed.');
    }
  });

  /* ── Logout ── */
  logoutBtn && logoutBtn.addEventListener('click', () => {
    document.cookie = 'admin=; Max-Age=0; path=/; SameSite=Lax';
    const pwdInput = document.getElementById('adminPassword');
    if (pwdInput) pwdInput.value = '';
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
      const data   = await getJSON(`/.netlify/functions/list-orders?${qs.toString()}`);
      const orders = data.orders || [];
      hideLoading();
      renderTable(orders, data.total || 0);
    } catch (err) {
      hideLoading();
      if (err.status === 401) { handle401(); return; }
      showAlert(panelAlert, err.message || 'Failed to load orders.');
      tableWrapper?.classList.add('d-none');
      tableEmpty?.classList.add('d-none');
    }
  }

  /* ── Render table ── */
  function renderTable(orders, total) {
    const countEl = document.getElementById('orderCount');
    if (countEl) countEl.textContent = `${total} order${total !== 1 ? 's' : ''}`;

    if (!orders.length) {
      tableWrapper?.classList.add('d-none');
      tableEmpty?.classList.remove('d-none');
      return;
    }

    tableEmpty?.classList.add('d-none');
    tableWrapper?.classList.remove('d-none');

    tableBody.innerHTML = orders.map((o) => {
      const actions = buildActions(o);
      const paymentRefText = o.payment_ref ? `<br/><span class="badge bg-light text-dark border">Ref: ${escapeHtml(o.payment_ref)}</span>` : '';
      return `
        <tr>
          <td class="font-monospace small">${escapeHtml(o.order_code)}</td>
          <td>${escapeHtml(o.customer_name)}</td>
          <td class="small text-muted">${escapeHtml(o.customer_phone)}</td>
          <td>₹${escapeHtml(String(o.amount))}</td>
          <td>${statusBadge(o.status)}${paymentRefText}</td>
          <td class="small text-muted">${escapeHtml(o.lr_number || '—')}</td>
          <td class="small text-muted">${escapeHtml(fmtDate(o.created_at))}</td>
          <td class="text-nowrap">${actions}</td>
        </tr>`;
    }).join('');

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

  function onSendConfirmation(order) {
    const business = 'కూర్మగ్రామము';
    const msg =
      `హరే కృష్ణ! Hi ${order.customer_name}, your order ${order.order_code} has been confirmed. ` +
      `Amount: ₹${order.amount}. We will dispatch it via Navata Transport soon. — ${business}`;
    const phone  = order.customer_phone.replace(/\D/g, '');
    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');
  }

  async function onMarkShipped(order) {
    const lr = window.prompt(`Enter LR / Consignment Number for order ${order.order_code}:`);
    if (lr === null) return;
    if (!lr.trim()) {
      alert('LR number is required to mark as shipped.');
      return;
    }

    const transporter = window.prompt('Enter Transporter name:', order.transporter || 'Navata');
    if (transporter === null) return;

    try {
      const data = await postJSON('/.netlify/functions/mark-shipped', {
        order_id:    order.id,
        lr_number:   lr.trim(),
        transporter: transporter.trim() || 'Navata',
      });

      if (data.wa_link) {
        window.open(data.wa_link, '_blank', 'noopener,noreferrer');
      }

      await loadOrders();
    } catch (err) {
      if (err.status === 401) { handle401(); return; }
      showAlert(panelAlert, `Failed to mark order as shipped: ${err.message}`);
    }
  }

  async function onUpdateStatus(order, newStatus, promptMsg) {
    if (!window.confirm(`${promptMsg}\nOrder: ${order.order_code}`)) return;

    try {
      const data = await postJSON('/.netlify/functions/update-status', {
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
}
