'use strict';

// Adapt Netlify-style handler (event => { statusCode, headers, body }) to Vercel/Node (req, res)
function vercelAdapter(netlifyHandler) {
  return async function (req, res) {
    const event = {
      httpMethod: req.method,
      headers: req.headers || {},
      queryStringParameters: req.query || {},
      body: typeof req.body === 'object' ? JSON.stringify(req.body) : (req.body || '{}'),
    };

    try {
      const result = await netlifyHandler(event);
      const headers = result.headers || {};
      for (const [key, val] of Object.entries(headers)) {
        res.setHeader(key, val);
      }
      res.status(result.statusCode || 200);
      try {
        const parsed = JSON.parse(result.body);
        return res.json(parsed);
      } catch {
        return res.send(result.body);
      }
    } catch (err) {
      console.error('[adapter error]', err);
      return res.status(500).json({ ok: false, error: err.message || 'Server error' });
    }
  };
}

module.exports = { vercelAdapter };
