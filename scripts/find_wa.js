const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
const links = [];
const regex = /<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  if (m[1].includes('wa') || m[1].includes('7732075607') || m[1].includes('api.whatsapp.com')) {
    links.push({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim().slice(0, 40) });
  }
}
console.log('WhatsApp links found:', links);
