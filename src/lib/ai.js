export async function requestAI(prompt, maxTokens, fallback) {
  const response = await fetch('/api/ai', { method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({provider:'groq',prompt,maxTokens}) });
  const data = await response.json();
  if (data.code === 'not_configured' && fallback) return JSON.stringify(await fallback());
  if (!response.ok) throw new Error(data.error || 'AI generation failed');
  return String(data.text || '').replace(/```json|```/g,'').trim();
}
