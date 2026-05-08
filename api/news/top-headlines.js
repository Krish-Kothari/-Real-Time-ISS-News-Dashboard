import axios from 'axios';

const NEWS_API_BASE = 'https://newsapi.org/v2';
const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY || process.env.NEWS_API_KEY;

export default async function handler(req, res) {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({ error: 'NEWS_API_KEY is not configured' });
    }

    const { category = 'general', country = 'us' } = req.query;
    const resp = await axios.get(`${NEWS_API_BASE}/top-headlines`, {
      params: {
        category,
        country,
        apiKey: NEWS_API_KEY,
        pageSize: 10,
      },
      timeout: 10000,
    });

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(resp.data);
  } catch (err) {
    console.error('Proxy /api/news/top-headlines error:', err?.response?.data || err?.message || err);
    return res.status(502).json({
      error: 'Failed to fetch news headlines',
      details: err?.response?.data || err?.message || String(err),
    });
  }
}
