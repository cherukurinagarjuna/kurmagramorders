/* ==========================================================
   public/assets/shipping.js
   Navata Transport Freight & Estimated Delivery Calculator
   Origin: Srikakulam (Kurmagramamu Vedic Village)
   ========================================================== */
'use strict';

// ── Destination Rates & Delivery Timelines (from Srikakulam) ──
const NAVATA_DESTINATIONS = {
  // Andhra Pradesh (North Coastal)
  'Visakhapatnam':  { ratePerKg: 2.2, minFreight: 70,  docketCharge: 40, days: '1-2 Days',   state: 'Andhra Pradesh' },
  'Vizianagaram':   { ratePerKg: 2.0, minFreight: 60,  docketCharge: 40, days: '1 Day',     state: 'Andhra Pradesh' },
  'Srikakulam':     { ratePerKg: 1.5, minFreight: 50,  docketCharge: 40, days: 'Same/1 Day', state: 'Andhra Pradesh' },
  
  // Andhra Pradesh (Central & South)
  'Vijayawada':     { ratePerKg: 3.5, minFreight: 100, docketCharge: 50, days: '2-3 Days',   state: 'Andhra Pradesh' },
  'Guntur':         { ratePerKg: 3.6, minFreight: 100, docketCharge: 50, days: '2-3 Days',   state: 'Andhra Pradesh' },
  'Rajahmundry':    { ratePerKg: 2.8, minFreight: 80,  docketCharge: 45, days: '1-2 Days',   state: 'Andhra Pradesh' },
  'Kakinada':       { ratePerKg: 2.7, minFreight: 80,  docketCharge: 45, days: '1-2 Days',   state: 'Andhra Pradesh' },
  'Eluru':          { ratePerKg: 3.2, minFreight: 90,  docketCharge: 45, days: '2-3 Days',   state: 'Andhra Pradesh' },
  'Nellore':        { ratePerKg: 4.2, minFreight: 120, docketCharge: 50, days: '3-4 Days',   state: 'Andhra Pradesh' },
  'Tirupati':       { ratePerKg: 4.5, minFreight: 130, docketCharge: 50, days: '3-4 Days',   state: 'Andhra Pradesh' },
  'Kurnool':        { ratePerKg: 4.5, minFreight: 130, docketCharge: 50, days: '3-4 Days',   state: 'Andhra Pradesh' },
  'Anantapur':      { ratePerKg: 4.8, minFreight: 140, docketCharge: 50, days: '3-5 Days',   state: 'Andhra Pradesh' },
  'Kadapa':         { ratePerKg: 4.5, minFreight: 130, docketCharge: 50, days: '3-4 Days',   state: 'Andhra Pradesh' },

  // Telangana
  'Hyderabad / Secunderabad': { ratePerKg: 4.2, minFreight: 120, docketCharge: 50, days: '2-3 Days', state: 'Telangana' },
  'Warangal':                 { ratePerKg: 4.0, minFreight: 120, docketCharge: 50, days: '3-4 Days', state: 'Telangana' },
  'Khammam':                  { ratePerKg: 3.8, minFreight: 110, docketCharge: 50, days: '2-3 Days', state: 'Telangana' },
  'Karimnagar':               { ratePerKg: 4.4, minFreight: 130, docketCharge: 50, days: '3-4 Days', state: 'Telangana' },
  'Nizamabad':                { ratePerKg: 4.6, minFreight: 135, docketCharge: 50, days: '3-5 Days', state: 'Telangana' },

  // Neighboring States
  'Bengaluru (Karnataka)':    { ratePerKg: 5.5, minFreight: 160, docketCharge: 60, days: '4-5 Days', state: 'Karnataka' },
  'Chennai (Tamil Nadu)':     { ratePerKg: 5.2, minFreight: 150, docketCharge: 60, days: '3-5 Days', state: 'Tamil Nadu' },
  'Bhubaneswar (Odisha)':     { ratePerKg: 3.6, minFreight: 110, docketCharge: 50, days: '2-3 Days', state: 'Odisha' },
  'Berhampur (Odisha)':       { ratePerKg: 2.5, minFreight: 80,  docketCharge: 45, days: '1-2 Days', state: 'Odisha' },
};

/**
 * Calculate Navata Freight Estimate
 * @param {string} destinationKey
 * @param {number} totalWeightKg
 * @returns {object|null}
 */
function calculateNavataFreight(destinationKey, totalWeightKg) {
  const dest = NAVATA_DESTINATIONS[destinationKey];
  if (!dest) return null;

  const weight = Math.max(1, Number(totalWeightKg) || 1);
  const baseRateFreight = weight * dest.ratePerKg;
  const applicableFreight = Math.max(dest.minFreight, baseRateFreight);
  const docketCharge = dest.docketCharge;
  
  // Standard road transport GST 5%
  const subtotal = applicableFreight + docketCharge;
  const gst = Math.round(subtotal * 0.05);
  const estimatedTotal = Math.round(subtotal + gst);

  return {
    destination: destinationKey,
    state: dest.state,
    weight: weight,
    ratePerKg: dest.ratePerKg,
    minFreight: dest.minFreight,
    applicableFreight: Math.round(applicableFreight),
    docketCharge: docketCharge,
    gst: gst,
    estimatedTotal: estimatedTotal,
    deliveryDays: dest.days,
  };
}

/**
 * Render Navata Calculator Widget into any container
 * @param {string} containerId
 * @param {number|null} defaultWeightKg
 */
function initNavataCalculator(containerId, defaultWeightKg = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentCart = (typeof getCart === 'function') ? getCart() : [];
  let calculatedWeight = 0;
  currentCart.forEach(item => {
    if (item.name && item.name.includes('25kg')) {
      calculatedWeight += (25 * (item.quantity || 1));
    } else {
      calculatedWeight += (item.quantity || 5);
    }
  });

  const initialWeight = defaultWeightKg || (calculatedWeight > 0 ? calculatedWeight : 25);

  const optionsHtml = Object.keys(NAVATA_DESTINATIONS).map(dest => {
    const d = NAVATA_DESTINATIONS[dest];
    return `<option value="${dest}">${dest} (${d.days})</option>`;
  }).join('');

  container.innerHTML = `
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4" style="border: 1px solid #ebdcc5 !important; background: #faf6ef;">
      <div class="card-header border-bottom py-3 px-4 d-flex justify-content-between align-items-center" style="background: #f4ecdc;">
        <div class="d-flex align-items-center gap-2">
          <span class="fs-4">🚚</span>
          <div>
            <h5 class="mb-0 fw-bold" style="color: var(--clr-forest); font-family: var(--font-heading);">
              Navata Freight &amp; Delivery Calculator
            </h5>
            <small class="text-muted">Origin: Srikakulam Branch (కూర్మగ్రామము)</small>
          </div>
        </div>
        <a href="https://www.navata.com/freight-cal" target="_blank" rel="noopener" class="btn btn-sm btn-outline-success rounded-pill px-3 d-none d-md-inline-block">
          Official Navata Tool ↗
        </a>
      </div>

      <div class="card-body p-4">
        <p class="small text-muted mb-3">
          Estimate freight charges and delivery timelines for your natural rice order according to Navata Road Transport tariffs:
        </p>

        <div class="row g-3 align-items-end mb-3">
          <!-- Destination Selector -->
          <div class="col-md-6">
            <label class="form-label small fw-semibold text-success">Select Delivery City / Hub</label>
            <select id="navataDestSelect" class="form-select border-success-subtle">
              ${optionsHtml}
            </select>
          </div>

          <!-- Total Weight Input -->
          <div class="col-md-4">
            <label class="form-label small fw-semibold text-success">Shipment Weight (in kg)</label>
            <div class="input-group">
              <input type="number" id="navataWeightInput" class="form-control text-center fw-bold" value="${initialWeight}" min="1" max="1000" />
              <span class="input-group-text bg-white">kg</span>
            </div>
          </div>

          <!-- Calculate Button -->
          <div class="col-md-2">
            <button type="button" id="navataCalcBtn" class="btn btn-success w-100 fw-bold">
              Calculate
            </button>
          </div>
        </div>

        <!-- Result Box -->
        <div id="navataResultBox" class="p-3 bg-white rounded-3 border">
          <!-- Will be filled by JS -->
        </div>

        <div class="mt-3 d-flex flex-wrap justify-content-between align-items-center small text-muted">
          <span>* Actual freight is determined by Navata at dispatch counter based on actual parcel weight &amp; docket booking.</span>
          <a href="https://www.navata.com/freight-cal" target="_blank" rel="noopener" class="text-success text-decoration-none">
            Visit navata.com/freight-cal ↗
          </a>
        </div>
      </div>
    </div>
  `;

  // Calculation event wiring
  function updateResult() {
    const dest = document.getElementById('navataDestSelect').value;
    const weight = parseFloat(document.getElementById('navataWeightInput').value) || 1;
    const res = calculateNavataFreight(dest, weight);
    const box = document.getElementById('navataResultBox');

    if (!res) {
      box.innerHTML = '<span class="text-danger small">Please select a valid destination.</span>';
      return;
    }

    box.innerHTML = `
      <div class="row g-2 align-items-center">
        <div class="col-sm-4 border-end">
          <div class="small text-muted">Estimated Delivery Time</div>
          <div class="fs-5 fw-bold text-success">⏱️ ${res.deliveryDays}</div>
          <div class="small text-muted">${res.destination} (${res.state})</div>
        </div>

        <div class="col-sm-4 border-end px-3">
          <div class="small text-muted">Breakdown (${res.weight} kg)</div>
          <div class="small text-dark">
            Freight (@ ₹${res.ratePerKg}/kg): <strong>₹${res.applicableFreight}</strong><br />
            Docket / LR Fee: <strong>₹${res.docketCharge}</strong> + GST: <strong>₹${res.gst}</strong>
          </div>
        </div>

        <div class="col-sm-4 text-sm-end">
          <div class="small text-muted">Estimated Navata Freight</div>
          <div class="fs-4 fw-bold text-success">₹${res.estimatedTotal.toLocaleString('en-IN')}*</div>
          <span class="badge bg-warning-subtle text-dark border">Payable to Navata upon delivery</span>
        </div>
      </div>
    `;
  }

  document.getElementById('navataCalcBtn').addEventListener('click', updateResult);
  document.getElementById('navataDestSelect').addEventListener('change', updateResult);
  document.getElementById('navataWeightInput').addEventListener('input', updateResult);

  // Run on initial render
  updateResult();
}
