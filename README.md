# Kurmagram Vedic Village (కూర్మగ్రామ వేదిక్ విలేజ్) — Natural Living Store

> **"సరళ జీవనం – ఉన్నత ఆశయం"** (Simple Living – High Thinking)  
> 100% Free Forever • Zero Runtime Backend • Direct-UPI (0% fee) • Bilingual Telugu-First • Zero CDN Calls

---

## 🌾 Overview
This storefront represents a portfolio-grade, static e-commerce website engineered for **Kurmagram Vedic Village**, a 60-acre natural farming community and Goshala in Srikakulam District, Andhra Pradesh (est. 2018 under Nanda Gokulam Goshala Trust).

### Highlights
- **100% Free Forever Hosting:** Static HTML5 / CSS3 / Vanilla JS. Runs on GitHub Pages, Netlify, Vercel, or any web server without database fees, serverless runtime limits, or paid API costs.
- **Direct-UPI Payment (0% Fees):** Client-side QR generation using `qrcode-generator` (Level M) + NPCI-compliant deep-link (`upi://pay`).
- **Telugu-First Bilingual:** Full Telugu by default with dynamic one-click English toggle (`STRINGS` dictionary).
- **Zero Runtime CDN Calls:** All fonts (`Noto Sans Telugu`, `Poppins`) and libraries (`GSAP`, `Lenis`, `Fuse.js`, `canvas-confetti`, `qrcode-generator`) are vendored locally in `/vendor`.
- **Sound & Delight:** WebAudio-synthesized temple-bell chime on add-to-cart and order handoff (no audio files, 🔔/🔕 toggle in header), plus saffron/gold confetti.
- **Single Source of Truth:** Store owners only need to edit `js/config.js` to change UPI IDs, WhatsApp numbers, prices, or catalog items.

---

## 📁 Project Structure

```
order tracking/
├── index.html            # Semantic master page
├── manifest.json         # PWA Manifest
├── sitemap.xml           # Search Engine Sitemap
├── robots.txt            # Search Engine Directives
├── sw.js                 # Service worker for offline shell
├── README.md             # Store owner & engineering manual
├── css/
│   └── styles.css        # Master stylesheet (farm palette, fluid clamp typography)
├── js/
│   ├── config.js         # ⭐ ONLY file store owner needs to edit!
│   ├── motion.js         # WebAudio bell chimes, Lenis & GSAP ScrollTrigger
│   ├── app.js            # Bilingual i18n, Fuse search, Cart drawer, UPI & WhatsApp
│   └── sw-register.js    # Service worker registration & offline notice
├── vendor/
│   ├── LICENSES.md       # Full open-source license attribution
│   ├── qrcode.min.js     # QR code generator (MIT)
│   ├── gsap.min.js       # GSAP Animation Platform (Standard License)
│   ├── ScrollTrigger.min.js
│   ├── lenis.min.js      # Lenis smooth scrolling (MIT)
│   ├── fuse.min.js       # Fuse.js bilingual fuzzy search (Apache-2.0)
│   ├── confetti.min.js   # Canvas confetti (MIT)
│   └── fonts/            # Noto Sans Telugu & Poppins woff2 font files
├── assets/
│   └── svg/
│       ├── logo.svg           # Sacred Kurma (Tortoise) emblem
│       ├── hero-landscape.svg # Layered parallax farm landscape
│       └── products/          # 8 Bespoke craft SVGs
└── tests/
    ├── e2e.spec.js       # Playwright E2E acceptance suite (T1 - T14)
    └── playwright.config.js
```

---

## 🛠️ Store Owner Guide: How to Update `js/config.js`

To update prices, UPI IDs, or phone numbers, open `js/config.js`:

```javascript
const CONFIG = {
  upiId: "kurmagramvv@upi",        // Replace with your Trust UPI ID (e.g. 9876543210@sbi)
  payeeName: "Kurmagram Vedic Village",
  whatsapp: "917732075607",        // Your WhatsApp number (with 91 country code, no +)
  phone2: "918712011776",
  email: "Kurmagramvv@gmail.com",
  fssai: "FSSAI Lic. No: XXXXXXXXXXXXXX"
};
```

---

## 🚀 Deployment Instructions (100% Free Forever)

### Option 1: GitHub Pages (Recommended)
1. Push this repository to GitHub.
2. In your repo on GitHub, go to **Settings > Pages**.
3. Under **Build and deployment > Branch**, select `main` and root `/`.
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo>/` in under 60 seconds with unlimited free bandwidth.

### Option 2: Vercel (Pure Static - 0 Build Credits)
1. Import the repository in [Vercel](https://vercel.com).
2. Framework Preset: **Other**.
3. Build Command: Leave blank / None.
4. Output Directory: Leave blank (`.` root).
5. Click **Deploy**. Since there are no serverless functions, it consumes 0 operational credits!

### Option 3: Localhost Testing
Run any static file server:
```bash
npx serve . -p 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running the E2E Acceptance Test Suite

The project includes an automated test suite verifying all 14 criteria:

```bash
npx playwright test
```

---

## 📈 Long-Term Upgrade Paths (When scaling up)
- **Headless E-commerce:** `medusajs/medusa` + `medusajs/nextjs-starter-medusa`
- **All-in-one PHP:** `bagisto/bagisto` + `bagisto/nextjs-commerce`
- **WordPress/WooCommerce:** `woocommerce/woocommerce` + `razorpay/razorpay-woocommerce`
