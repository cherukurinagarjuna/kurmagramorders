const https = require('https');

https.get('https://kurmagram.com/gallery/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const regex = /https:\/\/kurmagram\.com\/wp-content\/uploads\/[^\s"']+\.(?:jpg|jpeg|png|webp)/gi;
    const matches = b.match(regex) || [];
    const unique = Array.from(new Set(matches));
    console.log(`Gallery images count: ${unique.length}`);
    unique.slice(0, 25).forEach(img => console.log(' - ' + img));
  });
}).on('error', e => console.error(e.message));
