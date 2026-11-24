const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIST = path.resolve(__dirname, '..', 'dist');
const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'docs', 'screenshots');
const ARTIFACT_DIR = 'C:\\Users\\Nagarjun\\.gemini\\antigravity\\brain\\5c624ff9-8db2-40b2-a173-0e674b94ef51';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/' || p === '') p = '/index.html';
  if (!path.extname(p)) {
    if (fs.existsSync(path.join(DIST, p + '.html'))) {
      p = p + '.html';
    }
  }

  const f = path.join(DIST, p);
  if (fs.existsSync(f) && fs.statSync(f).isFile()) {
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(f).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found: ' + p);
  }
});

const PORT = 3994;
server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  let browser;
  try {
    browser = await chromium.launch({ headless: true });

    // 1. Desktop 1440px Hero Section
    console.log('Capturing Editorial Hero at 1440px...');
    const page1440 = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page1440.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle' });
    
    // Allow natural fluid headline typing to complete
    await page1440.waitForTimeout(1800);

    const heroSection = page1440.locator('.hero-editorial-section');
    const hero1440Path = path.join(SCREENSHOT_DIR, 'editorial-hero-1440px.png');
    const hero1440Artifact = path.join(ARTIFACT_DIR, 'editorial-hero-1440px.png');
    await heroSection.screenshot({ path: hero1440Path });
    fs.copyFileSync(hero1440Path, hero1440Artifact);
    console.log('Saved 1440px Hero screenshot to:', hero1440Path);

    // 2. Desktop 1440px Marquee Trust Band
    console.log('Capturing Kalamkari Marquee Trust Band at 1440px...');
    const marqueeSection = page1440.locator('.marquee-trust-section');
    const marquee1440Path = path.join(SCREENSHOT_DIR, 'editorial-marquee-1440px.png');
    const marquee1440Artifact = path.join(ARTIFACT_DIR, 'editorial-marquee-1440px.png');
    await marqueeSection.screenshot({ path: marquee1440Path });
    fs.copyFileSync(marquee1440Path, marquee1440Artifact);
    console.log('Saved 1440px Marquee screenshot to:', marquee1440Path);

    // 3. Desktop 1440px Catalog Ledger
    console.log('Capturing Catalog Ledger at 1440px with row hover turmeric tint...');
    const catalogSection = page1440.locator('#catalog');
    await catalogSection.scrollIntoViewIfNeeded();
    await page1440.waitForTimeout(400);

    // Hover over row 2 (Ghee) to demonstrate the turmeric 10% opacity row hover
    const secondRow = page1440.locator('.product-ledger-row').nth(1);
    await secondRow.hover();
    await page1440.waitForTimeout(300);

    const catalog1440Path = path.join(SCREENSHOT_DIR, 'editorial-catalog-1440px.png');
    const catalog1440Artifact = path.join(ARTIFACT_DIR, 'editorial-catalog-1440px.png');
    await catalogSection.screenshot({ path: catalog1440Path });
    fs.copyFileSync(catalog1440Path, catalog1440Artifact);
    console.log('Saved 1440px Catalog screenshot to:', catalog1440Path);

    // 4. Desktop 1440px Full Page
    console.log('Capturing Full Home Page at 1440px...');
    const full1440Path = path.join(SCREENSHOT_DIR, 'editorial-home-1440px-full.png');
    const full1440Artifact = path.join(ARTIFACT_DIR, 'editorial-home-1440px-full.png');
    await page1440.screenshot({ path: full1440Path, fullPage: true });
    fs.copyFileSync(full1440Path, full1440Artifact);
    console.log('Saved 1440px Full Page screenshot to:', full1440Path);

    // 5. Mobile 360px Hero Section & Full Page
    console.log('Capturing Mobile at 360px...');
    const page360 = await browser.newPage({
      viewport: { width: 360, height: 740 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2
    });
    await page360.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle' });
    await page360.waitForTimeout(1800);

    const mobileHero = page360.locator('.hero-editorial-section');
    const hero360Path = path.join(SCREENSHOT_DIR, 'editorial-hero-360px.png');
    const hero360Artifact = path.join(ARTIFACT_DIR, 'editorial-hero-360px.png');
    await mobileHero.screenshot({ path: hero360Path });
    fs.copyFileSync(hero360Path, hero360Artifact);
    console.log('Saved 360px Hero screenshot to:', hero360Path);

    const mobileCatalog = page360.locator('#catalog');
    await mobileCatalog.scrollIntoViewIfNeeded();
    await page360.waitForTimeout(400);

    const catalog360Path = path.join(SCREENSHOT_DIR, 'editorial-catalog-360px.png');
    const catalog360Artifact = path.join(ARTIFACT_DIR, 'editorial-catalog-360px.png');
    await mobileCatalog.screenshot({ path: catalog360Path });
    fs.copyFileSync(catalog360Path, catalog360Artifact);
    console.log('Saved 360px Catalog screenshot to:', catalog360Path);

    const full360Path = path.join(SCREENSHOT_DIR, 'editorial-home-360px-full.png');
    const full360Artifact = path.join(ARTIFACT_DIR, 'editorial-home-360px-full.png');
    await page360.screenshot({ path: full360Path, fullPage: true });
    fs.copyFileSync(full360Path, full360Artifact);
    console.log('Saved 360px Full Page screenshot to:', full360Path);

    console.log('ALL EDITORIAL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
