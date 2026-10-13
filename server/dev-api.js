import { paymentHandler } from '../api/test-payment.js';
import { aiHandler } from '../api/ai.js';

export function localApi(env) {
  const handlers = { '/api/test-payment': paymentHandler(env), '/api/ai': aiHandler(env) };
  const install = server => { server.middlewares.use(async (req, res, next) => {
    const handler = handlers[req.url?.split('?')[0]];
    if (!handler) return next();
    res.status = code => { res.statusCode = code; return res; };
    res.json = object => { res.setHeader('Content-Type','application/json'); res.end(JSON.stringify(object)); };
    let body = '';
    try {
      for await (const chunk of req) { body += chunk; if (body.length > 3000000) { res.status(413).json({ error: 'Request too large' }); return; } }
      req.body = body ? JSON.parse(body) : {};
      await handler(req, res);
    } catch { if (!res.writableEnded) res.status(400).json({ error: 'Invalid request body' }); }
  }); };
  return { name: 'originbite-local-api', configureServer: install, configurePreviewServer: install };
}
