# Phase 0: User Journeys & Interaction Flows

**Project:** Kurmagram Vedic Village (కూర్మగ్రామ వేదిక్ విలేజ్)  
**Document Status:** Pending User Review & Approval  
**Payment Architecture:** 100% Free Peer-to-Peer UPI (`upi://pay`) + UTR Manual Verification + WhatsApp Dispatch

---

## Flow 1: Primary Purchase Flow (End-to-End)

```mermaid
sequenceDiagram
    autonumber
    actor User as Customer (Customer Device)
    participant Catalog as Storefront / Shop
    participant Drawer as Cart Drawer / Page
    participant Checkout as Checkout Island
    participant UPI as UPI App (GPay / PhonePe / BHIM)
    participant WA as WhatsApp (+91-7732075607)

    User->>Catalog: Browse catalog / Filter category / Search
    Catalog-->>User: Render product cards (Kalamkari art & unit price)
    User->>Catalog: Select unit (e.g. 1L or 25kg) & tap "కార్ట్లో చేర్చు"
    Catalog->>Drawer: Play WebAudio temple bell chime & open drawer
    Drawer-->>User: Show itemized cart with subtotal & zero fee banner
    User->>Drawer: Tap "ఆర్డర్ పూర్తి చేయండి" (Proceed to Checkout)
    Drawer->>Checkout: Navigate to /checkout with cart state
    User->>Checkout: Fill Name, Phone (WhatsApp), Shipping Address
    Checkout->>Checkout: Generate unique Order ID (KG-YYYYMMDD-XXXX)
    
    alt Mobile Device Flow
        User->>Checkout: Tap "UPI ద్వారా చెల్లించండి" (Pay via UPI)
        Checkout->>UPI: Launch deep link upi://pay?pa=kurmagramvv@upi&pn=...&am=...
        User->>UPI: Authorize payment & note 12-digit UTR
    else Desktop Device Flow
        Checkout-->>User: Display NPCI-compliant UPI QR (Level M)
        User->>UPI: Scan QR code with mobile phone & complete payment
    end

    User->>Checkout: Paste / enter 12-digit UTR reference number
    User->>Checkout: Tap "ఆర్డర్ నిర్ధారించండి" (Confirm via WhatsApp)
    Checkout->>Checkout: Save order record to localStorage ('kurmagram_orders_v1')
    Checkout->>Checkout: Trigger temple bell chime & saffron/green confetti
    Checkout->>WA: Open WhatsApp with formatted itemized order dispatch
    WA-->>User: Message sent to Kurmagram Trust for dispatch verification
```

---

## Flow 2: Instant Search & Discovery Flow

```mermaid
flowchart TD
    Start["User arrives at /shop or /"] --> SearchInput["User enters query (Telugu or English)"]
    SearchInput --> FuseEngine{"Fuse.js Fuzzy Matcher"}
    
    FuseEngine -->|Telugu query e.g. 'నూనె'| MatchTe["Match 'te' name, 'tag', or 'desc'"]
    FuseEngine -->|English query e.g. 'oil'| MatchEn["Match 'en' name or 'descEn'"]
    
    MatchTe --> RenderList["Instant update of product grid (<50ms)"]
    MatchEn --> RenderList

    RenderList --> SelectProduct{"User action"}
    SelectProduct -->|Quick Add| AddDirect["Select unit & Add to Cart immediately"]
    SelectProduct -->|View Details| OpenDetail["Navigate to /product/[id] editorial page"]
    SelectProduct -->|No Matches| EmptyState["Show helpful suggestions & WhatsApp inquiry button"]
```

---

## Flow 3: WhatsApp Fallback at Any Stage

Kurmagram is a community-first trust store. If a customer is uncomfortable with forms, lacks a UPI app, or has custom delivery questions, a direct human channel is always accessible:

```mermaid
flowchart LR
    AnyPage["Any Storefront Page"] --> FloatWA["Floating WhatsApp Action / Direct Link"]
    FloatWA --> LaunchChat["Launch WhatsApp to +91-7732075607"]
    LaunchChat --> MsgPreset{"Contextual Message Draft"}
    MsgPreset -->|From Product Page| QueryProd["'నమస్తే, నాకు [ఉత్పత్తి పేరు] గురించి వివరాలు కావాలి...'"]
    MsgPreset -->|From Cart| QueryCart["'నమస్తే, నా కార్ట్ లోని వస్తువుల ఆర్డర్ కోసం సహాయం కావాలి...'"]
    MsgPreset -->|From Header/Footer| QueryGen["'నమస్తే కూర్మగ్రామం, నేను సహజ ఉత్పత్తుల గురించి మాట్లాడాలి...'"]
    QueryProd --> TrustReply["Trust volunteer replies and manually finalizes order"]
    QueryCart --> TrustReply
    QueryGen --> TrustReply
```

---

## Flow 4: Order History & 1-Click Reorder Flow

```mermaid
flowchart TD
    VisitOrders["Customer visits /orders"] --> ReadStorage["Read 'kurmagram_orders_v1' from localStorage"]
    
    ReadStorage --> CheckOrders{"Are there past orders?"}
    CheckOrders -->|Yes| ListOrders["Render past order cards with Order ID & timestamp"]
    CheckOrders -->|No| EmptyOrders["Show 'గతంలో ఆర్డర్లు ఏవీ లేవు' + Link to /shop"]

    ListOrders --> UserAction{"User clicks action"}
    UserAction -->|One-Click Reorder| PopulateCart["Load all items & unit selections into Cart Drawer"]
    UserAction -->|Check WhatsApp Status| OpenWA["Open WhatsApp asking for status of Order ID"]
    
    PopulateCart --> OpenCart["Open Cart Drawer with chime and prompt to checkout"]
```

---

## Flow 5: Graceful Degradation & No-JS Fallback Path

When a user browses with JavaScript disabled or on an ultra-low-bandwidth network:

1. **Static Catalog Display:** Product titles, full descriptions, unit pricing tables, and FSSAI notices render purely in HTML/CSS without relying on client-side JS.
2. **Accessible Direct Links:** Every product has a direct WhatsApp link encoding product name and selected unit:
   `https://wa.me/917732075607?text=నమస్తే,%20నేను%20[ఉత్పత్తి]%20ఆర్డర్%20చేయాలనుకుంటున్నాను`
3. **Static Fallback Route `/cart` & `/how-to-order`:** Full static page explains the 3-step UPI process, provides the direct UPI ID (`kurmagramvv@upi`), and presents phone numbers (`+91-7732075607`, `+91-8712011776`).
4. **Visible Content Guarantee:** No entrance animations keep content opacity at `0`. All CSS animations are progressive enhancements activated only under `.js` classes.
