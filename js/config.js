/**
 * KURMAGRAM VEDIC VILLAGE — STORE CONFIGURATION
 * Single source of truth for UPI ID, contact numbers, and product catalog.
 * The store owner only needs to edit this file to update prices, contact info, or products.
 */

const CONFIG = {
  upiId: "kurmagramvv@upi",        // DEMO — owner replaces with real Trust UPI ID
  payeeName: "Kurmagram Vedic Village",
  whatsapp: "917732075607",
  phone2: "918712011776",
  email: "Kurmagramvv@gmail.com",
  fssai: "FSSAI Lic. No: XXXXXXXXXXXXXX",   // shown on food items until owner updates
  address: "Near Anthakapalli Village, Kittalapadu Post, Via Shrimukhalingam, Srikakulam District, Andhra Pradesh – 532428, India",
  website: "www.kurmagram.com"
};

const CATEGORIES = [
  { id: "all", te: "అన్ని ఉత్పత్తులు", en: "All Products" },
  { id: "care", te: "వ్యక్తిగత సంరక్షణ", en: "Personal Care" },
  { id: "cow", te: "గో ఉత్పత్తులు", en: "Cow Products" },
  { id: "farm", te: "సహజ వ్యవసాయం", en: "Natural Farming" },
  { id: "grain", te: "దేశవాళీ ధాన్యాలు", en: "Grains & Rice" },
  { id: "oils", te: "గానుగ నూనెలు", en: "Cold-Pressed Oils" }
];

const PRODUCTS = [
  {
    "id": "sunni",
    "cat": "care",
    "te": "సున్నిపిండి",
    "en": "Sunni Pindi (Herbal Bath Powder)",
    "tag": "సహజ స్నాన చూర్ణం",
    "desc": "సంప్రదాయ పద్ధతిలో సహజ పదార్థాలతో తయారు చేసిన స్నాన చూర్ణం. రసాయన సబ్బులకు సహజ ప్రత్యామ్నాయం.",
    "descEn": "Handcrafted herbal bath powder made with traditional medicinal botanicals. A gentle, chemical-free natural skin cleanser.",
    "svg": "assets/svg/products/sunni.svg",
    "units": [
      { "label": "250g", "price": 120 },
      { "label": "500g", "price": 220 }
    ]
  },
  {
    "id": "anjan",
    "cat": "cow",
    "te": "గో అంజన్ భాం",
    "en": "Go Anjan Bham (Cow-Ghee Kajal)",
    "tag": "గో ఆధారితం",
    "desc": "గో ఆవు నెయ్యి దీపపు మరకతో సంప్రదాయ పద్ధతిలో తయారు చేసిన కాటుక.",
    "descEn": "Ayurvedic soothing kajal made from indigenous desi cow ghee soot and natural camphor.",
    "svg": "assets/svg/products/anjan.svg",
    "units": [
      { "label": "10g", "price": 150 }
    ]
  },
  {
    "id": "verm",
    "cat": "farm",
    "te": "వార్మ్ ఆర్క్",
    "en": "Verm Ark (Vermiwash Plant Tonic)",
    "tag": "సేంద్రియ పంట టానిక్",
    "desc": "వర్మీకంపోస్ట్ తయారీలో సేకరించిన ద్రవం — పంటలకు సేంద్రియ టానిక్.",
    "descEn": "Pure vermiwash liquid bio-tonic extracted naturally during organic vermicomposting. Rich in enzymes and plant nutrients.",
    "svg": "assets/svg/products/verm.svg",
    "units": [
      { "label": "500ml", "price": 90 },
      { "label": "1L", "price": 160 }
    ]
  },
  {
    "id": "goark",
    "cat": "cow",
    "te": "గో ఆర్క్",
    "en": "Go Ark (Cow Distillate)",
    "tag": "గోశాల ఉత్పత్తి",
    "desc": "గోశాల ఆవుల నుండి సేకరించి, సంప్రదాయ పద్ధతిలో స్వేదనం చేసిన ఆర్క్.",
    "descEn": "Sacred cow distillate prepared traditionally in a copper retort from indigenous Goshala cows.",
    "svg": "assets/svg/products/goark.svg",
    "units": [
      { "label": "500ml", "price": 140 },
      { "label": "1L", "price": 250 }
    ]
  },
  {
    "id": "pain",
    "cat": "care",
    "te": "పెయిన్ ఆయిల్",
    "en": "Herbal Pain Relief Oil",
    "tag": "నొప్పి నివారణ నూనె",
    "desc": "నొప్పి ఉపశమనానికి సంప్రదాయ హెర్బల్ నూనె.",
    "descEn": "Traditional Ayurvedic herbal medicated oil infused with healing herbs for soothing joint and muscle aches.",
    "svg": "assets/svg/products/pain.svg",
    "units": [
      { "label": "100ml", "price": 180 },
      { "label": "200ml", "price": 320 }
    ]
  },
  {
    "id": "rice",
    "cat": "grain",
    "te": "బ్రౌన్ రైస్",
    "en": "Brown Rice (Natural Farming)",
    "tag": "⭐ ప్రత్యేక ఆఫర్",
    "desc": "ఎలాంటి రసాయనాలు లేకుండా సహజ వ్యవసాయంలో పండించిన బ్రౌన్ రైస్.",
    "descEn": "Naturally grown unpolished brown rice cultivated using natural farming methods without synthetic chemicals.",
    "svg": "assets/svg/products/rice.svg",
    "isFood": true,
    "units": [
      { "label": "1kg", "price": 130 },
      { "label": "25kg", "price": 3000, "mrp": 3250, "note": "₹250 తగ్గింపు!", "noteEn": "₹250 OFF!" }
    ]
  },
  {
    "id": "sesame",
    "cat": "oils",
    "te": "నువ్వుల నూనె (గానుగ)",
    "en": "Cold-Pressed Sesame Oil",
    "tag": "చెక్క గానుగ",
    "desc": "చెక్క గానుగలో నెమ్మదిగా తీసిన నూనె — వేడి, రసాయన శుద్ధి లేదు.",
    "descEn": "Cold-pressed wood-churned (Chekka Ganuga) virgin sesame oil. No heating, no chemical refining.",
    "svg": "assets/svg/products/sesame.svg",
    "isFood": true,
    "units": [
      { "label": "500ml", "price": 220 },
      { "label": "1L", "price": 420 }
    ]
  },
  {
    "id": "groundnut",
    "cat": "oils",
    "te": "పల్లి నూనె (గానుగ)",
    "en": "Cold-Pressed Groundnut Oil",
    "tag": "చెక్క గానుగ",
    "desc": "చెక్క గానుగలో స్వచ్ఛమైన వేరుశెనగల నుండి తీసిన సహజ నూనె.",
    "descEn": "Pure cold-pressed groundnut oil extracted in traditional wooden churns from premium sun-dried peanuts.",
    "svg": "assets/svg/products/groundnut.svg",
    "isFood": true,
    "units": [
      { "label": "500ml", "price": 160 },
      { "label": "1L", "price": 300 }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, PRODUCTS, CATEGORIES };
}
