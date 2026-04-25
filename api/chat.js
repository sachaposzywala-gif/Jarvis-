export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(200).json({ content: [{ type: 'text', text: 'API OK' }] }); return; }
  const { system, messages } = req.body || {};
  if (!messages) { res.status(200).json({ content: [{ type: 'text', text: 'Pas de messages.' }] }); return; }
  const allMessages = system ? [{ role: 'system', content: system }, ...messages] : messages;
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
      'HTTP-Referer': 'https://jarvis-puce-xi.vercel.app',
      'X-Title': 'JARVIS'
    },
    body: JSON.stringify({ model: 'deepseek/deepseek-chat:free
', messages: allMessages, max_tokens: 500 }),
  });
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || JSON.stringify(data.error || 'Vide');
  res.status(200).json({ content: [{ type: 'text', text }] });
}
