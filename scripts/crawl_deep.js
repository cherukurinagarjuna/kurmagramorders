const https = require('https');
const urlModule = require('url');

function fetchUrl(targetUrl) {
  return new Promise((resolve, reject) => {
    https.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirect = res.headers.location;
        if (!redirect.startsWith('http')) redirect = urlModule.resolve(targetUrl, redirect);
        return fetchUrl(redirect).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

const pages = [
  'https://kurmagram.com/about-us/',
  'https://kurmagram.com/cow-protection/',
  'https://kurmagram.com/natural-farming/',
  'https://kurmagram.com/traditional-vedic-grukul/',
  'https://kurmagram.com/contact-us/'
];

async function main() {
  for (const p of pages) {
    try {
      console.log(`\n========================================\nPAGE: ${p}`);
      const res = await fetchUrl(p);
      console.log(`Status: ${res.status}, Length: ${res.body.length}`);
      
      // Extract paragraphs
      const pMatches = [...res.body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
        .map(m => m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '))
        .filter(t => t.length > 50);
      
      console.log(`Paragraphs (${pMatches.length}):`);
      pMatches.slice(0, 5).forEach((para, i) => console.log(`  [${i+1}] ${para.substring(0, 200)}...`));

      // Extract images on this page
      const imgs = [...res.body.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)]
        .map(m => m[1])
        .filter(src => src.includes('wp-content/uploads'));
      console.log(`Images found: ${imgs.length}`);
      const uniqueImgs = Array.from(new Set(imgs));
      uniqueImgs.slice(0, 6).forEach(src => console.log(`  - ${src}`));
    } catch (e) {
      console.error('Error fetching ' + p, e.message);
    }
  }
}

main();
