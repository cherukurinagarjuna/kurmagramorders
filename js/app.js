/**
 * KURMAGRAM VEDIC VILLAGE — STORE ENGINE (js/app.js)
 * Clean vanilla JS single-source-of-truth architecture.
 * Features:
 *  - Bilingual i18n (Telugu default / English toggle)
 *  - Fuse.js bilingual fuzzy search & category filters
 *  - Accessible Cart Drawer with focus trap & body scroll lock
 *  - Direct NPCI-compliant UPI URI + QR generation (Level M)
 *  - WhatsApp order handoff with itemized billing
 *  - WebAudio sound chimes & confetti celebrations
 *  - LocalStorage persistence with schema versioning
 */

(function () {
  'use strict';

  // --- 1. Bilingual Dictionary ---
  const STRINGS = {
    te: {
      siteTitle: "కూర్మగ్రామ వేదిక్ విలేజ్ | సహజ ఉత్పత్తులు",
      badge: "శ్రీకూరర్మ క్షేత్రం • నంద గోకులం గోశాల ట్రస్ట్ (2018)",
      heroTagline: "సరళ జీవనం – ఉన్నత ఆశయం",
      heroDesc: "ఎలాంటి ఫెర్టిలైజర్స్, క్రిమిసంహారకాలు లేకుండా, సకల జీవులకు హాని లేకుండా భక్తులు తయారు చేసిన సహజ ఉత్పత్తులు.",
      heroCtaShop: "ఉత్పత్తులు చూడండి 🌾",
      heroCtaStory: "మా ఆశయం తెలుసుకోండి 📖",
      pillarsTitle: "మా నాలుగు మూలస్తంభాలు",
      pillar1Title: "సరళ జీవనం (Simple)",
      pillar1Desc: "రసాయనాల్లేని ప్రాకృతిక జీవన శైలి.",
      pillar2Title: "సహజ పద్ధతులు (Natural)",
      pillar2Desc: "ఎరువులు, క్రిమిసంహారకాలు లేని దేశవాళీ సాగు.",
      pillar3Title: "సంప్రదాయ జ్ఞానం (Traditional)",
      pillar3Desc: "చెక్క గానుగ నూనెలు, గోశాల ఆర్క్ తయారీ.",
      pillar4Title: "ధార్మిక సేవా (Dharmic)",
      pillar4Desc: "సకల జీవుల సంరక్షణ మరియు గోసేవ.",
      searchPlaceholder: "ఉత్పత్తులను వెతకండి (ఉదా: సున్నిపిండి, నువ్వుల నూనె, brown rice)...",
      filterAll: "అన్ని ఉత్పత్తులు",
      noProductsFound: "క్షమించండి! మీరు వెతికిన ఉత్పత్తులు కనుగొనబడలేదు.",
      clearSearch: "వెతుకులాట క్లియర్ చేయండి",
      addToCart: "బుట్టలో వేయండి 🛒",
      addedToCart: "బుట్టలో చేర్చబడింది! 🌿",
      viewDetails: "వివరాలు",
      cartTitle: "మీ బుట్ట",
      cartEmptyTitle: "మీ బుట్ట ఖాళీగా ఉంది",
      cartEmptyDesc: "మా గోశాల మరియు సహజ వ్యవసాయ ఉత్పత్తులను ఎంచుకోండి.",
      cartSubtotal: "మొత్తం వెల:",
      cartFreeDelivery: "ఉచిత హోమ్ డెలివరీ వర్తిస్తుంది 🚚",
      checkoutBtn: "ఆర్డర్ పూర్తి చేయండి (UPI ద్వారా) →",
      checkoutTitle: "ఆర్డర్ వివరాలు & UPI చెల్లింపు",
      custNameLabel: "మీ పూర్తి పేరు *",
      custPhoneLabel: "ఫోన్ నంబర్ (WhatsApp) *",
      custAddressLabel: "పూర్తి డెలివరీ చిరునామా & పిన్‌కోడ్ *",
      custNotesLabel: "ప్రత్యేక సూచనలు (ఐచ్ఛికం)",
      payStep1: "1. క్రింది QR కోడ్‌ను మీ UPI యాప్ (GPay, PhonePe, Paytm) తో స్కాన్ చేయండి లేదా బటన్ క్లిక్ చేయండి:",
      payStep2: "2. చెల్లింపు పూర్తయ్యాక WhatsApp బటన్ క్లిక్ చేసి ఆర్డర్ నిర్ధారించండి.",
      payViaApp: "📱 UPI యాప్‌లో చెల్లించండి",
      copyUpiBtn: "📋 UPI ID కాపీ చేయండి",
      copied: "కాపీ చేయబడింది!",
      sendWhatsApp: "📲 WhatsApp ద్వారా ఆర్డర్ వివరాలు పంపండి",
      orderPlacedSuccess: "మీ ఆర్డర్ సిద్ధంగా ఉంది! WhatsApp ద్వారా పంపండి.",
      orderSummary: "ఆర్డర్ సారాంశం",
      fssaiNotice: "FSSAI రిజిస్ట్రేషన్ లైసెన్స్: XXXXXXXXXXXXXX",
      howToOrderTitle: "ఆర్డర్ ఎలా చేయాలి?",
      step1Title: "1. ఉత్పత్తులను ఎంచుకోండి",
      step1Desc: "మీకు కావలసిన పరిమాణాన్ని (g / kg / L) ఎంచుకుని బుట్టలో వేయండి.",
      step2Title: "2. డైరెక్ట్ UPI ద్వారా చెల్లించండి",
      step2Desc: "0% రుసుములతో నేరుగా మా ట్రస్ట్ UPI ID కి చెల్లించండి.",
      step3Title: "3. WhatsApp లో రసీదు పంపండి",
      step3Desc: "మీ ఆర్డర్ ID తో కూడిన మెసేజ్ ను ఒక్క క్లిక్ తో పంపండి.",
      orderHistoryTitle: "నా గత ఆర్డర్లు",
      noOrders: "ఇంకా ఎలాంటి ఆర్డర్లు లేవు.",
      viewHistory: "ఆర్డర్ల చరిత్ర 📋",
      close: "మూసివేయి",
      unitLabel: "పరిమాణం:"
    },
    en: {
      siteTitle: "Kurmagram Vedic Village | Natural Living Store",
      badge: "Srikurmam Region • Nanda Gokulam Goshala Trust (Est. 2018)",
      heroTagline: "Simple Living – High Thinking",
      heroDesc: "100% pure, natural products handcrafted by Vedic village community without chemicals, fertilizers, or harm to any living entity.",
      heroCtaShop: "Explore Catalog 🌾",
      heroCtaStory: "Our Mission 📖",
      pillarsTitle: "Our Four Core Pillars",
      pillar1Title: "Simple Living",
      pillar1Desc: "Pure, peaceful, chemical-free conscious lifestyle.",
      pillar2Title: "Natural Methods",
      pillar2Desc: "Desi natural farming without pesticides or fertilizers.",
      pillar3Title: "Traditional Wisdom",
      pillar3Desc: "Wood-pressed cold oils & sacred Goshala distillation.",
      pillar4Title: "Dharmic Values",
      pillar4Desc: "Sanctuary for sacred desi cows and community harmony.",
      searchPlaceholder: "Search natural products (e.g. Sunni Pindi, Sesame Oil, Brown Rice)...",
      filterAll: "All Products",
      noProductsFound: "No matching products found.",
      clearSearch: "Clear Search Filter",
      addToCart: "Add to Cart 🛒",
      addedToCart: "Added to Cart! 🌿",
      viewDetails: "Quick View",
      cartTitle: "Your Cart",
      cartEmptyTitle: "Your cart is currently empty",
      cartEmptyDesc: "Explore our pure Goshala and natural farming products.",
      cartSubtotal: "Subtotal:",
      cartFreeDelivery: "Eligible for Direct Farm Delivery 🚚",
      checkoutBtn: "Proceed to Checkout (Direct UPI) →",
      checkoutTitle: "Order Details & Direct UPI Payment",
      custNameLabel: "Full Name *",
      custPhoneLabel: "Phone Number (WhatsApp) *",
      custAddressLabel: "Delivery Address & Pincode *",
      custNotesLabel: "Delivery Notes (Optional)",
      payStep1: "1. Scan the QR code with any UPI app (GPay, PhonePe, Paytm) or tap the direct button:",
      payStep2: "2. After payment, click the WhatsApp button to confirm your order details and receipt.",
      payViaApp: "📱 Pay via UPI App",
      copyUpiBtn: "📋 Copy UPI ID",
      copied: "Copied!",
      sendWhatsApp: "📲 Send Order & Receipt on WhatsApp",
      orderPlacedSuccess: "Order prepared! Please send the confirmation on WhatsApp.",
      orderSummary: "Order Summary",
      fssaiNotice: "FSSAI Food License: XXXXXXXXXXXXXX",
      howToOrderTitle: "How to Order?",
      step1Title: "1. Select Products",
      step1Desc: "Choose your desired pack size (g / kg / L) and add to cart.",
      step2Title: "2. Pay via Direct UPI",
      step2Desc: "0% transaction fee. Pay directly to our trust account.",
      step3Title: "3. Send on WhatsApp",
      step3Desc: "One click sends your itemized order and delivery address.",
      orderHistoryTitle: "My Order History",
      noOrders: "No previous orders found in this browser.",
      viewHistory: "Past Orders 📋",
      close: "Close",
      unitLabel: "Size:"
    }
  };

  // --- 2. Central Store State ---
  class Store {
    constructor() {
      this.STORAGE_KEYS = {
        CART: 'kg_cart_v1',
        ORDERS: 'kg_orders_v1',
        LANG: 'kg_lang_v1'
      };

      this.lang = localStorage.getItem(this.STORAGE_KEYS.LANG) || 'te';
      this.cart = this.loadJSON(this.STORAGE_KEYS.CART, []);
      this.orders = this.loadJSON(this.STORAGE_KEYS.ORDERS, []);
      this.selectedUnits = {};
      this.activeCategory = 'all';
      this.searchQuery = '';
      this.currentOrderId = null;

      // Initialize default selected unit (index 0) for all products
      PRODUCTS.forEach((p) => {
        this.selectedUnits[p.id] = 0;
      });

      this.initFuseSearch();
    }

    loadJSON(key, defaultVal) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
      } catch (e) {
        return defaultVal;
      }
    }

    saveCart() {
      try {
        localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(this.cart));
      } catch (e) {}
    }

    saveOrders() {
      try {
        localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
      } catch (e) {}
    }

    setLang(lang) {
      if (lang !== 'te' && lang !== 'en') return;
      this.lang = lang;
      localStorage.setItem(this.STORAGE_KEYS.LANG, lang);
      document.documentElement.lang = lang;
      this.renderAll();
    }

    toggleLang() {
      this.setLang(this.lang === 'te' ? 'en' : 'te');
    }

    initFuseSearch() {
      if (typeof window.Fuse !== 'undefined') {
        const options = {
          keys: [
            { name: 'te', weight: 0.35 },
            { name: 'en', weight: 0.35 },
            { name: 'tag', weight: 0.15 },
            { name: 'desc', weight: 0.1 },
            { name: 'descEn', weight: 0.1 }
          ],
          threshold: 0.35,
          ignoreLocation: true
        };
        this.fuse = new window.Fuse(PRODUCTS, options);
      }
    }

    getFilteredProducts() {
      let list = PRODUCTS;

      // Category filter
      if (this.activeCategory !== 'all') {
        list = list.filter((p) => p.cat === this.activeCategory);
      }

      // Search query filter
      if (this.searchQuery.trim()) {
        if (this.fuse) {
          const results = this.fuse.search(this.searchQuery.trim());
          const matchedIds = new Set(results.map((r) => r.item.id));
          list = list.filter((p) => matchedIds.has(p.id));
        } else {
          const q = this.searchQuery.toLowerCase();
          list = list.filter(
            (p) =>
              p.te.toLowerCase().includes(q) ||
              p.en.toLowerCase().includes(q) ||
              p.tag.toLowerCase().includes(q)
          );
        }
      }

      return list;
    }

    setSelectedUnit(productId, unitIndex) {
      this.selectedUnits[productId] = unitIndex;
      this.renderProductCardPrice(productId);
    }

    addToCart(productId, unitIndex, qty = 1) {
      const idx = unitIndex !== undefined ? unitIndex : this.selectedUnits[productId] || 0;
      const existing = this.cart.find((item) => item.productId === productId && item.unitIndex === idx);

      if (existing) {
        existing.qty += qty;
      } else {
        this.cart.push({ productId, unitIndex: idx, qty });
      }

      this.saveCart();
      this.updateCartBadge();
      this.renderCartDrawer();

      // Trigger WebAudio bell chime
      if (window.soundManager) {
        window.soundManager.playBell('add');
      }

      this.showToast(this.t('addedToCart'));
    }

    updateCartQty(productId, unitIndex, delta) {
      const item = this.cart.find((i) => i.productId === productId && i.unitIndex === unitIndex);
      if (!item) return;

      item.qty += delta;
      if (item.qty <= 0) {
        this.cart = this.cart.filter((i) => !(i.productId === productId && i.unitIndex === unitIndex));
      }

      this.saveCart();
      this.updateCartBadge();
      this.renderCartDrawer();
      if (document.getElementById('checkoutModal')?.classList.contains('active')) {
        this.renderCheckoutSummary();
      }
    }

    removeFromCart(productId, unitIndex) {
      this.cart = this.cart.filter((i) => !(i.productId === productId && i.unitIndex === unitIndex));
      this.saveCart();
      this.updateCartBadge();
      this.renderCartDrawer();
      if (document.getElementById('checkoutModal')?.classList.contains('active')) {
        this.renderCheckoutSummary();
      }
    }

    getCartTotal() {
      return this.cart.reduce((sum, item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        if (!prod || !prod.units[item.unitIndex]) return sum;
        return sum + prod.units[item.unitIndex].price * item.qty;
      }, 0);
    }

    getCartCount() {
      return this.cart.reduce((sum, item) => sum + item.qty, 0);
    }

    clearCart() {
      this.cart = [];
      this.saveCart();
      this.updateCartBadge();
      this.renderCartDrawer();
    }

    generateOrderId() {
      const date = new Date();
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const rand = Math.floor(1000 + Math.random() * 9000);
      return `KG-${y}${m}${d}-${rand}`;
    }

    t(key) {
      return (STRINGS[this.lang] && STRINGS[this.lang][key]) || STRINGS.en[key] || key;
    }

    showToast(message, duration = 3000) {
      const toast = document.getElementById('toastNotification');
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }

    // --- UI Renderers ---
    updateCartBadge() {
      const count = this.getCartCount();
      const badge = document.getElementById('cartCountBadge');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
        badge.setAttribute('aria-label', `${count} items in cart`);
      }
    }

    renderCategoryChips() {
      const container = document.getElementById('categoryFilters');
      if (!container) return;

      container.innerHTML = CATEGORIES.map((cat) => {
        const isActive = this.activeCategory === cat.id;
        const label = this.lang === 'te' ? cat.te : cat.en;
        return `
          <button 
            type="button" 
            class="chip-btn ${isActive ? 'active' : ''}" 
            data-category="${cat.id}"
            aria-pressed="${isActive}">
            ${label}
          </button>
        `;
      }).join('');

      container.querySelectorAll('.chip-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.activeCategory = btn.dataset.category;
          this.renderCategoryChips();
          this.renderProductGrid();
        });
      });
    }

    renderProductGrid() {
      const grid = document.getElementById('productGrid');
      if (!grid) return;

      const products = this.getFilteredProducts();

      if (products.length === 0) {
        grid.innerHTML = `
          <div class="no-products-card">
            <div class="no-products-icon">🌿</div>
            <h3>${this.t('noProductsFound')}</h3>
            <button type="button" id="clearSearchBtn" class="btn btn-secondary">
              ${this.t('clearSearch')}
            </button>
          </div>
        `;
        document.getElementById('clearSearchBtn')?.addEventListener('click', () => {
          this.searchQuery = '';
          const searchInput = document.getElementById('productSearchInput');
          if (searchInput) searchInput.value = '';
          this.renderProductGrid();
        });
        return;
      }

      grid.innerHTML = products.map((prod) => this.renderProductCardHTML(prod)).join('');

      // Wire up card event handlers
      products.forEach((prod) => {
        const card = document.getElementById(`prod-card-${prod.id}`);
        if (!card) return;

        // Unit selector buttons
        card.querySelectorAll('.unit-pill').forEach((pill) => {
          pill.addEventListener('click', (e) => {
            const unitIdx = parseInt(e.currentTarget.dataset.unitIndex, 10);
            this.setSelectedUnit(prod.id, unitIdx);
          });
        });

        // Add to cart button
        card.querySelector('.btn-add-cart')?.addEventListener('click', () => {
          const selectedUnit = this.selectedUnits[prod.id] || 0;
          this.addToCart(prod.id, selectedUnit);
        });

        // Quick view button / click on image
        card.querySelector('.quick-view-trigger')?.addEventListener('click', () => {
          this.openQuickViewModal(prod);
        });
      });
    }

    renderProductCardHTML(prod) {
      const selectedIdx = this.selectedUnits[prod.id] || 0;
      const currentUnit = prod.units[selectedIdx] || prod.units[0];
      const title = this.lang === 'te' ? prod.te : prod.en;
      const subtitle = this.lang === 'te' ? prod.en : prod.te;
      const desc = this.lang === 'te' ? prod.desc : prod.descEn;

      const unitPillsHTML = prod.units.length > 1
        ? `
          <div class="unit-selector" role="radiogroup" aria-label="${this.t('unitLabel')}">
            ${prod.units.map((u, i) => `
              <button 
                type="button" 
                class="unit-pill ${i === selectedIdx ? 'selected' : ''}" 
                data-unit-index="${i}"
                role="radio"
                aria-checked="${i === selectedIdx}">
                ${u.label}
              </button>
            `).join('')}
          </div>
        `
        : `<div class="single-unit-badge">${currentUnit.label}</div>`;

      const priceHTML = this.formatPriceDisplay(currentUnit);

      return `
        <article class="product-card" id="prod-card-${prod.id}" data-id="${prod.id}">
          <div class="card-media quick-view-trigger" role="button" tabindex="0" aria-label="${title} - ${this.t('viewDetails')}">
            <span class="product-tag">${prod.tag}</span>
            <img src="${prod.svg}" alt="${title}" class="product-svg" loading="lazy" width="220" height="180">
          </div>
          <div class="card-body">
            <h3 class="product-title">${title}</h3>
            <p class="product-subtitle">${subtitle}</p>
            <p class="product-desc">${desc}</p>
            
            <div class="card-unit-row">
              ${unitPillsHTML}
            </div>

            <div class="card-pricing-row" id="price-row-${prod.id}">
              ${priceHTML}
            </div>

            <div class="card-actions">
              <button type="button" class="btn btn-primary btn-add-cart" aria-label="${this.t('addToCart')} ${title}">
                ${this.t('addToCart')}
              </button>
            </div>
          </div>
        </article>
      `;
    }

    formatPriceDisplay(unit) {
      const note = this.lang === 'te' ? unit.note : (unit.noteEn || unit.note);
      return `
        <div class="price-container">
          <span class="price-val">₹${unit.price}</span>
          ${unit.mrp ? `<span class="mrp-val"><del>₹${unit.mrp}</del></span>` : ''}
          ${note ? `<span class="discount-badge">${note}</span>` : ''}
        </div>
      `;
    }

    renderProductCardPrice(productId) {
      const prod = PRODUCTS.find((p) => p.id === productId);
      if (!prod) return;

      const card = document.getElementById(`prod-card-${productId}`);
      if (!card) return;

      const selectedIdx = this.selectedUnits[productId] || 0;
      const currentUnit = prod.units[selectedIdx] || prod.units[0];

      // Update pills active state
      card.querySelectorAll('.unit-pill').forEach((pill, idx) => {
        if (idx === selectedIdx) {
          pill.classList.add('selected');
          pill.setAttribute('aria-checked', 'true');
        } else {
          pill.classList.remove('selected');
          pill.setAttribute('aria-checked', 'false');
        }
      });

      // Update price display
      const priceRow = document.getElementById(`price-row-${productId}`);
      if (priceRow) {
        priceRow.innerHTML = this.formatPriceDisplay(currentUnit);
      }
    }

    renderCartDrawer() {
      const itemsContainer = document.getElementById('cartDrawerItems');
      const subtotalEl = document.getElementById('cartSubtotalAmount');
      const checkoutBtn = document.getElementById('cartCheckoutBtn');
      if (!itemsContainer || !subtotalEl) return;

      if (this.cart.length === 0) {
        itemsContainer.innerHTML = `
          <div class="cart-empty-view">
            <div class="empty-icon">🌾</div>
            <h4>${this.t('cartEmptyTitle')}</h4>
            <p>${this.t('cartEmptyDesc')}</p>
            <button type="button" class="btn btn-secondary" id="emptyCartShopBtn">
              ${this.t('heroCtaShop')}
            </button>
          </div>
        `;
        subtotalEl.textContent = '₹0';
        if (checkoutBtn) checkoutBtn.disabled = true;
        document.getElementById('emptyCartShopBtn')?.addEventListener('click', () => {
          this.closeCartDrawer();
          window.motionController.scrollTo('#catalog');
        });
        return;
      }

      if (checkoutBtn) checkoutBtn.disabled = false;
      const total = this.getCartTotal();
      subtotalEl.textContent = `₹${total}`;

      itemsContainer.innerHTML = this.cart.map((item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        if (!prod) return '';
        const unit = prod.units[item.unitIndex] || prod.units[0];
        const title = this.lang === 'te' ? prod.te : prod.en;
        const lineTotal = unit.price * item.qty;

        return `
          <div class="cart-item" data-id="${prod.id}" data-unit="${item.unitIndex}">
            <img src="${prod.svg}" alt="${title}" class="cart-item-thumb" width="60" height="50">
            <div class="cart-item-info">
              <h4 class="cart-item-title">${title}</h4>
              <span class="cart-item-unit">${unit.label} • ₹${unit.price}</span>
              <div class="cart-qty-control">
                <button type="button" class="qty-btn dec-btn" aria-label="Decrease quantity">−</button>
                <span class="qty-val" aria-live="polite">${item.qty}</span>
                <button type="button" class="qty-btn inc-btn" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div class="cart-item-pricing">
              <span class="line-total">₹${lineTotal}</span>
              <button type="button" class="cart-remove-btn" aria-label="Remove item">✕</button>
            </div>
          </div>
        `;
      }).join('');

      // Wire cart item buttons
      itemsContainer.querySelectorAll('.cart-item').forEach((row) => {
        const pId = row.dataset.id;
        const uIdx = parseInt(row.dataset.unit, 10);

        row.querySelector('.dec-btn')?.addEventListener('click', () => {
          this.updateCartQty(pId, uIdx, -1);
        });

        row.querySelector('.inc-btn')?.addEventListener('click', () => {
          this.updateCartQty(pId, uIdx, 1);
        });

        row.querySelector('.cart-remove-btn')?.addEventListener('click', () => {
          this.removeFromCart(pId, uIdx);
        });
      });
    }

    openCartDrawer() {
      const drawer = document.getElementById('cartDrawer');
      const backdrop = document.getElementById('drawerBackdrop');
      if (!drawer || !backdrop) return;

      this.renderCartDrawer();
      drawer.classList.add('open');
      backdrop.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      window.motionController.lockScroll();

      // Focus close button
      drawer.querySelector('.drawer-close-btn')?.focus();
    }

    closeCartDrawer() {
      const drawer = document.getElementById('cartDrawer');
      const backdrop = document.getElementById('drawerBackdrop');
      if (!drawer || !backdrop) return;

      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      window.motionController.unlockScroll();
    }

    openQuickViewModal(prod) {
      const modal = document.getElementById('quickViewModal');
      const content = document.getElementById('quickViewModalBody');
      if (!modal || !content) return;

      const title = this.lang === 'te' ? prod.te : prod.en;
      const subtitle = this.lang === 'te' ? prod.en : prod.te;
      const desc = this.lang === 'te' ? prod.desc : prod.descEn;
      const selectedIdx = this.selectedUnits[prod.id] || 0;
      const currentUnit = prod.units[selectedIdx] || prod.units[0];

      content.innerHTML = `
        <div class="quick-view-grid">
          <div class="quick-view-media">
            <img src="${prod.svg}" alt="${title}" width="260" height="220">
          </div>
          <div class="quick-view-details">
            <span class="product-tag">${prod.tag}</span>
            <h2>${title}</h2>
            <p class="quick-view-sub">${subtitle}</p>
            <p class="quick-view-desc">${desc}</p>
            
            ${prod.isFood ? `<div class="fssai-box">🛡️ ${this.t('fssaiNotice')}</div>` : ''}

            <div class="unit-selector-modal" role="radiogroup">
              ${prod.units.map((u, i) => `
                <button 
                  type="button" 
                  class="unit-pill ${i === selectedIdx ? 'selected' : ''}" 
                  data-unit-idx="${i}">
                  ${u.label} - ₹${u.price}
                </button>
              `).join('')}
            </div>

            <div class="modal-pricing-box" id="modalPriceBox">
              ${this.formatPriceDisplay(currentUnit)}
            </div>

            <button type="button" class="btn btn-primary btn-modal-add" id="modalAddCartBtn">
              ${this.t('addToCart')}
            </button>
          </div>
        </div>
      `;

      // Handle unit selection in modal
      content.querySelectorAll('.unit-pill').forEach((pill) => {
        pill.addEventListener('click', (e) => {
          const uIdx = parseInt(e.currentTarget.dataset.unitIdx, 10);
          this.setSelectedUnit(prod.id, uIdx);
          this.openQuickViewModal(prod); // Re-render modal state
        });
      });

      content.querySelector('#modalAddCartBtn')?.addEventListener('click', () => {
        this.addToCart(prod.id, this.selectedUnits[prod.id] || 0);
        this.closeQuickViewModal();
        this.openCartDrawer();
      });

      modal.classList.add('active');
      window.motionController.lockScroll();
      modal.querySelector('.modal-close-btn')?.focus();
    }

    closeQuickViewModal() {
      const modal = document.getElementById('quickViewModal');
      if (!modal) return;
      modal.classList.remove('active');
      window.motionController.unlockScroll();
    }

    // --- Checkout & UPI Payment Flow ---
    openCheckoutModal() {
      if (this.cart.length === 0) return;
      this.closeCartDrawer();

      const modal = document.getElementById('checkoutModal');
      if (!modal) return;

      this.currentOrderId = this.generateOrderId();
      this.renderCheckoutSummary();

      modal.classList.add('active');
      window.motionController.lockScroll();
      document.getElementById('custName')?.focus();
    }

    closeCheckoutModal() {
      const modal = document.getElementById('checkoutModal');
      if (!modal) return;
      modal.classList.remove('active');
      window.motionController.unlockScroll();
    }

    renderCheckoutSummary() {
      const summaryList = document.getElementById('checkoutItemsList');
      const totalAmountEl = document.getElementById('checkoutTotalAmount');
      const orderIdDisplay = document.getElementById('checkoutOrderId');
      if (!summaryList || !totalAmountEl) return;

      const total = this.getCartTotal();
      if (orderIdDisplay) orderIdDisplay.textContent = this.currentOrderId;
      totalAmountEl.textContent = `₹${total}`;

      summaryList.innerHTML = this.cart.map((item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        if (!prod) return '';
        const unit = prod.units[item.unitIndex] || prod.units[0];
        const title = this.lang === 'te' ? prod.te : prod.en;
        return `
          <li class="checkout-item-line">
            <span>${title} (${unit.label}) × ${item.qty}</span>
            <strong>₹${unit.price * item.qty}</strong>
          </li>
        `;
      }).join('');

      this.generatePaymentQR(total);
    }

    generatePaymentQR(total) {
      const qrContainer = document.getElementById('upiQrContainer');
      const payLinkBtn = document.getElementById('upiPayDeepLink');
      const copyUpiBtn = document.getElementById('copyUpiIdBtn');
      if (!qrContainer) return;

      // NPCI-standard URI specification:
      // upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
      const upiUri = `upi://pay?pa=${encodeURIComponent(CONFIG.upiId)}&pn=${encodeURIComponent(CONFIG.payeeName)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(this.currentOrderId)}`;

      // Direct payment link for mobile browsers
      if (payLinkBtn) {
        payLinkBtn.href = upiUri;
      }

      // Render QR code locally via qrcode-generator (Error correction Level M)
      if (typeof window.qrcode !== 'undefined') {
        try {
          const qr = window.qrcode(0, 'M');
          qr.addData(upiUri);
          qr.make();
          qrContainer.innerHTML = qr.createSvgTag({ scalable: true, margin: 2 });
        } catch (e) {
          console.warn('QR Code generation fallback:', e);
          qrContainer.innerHTML = `<div class="qr-fallback-box">UPI: <strong>${CONFIG.upiId}</strong><br>Amount: <strong>₹${total}</strong></div>`;
        }
      }

      // Copy UPI ID button
      if (copyUpiBtn) {
        copyUpiBtn.onclick = () => {
          this.copyToClipboard(CONFIG.upiId, copyUpiBtn);
        };
      }
    }

    copyToClipboard(text, btnElement) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showCopiedFeedback(btnElement);
        });
      } else {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        this.showCopiedFeedback(btnElement);
      }
    }

    showCopiedFeedback(btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = `✓ ${this.t('copied')}`;
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('copied');
      }, 2000);
    }

    handleOrderSubmission() {
      const nameInput = document.getElementById('custName');
      const phoneInput = document.getElementById('custPhone');
      const addressInput = document.getElementById('custAddress');
      const notesInput = document.getElementById('custNotes');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const address = addressInput ? addressInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      if (!name || !phone || !address) {
        alert(this.lang === 'te' ? 'దయచేసి మీ పేరు, ఫోన్ మరియు చిరునామా వివరాలను నింపండి.' : 'Please enter your Name, Phone Number, and Delivery Address.');
        return;
      }

      const total = this.getCartTotal();
      const orderData = {
        orderId: this.currentOrderId,
        date: new Date().toISOString(),
        customer: { name, phone, address, notes },
        items: this.cart.map((item) => {
          const prod = PRODUCTS.find((p) => p.id === item.productId);
          const unit = prod.units[item.unitIndex] || prod.units[0];
          return {
            id: prod.id,
            nameTe: prod.te,
            nameEn: prod.en,
            unit: unit.label,
            price: unit.price,
            qty: item.qty,
            lineTotal: unit.price * item.qty
          };
        }),
        totalAmount: total,
        upiId: CONFIG.upiId,
        status: 'Placed'
      };

      // Persist in local orders history
      this.orders.unshift(orderData);
      this.saveOrders();

      // Trigger Celebration: Sound & Confetti
      if (window.soundManager) {
        window.soundManager.playBell('order');
      }
      this.fireConfetti();

      // Format WhatsApp Message
      const waMessage = this.formatWhatsAppMessage(orderData);
      const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waMessage)}`;

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Clear Cart and close checkout modal
      this.clearCart();
      this.closeCheckoutModal();

      // Open Order Confirmation / History Modal
      this.openOrderHistoryModal();
    }

    formatWhatsAppMessage(order) {
      const itemsList = order.items
        .map((i, idx) => `${idx + 1}. ${i.nameTe} (${i.nameEn}) [${i.unit}] x ${i.qty} = ₹${i.lineTotal}`)
        .join('\n');

      return `*నమస్తే, కూర్మగ్రామ వేదిక్ విలేజ్ ఆర్డర్ రసీదు*\n` +
        `-----------------------------------------\n` +
        `*ఆర్డర్ ID:* ${order.orderId}\n` +
        `*తేదీ:* ${new Date(order.date).toLocaleDateString('te-IN')}\n\n` +
        `*కొనుగోలుదారుని వివరాలు:*\n` +
        `• పేరు: ${order.customer.name}\n` +
        `• ఫోన్: ${order.customer.phone}\n` +
        `• చిరునామా: ${order.customer.address}\n` +
        (order.customer.notes ? `• సూచనలు: ${order.customer.notes}\n` : '') +
        `\n*ఆర్డర్ చేసిన వస్తువులు:*\n${itemsList}\n\n` +
        `-----------------------------------------\n` +
        `*మొత్తం చెల్లించవలసినది:* ₹${order.totalAmount}\n` +
        `*UPI ID:* ${order.upiId}\n` +
        `*చెల్లింపు స్థితి:* UPI ద్వారా చెల్లించబడింది / స్క్రీన్‌షాట్ జతచేయబడింది.\n` +
        `-----------------------------------------\n` +
        `దయచేసి నా ఆర్డర్‌ను ధృవీకరించి పంపించగలరు. ధన్యవాదాలు!`;
    }

    fireConfetti() {
      if (typeof window.confetti !== 'undefined') {
        const saffron = '#e8890c';
        const paddyGreen = '#2f6b3a';
        const warmGold = '#ffb703';

        window.confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: [saffron, paddyGreen, warmGold]
        });

        setTimeout(() => {
          window.confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: [saffron, paddyGreen, warmGold]
          });
          window.confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: [saffron, paddyGreen, warmGold]
          });
        }, 250);
      }
    }

    openOrderHistoryModal() {
      const modal = document.getElementById('orderHistoryModal');
      const list = document.getElementById('orderHistoryList');
      if (!modal || !list) return;

      if (this.orders.length === 0) {
        list.innerHTML = `<div class="empty-orders-note">${this.t('noOrders')}</div>`;
      } else {
        list.innerHTML = this.orders.map((ord) => {
          const itemsSummary = ord.items.map((i) => `${i.nameTe} (${i.unit}) × ${i.qty}`).join(', ');
          const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(this.formatWhatsAppMessage(ord))}`;
          return `
            <div class="order-history-card">
              <div class="order-hist-header">
                <strong>${ord.orderId}</strong>
                <span class="order-hist-date">${new Date(ord.date).toLocaleDateString()}</span>
              </div>
              <p class="order-hist-items">${itemsSummary}</p>
              <div class="order-hist-footer">
                <span class="order-hist-total">మొత్తం: ₹${ord.totalAmount}</span>
                <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-whatsapp">
                  WhatsApp రసీదు 📲
                </a>
              </div>
            </div>
          `;
        }).join('');
      }

      modal.classList.add('active');
      window.motionController.lockScroll();
      modal.querySelector('.modal-close-btn')?.focus();
    }

    closeOrderHistoryModal() {
      const modal = document.getElementById('orderHistoryModal');
      if (!modal) return;
      modal.classList.remove('active');
      window.motionController.unlockScroll();
    }

    // --- Global Translations & Bindings ---
    renderAll() {
      // 1. Static i18n text replacement
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        el.textContent = this.t(key);
      });

      // 2. Language toggle button text
      const langBtn = document.getElementById('langToggleBtn');
      if (langBtn) {
        langBtn.textContent = this.lang === 'te' ? 'English' : 'తెలుగు';
        langBtn.setAttribute('aria-label', this.lang === 'te' ? 'Switch to English' : 'తెలుగులోకి మార్చండి');
      }

      // 3. Search placeholder
      const searchInput = document.getElementById('productSearchInput');
      if (searchInput) {
        searchInput.placeholder = this.t('searchPlaceholder');
      }

      // 4. Re-render dynamic components
      this.renderCategoryChips();
      this.renderProductGrid();
      this.renderCartDrawer();
      this.updateCartBadge();
    }

    initEventListeners() {
      // Language Toggle
      document.getElementById('langToggleBtn')?.addEventListener('click', () => {
        this.toggleLang();
      });

      // Cart Drawer open/close
      document.getElementById('headerCartBtn')?.addEventListener('click', () => {
        this.openCartDrawer();
      });
      document.getElementById('cartDrawerCloseBtn')?.addEventListener('click', () => {
        this.closeCartDrawer();
      });
      document.getElementById('drawerBackdrop')?.addEventListener('click', () => {
        this.closeCartDrawer();
      });

      // Cart Checkout Button
      document.getElementById('cartCheckoutBtn')?.addEventListener('click', () => {
        this.openCheckoutModal();
      });

      // Modals close buttons & backdrops
      document.querySelectorAll('.modal-overlay').forEach((overlay) => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            overlay.classList.remove('active');
            window.motionController.unlockScroll();
          }
        });
      });

      document.querySelectorAll('.modal-close-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const modal = e.target.closest('.modal-overlay');
          if (modal) {
            modal.classList.remove('active');
            window.motionController.unlockScroll();
          }
        });
      });

      // Escape key to close any open modal/drawer
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeCartDrawer();
          this.closeQuickViewModal();
          this.closeCheckoutModal();
          this.closeOrderHistoryModal();
        }
      });

      // Search input handler
      const searchInput = document.getElementById('productSearchInput');
      if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            this.searchQuery = e.target.value;
            this.renderProductGrid();
          }, 180);
        });
      }

      // Checkout WhatsApp submission button
      document.getElementById('submitOrderWhatsAppBtn')?.addEventListener('click', () => {
        this.handleOrderSubmission();
      });

      // Order History Trigger
      document.getElementById('viewOrderHistoryBtn')?.addEventListener('click', () => {
        this.openOrderHistoryModal();
      });

      // Copy Order Summary button
      document.getElementById('copySummaryBtn')?.addEventListener('click', (e) => {
        const orderSummary = this.formatWhatsAppMessage({
          orderId: this.currentOrderId,
          date: new Date().toISOString(),
          customer: {
            name: document.getElementById('custName')?.value || 'Guest',
            phone: document.getElementById('custPhone')?.value || '',
            address: document.getElementById('custAddress')?.value || '',
            notes: document.getElementById('custNotes')?.value || ''
          },
          items: this.cart.map((item) => {
            const prod = PRODUCTS.find((p) => p.id === item.productId);
            const unit = prod.units[item.unitIndex] || prod.units[0];
            return {
              nameTe: prod.te,
              nameEn: prod.en,
              unit: unit.label,
              qty: item.qty,
              lineTotal: unit.price * item.qty
            };
          }),
          totalAmount: this.getCartTotal(),
          upiId: CONFIG.upiId
        });
        this.copyToClipboard(orderSummary, e.currentTarget);
      });
    }

    init() {
      document.documentElement.lang = this.lang;
      this.initEventListeners();
      this.renderAll();
    }
  }

  // Instantiate store on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.store = new Store();
    window.store.init();
  });
})();
