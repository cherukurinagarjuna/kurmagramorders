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

const PORT = 3998;
server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  let browser;
  try {
    browser = await chromium.launch({ headless: true });

    // 1. Desktop 1440px Bento Product Grid
    console.log('Capturing Bento Product Grid at 1440px...');
    const page1440 = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    await page1440.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle' });
    await page1440.waitForTimeout(500);

    // Scroll to the Catalog / Product Grid section
    const catalogSection = page1440.locator('#catalog');
    await catalogSection.scrollIntoViewIfNeeded();
    await page1440.waitForTimeout(400);

    // Simulate mouse move over the featured rice card to trigger the 3D tilt & magnetic spotlight micro-interaction
    const riceCard = page1440.locator('#prod-card-rice');
    const box = await riceCard.boundingBox();
    if (box) {
      await page1440.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.4);
      await page1440.waitForTimeout(200);
    }

    // Capture the entire catalog section
    const bento1440Path = path.join(SCREENSHOT_DIR, 'bento-product-grid-1440px.png');
    const bento1440Artifact = path.join(ARTIFACT_DIR, 'bento-product-grid-1440px.png');
    await catalogSection.screenshot({ path: bento1440Path });
    fs.copyFileSync(bento1440Path, bento1440Artifact);
    console.log('Saved 1440px Bento Grid screenshot to:', bento1440Path);

    // 2. Mobile 360px Product Grid
    console.log('Capturing Product Grid at 360px...');
    const page360 = await browser.newPage({
      viewport: { width: 360, height: 780 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2
    });
    await page360.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle' });
    await page360.waitForTimeout(500);

    const mobileCatalog = page360.locator('#catalog');
    await mobileCatalog.scrollIntoViewIfNeeded();
    await page360.waitForTimeout(400);

    const bento360Path = path.join(SCREENSHOT_DIR, 'bento-product-grid-360px.png');
    const bento360Artifact = path.join(ARTIFACT_DIR, 'bento-product-grid-360px.png');
    await mobileCatalog.screenshot({ path: bento360Path });
    fs.copyFileSync(bento360Path, bento360Artifact);
    console.log('Saved 360px Bento Grid screenshot to:', bento360Path);

    console.log('All Product Grid screenshots captured successfully!');
  } catch (err) {
    console.error('Error capturing screenshots:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
