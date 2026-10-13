export function aiHandler(env = process.env) {
  return async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const cohere = body.provider === 'cohere';
      if (!['cohere','groq'].includes(body.provider)) return res.status(400).json({ error: 'Unknown provider' });
      const key = cohere ? env.COHERE_API_KEY : env.GROQ_API_KEY;
      if (!key) return res.status(503).json({ code: 'not_configured', error: `${cohere ? 'Cohere' : 'Groq'} is not configured on this server.` });
      if (!cohere && (typeof body.prompt !== 'string' || body.prompt.length > 18000)) return res.status(400).json({ error: 'Invalid prompt' });
      if (cohere && (typeof body.image !== 'string' || !/^data:image\/(png|jpeg|webp);base64,/.test(body.image) || body.image.length > 2800000)) return res.status(400).json({ error: 'Use a PNG, JPEG or WebP image smaller than 2 MB.' });
      const payload = cohere ? { model: env.COHERE_MODEL || 'c4ai-aya-vision-32b', messages: [{ role: 'user', content: [{ type: 'text', text: 'Extract only the visible text from this receipt image. Do not invent any text.' }, { type: 'image_url', image_url: { url: body.image } }] }] }
        : { model: env.GROQ_MODEL || 'llama-3.3-70b-versatile', messages: [{ role:'user',content:body.prompt }], max_tokens: Math.min(Number(body.maxTokens) || 2000, 3000), temperature: .7 };
      const response = await fetch(cohere ? 'https://api.cohere.com/v2/chat' : 'https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(45000) });
      const data = await response.json();
      if (!response.ok) return res.status(502).json({ error: data.message || data.error?.message || 'AI provider request failed.' });
      return res.status(200).json({ text: cohere ? data.message?.content?.filter(item => item.type === 'text').map(item => item.text).join('\n') : data.choices?.[0]?.message?.content });
    } catch { return res.status(502).json({ error: 'AI service timed out or returned an invalid response. Please retry.' }); }
  };
}
export default aiHandler();
