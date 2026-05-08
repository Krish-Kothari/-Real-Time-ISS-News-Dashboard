import axios from 'axios';

export default async function handler(req, res) {
  try {
    const resp = await axios.get('http://api.open-notify.org/astros.json', { timeout: 10000 });
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=119');
    return res.status(200).json(resp.data);
  } catch (err) {
    console.error('Proxy /api/astros error:', err?.message || err);
    return res.status(502).json({ error: 'Failed to fetch people in space', details: err?.message || String(err) });
  }
}
