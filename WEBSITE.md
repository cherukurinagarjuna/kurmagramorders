# KURMAGRAM VEDIC VILLAGE (కూర్మగ్రామ వేదిక్ విలేజ్)
## Complete Website Architecture, Technical Specifications & Agent Handover Guide

> **Official Storefront & Order Management System**  
> **Repository:** `order tracking` / `kurmagram-vedic-village`  
> **Default Language:** Telugu (`te`) with one-click English (`en`) switch  
> **Production Target:** Cloudflare Pages / GitHub Pages (100% Free Static Tier)  
> **Deployment Architecture:** Static Site Generation (Astro SSG) + Serverless Edge APIs  
> **Visual Theme:** Orgaxi Organic Farmhand Editorial Theme  

---

## 1. Executive Summary & Brand Identity

**Kurmagram Vedic Village (కూర్మగ్రామ వేదిక్ విలేజ్)** is an authentic, cow-centered spiritual eco-community situated near Anthakapalli Village, Kittalapadu Post (via Shrimukhalingam), Srikakulam District, Andhra Pradesh (PIN: 532428). 

Under the aegis of the **Sri Nanda Gokulam Goshala Trust**, the community practices:
1. **Ahimsa Desi Cow Protection (గోసంరక్షణ):** Care of indigenous Gir, Kankrej, Punganur, and Ongole cattle without commercial exploitation.
2. **Zero-Chemical Natural Farming (రసాయన రహిత సేద్యం):** Cultivation of traditional paddy varieties across 60 acres using only indigenous cow dung and urine based bio-inputs (జీవామృతం, ఘనజీవామృతం).
3. **Traditional Wooden Ghani Extraction (చెక్క గానుగ):** Cold extraction of unrefined virgin edible oils with zero friction heat and zero chemical solvents.
4. **Sacred Gurukulam Life & Community Handloom:** 80+ residential devotees and students producing natural bath powders, Ayurvedic formulations, and khadi handloom textiles.

### Motto & Tagline
- **Telugu:** `"సరళ జీవనం – ఉన్నత ఆశయం"`
- **English:** `"Simple Living – High Thinking"`

### Contact & Trust Information
- **Trust Entity:** Sri Nanda Gokulam Goshala & Vedic Village Trust
- **Official UPI ID:** `kurmagramvv@upi`
- **Payee Name:** Kurmagram Vedic Village
- **Official WhatsApp / Support:** `+91 7732075607`
- **Secondary Phone:** `+91 8712011776` / `+91 8074724717`
- **Email:** `kurmagramvv@gmail.com`
- **Location:** Anthakapalli Village, Kittalapadu Post (Via Shrimukhalingam), Gara Mandal, Srikakulam District, Andhra Pradesh – 532428, India.
- **Official Web Portals:** [kurmagram.com](https://kurmagram.com) | [YouTube](https://www.youtube.com/c/Kurmagrama) | [Facebook](https://www.facebook.com/Kurmagram/)
- **FSSAI Status:** FSSAI Registration under process (FSS Act 2006, Sec 31/1).

---

## 2. Hard Engineering Constraints (Non-Negotiable)

All collaborating AI agents and human developers must adhere strictly to these rules:

| Constraint | Requirement | Rationale |
| :--- | :--- | :--- |
| **100% Free Hosting** | Pure Astro SSG output deployed to Cloudflare Pages / GitHub Pages. | Zero operational hosting overhead for the non-profit trust. |
| **Zero Gateway Fees** | 0% transaction fee peer-to-peer UPI deep-linking (`upi://pay`), client-side dynamic QR generation, 12-digit UTR reference capture, and WhatsApp verification. | Eliminates gateway commissions (Razorpay/Stripe/Cashfree) and merchant overhead. |
| **Zero Runtime CDNs** | All JS libraries (`qrcode`, `gsap`, `ScrollTrigger`, `lenis`, `fuse`, `canvas-confetti`) and fonts are vendored locally in `/vendor`. | Absolute offline reliability, privacy, and zero external network bottlenecks. |
| **Telugu-First Standard** | Telugu (`te`) is default; line-height $\ge 1.75$; no letter-spacing on Telugu; font GSUB/GPOS tables preserved for complex conjuncts (క్ష, జ్ఞ, త్ర, శ్ర). | Rooted cultural authenticity for local patrons in Andhra Pradesh and Telangana. |
| **Anti-Slop Visuals** | Real photography from farm gallery only; custom inline Kalamkari SVGs; **ZERO emoji UI icons**, ZERO generic stock, ZERO unDraw/clip-art, ZERO SaaS purple gradients. | Respects the sacred, traditional rural aesthetic. |

---

## 3. Orgaxi Design System & Visual Grammar

The website implements an organic farm design system inspired by TheMazine Orgaxi theme, tailored to rural Andhra heritage:

### Color Palette (Tokens)
- **Deep Farm Forest:** `#1B431D` (Navbar, Topbar, primary brand accents)
- **Vibrant Leaf Green:** `#276329` / `#229E28` (Primary buttons, active tabs, pill highlights)
- **Harvest Gold / Brass:** `#E08200` / `#B5944B` (Subtitles, numeral highlights, badges)
- **Organic Cream Background:** `#FEFAF5` (Page body canvas)
- **Crisp Card White:** `#FFFFFF` with 1-2px border `#E5E7EB` or `#E2E8F0`
- **Iron Black Typography:** `#1F2937` (High readability, WCAG AA compliant)
- **Kalamkari Dye Accents:** Madder Red (`#7B1113`), Turmeric (`#D97706`), Indigo (`#1E3A8A`)

### Typography Stack
- **Latin Headings:** `Outfit`, sans-serif (weights 600, 700, 800)
- **Latin Body:** `DM Sans`, sans-serif (weights 400, 500, 700)
- **Telugu Headings & Numbers:** `Ramabhadra`, `Noto Serif Telugu`
- **Telugu Body Text:** `Noto Sans Telugu`, `Mandali`
- **Local Fallback:** Pre-compiled `.woff2` files in `/vendor/fonts/`

### Card & UI Components
- **Border Radii:** `16px` (`rounded-2xl`) on product and story cards; `9999px` (`rounded-full`) on buttons and category pills.
- **Elevation:** Soft ambient drop shadows (`0 8px 30px rgba(0,0,0,0.06)`).
- **Header:** Sticky white navbar with active green underline, deep green announcement topbar, audio toggle bell, and pill cart launcher with counter badge.
- **Hero:** Asymmetric layout with radial gradient backdrop, leaf kicker badge (`100% సహజం & గో ఆధారితం`), bold Telugu display heading, dual CTA pills, and gold-bordered goshala cow imagery with traditional trust seal.
- **Offer Strip:** 4 prominent feature pillars:
  1. *100% సహజ సేద్యం (Natural Farming)*
  2. *నంద గోకులం గోశాల (Desi Cow Goshala)*
  3. *చెక్క గానుగ నూనెలు (Cold-Pressed Oils)*
  4. *నవత ట్రాన్స్‌పోర్ట్ డెలివరీ (Navata Road Transport Delivery)*

---

## 4. Product Catalog (Single Source of Truth)

All product definitions reside in `src/config.ts` (Astro build-time) and `js/config.js` (client-side runtime).

| ID | Category | Telugu Name | English Name | Unit Variants & Pricing | Food Compliance / Batch |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sunni` | `care` | **సున్నిపిండి** | Sunni Pindi (Herbal Bath Powder) | • 250g: ₹120<br>• 500g: ₹220 | Handcrafted herbal bath powder. |
| `anjan` | `cow` | **గో అంజన్ భాం** | Go Anjan Bham (Cow-Ghee Kajal) | • 10g: ₹150 | Desi cow ghee soot & camphor. |
| `verm` | `farm` | **వార్మ్ ఆర్క్** | Verm Ark (Vermiwash Plant Tonic) | • 500ml: ₹90<br>• 1L: ₹160 | Bio-tonic from vermicomposting. |
| `goark` | `cow` | **గో ఆర్క్** | Go Ark (Sacred Cow Distillate) | • 500ml: ₹140<br>• 1L: ₹250 | Copper retort distillation. |
| `pain` | `care` | **పెయిన్ ఆయిల్** | Herbal Pain Relief Oil | • 100ml: ₹180<br>• 200ml: ₹320 | Ayurvedic medicated joint oil. |
| `rice` | `grain` | **బ్రౌన్ రైస్** | Brown Rice (Natural Farming) | • 1kg: ₹130<br>• 25kg: ₹3,000 (M.R.P: ₹3,250, Save ₹250) | Batch: `KG-2026-BR108`<br>Best Before: 6 Months<br>Neem leaf storage. |
| `sesame` | `oils` | **నువ్వుల నూనె (గానుగ)** | Cold-Pressed Sesame Oil | • 500ml: ₹220<br>• 1L: ₹420 | Batch: `KG-2026-SO204`<br>Best Before: 9 Months<br>Zero friction heat. |
| `groundnut` | `oils` | **పల్లి నూనె (గానుగ)** | Cold-Pressed Groundnut Oil | • 500ml: ₹160<br>• 1L: ₹300 | Batch: `KG-2026-GO305`<br>Best Before: 9 Months<br>Sun-dried peanuts. |

---

## 5. End-to-End User Journeys & Business Logic

### Flow A: Customer Ordering & Checkout
1. **Browse & Select:** User filters products by category swatches or searches via fuzzy search (`Fuse.js`).
2. **Select Unit:** User chooses specific variant (e.g. `25kg` or `1L`) via pill chips; price updates dynamically.
3. **Cart Management:** Line items saved in `localStorage['kg_cart']`.
4. **Checkout Modal / Page (`/checkout`):**
   - Customer details collected: Full Name, WhatsApp Mobile Number, Delivery Address, Landmark, Town, District, 6-digit Pincode.
   - Shipping Notice clearly displayed: Navata Transport booking charges are payable at the destination counter (To-Pay).
5. **Direct UPI Payment Screen:**
   - **Tab 1 (Dynamic QR):** Generates client-side QR encoding `upi://pay?pa=kurmagramvv@upi&pn=Kurmagram%20Vedic%20Village&am=AMOUNT&cu=INR`.
   - **Tab 2 (Official Trust QR):** Displays trust QR image (`Donation QR code.jpeg`).
   - Mobile deep-link button opens installed UPI app (GPay / PhonePe / Paytm / BHIM) directly.
6. **Payment Proof & Order Finalization:**
   - Customer inputs 12-digit UTR reference number or selects WhatsApp screenshot option.
   - Order POSTed to `/api/create-order` returning Order Code (e.g., `KG-20261123-0003`).
   - Customer redirected to WhatsApp with pre-composed order details message sent to `+91 7732075607`.

### Flow B: Order Tracking (`/track`)
- Customer enters Order Code (`KG-2026...`) or registered Mobile Number.
- Calls `/api/track-order`.
- Displays real-time status timeline:
  1. **అందింది (Received):** Order placed, awaiting payment confirmation.
  2. **ప్యాకింగ్ (Processing):** Packed by ashram devotees with sacred care.
  3. **రవాణాలో ఉంది (Shipped):** Handed over to Navata Road Transport; displays Lorry Receipt (LR) number.
  4. **చేరింది (Delivered):** Arrived at customer destination station.

---

## 6. Logistics, Dispatch Slip & Admin Console

### 1. Single-Page Printable Dispatch Slip (`/slip`)
Customized specifically for **Navata Road Transport** parcel counters and the Ashram packing department.
- **Strict 1-Page Layout:** Guaranteed single-page print without trailing page spill via:
  ```css
  @page { size: A4 portrait; margin: 6mm; }
  @media print {
    body, html { height: 99%; overflow: hidden !important; }
    .no-print { display: none !important; }
    .dispatch-slip-card { border: 2px solid #000; padding: 6mm; }
  }
  ```
- **Consignor Box:** Kurmagram Vedic Village Goshala, Kittalapadu, Srikakulam.
- **Consignee Box:** Recipient Name, Mobile Number (prominent bold box), Address, Pincode.
- **Commodities Table:** Numbered list of items, unit descriptions, quantities, and paid amounts.
- **Navata Transport Ledger:** LR number, Destination Branch, Number of bags/parcels, Freight Booking Type (`[X] TO-PAY`).
- **Signature Row:** Packing In-charge, Transport Handover Date/Time, Navata Booking Stamp.
- **URL Parameters:** `/slip?id=<ID>&code=<CODE>&key=<ADMIN_TOKEN>&autoprint=1`

### 2. Admin Order Management Portal (`/admin`)
- **Authentication:** Password protected via `/api/admin-login` (stored in session/cookie `kg_admin_token`).
- **Real-time Metrics:** Counts for Total, Received, Processing, and Shipped orders.
- **Status Change & Direct WhatsApp Notification:**
  - Status dropdown (`అందింది`, `ప్యాకింగ్`, `రవాణా`, `చేరింది`, `రద్దయింది`).
  - Selecting a new status immediately updates the database via `/api/update-status` and prompts/opens the pre-formatted WhatsApp message directly.
- **Simplified Actions:**
  - **Action 1:** `ప్రింట్ స్లిప్ (Print Slip)` &rarr; opens printable A4 slip in a new tab.
  - **Action 2:** `WhatsApp సందేశం (Send WhatsApp)` &rarr; opens direct WhatsApp chat with the customer pre-filled with the latest status.

---

## 7. Complete Sitemap & Route Directory

| Route | Source Template | Description & Key Features |
| :--- | :--- | :--- |
| `/` | `src/pages/index.astro` | **Homepage:** Hero, 4-pillar Offer Strip, Featured Harvest, 4-Milestone Magazine Story Chronicle with authentic farm photos, 3-Step Ordering Guide with Kalamkari motifs, Newsletter, Footer. |
| `/shop` | `src/pages/shop.astro` | **Store Catalog:** Category filter chips, instant search, dynamic unit selectors, live stock badges, Add-to-Cart interactions. |
| `/product/[id]` | `src/pages/product/[id].astro` | **Product Detail:** Full-bleed image preview, compliance metadata, storage notes, unit switchers, direct checkout link. |
| `/about` | `src/pages/about.astro` | **About the Ashram:** Rural community history, cow protection philosophy, Gurukulam, Sanyasa Kutiram, 6-photo verified farm gallery with matched Telugu captions. |
| `/how-to-order` | `src/pages/how-to-order.astro` | **Ordering Guide:** 3-step visual workflow, direct UPI transfer tutorial, Navata transport FAQ. |
| `/cart` | `src/pages/cart.astro` | **Dedicated Cart:** Line-item breakdown, quantity increment/decrement, free freight calculator threshold, checkout launcher. |
| `/checkout` | `src/pages/checkout.astro` | **Order Checkout:** Shipping address form, dynamic NPCI QR generation, UTR capture, WhatsApp order dispatch. |
| `/track` | `src/pages/track.astro` | **Live Order Tracker:** Real-time lookup by Order ID or phone, live status milestone progress bar. |
| `/slip` | `src/pages/slip.astro` | **Printable Lorry Receipt:** Official 1-page A4 dispatch slip for Navata Road Transport counter and packing records. |
| `/admin` | `src/pages/admin.astro` | **Admin Dashboard:** Secure ledger, status management, single-click WhatsApp updates, dispatch slip printing. |
| `/policies` | `src/pages/policies.astro` | **Statutory Disclosures:** FSSAI compliance notice, terms of service, shipping policy, privacy policy. |

---

## 8. Verified Media & Farm Photography Mapping

All media is stored locally in `public/assets/images/farm/` and converted to optimized WebP formats. Captions are verified and historically accurate:

| File Name | Resolution | Context / Depiction | Telugu Caption |
| :--- | :--- | :--- | :--- |
| `paddy-fields-800w.webp` | 800w | Organic paddy fields & Eastern Ghats | ౬౦ ఎకరాల రసాయన రహిత నల్లరేగడి వరి చేలు |
| `goshala-cows-800w.webp` | 800w | Ahimsa desi cow & calf grazing | నంద గోకులం గోశాలలో పచ్చిక మేస్తున్న దేశవాళీ గోమాత |
| `sanyasa-kutiram.jpg` | 800w | Sacred clay & tile ascetic hermitage | సన్యాస కుటీరం: సాంప్రదాయ మట్టి మరియు పెంకులతో నిర్మించిన కుటీరం |
| `paddy-planting.png` | 800w | Devotees planting paddy seedlings | వరి నాట్లు వేస్తున్న భక్తులు: 60 ఎకరాల ప్రకృతి క్షేత్రంలో సంప్రదాయ వరి నాట్లు |
| `handloom-weaving.jpg` | 800w | Devotee weaving khadi on traditional loom | సంప్రదాయ చేనేత మగ్గంపై ఖాదీ వస్త్రాలు నేస్తున్న సాధకుడు |
| `rural-life-calf.jpg` | 800w | Devotee walking on ashram dirt road with calf | ఆశ్రమ బాటలో గోవు దూడతో సాధకుడు • ప్రశాంత గ్రామీణ జీవనం |
| `gurukulam-service.jpg` | 800w | Evening prasadam distribution with village children | గ్రామస్తులు మరియు పిల్లలతో ఆధ్యాత్మిక సేవ • ప్రసాద పంపిణీ |
| `natural-farming-800w.webp` | 800w | Cold-pressed wooden ghani extraction | సంప్రదాయ చెక్క గానుగ — సున్నా వేడి, సహజ పోషకాల రక్షణ |
| `gurukulam-life-800w.webp` | 800w | Gurukulam students studying Vedic texts | వైదిక గురుకులం — నిస్వార్థ భక్తి భావనతో సేవా జీవనం |

---

## 9. Backend APIs & Database Schema

The codebase supports **Cloudflare Pages Functions** (`functions/api/`), Node/Vercel serverless (`api/`), and Netlify Functions (`netlify/functions/`) using standard Web APIs and database abstraction.

### Active Endpoints (Cloudflare Pages Functions & Node)
- `POST /api/create-order` — Creates a new order, calculates totals, persists to Cloudflare D1 / PostgreSQL, returns unique order code & pre-filled WhatsApp handoff link.
- `GET /api/track-order?code=...&phone=...` — Public endpoint to track order status and Navata Lorry Receipt (LR) number.
- `POST /api/admin-login` — Verifies admin password (`ADMIN_PASSWORD` env variable) and sets signed secure session cookie.
- `GET /api/list-orders` — Returns paginated orders list (authenticated).
- `GET /api/get-order?id=...&code=...` — Fetches full order details including items array for Navata slip printing.
- `POST /api/update-status` — Updates order status (`received`, `processing`, `shipped`, `delivered`, `cancelled`) and generates WhatsApp link.
- `POST /api/mark-shipped` — Assigns Navata LR number and marks order as shipped.
- `GET /api/get-products` — Returns JSON catalog.

### Cloudflare D1 Database Schema (`d1-schema.sql`)
```sql
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT NOT NULL UNIQUE,
  order_code TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  product_details TEXT,
  amount REAL NOT NULL,
  total_amount REAL,
  items TEXT DEFAULT '[]',
  payment_ref TEXT,
  payment_status TEXT DEFAULT 'pending_verification',
  status TEXT NOT NULL DEFAULT 'received',
  lr_number TEXT,
  transporter TEXT DEFAULT 'Navata Road Transport',
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
```

### PostgreSQL Schema (`schema.sql` / `supabase_schema.sql`)
```sql
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_no VARCHAR(32) UNIQUE NOT NULL,
  order_code VARCHAR(32) UNIQUE,
  customer_name VARCHAR(128) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT NOT NULL,
  pincode VARCHAR(10),
  district VARCHAR(64),
  state VARCHAR(64) DEFAULT 'Andhra Pradesh',
  amount NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(32) DEFAULT 'UPI',
  payment_ref VARCHAR(64),
  status VARCHAR(32) DEFAULT 'received',
  transporter VARCHAR(64) DEFAULT 'Navata Road Transport',
  lr_number VARCHAR(64),
  product_details TEXT,
  items JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 10. Repository Directory Structure

```
order tracking/
├── .agents/skills/            # Installed developer skills & automation tools
├── api/                       # Vercel / Node serverless API endpoints
│   ├── lib/
│   │   ├── adapter.js         # Netlify-to-Vercel event payload adapter
│   │   ├── db.js              # PostgreSQL client connection pool
│   │   └── helpers.js         # Auth & validation helpers
│   ├── admin-login.js
│   ├── create-order.js
│   ├── get-order.js
│   ├── get-products.js
│   ├── list-orders.js
│   ├── mark-shipped.js
│   ├── track-order.js
│   └── update-status.js
├── functions/                 # Cloudflare Pages Functions (Native Edge APIs)
│   ├── _middleware.js         # Cloudflare CORS & security headers
│   └── api/
│       ├── _helpers.js        # Web Crypto signing, phone & validation helpers
│       ├── admin-login.js     # Admin auth & signed session cookie
│       ├── create-order.js    # Order persistence (D1/PG) & WhatsApp link
│       ├── get-order.js       # Single order lookup for dispatch slips
│       ├── get-products.js    # Catalog items list
│       ├── list-orders.js     # Paginated admin orders list
│       ├── mark-shipped.js    # Navata LR recording & WhatsApp notice
│       ├── track-order.js     # Public tracking timeline endpoint
│       └── update-status.js   # Order status transition & customer message
├── assets/
│   ├── images/                # Farm photographs, logos, favicon bundle
│   └── svg/
│       ├── kalamkari/         # Kurma mark, vines, ghani, kolam vectors
│       └── products/          # 8 bespoke 2px stroke product illustrations
├── js/
│   ├── app.js                 # Cart state, modals, checkout, fuzzy search
│   ├── config.js              # Client-side single source of truth config
│   └── motion.js              # GSAP animations, Lenis smooth scrolling
├── netlify/functions/         # Netlify serverless source handlers
├── public/                    # Static assets copied verbatim to build output
├── scripts/
│   ├── serve-root.js          # Local multi-functional static + API dev server
│   └── verify_*.js            # Automated verification & testing scripts
├── src/
│   ├── components/
│   │   ├── Catalog.astro      # 4-column e-commerce grid with unit pills
│   │   ├── FeaturedHarvest.astro
│   │   ├── Footer.astro       # Kolam grid, contact info, FSSAI notice
│   │   ├── Header.astro       # Announcement bar, brand logo, navigation
│   │   ├── Hero.astro         # Radial hero, kicker, CTA pills, cow photo
│   │   ├── OfferStrip.astro   # 4 Orgaxi feature pillars
│   │   ├── Steps.astro        # 3-step ordering process with Kalamkari art
│   │   └── Story.astro        # 4-milestone alternating farm chronicle
│   ├── layouts/
│   │   └── Base.astro         # HTML5 shell, SEO meta, font links, analytics
│   ├── pages/                 # Astro routes (index, shop, about, slip, admin...)
│   ├── styles/
│   │   ├── orgaxi-theme.css   # Orgaxi organic theme styling rules
│   │   └── styles.css         # Baseline global styles
│   └── config.ts              # Astro build-time configuration & catalog
├── vendor/                    # 100% locally vendored runtime libraries & fonts
├── AGENTS.md                  # Strict engineering guidelines & Anti-Slop blacklist
├── DESIGN.md                  # Canonical design system tokens & specifications
├── Donation QR code.jpeg      # Official Goshala Trust bank QR code
├── package.json               # Node dependencies & build scripts
├── playwright.config.js       # Playwright E2E configuration
└── WEBSITE.md                 # This file: Comprehensive master website guide
```

---

## 11. Maintenance & Developer Runbook

### 1. Running the Local Development Environment
The custom Node server runs on port 3000, serving the static build and proxying API calls:
```powershell
# Run the local server
node scripts/serve-root.js
# Access in browser: http://localhost:3000
```

### 2. Building the Static Site
Because Windows PowerShell restricts `npx`, invoke Astro build via node directly:
```powershell
node ./node_modules/astro/bin/astro.mjs build
```
The compiled output is emitted to `/dist`.

### 3. Updating Product Prices or Contact Details
1. Update `src/config.ts` (affects Astro SSG pages).
2. Update `js/config.js` (affects client-side cart & checkout calculations).
3. Run `node ./node_modules/astro/bin/astro.mjs build` to regenerate the static bundle.

### 4. Running Quality & Anti-Slop Audits
```powershell
# Run Playwright E2E test suite
npx playwright test tests/e2e.spec.js

# Run Accessibility and Lighthouse quality gates
npx playwright test tests/quality-gate.spec.js
```

---

*Document compiled and maintained for Kurmagram Vedic Village. All rights reserved by Sri Nanda Gokulam Goshala Trust.*
