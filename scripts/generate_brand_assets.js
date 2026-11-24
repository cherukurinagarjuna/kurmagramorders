const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../assets/images');
const texDir = path.join(imgDir, 'textures');
if (!fs.existsSync(texDir)) fs.mkdirSync(texDir, { recursive: true });

async function createBrandAssets() {
  console.log('Generating brand assets (OG image, favicon set, textures)...');

  // 1. Favicons from trimmed logo
  const logoPath = path.join(imgDir, 'kurmagram-official-logo.png');
  const src = fs.existsSync(logoPath) ? logoPath : path.join(imgDir, 'logo-header.png');

  // 16x16, 32x32, 180x180 (Apple touch), 192x192, 512x512
  await sharp(src).resize(16, 16).png().toFile(path.join(imgDir, 'favicon-16.png'));
  await sharp(src).resize(32, 32).png().toFile(path.join(imgDir, 'favicon-32.png'));
  await sharp(src).resize(180, 180).png().toFile(path.join(imgDir, 'apple-touch-icon.png'));
  await sharp(src).resize(192, 192).png().toFile(path.join(imgDir, 'favicon-192.png'));
  await sharp(src).resize(512, 512).png().toFile(path.join(imgDir, 'favicon-512.png'));
  console.log('Saved favicon package (16, 32, 180, 192, 512).');

  // 2. Open Graph Share Image (1200x630 JPEG <= 300KB)
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <!-- Background Canvas: Unbleached Khadi Cream -->
    <rect width="1200" height="630" fill="#FAF6EE"/>
    
    <!-- Outer Kalamkari Ornamental Brass Border -->
    <rect x="30" y="30" width="1140" height="570" fill="none" stroke="#B5944B" stroke-width="3"/>
    <rect x="42" y="42" width="1116" height="546" fill="none" stroke="#231F1D" stroke-width="1.5" stroke-dasharray="6 4"/>

    <!-- Subtle Vine Corner Accents -->
    <g fill="#A62B2B" stroke="#231F1D" stroke-width="2">
      <circle cx="42" cy="42" r="8"/>
      <circle cx="1158" cy="42" r="8"/>
      <circle cx="42" cy="588" r="8"/>
      <circle cx="1158" cy="588" r="8"/>
    </g>

    <!-- Main Content -->
    <!-- Brand Crest Halo -->
    <circle cx="600" cy="180" r="85" fill="#FFFDF9" stroke="#231F1D" stroke-width="2.5"/>
    <circle cx="600" cy="180" r="75" fill="none" stroke="#B5944B" stroke-width="1.5" stroke-dasharray="4 3"/>

    <!-- Central Kurma Tortoise Symbol -->
    <ellipse cx="600" cy="180" rx="42" ry="32" fill="#2D6A4F" stroke="#231F1D" stroke-width="2.5"/>
    <!-- Shell Pattern -->
    <polygon points="600,162 616,171 616,189 600,198 584,189 584,171" fill="#1E3F66" stroke="#FAF6EE" stroke-width="2"/>
    <circle cx="600" cy="180" r="6" fill="#D97706"/>

    <!-- Head & Paddles -->
    <circle cx="648" cy="180" r="7" fill="#2D6A4F" stroke="#231F1D" stroke-width="2"/>
    <ellipse cx="570" cy="154" rx="7" ry="5" transform="rotate(-30 570 154)" fill="#2D6A4F" stroke="#231F1D" stroke-width="2"/>
    <ellipse cx="630" cy="154" rx="7" ry="5" transform="rotate(30 630 154)" fill="#2D6A4F" stroke="#231F1D" stroke-width="2"/>
    <ellipse cx="570" cy="206" rx="7" ry="5" transform="rotate(30 570 206)" fill="#2D6A4F" stroke="#231F1D" stroke-width="2"/>
    <ellipse cx="630" cy="206" rx="7" ry="5" transform="rotate(-30 630 206)" fill="#2D6A4F" stroke="#231F1D" stroke-width="2"/>

    <!-- Brand Typography -->
    <text x="600" y="320" font-family="'Noto Serif Telugu', serif" font-size="46" font-weight="700" fill="#231F1D" text-anchor="middle">కూర్మగ్రామ వేదిక్ విలేజ్</text>
    <text x="600" y="365" font-family="'Fraunces', serif" font-size="22" font-weight="600" fill="#B5944B" letter-spacing="4" text-anchor="middle">KURMAGRAM VEDIC VILLAGE</text>
    
    <!-- Tagline Rule -->
    <line x1="420" y1="395" x2="780" y2="395" stroke="#B5944B" stroke-width="1.5"/>

    <text x="600" y="440" font-family="'Noto Sans Telugu', sans-serif" font-size="30" font-weight="600" fill="#A62B2B" text-anchor="middle">"సరళ జీవనం – ఉన్నత ఆశయం"</text>
    <text x="600" y="485" font-family="'Noto Sans Telugu', sans-serif" font-size="20" fill="#231F1D" text-anchor="middle">శ్రీముఖలింగం సమీపాన 60 ఎకరాల సహజ వ్యవసాయం · నంద గోకులం గోశాల</text>

    <!-- Trust Badges Bar -->
    <rect x="250" y="520" width="700" height="42" rx="4" fill="#ECE2CE" stroke="#231F1D" stroke-width="1.5"/>
    <text x="600" y="547" font-family="'Noto Sans Telugu', sans-serif" font-size="16" font-weight="600" fill="#231F1D" text-anchor="middle">100% సహజం · రసాయనాలు లేని పంటలు · చెక్క గానుగ నూనెలు · Direct UPI (0% రుసుము)</text>
  </svg>
  `;

  await sharp(Buffer.from(ogSvg))
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(imgDir, 'og-kurmagram.jpg'));
  console.log('Saved OG image: og-kurmagram.jpg (1200x630)');

  // 3. Tactile Seamless Khadi Texture (Subtle paper grain)
  // Create subtle 200x200 seamless unbleached cotton grain pattern
  const khadiSvg = `
  <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.98   0 0 0 0 0.96   0 0 0 0 0.93   0 0 0 0.08 0"/>
    </filter>
    <rect width="200" height="200" fill="#FAF6EE"/>
    <rect width="200" height="200" filter="url(#noise)"/>
  </svg>
  `;
  await sharp(Buffer.from(khadiSvg))
    .png()
    .toFile(path.join(texDir, 'khadi-paper-texture.png'));
  console.log('Saved seamless paper texture: khadi-paper-texture.png');
}

createBrandAssets().catch(err => {
  console.error('Asset creation error:', err);
  process.exit(1);
});
