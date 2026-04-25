export default async function handler(req, res) {
  res.status(200).json({ content: [{ type: 'text', text: 'Bonjour Chef, je suis opérationnel !' }] });
}
