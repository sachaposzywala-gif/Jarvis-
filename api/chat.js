export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(200).json({ content: [{ type: 'text', text: 'Bonjour Chef !' }] });
    return;
  }
  const { system, messages } = req.body;
  const all = system ? [{ role: 'system', content: system }, ...messages] : messages;
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY
    },
    body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct:free', messages: all, max_tokens: 300 })
  });
  const d = await r.json();
  const t = d.choices?.[0]?.message?.content || JSON.stringify(d);
  res.status(200).json({ content: [{ type: 'text', text: t }] });
}
