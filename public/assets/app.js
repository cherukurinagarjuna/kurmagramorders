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
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

async function getJSON(url) {
  const res = await fetch(url, { credentials: 'include' });
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
