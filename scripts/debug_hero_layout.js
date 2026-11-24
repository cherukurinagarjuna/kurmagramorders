const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIST = path.resolve(__dirname, '..', 'dist');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/' || p === '') p = '/index.html';
  const f = path.join(DIST, p);
  if (fs.existsSync(f) && fs.statSync(f).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3999, '127.0.0.1', async () => {
  try {
    const b = await chromium.launch({ headless: true });
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto('http://127.0.0.1:3999/index.html');
    
    const info = await p.evaluate(() => {
      const getDetails = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        return {
          sel,
          rect: { top: r.top, left: r.left, width: r.width, height: r.height },
          display: cs.display,
          visibility: cs.visibility,
          opacity: cs.opacity,
          color: cs.color,
          bg: cs.backgroundColor,
          text: el.textContent.trim().substring(0, 40)
        };
      };
      return [
        getDetails('.hero-section'),
        getDetails('.hero-asymmetric-grid'),
        getDetails('.hero-content'),
        getDetails('#heroTitle'),
        getDetails('.hero-tagline'),
        getDetails('.hero-brass-rule'),
        getDetails('.hero-trust-box'),
        getDetails('.hero-actions'),
        getDetails('.hero-visual-column'),
        getDetails('.hero-photo-frame'),
        getDetails('.hero-photo-img')
      ];
    });

    console.log('DOM Element computed details:', JSON.stringify(info, null, 2));
    await b.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
  }
});
