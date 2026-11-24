# Kurmagram Vedic Village — Phase 3 (Structure & Build: Early v0 Shell Walkthrough)

**Project:** Kurmagram Vedic Village (కూర్మగ్రామ వేదిక్ విలేజ్) — Premium Store Rebuild  
**Phase:** 3 — Structure & Build (Early v0 Shell)  
**Status:** **Completed & Verified (28/28 Playwright Acceptance Tests Passed)**  
**Gate:** Awaiting User Approval to proceed to Phase 4 (UI Audit)

---

## 1. Executive Summary

In accordance with [`PROJECT_BRIEF.md`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/PROJECT_BRIEF.md), [`AGENTS.md`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/AGENTS.md), and [`DESIGN.md`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/DESIGN.md), the **Phase 3 Early v0 Shell** has been constructed, styled, and verified. 

The site transforms the store into a handcrafted, editorial Andhra farm brand rooted in **Srikakulam Pen-Kalamkari art** and authentic Vedic agriculture. Every element strictly adheres to the non-negotiable hard constraints and the Anti-Slop Blacklist.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHASE 3 VERIFICATION SUMMARY                    │
├────────────────────────────────────────────────────────────────────────┤
│ • Total E2E Tests Executed: 28 (14 Desktop Chrome + 14 Mobile 360x640) │
│ • Tests Passed:             28 / 28 (100% Green)                       │
│ • External Runtime CDN Calls: ZERO (100% locally vendored in /vendor)  │
│ • Emoji Characters in UI:   ZERO (Strictly replaced with SVG icons)    │
│ • UTR Capture Field:        Active (#custUtr with 12-digit validation) │
│ • Telugu Conjunct Safety:   Verified (line-height ≥ 1.85, 0 tracking)  │
│ • Mobile 360px Overflow:    0px (scrollWidth = clientWidth = 360px)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Hard Constraints & Business Logic Preservation

| Constraint | Implementation in Early v0 Shell | Status |
|---|---|---|
| **100% Free Static Output** | Pure static output (`index.html`, `css/styles.css`, `js/app.js`). Zero serverless DB, zero paid gateway fees, 100% deployable to Cloudflare Pages or GitHub Pages. | **Compliant** |
| **Preserve Catalog & Trust Data** | Migrated and preserved all 8 products, descriptions, dual units (e.g., Rice 1kg / 25kg ₹250 discount), `CONFIG.upi.id` (`kurmagramvv@upi`), WhatsApp (`917732075607`), and Srikakulam trust details from `js/config.js`. | **Preserved** |
| **Direct UPI + UTR + WhatsApp** | Direct deep-link (`upi://pay`), local SVG QR generation via `qrcode-generator` (Level M), **12-digit UTR capture** (`#custUtr`), and formatted itemized WhatsApp order receipt generation. Zero commercial gateways. | **Preserved & Verified** |
| **Telugu-First Bilingual** | Telugu (`te`) default across entire DOM with instant 1-click English toggle. All copy tailored to warm, authentic Telugu phrasing. | **Compliant** |
| **Zero Runtime CDN Calls** | All 46 `.woff2` font files, Phosphor SVG icons sprite, `lenis`, `gsap`, `fuse.js`, and `qrcode-generator` vendored in `/vendor`. Zero requests leave `localhost`. | **Verified (T2 Test Passed)** |
| **Authentic Imagery Only** | Real photography from `kurmagram.com` gallery optimized to WebP/AVIF via `sharp`. Custom Kalamkari line art (2px iron-black strokes). Zero emojis, zero stock art, zero unDraw. | **Compliant** |

---

## 3. Visual & Component Walkthrough

### 3.1 Asymmetric Editorial Hero
- **Golden-Hour Photography:** Authentic full-bleed farm vista (`assets/images/farm/optimized/farm-drone-golden-hour.webp`) framed in a 2px brass border with live credit caption: *శ్రీకాకుళం జిల్లా, కిట్టలపాడు సమీపాన 60 ఎకరాల సహజ వేదిక్ వ్యవసాయ క్షేత్రం*.
- **Telugu Display Headline:** Set in *Noto Serif Telugu* (700 weight, clamp `2.35rem → 3.6rem`), anchored by the custom Kalamkari Kurma (tortoise) sacred mark.
- **Microcopy & Value Proposition:** Genuine tagline *సరళ జీవనం – ఉన్నత ఆశయం*, followed by honest copy emphasizing natural cow-centered cultivation without chemical fertilizers or harm to living beings.
- **Single Grounded Primary CTA:** Underlined button *ఉత్పత్తుల భాండాగారం* leading directly to the catalog, complemented by *మా జీవన విధానం* secondary link.
- **Kalamkari Vine Divider:** Handloom vine SVG seamlessly connecting the Hero to the Featured Harvest section.

### 3.2 Featured Harvest Section
- Highlights core seasonal produce (Desi Cow Ghee and Natural Sunnipindi) with dual-column cards, tactile shadow, and 1-click quick-add integration (`window.quickAddFeatured`).

### 3.3 Kraft-Paper Catalog with Natural-Dye Category Chips
- **Interactive Search:** Fuzzy search powered by locally vendored `Fuse.js` supporting both Telugu (*సున్నిపిండి*) and English (*brown rice*) queries with zero latency.
- **Natural-Dye Filter Chips:** Authentic circular swatch dots reflecting traditional dyes:
  - *అన్నీ* (All — Kasinatha Iron Black)
  - *ఆవు నెయ్యి* (A2 Ghee — Pasupu Turmeric)
  - *గానుగ నూనెలు* (Wood-Pressed Oils — Tholu Madder)
  - *దేశవాళీ బియ్యం* (Indigenous Rice — Biyyam Unbleached White)
  - *స్నాన చూర్ణాలు* (Bath Powder — Harita Leaf Green)
- **Product Cards:** Tactile kraft-paper card with 2px iron-black product line illustrations, Telugu display typography, interactive unit selector pills (1kg vs 25kg bag with ₹250 discount badge), brass price display, and fluid *కార్ట్‌లో చేర్చు* button.

### 3.4 Pinned "Soil-to-Bottle" Journey (`scroll-craft`)
- **Scrollytelling Layout:** Pinned left visual column that dynamically updates the farm photo in sync with scroll progress using GSAP ScrollTrigger.
- **Ramabhadra Numerals:** High-impact Telugu numeral metrics:
  - **౬౦ ఎకరాలు** (60 Acres — గో-ఆధారిత ప్రకృతి వ్యవసాయం)
  - **౨౦౧౮** (Established 2018 — నంద గోకులం గోశాల రక్షణ)
  - **౮౦ సాధకులు** (80 Residents — నిస్వార్థ సేవ మరియు వైదిక జీవనం)

### 3.5 How to Order in 3 Simple Steps
- Step 1: **ఎంపిక చేయండి** (Select fresh farm products into your cart)
- Step 2: **UPI తో చెల్లించండి** (Direct 0% fee UPI transfer & capture 12-digit UTR)
- Step 3: **WhatsApp లో రసీదు** (Send receipt to +91-7732075607 for dispatch)

### 3.6 Cart Drawer & Direct-UPI Checkout Modal
- **Cart Drawer (`<aside id="cartDrawer">`):** Smooth slide-out drawer with Lenis scroll lock, accessible ESC key listener, line item increment/decrement/remove controls, dynamic subtotal calculation, and free delivery notice.
- **Direct-UPI Checkout Dialog (`#checkoutModal`):**
  - Generated Order ID matching `KG-YYYYMMDD-XXXX` pattern.
  - Itemized order recap with exact delivery address and phone number inputs.
  - **DOM-Rendered UPI QR Code:** Generates standard NPCI-compliant QR code with Error Correction Level M.
  - **UPI Deep Link (`upi://pay`):** One-click mobile app launcher supporting GPay, PhonePe, Paytm, and BHIM with prefilled parameters (`pa=kurmagramvv@upi`, `pn=Kurmagram Vedic Village`, `am=XXX.00`, `cu=INR`, `tn=KG-XXXX`).
  - **12-Digit UTR Capture Input (`#custUtr`):** Clean input box with explanatory helper text for customer transaction reference.
  - **WhatsApp Submission (`#submitOrderWhatsAppBtn`):** Generates pre-filled, URI-encoded order confirmation message sent directly to `917732075607` containing customer details, order items, total amount, and UTR number.

### 3.7 Handloom Kolam Footer
- Complete contact block with real address (*కిట్టలపాడు సమీపం, రాజాం రోడ్డు, శ్రీకాకుళం జిల్లా, 532428*), phone numbers, FSSAI notice (*FSSAI రిజిస్ట్రేషన్ ప్రక్రియలో ఉంది*), and copyright notice.

---

## 4. Anti-Slop Blacklist Compliance Audit

| Anti-Slop Rule | Audit Finding | Verdict |
|---|---|---|
| **No purple/indigo SaaS gradients or neon** | Uses 100% OKLCH earth dyes (Khadi cream, Kasi iron-black, Pasupu turmeric, Manjistha red, Ittadi brass, Harita green). | **PASS** |
| **No emoji icons, bullets, or decoration** | Automated script scanned `index.html` and `js/app.js`: **0 emojis found**. All icons use vendored Phosphor SVGs. | **PASS** |
| **No centered-hero + floating blur blobs** | Asymmetric grid with real golden-hour farm photography and botanical line art. | **PASS** |
| **No 3 identical feature cards** | Content-specific layout (Featured harvest pair, pinned story cards, 3-step numbered flow). | **PASS** |
| **No glassmorphism everywhere** | Tactile kraft-paper surfaces with organic paper borders and subtle drop shadows. | **PASS** |
| **No Inter / Roboto / Poppins defaults** | Noto Serif Telugu (display), Ramabhadra (numerals), Noto Sans Telugu (body), Fraunces (Latin display), Source Sans 3 (Latin body). | **PASS** |
| **No vague AI fluff copy** | Script scanned for prohibited phrases (*"Discover peace"*, *"Find Harmony Within"*, *"Nourish Your Soul"*). **0 found**. | **PASS** |
| **No fake testimonials or statistics** | Zero fabricated reviews. Real farm facts only (60 acres, 2018 established, 80 residents, indigenous cows). | **PASS** |
| **No blanket rounded-2xl on everything** | Strict 4px / 6px tactile radius tokens (`--radius-sm: 4px`, `--radius-md: 6px`). | **PASS** |
| **No stock photos or unDraw art** | 100% authentic photography from `kurmagram.com` + custom Kalamkari SVGs. | **PASS** |
| **No lorem ipsum placeholder text** | Every line is real, authentic Telugu and English agricultural copy. | **PASS** |

---

## 5. Playwright E2E Acceptance Test Results

All 28 tests passed cleanly across **Desktop Chrome** and **Mobile Viewport (360x640)**:

```
Running 28 tests using 1 worker

  ok  1 [Desktop Chrome] › T1: Home page loads with Telugu default title and tagline (778ms)
  ok  2 [Desktop Chrome] › T2: Zero external runtime CDN calls (1.1s)
  ok  3 [Desktop Chrome] › T3: Bilingual toggle flips text between Telugu and English dynamically (779ms)
  ok  4 [Desktop Chrome] › T4: Fuzzy product search works for Telugu and English queries (1.5s)
  ok  5 [Desktop Chrome] › T5: Category filter chips filter products accurately (828ms)
  ok  6 [Desktop Chrome] › T6: Unit selector switches size and updates price accordingly (690ms)
  ok  7 [Desktop Chrome] › T7: Add to Cart updates badge count and shows toast notice (777ms)
  ok  8 [Desktop Chrome] › T8: Cart Drawer quantity controls (+ / - / remove) update totals (1.5s)
  ok  9 [Desktop Chrome] › T9: Cart Drawer accessibility (ESC key close and body scroll lock) (654ms)
  ok 10 [Desktop Chrome] › T10: Checkout modal opens with generated Order ID (3.9s)
  ok 11 [Desktop Chrome] › T11: UPI QR code is rendered in DOM (4.1s)
  ok 12 [Desktop Chrome] › T12: UPI deep link format matches NPCI specifications (4.0s)
  ok 13 [Desktop Chrome] › T13: WhatsApp submission URL contains encoded order details (8.5s)
  ok 14 [Desktop Chrome] › T14: Mobile viewport (360x640) has no horizontal scroll overflow (1.0s)
  ok 15 [Mobile Viewport (360x640)] › T1: Home page loads with Telugu default title and tagline (598ms)
  ok 16 [Mobile Viewport (360x640)] › T2: Zero external runtime CDN calls (1.0s)
  ok 17 [Mobile Viewport (360x640)] › T3: Bilingual toggle flips text between Telugu and English dynamically (715ms)
  ok 18 [Mobile Viewport (360x640)] › T4: Fuzzy product search works for Telugu and English queries (1.6s)
  ok 19 [Mobile Viewport (360x640)] › T5: Category filter chips filter products accurately (832ms)
  ok 20 [Mobile Viewport (360x640)] › T6: Unit selector switches size and updates price accordingly (595ms)
  ok 21 [Mobile Viewport (360x640)] › T7: Add to Cart updates badge count and shows toast notice (723ms)
  ok 22 [Mobile Viewport (360x640)] › T8: Cart Drawer quantity controls (+ / - / remove) update totals (1.3s)
  ok 23 [Mobile Viewport (360x640)] › T9: Cart Drawer accessibility (ESC key close and body scroll lock) (595ms)
  ok 24 [Mobile Viewport (360x640)] › T10: Checkout modal opens with generated Order ID (3.8s)
  ok 25 [Mobile Viewport (360x640)] › T11: UPI QR code is rendered in DOM (3.8s)
  ok 26 [Mobile Viewport (360x640)] › T12: UPI deep link format matches NPCI specifications (3.8s)
  ok 27 [Mobile Viewport (360x640)] › T13: WhatsApp submission URL contains encoded order details (13.4s)
  ok 28 [Mobile Viewport (360x640)] › T14: Mobile viewport (360x640) has no horizontal scroll overflow (1.0s)

  28 passed (1.1m)
```

---

## 6. Generated Visual Artifacts

The following visual acceptance captures have been generated in [`docs/screenshots/`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/screenshots/):
1. **Desktop Viewport:** [`v0-desktop-home.png`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/screenshots/v0-desktop-home.png) (Asymmetric hero, Telugu headline, farm photo frame, brass rules).
2. **Mobile Viewport (360px):** [`v0-mobile-home.png`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/screenshots/v0-mobile-home.png) (Responsive header, 0px horizontal overflow, legible Telugu typography).
3. **Cart Drawer:** [`v0-mobile-cart.png`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/screenshots/v0-mobile-cart.png) (Quantity controls, unit price, free delivery badge, subtotal).
4. **Direct-UPI & UTR Capture:** [`v0-mobile-checkout-utr.png`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/screenshots/v0-mobile-checkout-utr.png) (In-DOM UPI QR code, deep link, 12-digit UTR input field, WhatsApp dispatch button).

---

## 7. Approval Request & Next Phase

Phase 3 (Structure & Build — Early v0 Shell) is complete, tested, and ready for your review.

Please provide your approval to proceed to:
**Phase 4 — UI Audit:** Executing `vercel-labs/agent-skills` (`web-design-guidelines`) for line-by-line linting, contrast checks, and final polish against the Anti-Slop Blacklist.
