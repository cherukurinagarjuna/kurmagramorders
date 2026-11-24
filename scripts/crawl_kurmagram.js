const https = require('https');
const http = require('http');
const urlModule = require('url');

function fetchUrl(targetUrl) {
  return new Promise((resolve, reject) => {
    const parsed = urlModule.parse(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = urlModule.resolve(targetUrl, redirectUrl);
        }
        console.log(`Redirecting to ${redirectUrl}`);
        return fetchUrl(redirectUrl).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function run() {
  try {
    console.log('Fetching https://kurmagram.com ...');
    const res = await fetchUrl('https://kurmagram.com');
    console.log('Status:', res.status);
    console.log('Body length:', res.body.length);

    const titleMatch = res.body.match(/<title>([^<]+)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title');

    // Extract stylesheets
    const cssMatches = [...res.body.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)];
    console.log('\nStylesheets:');
    cssMatches.forEach(m => console.log(' - ' + m[1]));

    // Extract navigation links
    const linkMatches = [...res.body.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
    console.log('\nNavigation / Links (sample):');
    const seenLinks = new Set();
    for (const m of linkMatches) {
      const href = m[1];
      const text = m[2].replace(/<[^>]+>/g, '').trim();
      if (text && !seenLinks.has(text) && !href.startsWith('#') && !href.startsWith('javascript')) {
        seenLinks.add(text);
        console.log(` - ${text} -> ${href}`);
      }
    }

    // Extract images
    const imgMatches = [...res.body.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
    console.log(`\nFound ${imgMatches.length} images on homepage. Sample:`);
    const seenImgs = new Set();
    for (const m of imgMatches) {
      if (!seenImgs.has(m[1])) {
        seenImgs.add(m[1]);
        if (seenImgs.size <= 15) console.log(` - ${m[1]}`);
      }
    }

    // Extract headings
    console.log('\nHeadings (H1, H2, H3):');
    const headingMatches = [...res.body.matchAll(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi)];
    headingMatches.forEach(m => {
      const tag = m[1].toUpperCase();
      const txt = m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
      if (txt) console.log(` [${tag}] ${txt}`);
    });

  } catch (err) {
    console.error('Error fetching:', err.message);
  }
}

run();
