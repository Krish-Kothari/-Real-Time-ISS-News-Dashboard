import axios from 'axios';

export default async function handler(req, res) {
  try {
    const resp = await axios.get('http://api.open-notify.org/iss-now.json', { timeout: 10000 });
    // cache briefly at CDN edge
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');
    return res.status(200).json(resp.data);
  } catch (err) {
    console.error('Proxy /api/iss-now error:', err?.message || err);
    return res.status(502).json({ error: 'Failed to fetch ISS location', details: err?.message || String(err) });
  }
}
