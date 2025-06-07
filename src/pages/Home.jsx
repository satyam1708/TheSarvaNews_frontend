import React, { useEffect, useState } from 'react';
import TheSarvaNewsHeader from './TheSarvaNewsHeader';
import { Helmet } from 'react-helmet';
export default function Home() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const today = new Date().toISOString().split('T')[0];

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [selectedDate, setSelectedDate] = useState(today);
  const [topic, setTopic] = useState('general');
  const [mode, setMode] = useState('search');

  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');

      try {
        let url = new URL(`${API_BASE_URL}/api/news`);

        if (mode === 'top-headlines') {
          url.searchParams.append('mode', 'top-headlines');
          url.searchParams.append('category', topic);
          url.searchParams.append('country', 'in');
          url.searchParams.append('language', 'en');
        } else {
          url.searchParams.append('mode', 'search');
          url.searchParams.append('keyword', 'India');
          url.searchParams.append('date', selectedDate);
          url.searchParams.append('category', topic);
          url.searchParams.append('country', 'in');
          url.searchParams.append('language', 'en');
        }

        const res = await fetch(url.toString());
        const data = await res.json();

        if (data.articles && data.articles.length > 0) {
          setNews(data.articles);
        } else {
          setNews([]);
          setError('No news found for the selected filters.');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setNews([]);
        setError('Failed to fetch news. Please try again.');
      }
      setLoading(false);
    };

    fetchNews();
  }, [selectedDate, topic, mode, API_BASE_URL]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_BASE_URL}/api/bookmarks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const ids = new Set(data.map(bm => bm.url));
        setBookmarkedIds(ids);
      })
      .catch(err => {
        console.error('Failed to fetch bookmarks:', err);
      });
  }, [API_BASE_URL]);

  const openModal = (article) => {
    setActiveArticle(article);
    setModalOpen(true);
    setShowLoginPrompt(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveArticle(null);
    setShowLoginPrompt(false);
  };

  const handleLoginClick = () => {
    // Redirect to login page or open login modal (adjust URL as needed)
    window.location.href = '/login';
  };

  const toggleBookmark = async (article) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    const isBookmarked = bookmarkedIds.has(article.url);

    try {
      if (isBookmarked) {
        await fetch(`${API_BASE_URL}/api/bookmarks`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url: article.url }),
        });
        setBookmarkedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(article.url);
          return newSet;
        });
      } else {
        await fetch(`${API_BASE_URL}/api/bookmarks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: article.title,
            url: article.url,
            description: article.description,
            source: article.source?.name,
            publishedAt: article.publishedAt,
            image: article.image,
          }),
        });
        setBookmarkedIds(prev => new Set(prev).add(article.url));
      }
      setShowLoginPrompt(false);
    } catch (error) {
      console.error('Error updating bookmark:', error);
      alert('Failed to update bookmark. Please try again.');
    }
  };

  const saveCombinedImage = (article) => {
    alert(`Save combined image for: ${article.title}`);
  };

  return (
    <div className="p-4">
      <Helmet>
        <title>TheSarvaNews — All News, One Place</title>
        <meta
          name="description"
          content="TheSarvaNews - All News, One Place. Get the latest headlines and stories from around the world."
        />
      </Helmet>
      <TheSarvaNewsHeader />

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        <input
          type="date"
          className="border px-3 py-2 rounded-md text-black"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={today}
          disabled={mode === 'top-headlines'}
        />

        {mode === 'top-headlines' && (
          <select
            className="border px-3 py-2 rounded-md text-black"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="general">General</option>
            <option value="technology">Technology</option>
            <option value="sports">Sports</option>
            <option value="business">Business</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="entertainment">Entertainment</option>
          </select>
        )}

        <select
          className="border px-3 py-2 rounded-md text-black"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="search">Search by Date</option>
          <option value="top-headlines">Top Headlines</option>
        </select>
      </div>

      {mode === 'search' && (
        <p className="text-center text-sm text-gray-600 mb-4">
          Showing news for <strong>{selectedDate}</strong>
        </p>
      )}

      {loading ? (
        <p className="text-center text-xl">Loading news...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-lg">{error}</p>
      ) : news.length === 0 ? (
        <p className="text-center text-xl">No news found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              {article.image && (
                <img
                  src={article.image}
                  alt="news"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-black">
                  {article.title}
                </h2>
                <p className="text-gray-700 text-sm mb-2">{article.description}</p>

                <div className="mt-auto flex gap-2 flex-wrap">
                  <button
                    onClick={() => openModal(article)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 text-sm underline self-center"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && activeArticle && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            {showLoginPrompt ? (
              <div className="flex flex-col items-center justify-center p-10">
                <p className="text-xl mb-4 text-red-600 font-semibold">
                  You need to be logged in to bookmark articles.
                </p>
                <button
                  onClick={handleLoginClick}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Login
                </button>
              </div>
            ) : (
              <>
                {activeArticle.image && (
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full max-h-60 object-cover rounded mb-4"
                  />
                )}

                <h2 className="text-2xl font-bold mb-2">{activeArticle.title}</h2>
                <p className="mb-4 text-gray-700">
                  {activeArticle.content || activeArticle.description}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <strong>Author:</strong> {activeArticle.author || 'Unknown'}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Source:</strong> {activeArticle.source?.name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Published:</strong>{' '}
                  {activeArticle.publishedAt
                    ? new Date(activeArticle.publishedAt).toLocaleString()
                    : 'Unknown'}
                </p>

                <div className="flex gap-4 flex-wrap">
                  <a
                    href={activeArticle.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline self-center"
                  >
                    Read full article on original site →
                  </a>

                  {activeArticle.image && (
                    <button
                      onClick={() => saveCombinedImage(activeArticle)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Save Article Image & Details
                    </button>
                  )}

                  <button
                    onClick={() => toggleBookmark(activeArticle)}
                    className={`px-3 py-1 rounded transition ${
                      bookmarkedIds.has(activeArticle.url)
                        ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                        : 'bg-gray-300 text-black hover:bg-gray-400'
                    }`}
                  >
                    {bookmarkedIds.has(activeArticle.url)
                      ? 'Remove Bookmark'
                      : 'Bookmark'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
