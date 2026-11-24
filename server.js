'use strict';

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Map of functions
const functions = {
  'create-order':  require('./netlify/functions/create-order').handler,
  'admin-login':   require('./netlify/functions/admin-login').handler,
  'list-orders':   require('./netlify/functions/list-orders').handler,
  'track-order':   require('./netlify/functions/track-order').handler,
  'mark-shipped':  require('./netlify/functions/mark-shipped').handler,
  'get-order':     require('./netlify/functions/get-order').handler,
  'get-products':  require('./netlify/functions/get-products').handler,
  'update-status': require('./netlify/functions/update-status').handler,
};

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Check if request is for a function (supports both /.netlify/functions/<name> and /api/<name>)
  let funcName = null;
  if (pathname.startsWith('/.netlify/functions/')) {
    funcName = pathname.replace('/.netlify/functions/', '').split('/')[0];
  } else if (pathname.startsWith('/api/')) {
    funcName = pathname.replace('/api/', '').split('/')[0];
  }

  if (funcName && functions[funcName]) {
    // Read request body
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      const body = Buffer.concat(chunks).toString('utf8');

      // Convert Node http request into Netlify function event format
      const event = {
        httpMethod: req.method,
        headers: req.headers || {},
        queryStringParameters: parsedUrl.query || {},
        body: body || null,
        isBase64Encoded: false,
      };

      try {
        const result = await functions[funcName](event);
        const headers = result.headers || {};
        
        // Write status and headers
        res.writeHead(result.statusCode || 200, headers);
        res.end(result.body || '');
      } catch (err) {
        console.error(`[Server] Error executing function ${funcName}:`, err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message || 'Internal server error' }));
      }
    });
    return;
  }

  // Otherwise, serve static files from /public
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Prevent directory traversal
  const safePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Check if appending .html helps
      const htmlPath = safePath + '.html';
      if (fs.existsSync(htmlPath)) {
        serveFile(htmlPath, res);
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    serveFile(safePath, res);
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

server.listen(PORT, () => {
  console.log(`\n🌾 Kurmagramamu Local Server is running!`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${PUBLIC_DIR}`);
  console.log(`⚡ API functions mounted at: /.netlify/functions/* & /api/*\n`);
});
