import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { lat, lon, n } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });

    const resp = await axios.get('http://api.open-notify.org/iss-passes.json', {
      params: { lat, lon, n: n || 1 },
      timeout: 10000,
    });

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=119');
    return res.status(200).json(resp.data);
  } catch (err) {
    console.error('Proxy /api/iss-passes error:', err?.message || err);
    return res.status(502).json({ error: 'Failed to fetch ISS passes', details: err?.message || String(err) });
  }
}
