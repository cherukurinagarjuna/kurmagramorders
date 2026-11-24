const fs = require('fs');
const path = require('path');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160" class="vintage-seal-svg" aria-hidden="true">
  <defs>
    <path id="textPathTop" d="M 24 80 A 56 56 0 1 1 136 80" />
    <path id="textPathBottom" d="M 136 80 A 56 56 0 1 1 24 80" />
  </defs>
  <style>
    .seal-ring-outer { fill: none; stroke: #231F1D; stroke-width: 2px; stroke-dasharray: 4 2.5; }
    .seal-ring-inner { fill: none; stroke: #231F1D; stroke-width: 1.5px; }
    .seal-ring-center { fill: none; stroke: #B5944B; stroke-width: 1.2px; }
    .seal-text { font-family: 'Fraunces', serif; font-size: 8.5px; font-weight: 700; fill: #231F1D; letter-spacing: 0.12em; text-transform: uppercase; }
    .seal-center-text { font-family: 'Ramabhadra', 'Noto Serif Telugu', serif; font-size: 13px; font-weight: 700; fill: #A62B2B; text-anchor: middle; }
    .seal-sub-text { font-family: 'Fraunces', serif; font-size: 8.5px; font-weight: 700; fill: #231F1D; text-anchor: middle; letter-spacing: 0.08em; }
  </style>
  <circle cx="80" cy="80" r="75" class="seal-ring-outer" />
  <circle cx="80" cy="80" r="68" class="seal-ring-inner" />
  <circle cx="80" cy="80" r="46" class="seal-ring-center" />
  <text class="seal-text">
    <textPath href="#textPathTop" startOffset="50%" text-anchor="middle">
      KURMAGRAM • SINCE 2018
    </textPath>
  </text>
  <text class="seal-text">
    <textPath href="#textPathBottom" startOffset="50%" text-anchor="middle">
      100% NATURAL • వైదిక క్షేత్రం
    </textPath>
  </text>
  <!-- Center Stamped Brand Mark -->
  <text x="80" y="75" class="seal-center-text">కూర్మగ్రామ</text>
  <line x1="56" y1="80" x2="104" y2="80" stroke="#B5944B" stroke-width="1" />
  <text x="80" y="93" class="seal-sub-text">ESTD. 2018</text>
</svg>
`;

fs.writeFileSync(path.join(__dirname, '../public/assets/svg/kalamkari/vintage-seal.svg'), svg, 'utf8');
fs.writeFileSync(path.join(__dirname, '../assets/svg/kalamkari/vintage-seal.svg'), svg, 'utf8');
console.log('Vintage seal SVG successfully generated.');
