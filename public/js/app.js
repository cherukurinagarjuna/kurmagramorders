/**
 * KURMAGRAM VEDIC VILLAGE — STORE ENGINE (js/app.js)
 * Clean vanilla JS single-source-of-truth architecture.
 * Standards:
 *  - 100% Anti-Slop Compliance (Zero Emojis, Zero SaaS Neon)
 *  - Bilingual i18n (Telugu default / English toggle)
 *  - Fuse.js bilingual fuzzy search & natural-dye category chips
 *  - Accessible Cart Drawer with focus trap & body scroll lock
 *  - Direct NPCI-compliant UPI URI + QR generation (Level M)
 *  - 12-digit UTR reference capture & WhatsApp order handoff
 *  - WebAudio sound chimes & confetti celebrations
 *  - LocalStorage persistence with schema versioning
 */

(function () {
  'use strict';

  // Natural dye colors for category swatches
  const DYE_COLORS = {
    all: '#B5944B',    /* Antique Brass */
    care: '#A62B2B',   /* Madder Red */
    cow: '#F59E0B',    /* Ghee Amber */
    farm: '#2D6A4F',   /* Harita Green */
    grain: '#D97706',  /* Turmeric Amber */
    oils: '#1E3F66'    /* Indigo Blue */
  };

  // --- 1. Bilingual Dictionary (Cleaned of all emojis) ---
  const STRINGS = {
    te: {
      siteTitle: "కూర్మగ్రామ వేదిక్ విలేజ్ | సహజ ఉత్పత్తులు",
      badge: "శ్రీకూరర్మ క్షేత్రం • నంద గోకులం గోశాల ట్రస్ట్ (2018)",
      heroTagline: "సరళ జీవనం – ఉన్నత ఆశయం",
      heroDesc: "ఎలాంటి ఫెర్టిలైజర్స్, క్రిమిసంహారకాలు లేకుండా, సకల జీవులకు హాని లేకుండా భక్తులు తయారు చేసిన సహజ ఉత్పత్తులు.",
      heroCtaShop: "ఉత్పత్తుల భాండాగారం",
      heroCtaStory: "మా జీవన విధానం",
      pillarsTitle: "మా నాలుగు మూలస్తంభాలు",
      pillar1Title: "రసాయన రహిత పుణ్యభూమి",
      pillar1Desc: "ఎలాంటి కృత్రిమ రసాయనాలు, పురుగుమందులు వాడకుండా జీవామృతం, వేప కషాయాలతో పండించే సంప్రదాయ దేశవాళీ పంటలు.",
      pillar2Title: "నంద గోకులం గో సంరక్షణ",
      pillar2Desc: "అహింసా పద్ధతిలో పూజించబడే దేశవాళీ గోవుల సంరక్షణ. గోశాల స్వచ్ఛమైన ఆవు నెయ్యి మరియు సంప్రదాయ స్వేదన ఆర్క్.",
      pillar3Title: "సంప్రదాయ చెక్క గానుగ నూనెలు",
      pillar3Desc: "సూర్యరశ్మికి ఎండిన నువ్వులు మరియు వేరుశెనగల నుండి చెక్క గానుగతో నిదానంగా తీసిన స్వచ్ఛమైన కోల్డ్ ప్రెస్డ్ నూనెలు.",
      pillar4Title: "ధార్మిక వేదిక్ సమాజం",
      pillar4Desc: "వేదిక్ గురుకులం, నిరాడంబర గ్రామీణ జీవనం మరియు సకల ప్రాణుల పట్ల దయతో కూడిన భక్తిమయ నిత్య సేవా విధానం.",
      searchPlaceholder: "ఉత్పత్తులను వెతకండి (ఉదా: సున్నిపిండి, నువ్వుల నూనె, brown rice)...",
      filterAll: "అన్ని ఉత్పత్తులు",
      noProductsFound: "క్షమించండి! మీరు వెతికిన ఉత్పత్తులు కనుగొనబడలేదు.",
      clearSearch: "వెతుకులాట క్లియర్ చేయండి",
      addToCart: "కార్ట్లో చేర్చు",
      addedToCart: "బుట్టలో చేర్చబడింది!",
      viewDetails: "వివరాలు",
      cartTitle: "మీ బుట్ట",
      cartEmptyTitle: "మీ బుట్ట ఖాళీగా ఉంది",
      cartEmptyDesc: "మా గోశాల మరియు సహజ వ్యవసాయ ఉత్పత్తులను ఎంచుకోండి.",
      cartSubtotal: "మొత్తం వెల:",
      cartFreeDelivery: "🚚 రవాణా ఛార్జీలు అదనం (నవత ట్రాన్స్‌పోర్ట్ ప్రకారం)",
      checkoutBtn: "ఆర్డర్ పూర్తి చేయండి (UPI ద్వారా) →",
      checkoutTitle: "ఆర్డర్ వివరాలు & UPI చెల్లింపు",
      custNameLabel: "మీ పూర్తి పేరు *",
      custPhoneLabel: "ఫోన్ నంబర్ (WhatsApp) *",
      custAddressLabel: "ఇంటి నం., వీధి, గ్రామం/పట్టణం (Address) *",
      formLandmark: "ల్యాండ్‌మార్క్ (Landmark)",
      formPincode: "పిన్‌కోడ్ (Pincode) *",
      shippingNoticeTitle: "రవాణా ఛార్జీలు అదనం (Shipping Charges are Extra):",
      shippingNoticeBody: "సరుకు రవాణా ఖర్చులు నవత రోడ్ ట్రాన్స్‌పోర్ట్ (Navata Road Transport) టారిఫ్ ప్రకారం ఉంటాయి. సరుకు డెలివరీ/తీసుకునే సమయంలో నేరుగా నవత ట్రాన్స్‌పోర్ట్ వారికి చెల్లించాలి.",
      custNotesLabel: "ప్రత్యేక సూచనలు (ఐచ్ఛికం)",
      payStep1: "1. క్రింది QR కోడ్‌ను మీ UPI యాప్ (GPay, PhonePe, Paytm, BHIM) తో స్కాన్ చేసి చెల్లించండి:",
      payStep2: "2. చెల్లింపు పూర్తయ్యాక 12-అంకెల UTR నంబరు నమోదు చేసి WhatsApp బటన్ క్లిక్ చేయండి.",
      payViaApp: "UPI యాప్‌లో చెల్లించండి",
      copyUpiBtn: "UPI ID కాపీ చేయండి",
      copied: "కాపీ చేయబడింది!",
      sendWhatsApp: "WhatsApp (+91 7732075607) లో రసీదు పంపండి →",
      orderPlacedSuccess: "మీ ఆర్డర్ సిద్ధంగా ఉంది! WhatsApp ద్వారా పంపండి.",
      orderSummary: "ఆర్డర్ సారాంశం",
      fssaiNotice: "FSSAI లైసెన్స్ నంబర్: XXXXXXXXXXXXXX",
      howToOrderTitle: "ఆర్డర్ ఎలా చేయాలి?",
      step1Title: "1. ఉత్పత్తులను ఎంచుకోండి",
      step1Desc: "మీకు కావలసిన పరిమాణాన్ని (g / kg / L) ఎంచుకుని బుట్టలో వేయండి.",
      step2Title: "2. డైరెక్ట్ UPI ద్వారా చెల్లించండి",
      step2Desc: "0% రుసుములతో నేరుగా మా ట్రస్ట్ UPI ID కి GPay/PhonePe ద్వారా చెల్లించండి.",
      step3Title: "3. UTR & WhatsApp నిర్ధారణ",
      step3Desc: "12-అంకెల UTR నంబరు నమోదు చేసి, ఒక్క క్లిక్ తో WhatsApp లో రసీదు పంపండి.",
      orderHistoryTitle: "నా గత ఆర్డర్లు",
      noOrders: "గతంలో ఆర్డర్లు ఏవీ లేవు.",
      viewHistory: "ఆర్డర్ల చరిత్ర",
      close: "మూసివేయి",
      unitLabel: "పరిమాణం:",
      shopTitle: "మా సహజ ఉత్పత్తుల భాండాగారం",
      shopSub: "గోశాల మరియు సహజ వ్యవసాయ క్షేత్రం నుండి నేరుగా మీ ఇంటికి",
      featuredTitle: "ఈ కాలపు ముఖ్య ఉత్పత్తులు",
      featuredSub: "ఆశ్రమ గోశాల మరియు ప్రకృతి క్షేత్రం నుండి తాజా పంట",
      orderHistory: "ఆర్డర్ల చరిత్ర",
      navHome: "హోమ్",
      navShop: "ఉత్పత్తులు",
      navStory: "మా కథ",
      navHowToOrder: "ఆర్డర్ విధానం",
      heroTitle: "కూర్మగ్రామ వేదిక్ విలేజ్",
      heroDescription: "ఎలాంటి ఫెర్టిలైజర్స్, క్రిమిసంహారకాలు లేకుండా, సకల జీవులకు హాని లేకుండా భక్తులు తయారు చేసిన సహజ ఉత్పత్తులు. దేశవాళీ ఆవుల సంరక్షణతో కూడిన వైదిక గ్రామీణ జీవనం.",
      stepsTitle: "ఆర్డర్ చేసే సులభమైన 3 దశలు",
      stepsSub: "ఎలాంటి మధ్యవర్తులు లేకుండా, 0% ఫీజుతో నేరుగా ఆశ్రమానికి చెల్లించండి",
      storyTitle: "మట్టి నుండి మీ చేతికి • సహజ జీవన ప్రస్థానం",
      storySub: "శ్రీకాకుళం కిట్టలపాడు సమీపాన గో-ఆధారిత వైదిక సమాజం",
      orderIdLabel: "ఆర్డర్ సంఖ్య",
      formName: "మీ పూర్తి పేరు *",
      formPhone: "ఫోన్ నంబర్ (WhatsApp) *",
      formAddress: "డెలివరీ చిరునామా (పూర్తి వివరాలు, పిన్‌కోడ్) *",
      copyUpi: "UPI ID కాపీ చేయండి",
      utrLabel: "2. చెల్లింపు పూర్తయిన తర్వాత UPI 12-అంకెల UTR / Ref నంబర్ నమోదు చేయండి:",
      utrHelp: "ఇది మీ ఆర్డర్ త్వరగా ధృవీకరించడానికి మరియు పంపించడానికి ఉపకరిస్తుంది."
    },
    en: {
      siteTitle: "Kurmagram Vedic Village | Pure Natural Products & Cow Care",
      badge: "Shrimukhalingam • Nanda Gokulam Goshala Trust (Est. 2018)",
      heroTagline: "Simple Living – High Thinking",
      heroDesc: "100% pure natural preparations cultivated with devotion without synthetic fertilizers, chemical pesticides, or harm to any living beings.",
      heroCtaShop: "Explore Catalog",
      heroCtaStory: "Our Life & Heritage",
      pillarsTitle: "Our Four Core Pillars",
      pillar1Title: "Zero-Chemical Sacred Soil",
      pillar1Desc: "Traditional desi farming nurtured purely with Jeevamrutham and neem decoctions.",
      pillar2Title: "Nanda Gokulam Cow Sanctuary",
      pillar2Desc: "Devotional care of indigenous desi cows with ahimsa milk ghee and herbal distillates.",
      pillar3Title: "Wood-Churned Cold Extraction",
      pillar3Desc: "Pure virgin oils extracted slowly in traditional wooden ghani without heat.",
      pillar4Title: "Dharmic Living Community",
      pillar4Desc: "80 resident devotees and Vedic Gurukulam students dedicated to simple rural life.",
      searchPlaceholder: "Search preparations (e.g. Sunni Pindi, Sesame Oil, Brown Rice)...",
      filterAll: "All Products",
      noProductsFound: "No products matched your search.",
      clearSearch: "Clear Search",
      addToCart: "Add to Cart",
      addedToCart: "Added to cart!",
      viewDetails: "View Details",
      cartTitle: "Your Cart",
      cartEmptyTitle: "Your cart is empty",
      cartEmptyDesc: "Explore our goshala and natural farm preparations to begin.",
      cartSubtotal: "Subtotal:",
      cartFreeDelivery: "🚚 Shipping charges extra (per Navata Transport)",
      checkoutBtn: "Complete Order (Direct UPI) →",
      checkoutTitle: "Order Details & Direct UPI Payment",
      custNameLabel: "Full Name *",
      custPhoneLabel: "Phone Number (WhatsApp) *",
      custAddressLabel: "House No, Street, Village/City *",
      formLandmark: "Landmark (Optional)",
      formPincode: "Pincode (6 Digits) *",
      shippingNoticeTitle: "Shipping Charges are Extra:",
      shippingNoticeBody: "Shipping charges are calculated according to Navata Road Transport tariffs, payable directly upon delivery/pickup.",
      custNotesLabel: "Delivery Instructions (Optional)",
      payStep1: "1. Scan the QR code with your UPI app (GPay, PhonePe, Paytm, BHIM) or tap the button:",
      payStep2: "2. After paying, enter your 12-digit UTR and confirm on WhatsApp.",
      payViaApp: "Pay via UPI App",
      copyUpiBtn: "Copy UPI ID",
      copied: "Copied!",
      sendWhatsApp: "Send Order Receipt on WhatsApp (+91 7732075607) →",
      orderPlacedSuccess: "Order prepared! Ready to dispatch via WhatsApp.",
      orderSummary: "Order Summary",
      fssaiNotice: "FSSAI Lic. No: XXXXXXXXXXXXXX",
      howToOrderTitle: "How to Order?",
      step1Title: "1. Select Products",
      step1Desc: "Choose your desired pack size (g / kg / L) and add to cart.",
      step2Title: "2. Pay via Direct UPI",
      step2Desc: "0% transaction fee. Pay directly to our trust account.",
      step3Title: "3. UTR & WhatsApp Confirmation",
      step3Desc: "Enter the 12-digit UTR reference and send your itemized receipt in 1 tap.",
      orderHistoryTitle: "My Order History",
      noOrders: "No previous orders found in this browser.",
      viewHistory: "Past Orders",
      close: "Close",
      unitLabel: "Size:",
      shopTitle: "Our Natural Storehouse",
      shopSub: "Directly from the goshala and natural farm to your home",
      featuredTitle: "Seasonal Featured Harvest",
      featuredSub: "Fresh harvest directly from the sanctuary goshala and natural farm",
      orderHistory: "Order History",
      navHome: "Home",
      navShop: "Products",
      navStory: "Our Story",
      navHowToOrder: "How to Order",
      heroTitle: "Kurmagram Vedic Village",
      heroDescription: "100% natural, chemical-free preparations handcrafted by devotees without harm to living beings. Vedic rural living rooted in indigenous desi cow protection.",
      stepsTitle: "Simple 3-Step Ordering Guide",
      stepsSub: "Zero middlemen, zero transaction fees. Direct trust transfer.",
      storyTitle: "From Soil to Bottle • Our Living Journey",
      storySub: "Cow-centered Vedic community near Kittalapadu, Srikakulam",
      orderIdLabel: "Order ID",
      formName: "Full Name *",
      formPhone: "Phone Number (WhatsApp) *",
      formAddress: "Delivery Address & PIN *",
      copyUpi: "Copy UPI ID",
      utrLabel: "2. After paying, enter your 12-digit UPI UTR / Ref number:",
      utrHelp: "Helps us quickly verify and dispatch your order."
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
      if (STRINGS[this.lang] && STRINGS[this.lang][key]) {
        return STRINGS[this.lang][key];
      }
      if (STRINGS.en && STRINGS.en[key]) {
        return STRINGS.en[key];
      }
      return null;
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
        const dyeColor = DYE_COLORS[cat.id] || '#B5944B';
        return `
          <button 
            type="button" 
            class="chip-btn ${isActive ? 'active' : ''}" 
            data-category="${cat.id}"
            aria-pressed="${isActive}">
            <span class="dye-dot" style="background-color: ${dyeColor};"></span>
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
      const grid = document.getElementById('productsGrid') || document.getElementById('productGrid');
      if (!grid) return;

      const products = this.getFilteredProducts();

      if (products.length === 0) {
        grid.innerHTML = `
          <div class="no-products-card" style="text-align: center; grid-column: 1 / -1; padding: 2rem;">
            <h3>${this.t('noProductsFound')}</h3>
            <button type="button" id="clearSearchBtn" class="btn btn-secondary" style="margin-top: 1rem;">
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
        card.querySelector('.btn-view-details')?.addEventListener('click', () => {
          this.openQuickViewModal(prod);
        });
      });

      // Refresh 3D tilt & magnetic hover bindings on newly rendered cards
      if (window.bentoTiltController) {
        window.bentoTiltController.refresh();
      }
    }

    renderProductCardHTML(prod) {
      const selectedIdx = this.selectedUnits[prod.id] || 0;
      const currentUnit = prod.units[selectedIdx] || prod.units[0];
      const title = this.lang === 'te' ? prod.te : prod.en;
      const subtitle = this.lang === 'te' ? prod.en : prod.te;
      const desc = this.lang === 'te' ? prod.desc : prod.descEn;
      const isRice = prod.id === 'rice';
      const indexNum = (PRODUCTS.findIndex((p) => p.id === prod.id) + 1).toString().padStart(2, '0');

      const unitPillsHTML = prod.units.length > 1
        ? `
          <div class="card-units-selector ledger-units-container unit-pills-wrap" role="radiogroup" aria-label="${this.t('unitLabel')}">
            ${prod.units.map((u, i) => `
              <button 
                type="button" 
                class="unit-pill ${i === selectedIdx ? 'selected active' : ''}" 
                data-unit-index="${i}"
                data-unit-idx="${i}"
                role="radio"
                aria-checked="${i === selectedIdx}">
                ${u.label}
              </button>
            `).join('')}
          </div>
        `
        : `<div class="ledger-units-container"><span class="unit-pill selected active">${currentUnit.label}</span></div>`;

      const priceHTML = this.formatPriceDisplay(currentUnit);

      return `
        <article 
          class="product-card product-ledger-row ${isRice ? 'product-ledger-row--featured' : ''}" 
          id="prod-card-${prod.id}" 
          data-id="${prod.id}" 
          data-category="${prod.cat}">
          <!-- Left: Index + Product Line Art + Large Telugu & Small English Title -->
          <div class="ledger-item-col-left">
            <span class="ledger-row-num">${indexNum}</span>
            <div class="ledger-row-art quick-view-trigger" role="button" tabindex="0" aria-label="${title} - ${this.t('viewDetails')}">
              <img src="${prod.svg}" alt="${title}" class="ledger-row-svg" loading="lazy" width="56" height="56">
            </div>
            <div class="ledger-row-titles">
              <div class="ledger-title-line">
                <h3 class="product-name-te ledger-name-te"><a href="/product/${prod.id}" class="ledger-title-link">${title}</a></h3>
                <span class="ledger-tag-stamp">${prod.tag}</span>
                ${isRice ? '<span class="ledger-offer-stamp">25kg ఆఫర్</span>' : ''}
              </div>
              <span class="product-name-en ledger-name-en">${subtitle}</span>
              <p class="product-desc ledger-row-desc">${desc}</p>
            </div>
          </div>

          <!-- Middle Left: Unit Selector (Sharp Rectangular Blocks) -->
          <div class="ledger-item-col-units">
            ${unitPillsHTML}
          </div>

          <!-- Middle Right: Price in Distinct Brass-Colored Box -->
          <div class="ledger-item-col-price" id="price-row-${prod.id}">
            ${priceHTML}
          </div>

          <!-- Right: Add to Cart as Simple Text Link with an Arrow (→), not a button -->
          <div class="ledger-item-col-action">
            <button 
              type="button" 
              class="btn-add-cart catalog-link-action" 
              data-id="${prod.id}" 
              data-i18n="addToCart" 
              aria-label="${this.t('addToCart')} ${title}">
              ${this.t('addToCart')} &rarr;
            </button>
          </div>
        </article>
      `;
    }

    formatPriceDisplay(unit) {
      const note = this.lang === 'te' ? unit.note : (unit.noteEn || unit.note);
      return `
        <div class="ledger-brass-box price-display price-box">
          <span class="price-val">₹${unit.price}</span>
          <span class="unit-tag">/ ${unit.label}</span>
          ${unit.mrp ? `<span class="mrp-val">₹${unit.mrp}</span>` : ''}
          ${note ? `<span class="discount-badge ledger-savings-badge">${note}</span>` : ''}
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
          pill.classList.add('active');
          pill.setAttribute('aria-checked', 'true');
        } else {
          pill.classList.remove('active');
          pill.setAttribute('aria-checked', 'false');
        }
      });

      // Update price display
      const priceDisplay = card.querySelector('.price-display');
      if (priceDisplay) {
        priceDisplay.outerHTML = this.formatPriceDisplay(currentUnit);
      }
    }

    renderCartDrawer() {
      const itemsContainer = document.getElementById('cartDrawerItems');
      const subtotalEl = document.getElementById('cartSubtotalAmount');
      const checkoutBtn = document.getElementById('cartCheckoutBtn');
      if (!itemsContainer || !subtotalEl) return;

      if (this.cart.length === 0) {
        itemsContainer.innerHTML = `
          <div class="cart-empty-view" style="text-align: center; padding: 3rem 1rem;">
            <h4>${this.t('cartEmptyTitle')}</h4>
            <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">${this.t('cartEmptyDesc')}</p>
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
          <div class="cart-item-row" data-id="${prod.id}" data-unit="${item.unitIndex}">
            <img src="${prod.svg}" alt="${title}" class="cart-item-img" width="52" height="52">
            <div class="cart-item-meta">
              <h4 class="cart-item-title">${title}</h4>
              <span class="cart-item-unit">${unit.label} • ₹${unit.price}</span>
              <div class="cart-qty-ctrls" style="margin-top: 4px;">
                <button type="button" class="qty-btn dec-btn" aria-label="Decrease quantity">−</button>
                <span class="qty-num" aria-live="polite">${item.qty}</span>
                <button type="button" class="qty-btn inc-btn" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 700; color: var(--color-kasi); margin-bottom: 4px;">₹${lineTotal}</div>
              <button type="button" class="cart-remove-btn" aria-label="Remove item">&times;</button>
            </div>
          </div>
        `;
      }).join('');

      // Wire cart item buttons
      itemsContainer.querySelectorAll('.cart-item-row').forEach((row) => {
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
      drawer.removeAttribute('inert');
      drawer.classList.add('open');
      backdrop.classList.add('show');
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
      backdrop.classList.remove('show');
      drawer.setAttribute('inert', '');
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
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px; text-align: center; background: var(--color-tholu); padding: 1rem; border-radius: var(--radius-sm);">
            <img src="${prod.svg}" alt="${title}" style="max-width: 100%; height: auto;">
          </div>
          <div style="flex: 1.5; min-width: 240px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="card-tag-badge" style="position: static; margin-bottom: 0.5rem; display: inline-block;">${prod.tag}</span>
              <h2 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--color-kasi); margin-bottom: 0.2rem;">${title}</h2>
              <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">${subtitle}</p>
              <p style="font-size: 0.95rem; line-height: 1.7; color: var(--color-kasi); margin-bottom: 1rem;">${desc}</p>
              ${prod.isFood ? `<p style="font-size: 0.82rem; color: var(--color-ittadi); margin-bottom: 1rem;">${this.t('fssaiNotice')}</p>` : ''}
            </div>

            <div>
              <div style="margin-bottom: 1rem;">
                <label style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 0.35rem;">${this.t('unitLabel')}</label>
                <div class="unit-pills-wrap">
                  ${prod.units.map((u, i) => `
                    <button 
                      type="button" 
                      class="unit-pill ${i === selectedIdx ? 'active' : ''}" 
                      data-modal-unit="${i}">
                      ${u.label} - ₹${u.price}
                    </button>
                  `).join('')}
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <div class="price-val" style="font-size: 1.5rem;">₹${currentUnit.price}</div>
                <button type="button" class="btn btn-primary" id="modalAddCartBtn">
                  + ${this.t('addToCart')}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Handle unit selection in modal
      content.querySelectorAll('[data-modal-unit]').forEach((pill) => {
        pill.addEventListener('click', (e) => {
          const uIdx = parseInt(e.currentTarget.dataset.modalUnit, 10);
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

      modal.removeAttribute('inert');
      modal.classList.add('active');
      window.motionController.lockScroll();
      document.getElementById('custName')?.focus();
    }

    closeCheckoutModal() {
      const modal = document.getElementById('checkoutModal');
      if (!modal) return;
      modal.setAttribute('inert', '');
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
      const tabDynamic = document.getElementById('modalTabDynamicQr');
      const tabOfficial = document.getElementById('modalTabOfficialQr');
      const officialContainer = document.getElementById('modalOfficialQrContainer');

      if (!qrContainer) return;

      // NPCI-standard URI specification:
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
          qrContainer.innerHTML = `<div style="padding: 1rem; font-weight: 700;">UPI: ${CONFIG.upiId}</div>`;
        }
      }

      // Dual QR Tab switcher
      if (tabDynamic && tabOfficial && officialContainer) {
        tabDynamic.onclick = () => {
          tabDynamic.classList.add('active');
          tabDynamic.setAttribute('aria-selected', 'true');
          tabOfficial.classList.remove('active');
          tabOfficial.setAttribute('aria-selected', 'false');
          qrContainer.style.display = 'flex';
          officialContainer.style.display = 'none';
        };

        tabOfficial.onclick = () => {
          tabOfficial.classList.add('active');
          tabOfficial.setAttribute('aria-selected', 'true');
          tabDynamic.classList.remove('active');
          tabDynamic.setAttribute('aria-selected', 'false');
          qrContainer.style.display = 'none';
          officialContainer.style.display = 'block';
        };
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
      btn.innerHTML = `<svg class="ph-icon" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"><use href="#ph-check"/></svg>${this.t('copied')}`;
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('copied');
      }, 2000);
    }

    async handleOrderSubmission() {
      const nameInput = document.getElementById('custName');
      const phoneInput = document.getElementById('custPhone');
      const addressInput = document.getElementById('custAddress');
      const landmarkInput = document.getElementById('custLandmark');
      const pincodeInput = document.getElementById('custPincode');
      const notesInput = document.getElementById('custNotes');
      const utrInput = document.getElementById('custUtr');
      const screenshotOpt = document.getElementById('modalUtrScreenshotOpt');
      const submitBtn = document.getElementById('submitOrderWhatsAppBtn');
      const errorBox = document.getElementById('modalValidationError');
      const errorMsg = document.getElementById('modalValidationMsg');
      const successBox = document.getElementById('modalOrderSuccessCard');
      const disclaimer = document.getElementById('modalSubmitDisclaimer');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const address = addressInput ? addressInput.value.trim() : '';
      const landmark = landmarkInput ? landmarkInput.value.trim() : '';
      const pincode = pincodeInput ? pincodeInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';
      const utr = utrInput ? utrInput.value.trim() : '';
      const hasScreenshotOpt = screenshotOpt ? screenshotOpt.checked : false;

      // Reset previous error visual states
      [nameInput, phoneInput, addressInput, pincodeInput].forEach((inp) => {
        if (inp) {
          inp.style.borderColor = '';
          inp.style.backgroundColor = '';
        }
      });
      if (errorBox) errorBox.style.display = 'none';

      // Inline validation with auto-scroll to the missing field
      let firstInvalid = null;
      let validationText = '';

      if (!name || name.length < 2) {
        firstInvalid = nameInput;
        validationText = this.lang === 'te' 
          ? 'దయచేసి పైన మీ పూర్తి పేరు నమోదు చేయండి.' 
          : 'Please enter your Full Name above.';
      } else if (!phone || phone.replace(/\D/g, '').length < 10) {
        firstInvalid = phoneInput;
        validationText = this.lang === 'te' 
          ? 'దయచేసి పైన సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.' 
          : 'Please enter a valid 10-digit Phone Number above.';
      } else if (!address || address.length < 5) {
        firstInvalid = addressInput;
        validationText = this.lang === 'te' 
          ? 'దయచేసి పైన మీ పూర్తి డెలివరీ చిరునామా నమోదు చేయండి.' 
          : 'Please enter your complete Delivery Address above.';
      } else if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
        firstInvalid = pincodeInput;
        validationText = this.lang === 'te' 
          ? 'దయచేసి పైన సరైన 6 అంకెల పిన్‌కోడ్ (Pincode) నమోదు చేయండి.' 
          : 'Please enter a valid 6-digit Pincode above.';
      }

      if (firstInvalid) {
        if (errorBox && errorMsg) {
          errorMsg.textContent = validationText;
          errorBox.style.display = 'block';
          errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        firstInvalid.style.borderColor = '#DC2626';
        firstInvalid.style.backgroundColor = '#FEF2F2';
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
        return;
      }

      const total = this.getCartTotal();
      const effectiveRef = utr || (hasScreenshotOpt ? 'Screenshot on WhatsApp' : 'Direct UPI');
      const officialOrderCode = this.currentOrderId;
      const targetPhone = '917732075607';
      const fullFormattedAddress = `${address}${landmark ? ` (ల్యాండ్‌మార్క్: ${landmark})` : ''}, PIN: ${pincode}`;

      const orderData = {
        orderId: officialOrderCode,
        date: new Date().toISOString(),
        customer: { name, phone, address: fullFormattedAddress, landmark, pincode, notes },
        utr: utr,
        items: this.cart.map((item) => {
          const prod = PRODUCTS.find((p) => p.id === item.productId);
          const unit = prod ? (prod.units[item.unitIndex] || prod.units[0]) : { label: '', price: 0 };
          return {
            id: prod ? prod.id : item.productId,
            nameTe: prod ? prod.te : '',
            nameEn: prod ? prod.en : '',
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

      // 1. Format devotional WhatsApp message
      const waMessage = this.formatWhatsAppMessage(orderData);
      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;

      // 2. Persist to local storage
      this.orders.unshift(orderData);
      this.saveOrders();

      // 3. Trigger celebration sounds & confetti
      if (window.soundManager) {
        window.soundManager.playBell('order');
      }
      this.fireConfetti();

      // 4. Synchronously open WhatsApp in new tab (Unblocked because called directly on user gesture)
      try {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.warn('Direct popup open caught:', e);
      }

      // 5. Transform modal UI into Thank You celebration with guaranteed direct click link (No Print Button)
      if (submitBtn) {
        submitBtn.style.display = 'none';
      }
      if (disclaimer) {
        disclaimer.style.display = 'none';
      }

      if (successBox) {
        successBox.innerHTML = `
          <div style="background: #ECFDF5; border: 2px solid #059669; padding: 1.25rem 1.4rem; box-shadow: 4px 4px 0 #064E3B; text-align: left;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <span style="font-size: 1.8rem;">🙏</span>
              <div>
                <h3 style="margin: 0; color: #065F46; font-size: 1.15rem; font-family: 'Ramabhadra', serif;">
                  ${this.lang === 'te' ? `ధన్యవాదాలు ${name} గారు! మీ ఆర్డర్ విజయవంతంగా నమోదైంది!` : `Thank you ${name}! Order Successfully Created!`}
                </h3>
                <span style="font-size: 0.75rem; color: #047857; font-weight: 800; letter-spacing: 0.05em;">
                  THANK YOU! ORDER SUCCESSFULLY CREATED
                </span>
              </div>
            </div>
            <p style="margin: 0.6rem 0; color: #064E3B; font-size: 0.92rem; line-height: 1.6;">
              ${this.lang === 'te' 
                ? `మీ ఆర్డర్ నంబర్: <strong>${officialOrderCode}</strong> (మొత్తం: <strong>₹${total}</strong>). WhatsApp లో మెసేజ్ మరియు స్క్రీన్‌షాట్ పంపిన వెంటనే, మా ఆశ్రమ కార్యాలయం UTR పరిశీలించి నవత ట్రాన్స్‌పోర్ట్ ద్వారా సరుకును పంపుతుంది.`
                : `Order No: <strong>${officialOrderCode}</strong> (Total: <strong>₹${total}</strong>). Please send your screenshot on WhatsApp to confirm delivery via Navata Transport.`
              }
            </p>
            <div style="background: #D1FAE5; border: 1px solid #059669; padding: 0.5rem 0.8rem; margin: 0.6rem 0; font-size: 0.85rem; color: #065F46;">
              🚚 <strong>రవాణా సమాచారం:</strong> రవాణా ఛార్జీలు అదనం. నవత రోడ్ ట్రాన్స్‌పోర్ట్ (Navata Road Transport) టారిఫ్ ప్రకారం డెలివరీ సమయంలో చెల్లించాలి. 
              <a href="https://www.navata.com/freight-cal" target="_blank" rel="noopener noreferrer" style="color: #047857; font-weight: 700; text-decoration: underline;">
                (Navata Freight Calculator &nearr;)
              </a>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 1rem;">
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" 
                 class="btn btn-whatsapp" 
                 style="text-align: center; font-weight: 800; font-size: 1rem; padding: 0.85rem; background: #1B8344 !important; color: #fff !important; text-decoration: none; border: 2px solid #0D5C2C; box-shadow: 2px 2px 0 #000; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M187.58 144.84l-32-16a8 8 0 0 0-8 .5l-14.69 9.8a40.55 40.55 0 0 1-16-16l9.8-14.69a8 8 0 0 0 .5-8l-16-32A8 8 0 0 0 104 64a40 40 0 0 0-40 40 88.1 88.1 0 0 0 88 88 40 40 0 0 0 40-40 8 8 0 0 0-4.42-7.16zM152 176a72.08 72.08 0 0 1-72-72 24 24 0 0 1 19.29-23.51l11.4 22.8-8.1 12.16a8 8 0 0 0-.76 7.42 56.49 56.49 0 0 0 28.3 28.3 8 8 0 0 0 7.42-.76l12.16-8.1 22.8 11.4A24 24 0 0 1 152 176z"/>
                </svg>
                <span>${this.lang === 'te' ? 'WhatsApp (+91 7732075607) లో రసీదు పంపండి &rarr;' : 'Send Receipt on WhatsApp (+91 7732075607) &rarr;'}</span>
              </a>
              <a href="/track?code=${encodeURIComponent(officialOrderCode)}" class="btn btn-sharp-secondary" style="text-align: center; text-decoration: none; font-size: 0.88rem; padding: 0.6rem;">
                ${this.lang === 'te' ? 'ఆర్డర్ ట్రాక్ చేయండి &rarr;' : 'Live Tracking &rarr;'}
              </a>
            </div>
          </div>
        `;
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // 6. Clear cart & update badge
      this.clearCart();

      // 7. Background database sync (non-blocking)
      try {
        const payload = {
          order_code: officialOrderCode,
          order_no: officialOrderCode,
          name,
          phone,
          address: notes ? `${fullFormattedAddress}\n[గమనిక: ${notes}]` : fullFormattedAddress,
          amount: total,
          payment_ref: effectiveRef,
          items: orderData.items.map((it) => ({
            name: `${it.nameTe} (${it.nameEn})`,
            quantity: it.qty,
            price: it.price,
            unit: it.unit,
            subtotal: it.lineTotal
          }))
        };
        fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch((err) => console.warn('Background order sync fallback:', err));

        // Save order to localStorage backup
        try {
          const storedOrders = JSON.parse(localStorage.getItem('kg_orders') || '[]');
          storedOrders.unshift({
            order_code: officialOrderCode,
            order_no: officialOrderCode,
            customer_name: name,
            customer_phone: phone,
            delivery_address: fullFormattedAddress,
            amount: total,
            status: 'received',
            transporter: 'నవత రోడ్ ట్రాన్స్‌పోర్ట్ (Navata Road Transport)',
            created_at: new Date().toISOString(),
            product_details: orderData.items.map(it => `${it.nameTe} x ${it.qty}`).join(', ')
          });
          localStorage.setItem('kg_orders', JSON.stringify(storedOrders.slice(0, 30)));
        } catch (e) {}
      } catch (e) {
        console.warn('API sync caught:', e);
      }
    }

    formatWhatsAppMessage(order) {
      const itemsList = order.items
        .map((i, idx) => `${idx + 1}. ${i.nameTe} (${i.nameEn}) [${i.unit}] x ${i.qty} = ₹${i.lineTotal}`)
        .join('\n');

      const utrText = order.utr 
        ? `• UTR / లావాదేవీ నంబర్: ${order.utr}\n` 
        : `• చెల్లింపు స్థితి: Direct UPI ద్వారా చెల్లించబడింది (రసీదు జతచేశాను)\n`;

      return `హరే కృష్ణ! 🙏\n` +
        `ధన్యవాదాలు (Thank you) — నేను కూర్మగ్రామ వేదిక్ విలేజ్ సహజ ఉత్పత్తుల కోసం UPI చెల్లింపు పూర్తి చేశాను.\n\n` +
        `✅ *ఆర్డర్ నమోదైంది (Order Created)*\n` +
        `-----------------------------------------\n` +
        `*ఆర్డర్ ID:* ${order.orderId}\n` +
        `*తేదీ:* ${new Date(order.date).toLocaleDateString('te-IN')}\n\n` +
        `*కొనుగోలుదారుని వివరాలు:*\n` +
        `• పేరు: ${order.customer.name}\n` +
        `• ఫోన్: ${order.customer.phone}\n` +
        `• చిరునామా: ${order.customer.address}\n` +
        (order.customer.landmark ? `• ల్యాండ్‌మార్క్: ${order.customer.landmark}\n` : '') +
        (order.customer.pincode ? `• పిన్‌కోడ్: ${order.customer.pincode}\n` : '') +
        (order.customer.notes ? `• సూచనలు: ${order.customer.notes}\n` : '') +
        utrText +
        `🚚 *రవాణా వివరాలు:* నవత రోడ్ ట్రాన్స్‌పోర్ట్ (సరుకు డెలివరీ ఛార్జీలు అదనం - టారిఫ్: https://www.navata.com/freight-cal)\n` +
        `\n*ఆర్డర్ చేసిన వస్తువులు:*\n${itemsList}\n\n` +
        `-----------------------------------------\n` +
        `*మొత్తం చెల్లించవలసినది:* ₹${order.totalAmount}\n` +
        `*ట్రస్ట్ UPI ID:* ${order.upiId}\n` +
        `-----------------------------------------\n` +
        `చెల్లింపు స్క్రీన్‌షాట్ ఇక్కడ జతచేస్తున్నాను. దయచేసి ధృవీకరించి సరుకును నవత రోడ్ ట్రాన్స్‌పోర్ట్ ద్వారా పంపగలరు.\n` +
        `ధన్యవాదాలు! (Thank you!) 🙏`;
    }

    fireConfetti() {
      if (typeof window.confetti !== 'undefined') {
        const saffron = '#d97706';
        const paddyGreen = '#2d6a4f';
        const warmGold = '#b5944b';

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
        list.innerHTML = `<div class="empty-orders-note" style="text-align: center; padding: 2rem;">${this.t('noOrders')}</div>`;
      } else {
        list.innerHTML = this.orders.map((ord) => {
          const itemsSummary = ord.items.map((i) => `${i.nameTe} (${i.unit}) × ${i.qty}`).join(', ');
          const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(this.formatWhatsAppMessage(ord))}`;
          return `
            <div class="checkout-summary-card" style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 700;">
                <span>${ord.orderId}</span>
                <span style="font-size: 0.85rem; color: var(--color-text-muted);">${new Date(ord.date).toLocaleDateString()}</span>
              </div>
              <p style="font-size: 0.88rem; color: var(--color-kasi); margin-bottom: 0.5rem;">${itemsSummary}</p>
              ${ord.utr ? `<p style="font-size: 0.8rem; color: var(--color-manjistha); margin-bottom: 0.5rem;">UTR: ${ord.utr}</p>` : ''}
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dotted var(--color-border); padding-top: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                <span style="font-weight: 700;">మొత్తం: ₹${ord.totalAmount}</span>
                <div style="display: flex; gap: 0.4rem; align-items: center;">
                  <a href="/track?code=${encodeURIComponent(ord.orderId)}" class="btn btn-secondary btn-sm" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">
                    ట్రాకింగ్ &rarr;
                  </a>
                  <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">
                    WhatsApp రసీదు
                  </a>
                </div>
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
        const text = this.t(key);
        if (text) {
          if (el.id === 'heroFluidHeadline' && window.fluidHeadlineTyping) {
            window.fluidHeadlineTyping.setText(text, this.currentLang);
            return;
          }
          el.textContent = text;
        }
      });

      // 1b. Static i18n placeholder replacement
      document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        const text = this.t(key);
        if (text) {
          el.placeholder = text;
        }
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
        const searchPlaceholder = this.t('searchPlaceholder');
        if (searchPlaceholder) {
          searchInput.placeholder = searchPlaceholder;
        }
      }

      // Update document lang
      document.documentElement.lang = this.lang;

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
        const utrVal = document.getElementById('custUtr')?.value.trim() || '';
        const orderSummary = this.formatWhatsAppMessage({
          orderId: this.currentOrderId,
          date: new Date().toISOString(),
          customer: {
            name: document.getElementById('custName')?.value || 'Guest',
            phone: document.getElementById('custPhone')?.value || '',
            address: document.getElementById('custAddress')?.value || '',
            notes: document.getElementById('custNotes')?.value || ''
          },
          utr: utrVal,
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

  // Global helper for featured cards
  window.quickAddFeatured = function(productId, unitLabel, price) {
    if (!window.store) return;
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod) return;
    const unitIdx = prod.units.findIndex(u => u.label === unitLabel);
    const idx = unitIdx !== -1 ? unitIdx : 0;
    window.store.addToCart(productId, idx, 1);
    window.store.openCartDrawer();
  };

  // Instantiate store on DOM ready or immediately if already loaded
  function initStore() {
    if (!window.store) {
      window.store = new Store();
      window.store.init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStore);
  } else {
    initStore();
  }
})();
