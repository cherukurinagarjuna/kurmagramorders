const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
require('dotenv').config();

// Prevent unhandled errors or PG connection drops from crashing the server
process.on('uncaughtException', (err) => {
  console.warn('[server uncaughtException caught]', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.warn('[server unhandledRejection caught]', (reason && reason.message) || reason);
});

const PORT = 3000;
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.webp': 'image/webp',
  '.avif': 'image/avif'
};

const server = http.createServer((req, res) => {
  // Handle API routes: /api/* and /.netlify/functions/*
  if (req.url.startsWith('/api/') || req.url.startsWith('/.netlify/functions/')) {
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let fnName = urlObj.pathname.replace(/^\/(?:api|\.netlify\/functions)\//, '');
    fnName = fnName.split('/')[0];
    const fnPath = path.join(ROOT, 'netlify', 'functions', `${fnName}.js`);

    if (fs.existsSync(fnPath)) {
      let bodyData = '';
      req.on('data', chunk => { bodyData += chunk; });
      req.on('end', async () => {
        try {
          delete require.cache[require.resolve(fnPath)];
          const { handler } = require(fnPath);
          const event = {
            httpMethod: req.method,
            path: urlObj.pathname,
            headers: req.headers,
            queryStringParameters: Object.fromEntries(urlObj.searchParams.entries()),
            body: bodyData
          };
          const result = await handler(event);
          const resHeaders = Object.assign({ 'Content-Type': 'application/json' }, result.headers || {});
          res.writeHead(result.statusCode || 200, resHeaders);
          res.end(result.body || '');
        } catch (err) {
          console.error(`API Error in ${fnName}:`, err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: err.message }));
        }
      });
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: false, error: `Function ${fnName} not found` }));
    }
  }

  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  
  const candidates = [
    path.join(ROOT, 'dist', reqPath),
    path.join(ROOT, 'dist', reqPath + '.html'),
    path.join(ROOT, reqPath),
    path.join(ROOT, reqPath + '.html')
  ];

  let resolvedFile = null;
  for (const c of candidates) {
    if (c.startsWith(ROOT) && fs.existsSync(c) && fs.statSync(c).isFile()) {
      resolvedFile = c;
      break;
    }
  }

  if (!resolvedFile) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not Found: ' + reqPath);
  }

  const ext = path.extname(resolvedFile).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  const headers = { 
    'Content-Type': contentType,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  const acceptEncoding = req.headers['accept-encoding'] || '';
  const isCompressible = ['.html', '.css', '.js', '.json', '.svg'].includes(ext);

  if (isCompressible && acceptEncoding.includes('gzip')) {
    headers['Content-Encoding'] = 'gzip';
    res.writeHead(200, headers);
    fs.createReadStream(resolvedFile).pipe(zlib.createGzip()).pipe(res);
  } else {
    res.writeHead(200, headers);
    fs.createReadStream(resolvedFile).pipe(res);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server listening on http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
});
