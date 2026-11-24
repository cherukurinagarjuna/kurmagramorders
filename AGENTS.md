# AGENTS.md — Engineering Rules, Constraints & Standards

## Project: Kurmagram Vedic Village (కూర్మగ్రామ వేదిక్ విలేజ్)
This document sets the ground rules and hard constraints that all AI agents and contributors must strictly enforce across all tasks.

---

## 1. Hard Constraints (Non-Negotiable)

1. **100% Free Static Output:**
   - Architecture: Pure static output (Astro, zero-JS by default; interactive client islands only where strictly necessary).
   - Deployment: Cloudflare Pages or GitHub Pages (100% free tier).
   - Zero runtime backend, zero serverless database dependencies, zero paid third-party APIs, zero payment gateway fees.

2. **Preserve Business Logic & Data:**
   - Single source of truth for catalog & trust configs: preserve all product data, units, descriptions, prices, and `js/config.js` (UPI ID `kurmagramvv@upi`, WhatsApp `917732075607`, phone numbers, and FSSAI notice).
   - Payment Flow: Direct UPI deep-link (`upi://pay`) + locally generated QR code (NPCI-compliant) + UTR reference capture + WhatsApp order confirmation handoff. Never substitute or add a commercial payment gateway (no Razorpay/Stripe/Cashfree).

3. **Telugu-First Bilingual Standard:**
   - Telugu (`te`) is the DEFAULT language across the storefront, with an intuitive one-click English (`en`) toggle.
   - All runtime libraries (`qrcode-generator`, `GSAP` + `ScrollTrigger`, `Lenis`, `Fuse`, `canvas-confetti`) and typography files must be vendored locally in `/vendor`. Zero external runtime CDN calls.
   - Telugu typography rules: line-height ≥ 1.75; NEVER letter-space Telugu; `lang="te"`; preserve GSUB/GPOS tables; strictly verify complex conjunct rendering (e.g., క్ష, జ్ఞ, త్ర, శ్ర).

4. **Authentic Imagery & Visual Integrity:**
   - Real photography only from the farm/village (www.kurmagram.com gallery).
   - Custom inline Kalamkari SVGs (Kurma tortoise mark, handloom vine dividers, paddy stalks, wooden ghani, kolam grids, 8 bespoke 2px iron-black product line illustrations).
   - **Zero Emoji Icons & Zero Generic Stock:** No emojis used as UI icons or decorative markers. No generic AI clip art or unDraw illustrations.

5. **Direct-UPI & UTR Manual Verification:**
   - Payment remains 0% fee peer-to-peer UPI with customer UTR input and manual verification via WhatsApp receipt.

---

## 2. Anti-Slop Blacklist

Any agent output violating any of these points will be rejected immediately:
- ❌ No purple/indigo SaaS gradients or neon aesthetic.
- ❌ No emoji icons, emoji bullets, or emoji decoration.
- ❌ No centered-hero + floating blur blobs cliché.
- ❌ No 3 identical feature cards.
- ❌ No glassmorphism everywhere.
- ❌ No Inter / Roboto / generic Poppins default typography.
- ❌ No vague AI fluff copy ("Discover peace", "Find Harmony Within", "Nourish Your Soul", "Awaken Your Spirit", "Radiate Peace").
- ❌ No fake testimonials or fabricated statistics.
- ❌ No blanket `rounded-2xl` on every component.
- ❌ No stock photos or unDraw illustrations.
- ❌ No lorem ipsum placeholder text.
- ❌ No gratuitous or unmotivated motion.
- ❌ No stray hex colors outside the OKLCH design tokens.
- ❌ No cookie-cutter SaaS section sequencing.

---

## 3. Installed Skills & Tooling Roles

- **`karero/croftweaver` (`new-website`):** Structural backbone, Astro scaffold, Cloudflare Pages integration, pre-launch checklists.
- **`google-labs-code/stitch-skills` (`design-md`):** Canonical authoring of `DESIGN.md` design system tokens and standards.
- **`ConardLi/garden-skills` (`web-design-engineer`):** Staged engineering process: Context → Design System → v0 Shell → Progressive Refinement.
- **`nateherkai/scroll-craft`:** Scrollytelling, layered story narrative, pinned soil-to-bottle journey.
- **`vercel-labs/agent-skills` (`web-design-guidelines`):** UI audits, rule-by-rule file:line linting and fixes.
- **`addyosmani/web-quality-skills`:** Mobile Lighthouse (Perf≥90, A11y≥95, Best-Practices≥95, SEO≥95), Core Web Vitals (LCP<2.5s, INP<200ms, CLS<0.1), and WCAG 2.2 AA validation.

---

## 4. Phase-Gated Governance

Work progresses strictly under the Artifact-Gated protocol. No phase begins until the artifacts of the preceding phase are delivered, reviewed, and approved:
- **Phase 0 — Discovery:** `sitemap.md`, `user-flows.md`, `content-model.md`
- **Phase 1 — Design System:** `DESIGN.md`, annotated wireframes (360px & 1440px), visual moodboard
- **Phase 2 — Assets:** `asset-manifest.md`, optimized responsive assets, Kalamkari SVG suite
- **Phase 3 — Structure & Build:** Astro architecture, components, scrollytelling narrative, v0 review
- **Phase 4 — UI Audit:** `web-design-guidelines` audit & anti-slop verification
- **Phase 5 — Quality Gate:** Lighthouse, CWV, WCAG 2.2 AA, Playwright E2E & visual regressions
- **Phase 6 — Deploy:** Cloudflare Pages release, JSON-LD, PWA offline shell, ₹1 test verification
