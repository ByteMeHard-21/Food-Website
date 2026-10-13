import { createHmac, timingSafeEqual } from 'node:crypto';

export function paymentHandler(env = process.env) {
  return async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });
    const key = env.VITE_RAZORPAY_KEY_ID || '';
    const secret = env.RAZORPAY_KEY_SECRET || '';
    if (!key.startsWith('rk_test_')) return res.status(400).json({ error: 'Only Razorpay Test Mode keys are permitted.' });
    if (!secret) return res.status(503).json({ error: 'Add the matching test RAZORPAY_KEY_SECRET to the server environment, or use dummy checkout.' });
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body.action === 'verify') {
        if (!body.orderId?.startsWith('order_') || !body.paymentId?.startsWith('pay_') || !/^[a-f0-9]{64}$/i.test(body.signature || '')) return res.status(400).json({ error: 'Invalid test payment response' });
        const expected = createHmac('sha256', secret).update(`${body.orderId}|${body.paymentId}`).digest('hex');
        if (!timingSafeEqual(Buffer.from(expected), Buffer.from(body.signature))) return res.status(400).json({ error: 'Test payment signature verification failed' });
        return res.status(200).json({ verified: true, mode: 'test' });
      }
      if (body.action !== 'create' || !['monthly','yearly'].includes(body.cycle)) return res.status(400).json({ error: 'Invalid billing cycle' });
      const amount = Math.round((body.cycle === 'yearly' ? 9590 : 999) * 1.18) * 100;
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}` },
        body: JSON.stringify({ amount, currency: 'INR', receipt: `ob_test_${Date.now()}`, notes: { mode: 'test', cycle: body.cycle } }), signal: AbortSignal.timeout(15000),
      });
      const order = await response.json();
      if (!response.ok) return res.status(502).json({ error: order.error?.description || 'Razorpay could not create a test order.' });
      return res.status(200).json({ id: order.id, amount: order.amount, currency: order.currency, key, mode: 'test' });
    } catch { return res.status(502).json({ error: 'Test payment service unavailable. Please retry or use dummy checkout.' }); }
  };
}
export default paymentHandler();
