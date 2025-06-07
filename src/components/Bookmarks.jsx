import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


const Bookmarks = () => {
  const { user, token } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchBookmarks = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
          headers: {
            Authorization: `Bearer ${token || user.token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch bookmarks');

        const data = await res.json();
        setBookmarks(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user, token]);

  useEffect(() => {
    if (!user) return;

    const fetchNews = async () => {
      setNewsLoading(true);
      setNewsError('');
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/news?mode=top-headlines&lang=en&country=us&max=5`
        );

        if (!res.ok) throw new Error('Failed to fetch latest news');

        const data = await res.json();
        setNews(data.articles || []);
      } catch (err) {
        setNewsError(err.message || 'Failed to load news');
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, [user]);

  const handleAddBookmark = async (article) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || user.token}`,
        },
        body: JSON.stringify({
          url: article.url,
          title: article.title,
          description: article.description || '',
          image: article.image || '',
          publishedAt: article.publishedAt || '',
          source: article.source?.name || '',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to add bookmark');
      }

      setBookmarks((prev) => [
        ...prev,
        {
          id: article.url,
          url: article.url,
          title: article.title,
          description: article.description || '',
          image: article.image || '',
          publishedAt: article.publishedAt || '',
          source: article.source?.name || '',
        },
      ]);
    } catch (err) {
      setError(err.message || 'Failed to add bookmark');
    }
  };

  const handleDelete = async (url) => {
    if (!window.confirm('Are you sure you want to remove this bookmark?')) return;

    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || user.token}`,
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to delete bookmark');
      }

      setBookmarks((prev) => prev.filter((b) => b.url !== url));
    } catch (err) {
      setError(err.message || 'Failed to remove bookmark');
    }
  };

  if (!user) return <p className="text-center text-gray-600 mt-10">Please login to see bookmarks.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-20 px-4">
      <h2 className="text-2xl font-semibold mb-6 text-orange-600">Your Bookmarks</h2>

      {error && (
        <p className="text-red-500 mb-4 border border-red-200 p-2 rounded bg-red-50">{error}</p>
      )}

      {loading ? (
        <p className="text-gray-600">Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <p className="text-gray-500 italic">No bookmarks yet.</p>
      ) : (
        <div className="grid gap-4 mb-10">
          {bookmarks.map(({ id, title, description, url }) => (
            <div
              key={id}
              className="p-4 border border-gray-200 rounded-md shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
              <p className="text-gray-600 mt-1">{description}</p>
              <div className="mt-3 flex items-center justify-between">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-500 hover:underline"
                >
                  Read more
                </a>
                <button
                  onClick={() => handleDelete(url)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition"
                  aria-label={`Remove bookmark for ${title}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-6 text-orange-600">Latest News</h2>

      {newsError && (
        <p className="text-red-500 mb-4 border border-red-200 p-2 rounded bg-red-50">{newsError}</p>
      )}

      {newsLoading ? (
        <p className="text-gray-600">Loading latest news...</p>
      ) : news.length === 0 ? (
        <p className="text-gray-500 italic">No news available.</p>
      ) : (
        <div className="grid gap-4">
          {news.map((article) => {
            const isBookmarked = bookmarks.some((b) => b.url === article.url);
            return (
              <div
                key={article.url}
                className="p-4 border border-gray-200 rounded-md shadow-sm bg-white hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-blue-700">{article.title}</h3>
                <p className="text-gray-600 mt-1">{article.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-500 hover:underline"
                  >
                    Read more
                  </a>
                  <button
                    onClick={() => handleAddBookmark(article)}
                    disabled={isBookmarked}
                    className={`text-sm px-3 py-1 rounded transition ${
                      isBookmarked
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                    aria-label={`Add bookmark for ${article.title}`}
                  >
                    {isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
