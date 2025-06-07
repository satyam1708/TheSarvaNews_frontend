import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function NewsList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarkingIds, setBookmarkingIds] = useState(new Set());
  const { user, token } = useContext(AuthContext);

  // Use environment variable for API base URL or fallback
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/news?mode=top-headlines&category=general&language=en&country=in`
        );
        setArticles(res.data.articles || []);
      } catch (err) {
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [API_BASE_URL]);

  const handleBookmark = async (article) => {
    if (!user) {
      alert('Please login to bookmark articles.');
      return;
    }

    setBookmarkingIds((prev) => new Set(prev).add(article.url));
    try {
      await axios.post(
        `${API_BASE_URL}/api/bookmarks`,
        {
          title: article.title,
          url: article.url,
          description: article.description,
          image: article.image,
          publishedAt: article.publishedAt,
          source: article.source?.name || '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Article bookmarked!');
    } catch (error) {
      console.error('Failed to bookmark:', error.message);
      alert('Error saving bookmark.');
    } finally {
      setBookmarkingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(article.url);
        return updated;
      });
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading news...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-semibold mb-4">Top Headlines</h2>
      {articles.length === 0 ? (
        <p className="text-center text-gray-500">No news articles found.</p>
      ) : (
        articles.map((article, idx) => (
          <div
            key={idx}
            className="p-4 rounded-md shadow-md border bg-white hover:shadow-lg transition"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-blue-700 hover:underline"
            >
              {article.title}
            </a>
            <p className="text-gray-700 text-sm mt-2">{article.description}</p>
            {user && (
              <button
                onClick={() => handleBookmark(article)}
                disabled={bookmarkingIds.has(article.url)}
                className={`mt-3 px-4 py-1 rounded text-white ${
                  bookmarkingIds.has(article.url)
                    ? 'bg-green-500 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {bookmarkingIds.has(article.url) ? 'Saving...' : 'Bookmark'}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default NewsList;
