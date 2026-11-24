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

const PORT = 3888;
server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    
    // 1. Home 1440px
    console.log('Capturing Home 1440px...');
    let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    
    // Verify headings
    const h1Text = await page.locator('#heroTitle').textContent();
    const navHome = await page.locator('nav a[data-i18n="navHome"]').textContent();
    const featuredHead = await page.locator('#featuredSectionTitle').textContent();
    console.log('Home 1440px Verified Texts:', { h1Text, navHome, featuredHead });
    
    const home1440Path = path.join(SCREENSHOT_DIR, 'v0-home-1440px.png');
    await page.screenshot({ path: home1440Path, fullPage: false });
    fs.copyFileSync(home1440Path, path.join(ARTIFACT_DIR, 'v0-home-1440px.png'));
    
    const home1440FullPath = path.join(SCREENSHOT_DIR, 'v0-home-1440px-full.png');
    await page.screenshot({ path: home1440FullPath, fullPage: true });
    fs.copyFileSync(home1440FullPath, path.join(ARTIFACT_DIR, 'v0-home-1440px-full.png'));
    await page.close();

    // 2. Home 360px
    console.log('Capturing Home 360px...');
    page = await browser.newPage({ viewport: { width: 360, height: 640 } });
    await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    const home360Path = path.join(SCREENSHOT_DIR, 'v0-home-360px.png');
    await page.screenshot({ path: home360Path, fullPage: false });
    fs.copyFileSync(home360Path, path.join(ARTIFACT_DIR, 'v0-home-360px.png'));

    const home360FullPath = path.join(SCREENSHOT_DIR, 'v0-home-360px-full.png');
    await page.screenshot({ path: home360FullPath, fullPage: true });
    fs.copyFileSync(home360FullPath, path.join(ARTIFACT_DIR, 'v0-home-360px-full.png'));
    await page.close();

    // 3. Shop 1440px
    console.log('Capturing Shop 1440px...');
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://127.0.0.1:${PORT}/shop.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    
    const shopH1 = await page.locator('main h1').textContent();
    const shopCatalogTitle = await page.locator('#shopTitle').textContent();
    console.log('Shop 1440px Verified Texts:', { shopH1, shopCatalogTitle });

    const shop1440Path = path.join(SCREENSHOT_DIR, 'v0-shop-1440px.png');
    await page.screenshot({ path: shop1440Path, fullPage: false });
    fs.copyFileSync(shop1440Path, path.join(ARTIFACT_DIR, 'v0-shop-1440px.png'));

    const shop1440FullPath = path.join(SCREENSHOT_DIR, 'v0-shop-1440px-full.png');
    await page.screenshot({ path: shop1440FullPath, fullPage: true });
    fs.copyFileSync(shop1440FullPath, path.join(ARTIFACT_DIR, 'v0-shop-1440px-full.png'));
    await page.close();

    // 4. Shop 360px
    console.log('Capturing Shop 360px...');
    page = await browser.newPage({ viewport: { width: 360, height: 640 } });
    await page.goto(`http://127.0.0.1:${PORT}/shop.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    const shop360Path = path.join(SCREENSHOT_DIR, 'v0-shop-360px.png');
    await page.screenshot({ path: shop360Path, fullPage: false });
    fs.copyFileSync(shop360Path, path.join(ARTIFACT_DIR, 'v0-shop-360px.png'));

    const shop360FullPath = path.join(SCREENSHOT_DIR, 'v0-shop-360px-full.png');
    await page.screenshot({ path: shop360FullPath, fullPage: true });
    fs.copyFileSync(shop360FullPath, path.join(ARTIFACT_DIR, 'v0-shop-360px-full.png'));
    await page.close();

    console.log('All 4 screenshots captured successfully and copied to artifact directory!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
