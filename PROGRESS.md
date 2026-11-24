# PROGRESS.md — Kurmagram Vedic Village Project Status

## Project Overview
- **Brand:** Kurmagram Vedic Village (కూర్మగ్రామ వేదిక్ విలేజ్)
- **Objective:** Rebuild the existing site into an elegant, attractive, portfolio-grade store with premium structure: sitemap, flows, wireframes, assets, and persistent design system.
- **Key Constraints:** 100% Free static output (Astro, zero-JS by default, islands where needed), preserve `js/config.js` and UPI + UTR + WhatsApp flow, Telugu-first bilingual, zero runtime CDN, authentic photography, Kalamkari SVGs, no AI slop.

---

## Phase Status Summary

| Phase | Description | Deliverables / Artifacts | Status | Approval |
|---|---|---|---|---|
| **Phase 0** | Discovery | `sitemap.md`, `user-flows.md`, `content-model.md` | **COMPLETED** | **Approved** |
| **Phase 1** | Design System | `DESIGN.md`, `wireframes.md`, `moodboard.md` | **COMPLETED** | **Approved** |
| **Phase 2** | Assets & Optimization | `asset-manifest.md`, Kalamkari SVGs, WebP/AVIF farm photos, vendored fonts/icons | **COMPLETED** | **Approved** |
| **Phase 3** | Structure & Build | Semantic layout, Asymmetric Hero, Kraft Catalog, Scroll-Craft story, Cart drawer, Direct-UPI + UTR checkout, v0 review | **COMPLETED** | **Awaiting Approval** |
| **Phase 4** | UI Audit | `web-design-guidelines` audit, anti-slop blacklist check | **NEXT STEP** | Pending Phase 3 approval |
| **Phase 5** | Quality Gate | Lighthouse, Core Web Vitals, WCAG 2.2 AA, Playwright E2E | **PENDING** | Pending Phase 4 |
| **Phase 6** | Deployment & Handover | Cloudflare Pages release, JSON-LD, PWA offline shell, ₹1 test verification | **PENDING** | Pending Phase 5 |

---

## Artifact Inventory to Date

### Phase 0 — Discovery
- [`docs/discovery/sitemap.md`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/discovery/sitemap.md)
- [`docs/discovery/user-flows.md`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/discovery/user-flows.md)
- [`docs/discovery/content-model.md`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/discovery/content-model.md)

### Phase 1 — Design System
- [`DESIGN.md`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/DESIGN.md)
- [`docs/design/wireframes.md`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/design/wireframes.md)
- [`docs/design/moodboard.md`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/design/moodboard.md)

### Phase 2 — Assets
- [`docs/assets/asset-manifest.md`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/assets/asset-manifest.md)
- **Authentic Farm Stills:** 10 photos in `assets/images/farm/optimized/` (WebP & AVIF at 1200w, 800w, 400w).
- **Kalamkari SVGs:** `kurma-mark.svg`, `vine-divider.svg`, `paddy-stalk.svg`, `wooden-ghani.svg`, `kolam-grid.svg`, `cow-calf.svg` in `assets/svg/kalamkari/`.
- **8 Product Line Illustrations:** 2px iron-black SVGs in `assets/svg/products/`.
- **Vendored Fonts:** 46 `.woff2` files in `vendor/fonts/` with `fonts.css`.
- **Vendored Icons:** Phosphor sprite in `vendor/icons/phosphor/phosphor-icons.svg`.
- **Brand Assets:** `og-kurmagram.jpg`, favicon suite (16, 32, 180, 192, 512px), `khadi-paper-texture.png`.

---

### Phase 3 — Structure & Build (Astro Static Architecture — Home & Shop v0)
- **Astro Config & Engine:** [`astro.config.mjs`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/astro.config.mjs) (`output: "static"`, zero-JS default, local font and style asset inlining).
- **Home Route:** [`src/pages/index.astro`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/src/pages/index.astro) -> [`dist/index.html`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/dist/index.html).
- **Shop Route:** [`src/pages/shop.astro`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/src/pages/shop.astro) -> [`dist/shop.html`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/dist/shop.html).
- **Modular Components:** `src/components/Header.astro`, `Hero.astro`, `OfferStrip.astro`, `FeaturedHarvest.astro`, `Catalog.astro`, `Story.astro`, `Steps.astro`, `Footer.astro`.
- **Verified v0 Visual Screenshots:**
  - Desktop 1440px Home: [`docs/screenshots/v0-home-1440px.png`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/screenshots/v0-home-1440px.png)
  - Mobile 360px Home: [`docs/screenshots/v0-home-360px.png`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/screenshots/v0-home-360px.png)
  - Desktop 1440px Shop: [`docs/screenshots/v0-shop-1440px.png`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/screenshots/v0-shop-1440px.png)
  - Mobile 360px Shop: [`docs/screenshots/v0-shop-360px.png`](file:///c:/Users/Nagarjun/Downloads/order%20tracking/docs/screenshots/v0-shop-360px.png)

---

## Immediate Next Step
Awaiting user review and gate approval for **Phase 3 (Structure & Build — Early v0 Shell)**.
Upon approval, proceed to **Phase 4 — UI Audit (`web-design-guidelines` audit & anti-slop verification)**.
