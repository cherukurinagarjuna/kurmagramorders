# Phase 0: Bilingual Content Model & Schema Specification

**Project:** Kurmagram Vedic Village (కూర్మగ్రామ వేదిక్ విలేజ్)  
**Document Status:** Pending User Review & Approval  
**Localization Standard:** Telugu (`te`) Default with English (`en`) Secondary Support

---

## 1. Store Configuration & Identity Schema (`CONFIG`)

The single source of truth for administrative contact, payments, and legal disclosures:

```typescript
interface StoreConfig {
  upiId: string;         // e.g., "kurmagramvv@upi"
  payeeName: string;     // e.g., "Kurmagram Vedic Village"
  whatsapp: string;      // e.g., "917732075607"
  phone2: string;        // e.g., "918712011776"
  email: string;         // e.g., "Kurmagramvv@gmail.com"
  fssai: string;         // e.g., "FSSAI Lic. No: XXXXXXXXXXXXXX"
  address: string;       // "Near Anthakapalli Village, Kittalapadu Post, Via Shrimukhalingam, Srikakulam District, AP – 532428"
  website: string;       // "www.kurmagram.com"
  foundedYear: number;   // 2018
  acreage: number;       // 60
  residentCount: number; // 80
}
```

---

## 2. Product & Category Entity Schema

```typescript
interface UnitOption {
  label: string;         // e.g., "500ml", "1L", "250g", "25kg"
  price: number;         // Current selling price in INR (e.g., 220)
  mrp?: number;          // Original MRP for discount calculation (e.g., 3250)
  note?: string;         // Telugu discount label (e.g., "₹250 తగ్గింపు!")
  noteEn?: string;       // English discount label (e.g., "₹250 OFF!")
}

interface ProductItem {
  id: string;            // Unique alphanumeric handle ("sunni", "anjan", "verm", etc.)
  cat: string;           // Category handle reference ("care", "cow", "farm", "grain", "oils")
  te: string;            // Telugu display name (e.g., "సున్నిపిండి")
  en: string;            // English display name (e.g., "Sunni Pindi (Herbal Bath Powder)")
  tag: string;           // Telugu badge/highlight (e.g., "సహజ స్నాన చూర్ణం")
  tagEn: string;         // English badge/highlight (e.g., "Herbal Bath Powder")
  desc: string;          // Full traditional description in Telugu
  descEn: string;        // Full traditional description in English
  svg: string;           // Path to bespoke 2px iron-black Kalamkari SVG line art
  photo?: string;        // Path to high-res real farm photography
  isFood?: boolean;      // Triggers FSSAI license display if true
  units: UnitOption[];   // 1 to 3 package size options
}

interface CategoryItem {
  id: string;            // "all" | "care" | "cow" | "farm" | "grain" | "oils"
  te: string;            // Telugu category name
  en: string;            // English category name
  dyeSwatch: string;     // Natural dye hex color reference for UI tag chip
}
```

---

## 3. Preserved Product Catalog Matrix (8 Bespoke Items)

All items from `js/config.js` are preserved verbatim with verified Telugu typography:

| ID | Category | Telugu Name (`te`) | English Name (`en`) | Units & Prices (INR) | FSSAI Food? |
|---|---|---|---|---|---|
| `sunni` | `care` | సున్నిపిండి | Sunni Pindi (Herbal Bath Powder) | 250g: ₹120<br>500g: ₹220 | No |
| `anjan` | `cow` | గో అంజన్ భాం | Go Anjan Bham (Cow-Ghee Kajal) | 10g: ₹150 | No |
| `verm` | `farm` | వార్మ్ ఆర్క్ | Verm Ark (Vermiwash Plant Tonic) | 500ml: ₹90<br>1L: ₹160 | No |
| `goark` | `cow` | గో ఆర్క్ | Go Ark (Cow Distillate) | 500ml: ₹140<br>1L: ₹250 | No |
| `pain` | `care` | పెయిన్ ఆయిల్ | Herbal Pain Relief Oil | 100ml: ₹180<br>200ml: ₹320 | No |
| `rice` | `grain` | బ్రౌన్ రైస్ | Brown Rice (Natural Farming) | 1kg: ₹130<br>25kg: ₹3000 *(MRP ₹3250)* | **Yes** |
| `sesame` | `oils` | నువ్వుల నూనె (గానుగ) | Cold-Pressed Sesame Oil | 500ml: ₹220<br>1L: ₹420 | **Yes** |
| `groundnut` | `oils` | పల్లి నూనె (గానుగ) | Cold-Pressed Groundnut Oil | 500ml: ₹160<br>1L: ₹300 | **Yes** |

---

## 4. Farm Story & Heritage Content Model (`STORY`)

Structured for the `nateherkai/scroll-craft` scrollytelling narrative:

- **Section 1: The Soil & Landscape (నేల & ప్రకృతి)**
  - `headlineTe`: "శ్రీముఖలింగం సమీపాన 60 ఎకరాల ప్రకృతి ఒడి"
  - `headlineEn`: "60 Acres of Natural Living Near Shrimukhalingam"
  - `metrics`: `60 ఎకరాలు (60 Acres)` | `2018 (Est.)` | `80 నివాసులు (80 Residents)`
  - `bodyTe`: "వంశధార నదీ తీరాన, రసాయనాలు లేని పవిత్ర నేలలో ప్రకృతి సిద్ధమైన వ్యవసాయం."
- **Section 2: Sacred Cow Protection (గో రక్షణ & గోశాల)**
  - `headlineTe`: "నంద గోకులం గోశాల — దేశవాళీ గోవుల సంరక్షణ"
  - `headlineEn`: "Nanda Gokulam Goshala — Indigenous Cow Sanctuary"
  - `bodyTe`: "అహింసా పద్ధతిలో సేవించబడే దేశవాళీ ఆవులు. వాటి ద్వారా లభించే స్వచ్ఛమైన గో ఉత్పత్తులు."
- **Section 3: Traditional Wood Churning (సంప్రదాయ చెక్క గానుగ)**
  - `headlineTe`: "సూర్యరశ్మికి ఎండిన గింజలు, నిదానంగా తిరిగే చెక్క గానుగ"
  - `headlineEn`: "Sun-Dried Seeds, Slow Wood-Churned Cold Extraction"
  - `bodyTe`: "వేడి చేయకుండా, రసాయనాలు కలపకుండా తీసిన సహజ నూనెలు — పూర్వీకుల ఆరోగ్య రహస్యం."

---

## 5. Trust & Statutory Content Model

- **Hero Tagline:**
  - `te`: "సరళ జీవనం – ఉన్నత ఆశయం"
  - `en`: "Simple Living – High Thinking"
- **Trust Guarantee Line:**
  - `te`: "ఎలాంటి ఫెర్టిలైజర్స్, క్రిమిసంహారకాలు లేకుండా, సకల జీవులకు హాని లేకుండా భక్తులు తయారు చేసిన సహజ ఉత్పత్తులు."
  - `en`: "Natural products prepared with devotion without synthetic fertilizers, pesticides, or harm to any living beings."
- **Statutory FSSAI Notice:**
  - Shown on all edible products (`rice`, `sesame`, `groundnut`).
- **Payment Assurance:**
  - `te`: "0% రుసుములతో నేరుగా ట్రస్ట్ కు UPI చెల్లింపు. మీ ప్రతి కొనుగోలు గోశాల మరియు గురుకుల పోషణకు తోడ్పడుతుంది."
  - `en`: "Direct-UPI payment with 0% gateway fee. Every purchase directly sustains our Goshala and Vedic Gurukulam."

---

## 6. Policy Content Model

1. **Shipping & Packaging Policy (`/policies#shipping`):**
   - Eco-friendly plastic-free or corrugated safe cushioning.
   - Dispatch within 24-48 hours via India Post Registered Parcel / standard courier across AP, Telangana, and Pan-India.
2. **Returns & Damaged Shipments (`/policies#returns`):**
   - Free replacement in case of transit leakage or broken seal upon sharing a simple WhatsApp photo.
3. **Privacy Statement (`/policies#privacy`):**
   - No cookies, no ad trackers, no telemetry. Customer name, phone, and address are used exclusively for delivery logistics and manual WhatsApp communication.
