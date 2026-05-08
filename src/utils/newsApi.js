import axios from 'axios';

const NEWS_API_BASE = 'https://newsapi.org/v2';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const USE_SERVERLESS_PROXY = import.meta.env.PROD;
const PROXY_BASE = '/api/news';

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const newsApi = {
  // Get top headlines
  getTopHeadlines: async (category = 'general', country = 'us') => {
    try {
      if (USE_SERVERLESS_PROXY) {
        const response = await axios.get(`${PROXY_BASE}/top-headlines`, {
          params: { category, country },
        });
        return response.data;
      }

      // Check cache first
      const cacheKey = `news_${category}_${country}`;
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}_time`);

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < CACHE_DURATION) {
        return JSON.parse(cached);
      }

      const response = await axios.get(`${NEWS_API_BASE}/top-headlines`, {
        params: {
          category,
          country,
          apiKey: NEWS_API_KEY,
          pageSize: 10,
        },
      });

      // Store in cache
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());

      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Search news articles
  searchArticles: async (query, sortBy = 'publishedAt') => {
    try {
      if (USE_SERVERLESS_PROXY) {
        const response = await axios.get(`${PROXY_BASE}/everything`, {
          params: { q: query, sortBy },
        });
        return response.data;
      }

      const response = await axios.get(`${NEWS_API_BASE}/everything`, {
        params: {
          q: query,
          sortBy,
          apiKey: NEWS_API_KEY,
          pageSize: 20,
          language: 'en',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  },

  // Get articles by category
  getByCategory: async (category = 'general') => {
    return newsApi.getTopHeadlines(category, 'us');
  },
};

export default newsApi;
