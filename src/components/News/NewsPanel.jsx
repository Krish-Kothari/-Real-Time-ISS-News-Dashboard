import React, { useEffect, useState } from 'react';
import { useNewsStore } from '../../utils/store.js';
import { newsApi } from '../../utils/newsApi.js';
import { Search, RotateCcw, ExternalLink } from 'lucide-react';

const CATEGORIES = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

export const NewsPanel = () => {
  const {
    articles,
    loading,
    error,
    selectedCategory,
    setArticles,
    setLoading,
    setError,
    setSelectedCategory,
  } = useNewsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');

  // Fetch news articles
  const fetchNews = async (category = selectedCategory, query = '') => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (query) {
        data = await newsApi.searchArticles(query, sortBy);
      } else {
        data = await newsApi.getByCategory(category);
      }

      setArticles(data.articles || []);
    } catch (err) {
      setError('Failed to fetch news articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNews();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNews(selectedCategory, searchQuery);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    fetchNews(category);
  };

  // Filter and sort articles
  let displayedArticles = articles;
  if (sortBy === 'publishedAt') {
    displayedArticles = [...articles].sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="card p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input flex-1"
          />
          <button type="submit" className="btn btn-primary">
            <Search size={20} />
            Search
          </button>
        </div>
      </form>

      {/* Categories */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sort and Refresh */}
      <div className="card p-4 flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input flex-1"
        >
          <option value="publishedAt">Sort by Date (Newest)</option>
          <option value="relevancy">Sort by Relevance</option>
        </select>
        <button onClick={() => fetchNews()} className="btn btn-secondary">
          <RotateCcw size={20} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
          {error}
          <button
            onClick={() => fetchNews()}
            className="ml-2 underline font-semibold hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="skeleton h-6 w-3/4 rounded"></div>
              <div className="skeleton h-4 w-full rounded"></div>
              <div className="skeleton h-4 w-full rounded"></div>
              <div className="skeleton h-32 w-full rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Articles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedArticles.slice(0, 10).map((article, idx) => (
          <article key={idx} className="card overflow-hidden flex flex-col hover:shadow-xl transition-all">
            {/* Image */}
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col">
              <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
                {article.title}
              </h3>

              <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                <div>By {article.author || 'Unknown'}</div>
                <div>{new Date(article.publishedAt).toLocaleDateString()}</div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-3 flex-1">
                {article.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 badge badge-primary">
                  {article.source.name}
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                >
                  <ExternalLink size={16} />
                  Read More
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* No Articles Message */}
      {!loading && displayedArticles.length === 0 && (
        <div className="card p-8 text-center text-slate-600 dark:text-slate-400">
          <p>No articles found. Try searching with different keywords.</p>
        </div>
      )}
    </div>
  );
};

export default NewsPanel;
