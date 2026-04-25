export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  try {
    const { system, messages } = req.body;
    const all = system ? [{ role: 'system', content: system }, ...messages] : messages;
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: all,
        max_tokens: 300
      })
    });
    const d = await r.json();
    const t = d.choices?.[0]?.message?.content || JSON.stringify(d);
    res.status(200).json({ content: [{ type: 'text', text: t }] });
  } catch(e) {
    res.status(200).json({ content: [{ type: 'text', text: 'ERR: ' + e.message }] });
  }
}
