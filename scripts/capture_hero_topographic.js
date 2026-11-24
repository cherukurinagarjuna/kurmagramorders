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

const PORT = 3999;
server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  let browser;
  try {
    browser = await chromium.launch({ headless: true });

    // 1. Desktop 1440px
    console.log('Capturing Hero at 1440px...');
    const page1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page1440.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle' });

    // Wait for fluid typing animation to complete
    await page1440.waitForTimeout(2800);

    const headlineText = await page1440.locator('#heroFluidHeadline').textContent();
    console.log('1440px Fluid Headline Text:', headlineText.trim());

    // Screenshot of the Hero viewport
    const hero1440Path = path.join(SCREENSHOT_DIR, 'hero-topographic-1440px.png');
    const hero1440Artifact = path.join(ARTIFACT_DIR, 'hero-topographic-1440px.png');
    await page1440.screenshot({ path: hero1440Path, clip: { x: 0, y: 0, width: 1440, height: 860 } });
    fs.copyFileSync(hero1440Path, hero1440Artifact);
    console.log('Saved 1440px screenshot to:', hero1440Path);

    // 2. Mobile 360px
    console.log('Capturing Hero at 360px...');
    const page360 = await browser.newPage({
      viewport: { width: 360, height: 780 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2
    });
    await page360.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle' });

    // Wait for fluid typing animation to complete
    await page360.waitForTimeout(2800);

    const mobileHeadlineText = await page360.locator('#heroFluidHeadline').textContent();
    console.log('360px Fluid Headline Text:', mobileHeadlineText.trim());

    // Screenshot of the Mobile Hero
    const hero360Path = path.join(SCREENSHOT_DIR, 'hero-topographic-360px.png');
    const hero360Artifact = path.join(ARTIFACT_DIR, 'hero-topographic-360px.png');
    await page360.screenshot({ path: hero360Path, clip: { x: 0, y: 0, width: 360, height: 780 } });
    fs.copyFileSync(hero360Path, hero360Artifact);
    console.log('Saved 360px screenshot to:', hero360Path);

    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error capturing screenshots:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
