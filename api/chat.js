export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  try {
    const { system, messages } = req.body;
    const allMessages = system
      ? [{ role: 'system', content: system }, ...messages]
      : messages;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
        'HTTP-Referer': 'https://jarvis-puce-xi.vercel.app',
        'X-Title': 'JARVIS'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: allMessages,
        max_tokens: 500
      }),
    });
    const data = await response.json();
    if (data.error) {
      res.status(200).json({ content: [{ type: 'text', text: 'Erreur API: ' + data.error.message }] });
      return;
    }
    const text = data.choices?.[0]?.message?.content || "Vide.";
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (e) {
    res.status(200).json({ content: [{ type: 'text', text: 'Exception: ' + e.message }] });
  

