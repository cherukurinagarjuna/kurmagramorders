# PROJECT: Kurmagram Vedic Village — Premium Store Rebuild (Design-System-First)
Rebuild the existing site into an elegant, attractive, portfolio-grade store with premium
structure: sitemap, flows, wireframes, assets, and a persistent design system. Preserve all
existing content, js/config.js, and the UPI + UTR + WhatsApp payment logic. Artifact-gated:
deliver and get approval on each phase's artifacts BEFORE the next phase. No AI slop.

## ROLE
Elite design director + frontend architect + QA engineer. The result must feel like a
handcrafted Andhra farm brand — editorial, warm, distinctive — never an AI template.

## INSTALLED SKILLS — LOAD AND FOLLOW
- karero/croftweaver (new-website): structural backbone, Astro → GitHub → Cloudflare Pages.
- google-labs-code/stitch-skills (design-md): author DESIGN.md as the design-system source of truth.
- ConardLi/garden-skills (web-design-engineer): staged process — context → design system → v0 → refine.
- nateherkai/scroll-craft: premium scroll-driven story section + its visual checker.
- vercel-labs/agent-skills (web-design-guidelines): audit UI, fix every file:line finding.
- addyosmani/web-quality-skills: Lighthouse + Core Web Vitals + WCAG 2.2 measurement loop.

## HARD CONSTRAINTS
1. 100% free static output (Astro, zero-JS by default; islands only where needed). Deploy to
   Cloudflare Pages or GitHub Pages. No backend, no paid services, no payment gateway.
2. PRESERVE: all product data, prices, js/config.js (UPI ID/WhatsApp), and the UPI deep-link +
   QR + UTR capture + WhatsApp order flow. Migrate, don't discard.
3. Telugu DEFAULT + EN toggle; vendor all runtime libs/fonts locally (no runtime CDN).
4. Real photos from www.kurmagram.com gallery; custom Kalamkari SVG; NO emoji icons, NO stock.
5. Payments stay direct-UPI + UTR manual verification (do not add a gateway).

## ART DIRECTION (rooted, not generic)
Kalamkari — Andhra Pradesh pen-painted natural-dye textile art (living tradition in Srikakulam).
Palette in OKLCH (culori): unbleached-cotton cream, indigo, madder red, turmeric, leaf green,
iron-black ink, brass. Hand-drawn botanical line motifs + a custom Kurma (tortoise) mark.
Type: Noto Serif Telugu (display), Ramabhadra (numerals), Mandali/Noto Sans Telugu (body),
Fraunces (Latin display), Source Sans 3 (Latin body). Telugu line-height ≥1.75; NEVER
letter-space Telugu; lang="te"; keep GSUB/GPOS when subsetting; verify conjuncts క్ష జ్ఞ త్ర శ్ర.
Editorial asymmetric layout, 8pt rhythm, paper/handloom texture, brass rules, real photography.

## PHASE 0 — DISCOVERY (artifacts: sitemap.md, user-flows.md, content-model.md)
Sitemap (start here, refine):
  /            home: hero, offer, featured, story teaser, trust, how-to-order
  /shop        all products: search + category chips + sort
  /product/[id] detail: gallery, description, variants, qty, add-to-cart, related, trust
  /about       the farm, goshala, gurukulam, natural practices, gallery
  /contact     address, phones, WhatsApp, map
  /how-to-order 3 steps, UPI guide, FAQ
  /cart        drawer + page fallback
  /checkout    details form → UPI QR/deep-link → UTR → WhatsApp confirm → success
  /orders      local order history + reorder
  /policies    shipping, returns, privacy, FSSAI
  + sitemap.xml, robots.txt, manifest.json
User flows: browse→filter→detail→variant/qty→cart→checkout→UPI pay→UTR→WhatsApp→success;
reorder from /orders; WhatsApp fallback at any step; search→result→detail.
Content model: products, categories, offers, story, trust, policies (Telugu + English fields).

## PHASE 1 — DESIGN SYSTEM (artifacts: DESIGN.md, wireframes, moodboard)
Author DESIGN.md in the stitch design.md format: OKLCH color tokens (semantic + AA contrast),
fluid type scale (clamp), 8pt spacing, radius/shadow scales, motion spec (durations/easings/
reduced-motion), Kalamkari motif library, component specs, voice & tone (specific, honest, warm).
Wireframes: annotated low-fi → hi-fi for home/shop/detail/checkout at 360px and 1440px.
Moodboard: natural dyes, Kalamkari line work, kraft/brass/kumkum, real farm photography.

## PHASE 2 — ASSETS (artifact: asset-manifest.md)
- Real gallery photos → sharp → WebP/AVIF + responsive srcset + lazy + width/height.
- Custom inline Kalamkari SVG: Kurma mark, vine divider, paddy stalk, wooden ghani, kolam grid,
  8 product line illustrations (consistent 2px iron-black stroke).
- Phosphor icons (Regular + Duotone), vendored. Fonts vendored + subset (fonttools).
- OG image, favicon set, manifest icons, sitemap.xml.
- gpt-image-2 ONLY for seamless paper/handloom textures under strict art direction; NEVER for
  product/people photos. Reject any output that looks generic/AI.

## PHASE 3 — STRUCTURE & BUILD (Astro via croftweaver; garden web-design-engineer staged)
Build layouts/components/islands from DESIGN.md. Show an early v0, then refine.
- Hero: full-bleed golden-hour farm photo, asymmetric; vertical Telugu display headline,
  Kurma mark, one brass rule, ONE grounded CTA; a Kalamkari vine drawn on scroll.
- Shop: kraft-paper cards, custom product line art, Telugu display name, brass price tab,
  underline "కార్ట్లో చేర్చు" micro-interaction; category chips as natural-dye swatches.
- Story: scroll-craft pinned "soil-to-bottle" narrative; real photos + line art + big
  Ramabhadra numerals (60 ఎకరాలు / 2018 / 80 residents).
- Product detail / cart / checkout: calm, focused, auto-animate line items; preserve UPI+UTR+WhatsApp.
- Footer: handloom-weave SVG, real address/phones, kolam grid.
Microcopy: rewrite every string specific/honest/warm; DELETE fluff ("Discover peace",
"Find Harmony Within", "Nourish Your Soul", "Awaken Your Spirit", "Radiate Peace").
Keep the real tagline "సరళ జీవనం – ఉన్నత ఆశయం".

## PHASE 4 — UI AUDIT (vercel web-design-guidelines)
Run the skill; fix EVERY file:line finding. Then enforce the ANTI-SLOP BLACKLIST:
no purple/indigo gradients · no emoji icons/decoration · no centered-hero+blobs cliché ·
no 3 identical feature cards · no glassmorphism/neon everywhere · no Inter/Roboto/Poppins
default · no vague fluff copy · no fake testimonials/stats · no rounded-2xl on everything ·
no stock/unDraw · no lorem · no gratuitous motion · no stray hex/inconsistent spacing ·
no cookie-cutter SaaS section order. Reject your own output if any item remains.

## PHASE 5 — QUALITY GATE (addyosmani web-quality-skills + axe + Playwright)
Lighthouse mobile: Perf≥90, A11y≥95, Best-Practices≥95, SEO≥95.
Core Web Vitals: LCP<2.5s, INP<200ms, CLS<0.1. WCAG 2.2 AA (axe: zero critical/serious).
Playwright: E2E for the full order flow + visual-regression screenshots; Telugu conjunct
rendering at 360px & 1440px (no clipping); reduced-motion → static, all content visible;
keyboard nav + focus traps; no-JS fallback (catalog/phones/WhatsApp work); no console errors.

## PHASE 6 — DEPLOY (croftweaver)
Astro → GitHub → Cloudflare Pages (free). JSON-LD (Organization + Product/Offer in INR),
sitemap.xml, robots.txt, manifest.json, service-worker offline shell. Pre-launch checklist:
real UPI ID, real prices, FSSAI number, remove demo ribbon, ₹1 test payment, verify WhatsApp
arrives at 7732075607. Document what each skill runs; least privilege; never expose credentials.

## ACCEPTANCE (premium gate — prove ALL)
P1 Artifacts exist & approved: sitemap, flows, wireframes, DESIGN.md, asset-manifest, QA report.
P2 Anti-slop blacklist: zero violations (grep emoji=0, no purple gradient, no fluff phrases).
P3 web-design-guidelines: all findings resolved. P4 Lighthouse/CWV/WCAG targets met.
P5 Telugu renders correctly; AA contrast; single OKLCH token system; 8pt spacing.
P6 Real optimized photos; custom SVG only; before/after screenshots show a distinctive design.
P7 Full order flow works end-to-end; payment logic preserved; free static deploy live.

## PROCESS
Artifact-gated: Phase 0→1→2→3→4→5→6, approval at each gate. Use the installed skills by name.
Show before/after screenshots and the QA report. Do not ask unnecessary questions; document
assumptions in DESIGN.md/README. Security: review skill permissions; never touch bank/WhatsApp creds.

## FIRST ACTION
Save this entire brief as PROJECT_BRIEF.md in the repo root and mirror its hard constraints
into AGENTS.md. Create the implementation plan artifact. DO NOT BUILD ANYTHING YET.
Stop after the plan and wait for my approval.
