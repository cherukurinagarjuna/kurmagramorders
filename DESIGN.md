# Design System: Kurmagram Vedic Village (కూర్మగ్రామ వేదిక్ విలేజ్)
**Project Handle:** `kurmagram-vedic-village`  
**Living Tradition:** Srikakulam Kalamkari & Natural Vedic Farming  
**Aesthetic Anchor:** Handcrafted Andhra farm brand — editorial, warm, tactile, authentic  
**Governance:** Strict Anti-Slop Directive | WCAG 2.2 AA Compliant

---

## 1. Visual Theme & Atmosphere

* **Atmosphere:** Deeply rooted, unhurried, artisanal, and reverent. The visual sensation of walking into a sacred Andhra rural agrahara or organic farmstead at dawn — sunlit unbleached cotton (*Khadi*), wet red earth (*Manjistha*), iron-black pen strokes (*Kasi*), and antique bell brass (*Ittadi*).
* **Density:** *Balanced Editorial* (Scale 5/10). Generous natural negative space allowing Telugu glyph ascenders and complex conjunct ligatures to breathe with full dignity.
* **Variance & Layout:** *Offset Asymmetric* (Scale 7/10). Editorial magazine-style layouts, vertical Telugu display headlines, asymmetrical golden-hour photography grids, and tactile handloom-textured dividers. Symmetrical cookie-cutter card grids and centered floating SaaS blobs are strictly banished.
* **Motion Philosophy:** *Restrained Mechanical & Tactile* (Scale 4/10). Natural spring physics mirroring real-world matter — a Kalamkari vine unfurling along a brass guide rule on scroll, a gentle temple-bell acoustic resonant response on cart updates, and instant static stability for visitors with `prefers-reduced-motion`.

---

## 2. Color Palette & Functional Roles (OKLCH Natural Dyes)

Deriving exclusively from organic vegetable, botanical, and mineral dyes endemic to Andhra Pradesh Kalamkari traditions:

| Descriptive Color Name | OKLCH Value | Fallback Hex | Functional Role & Contrast Ratio |
|---|---|---|---|
| **Unbleached Cotton (*Khadi Cream*)** | `oklch(0.972 0.015 88)` | `#FAF6EE` | Canvas root background; soft paper warmth with zero digital glare. |
| **Warm Rice Surface (*Biyyam White*)** | `oklch(0.992 0.008 85)` | `#FFFDF9` | Card surfaces, modal sheets, and drawer elevated planes. |
| **Sun-Baked Kraft Paper (*Tholu Kraft*)** | `oklch(0.915 0.032 75)` | `#ECE2CE` | Product card backings, secondary containers, and tag pills. |
| **Iron-Black Fermented Ink (*Kasi Black*)** | `oklch(0.220 0.020 60)` | `#231F1D` | Primary typography, bespoke 2px illustration linework; **12.8:1 contrast (AAA)**. |
| **Temple Madder Root (*Manjistha Red*)** | `oklch(0.480 0.170 28)` | `#A62B2B` | Primary brand accent, alert tags, price savings highlights; **4.8:1 contrast (AA)**. |
| **Sacred Vat Indigo (*Neeli Blue*)** | `oklch(0.380 0.110 255)` | `#1E3F66` | Secondary accent, link underlines, trust seal stamps; **7.2:1 contrast (AAA)**. |
| **Fresh Turmeric Dye (*Pasupu Amber*)** | `oklch(0.750 0.160 75)` | `#D97706` | Primary action buttons, checkout triggers, offer banners; **3.2:1 contrast on Dark, 4.5:1 with Off-Black text**. |
| **Riverbank Paddy (*Harita Green*)** | `oklch(0.450 0.130 142)` | `#2D6A4F` | Natural farming badges, organic cert indicators, success toasts; **4.9:1 contrast (AA)**. |
| **Antique Temple Brass (*Ittadi Brass*)** | `oklch(0.680 0.090 85)` | `#B5944B` | Hairline dividers (1px), ornamental borders, price ribbon tabs. |
| **Desi Cow Ghee (*Aavu Neyyi*)** | `oklch(0.820 0.120 80)` | `#F59E0B` | Subtle warm tint accents and seasonal harvest glow. |

### Color Rules:
1. **Never use `#000000`:** Deepest dark is fermented *Kasi Black* (`#231F1D`).
2. **Zero Purple/Indigo SaaS Gradients:** Neon violet, purple radial blurs, and glassmorphism glows are completely blocked.
3. **Calibrated Saturation:** Chroma never exceeds `0.18` in OKLCH to preserve organic botanical dye authenticity.

---

## 3. Typographic Architecture & Rules

Bilingual, Telugu-first hierarchy calibrated for intricate glyph conjunct rendering and editorial elegance:

### Font Families
* **Telugu Display (Titles & Major Heads):** `Noto Serif Telugu` (Weights: 600 SemiBold, 700 Bold). Preserves traditional palm-leaf and stone-inscription serif gravitas.
* **Telugu Numerals & Metric Display:** `Ramabhadra` (Weight: 400). Tall, high-density traditional Telugu numerals for acreage, years, and resident statistics (`౬౦ ఎకరాలు`, `౨౦౧౮`, `౮౦ నివాసులు`).
* **Telugu Body & Subheadings:** `Mandali` / `Noto Sans Telugu` (Weights: 400 Regular, 600 SemiBold). Clear, round letterforms optimized for comfortable legibility at small sizes.
* **Latin Display (Brand & English Titles):** `Fraunces` (OFL, Optical Sizes 9–144, Warm Editorial Serif).
* **Latin Body & UI Details:** `Source Sans 3` (OFL, Weights: 400 Regular, 600 SemiBold).

### Fluid Type Scale (CSS Clamp)

```css
--font-display-2xl: clamp(2.25rem, 5vw + 1rem, 3.75rem); /* 36px → 60px; Hero headline */
--font-display-xl:  clamp(1.75rem, 3.5vw + 0.75rem, 2.75rem); /* 28px → 44px; Section headers */
--font-title-lg:    clamp(1.35rem, 2vw + 0.5rem, 1.85rem);    /* 22px → 30px; Product title */
--font-title-md:    clamp(1.15rem, 1.2vw + 0.4rem, 1.45rem);  /* 18px → 23px; Card title */
--font-body-base:   clamp(0.98rem, 0.5vw + 0.85rem, 1.125rem); /* 15.7px → 18px; Body text */
--font-caption:     clamp(0.82rem, 0.3vw + 0.75rem, 0.92rem);  /* 13px → 14.7px; Tags & notes */
```

### Non-Negotiable Telugu Typographic Rules
1. **Line-Height ≥ 1.75:** Telugu contains upper vowel signs (*maatras* e.g., ి, ీ, ే, ై) and subscript conjunct consonants (*vattulu* e.g., ్క, ్ష, ్త్ర). Standard 1.2–1.5 line heights cause catastrophic clipping. Base line-height is locked to `1.85` for body, `1.5` for display.
2. **Letter-Spacing = 0 (NEVER letter-space Telugu):** Adding `letter-spacing` breaks OpenType GSUB/GPOS ligature tables, detaching *vattulu* from host consonants.
3. **HTML Document Attribute:** Root or text containers must carry `lang="te"`.
4. **Conjunct Validation Gate:** Every release must visually and programmatically verify render integrity of complex conjuncts: **క్ష** (ksha), **జ్ఞ** (jna), **త్ర** (tra), **శ్ర** (shra).

---

## 4. Kalamkari Motifs & Botanical Line Library

All graphical accents are hand-authored inline SVGs rendered with a uniform **2px iron-black (`#231F1D`) stroke**, organic line endings, and subtle earthy color fills:

1. **Kurma (Sacred Tortoise) Seal:** The central emblem representing steady dharma, longevity, and self-contained peace. Used on the header, hero backdrop, and receipt crest.
2. **Twisting Handloom Vine Divider (* తీగ అల్లిక *):** S-curved botanical vines with hand-drawn leaf bracts that unfurl horizontally across section breaks.
3. **Paddy Grain Stalks (* వరి కంకులు *):** Clustered ripe stalks framing agricultural details and grain products.
4. **Traditional Wooden Ghani (* చెక్క గానుగ *):** Heavy wood pestle and mortar illustration symbolizing slow, unheated cold extraction.
5. **Ahimsa Cow & Calf Silhouette (* గోమాత - దూడ *):** Mother cow lovingly nuzzling her calf, representing Nanda Gokulam Goshala.
6. **Sacred Kolam / Muggulu Grids (* ముగ్గులు *):** Geometric rice-flour doorstep floor art framing the page footer and checkout receipt.

---

## 5. Component Specifications & Interaction Behaviors

### Buttons & Interactive Controls
* **Primary CTA (*తుది చెల్లింపు / కొనండి*):**
  - Shape: Subtly rounded corners (`border-radius: 4px` — *never pill, never generic rounded-2xl*).
  - Background: *Pasupu Amber* (`#D97706`) with *Kasi Black* text.
  - Border: 1.5px solid *Antique Brass* (`#B5944B`).
  - Active Behavior: Tactile `transform: translateY(1px) scale(0.99)` with box-shadow compression.
* **Secondary Underline Micro-Action (*కార్ట్లో చేర్చు*):**
  - No background container. Elegant editorial text with an artisanal Kalamkari brass underline that expands from center on hover (`transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)`).
* **Category Dye Swatches:**
  - Rectangular chips with handloom textured borders and an authentic botanical dye indicator dot. Selected state adds a 1px brass outline and subtle parchment fill.

### Cards & Surfaces
* **Product Card:**
  - Background: *Biyyam White* (`#FFFDF9`) bordered with 1px *Antique Brass* or *Tholu Kraft* (`#ECE2CE`).
  - Corners: `border-radius: 6px`.
  - Elevation: Natural paper lay — zero fuzzy box-shadow. Uses a subtle directional contact shadow: `box-shadow: 0 2px 4px rgba(35, 31, 29, 0.05), 0 6px 12px rgba(35, 31, 29, 0.03)`.
  - Header: 2px iron-black product line art framed within a soft unbleached parchment inset.
  - Price Tag: Brass tab anchored to bottom-left with dual unit switcher (e.g., `500ml / 1L`).

### Form Inputs & Checkout Elements
* **Input Fields:**
  - Background: *Khadi Cream* (`#FAF6EE`).
  - Border: 1.5px solid *Tholu Kraft* (`#ECE2CE`), transitioning to *Manjistha Red* (`#A62B2B`) on focus.
  - Label: Always above input in *Kasi Black* with mandatory red asterisk indicator.
  - Validation: Real-time inline feedback without jarring layout shifts.

### Cart Drawer & Modal Overlays
* **Drawer Architecture:** Slides out from the right (`width: min(440px, 100vw)`).
* **Backdrop:** Deep *Kasi Black* at 45% opacity with subtle warm diffusion (no intense glassmorphism blur).
* **Body Lock:** Coordinated with Lenis scroll manager (`lenis.stop()` on open, `lenis.start()` on close).
* **Focus Trap & Keyboard:** Traps focus inside drawer; closes instantly on `Escape` key press.

---

## 6. Layout Principles & Spatial Grid

* **Spatial Base Rhythm:** Strict 8-point typographic and layout grid (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`).
* **Viewport Adaptability:**
  - Mobile (360px–640px): Single-column, generous touch targets (minimum 48×48px), sticky compact bottom action bar for checkout.
  - Desktop (1024px–1440px): Asymmetrical multi-column editorial layouts; side-by-side sticky product gallery and configuration; pinned scrollytelling split view.
* **No Element Overlapping:** Every element has its own breathing zone. Text never collides with or obscures photography.

---

## 7. Motion & Accessibility Contract

* **Durations & Easings:**
  - Micro-interactions: `180ms ease-out`
  - Page drawers / modals: `320ms cubic-bezier(0.16, 1, 0.3, 1)` (silk-smooth deceleration)
  - Scrollytelling transitions: Pinned scrub driven directly by viewport scroll.
* **Prefers-Reduced-Motion:**
  - When `prefers-reduced-motion: reduce` is detected: Lenis smooth scroll and GSAP scroll timelines are completely bypassed. All elements render in their terminal fully-visible states (`opacity: 1; transform: none`).

---

## 8. Voice & Tone Guidelines

* **Character:** Specific, honest, rooted, devotional, respectful of both farmer and consumer.
* **Mandatory Inclusion:** The living tagline **"సరళ జీవనం – ఉన్నత ఆశయం"** (*Simple Living – High Thinking*).
* **Strict Fluff Deletion:**
  - ❌ BANNED: *"Discover peace"*, *"Find Harmony Within"*, *"Awaken Your Spirit"*, *"Nourish Your Soul"*, *"Radiate Pure Energy"*.
  - ✅ APPROVED: *"గోశాల దేశవాళీ ఆవుల నెయ్యి మరియు సంప్రదాయ వనమూలికలతో తయారు చేసిన స్వచ్ఛమైన ఉత్పత్తులు."* (Clear, factual, honest explanation of ingredients and traditional preparation).

---

## 9. Explicit Anti-Slop Blacklist (Unslop & No-AI-Slop Directives)

Grounded in the core design rules of `heydamir/unslop` and editorial standards of `petergyang/no-ai-slop`, the following generic AI tropes and template shortcuts are strictly forbidden across the entire design system and codebase:

| Banned Element / AI Slop Cliché | Why It Is Banned | Handcrafted Authentic Replacement |
|---|---|---|
| **1. Multi-Stop Linear / Radial CSS Gradients & Gradient Text** (`linear-gradient`, `radial-gradient`, `text-fill-color: transparent`) | Standard CSS gradient fades (such as horizontal brass rules or dark photo scrims) are an automated AI shortcut for faux-depth that cheapens the tactile physical aesthetic. | Use solid OKLCH natural dye values (`--color-khadi`, `--color-tholu`), 1px solid brass hairline rules (`1px solid var(--color-ittadi)`), authentic inline Kalamkari SVG vine dividers, or solid tinted paper insets. |
| **2. Fuzzy Multi-Layer Box Shadows & Soft Elevation Blur** (`box-shadow: 0 8px 24px rgba(...)`) | Diffuse multi-layer box shadows are a telltale sign of generic Web2/SaaS components, dissolving the crisp tactile definition of physical paper and cloth. | Flat paper contact with crisp 1px solid iron-black / kraft borders (`1px solid var(--color-border)`), 1px antique brass frames, or flat directional 2px solid ink offset shadows (`box-shadow: 2px 2px 0 var(--color-kasi)`). |
| **3. Pill-Shaped Badges, Filter Chips & Full-Radius Tags** (`border-radius: var(--radius-full)`, `9999px`) | Modern SaaS pill buttons and rounded-full status badges look mass-manufactured and sterile. | Rectangular stamped ink seals (`border-radius: 2px` or `4px`) styled like traditional block prints, framed by 1px solid borders or Kalamkari ornamental bracket corners. |
| **4. Uppercase Tracked Micro-Labels** (`letter-spacing > 0.1em` with `text-transform: uppercase`) | Over-tracked small uppercase Latin text is a generic AI agency cliché used to fake "luxury minimalism". It clashes with the organic curves and conjunct dignity of Telugu script. | Natural sentence-case typography or modest classical small-caps (`letter-spacing: 0.02em` max) using `Fraunces` or `Source Sans 3`, keeping visual parity with Telugu headlines. |
| **5. Fractional Spacing Drift & Uncoordinated Radii** (arbitrary rems like `1.25rem`, `0.45rem`, `0.95rem` violating the 8pt base grid) | Inconsistent padding and uncalculated corner radii make card layouts feel disjointed and algorithmically generated. | Strict enforcement of the 8pt layout scale (`--space-2: 8px`, `--space-4: 16px`, `--space-6: 24px`, `--space-8: 32px`). Concentric corner radii must strictly follow optical nesting: $R_{\text{outer}} = R_{\text{inner}} + \text{padding}$. |

