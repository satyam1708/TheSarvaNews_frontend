import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const NewsCard = ({ article }) => {
  const { user, token } = useContext(AuthContext);
  const [bookmarked, setBookmarked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if (!user) {
      setError('Please login to bookmark articles.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.image,
          publishedAt: article.publishedAt,
          source: article.source?.name || '',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to bookmark the article.');
      }

      setBookmarked(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>

      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full max-h-48 object-cover rounded-md mb-3"
        />
      )}

      <p className="text-gray-700 mb-2">{article.description}</p>

      <p className="text-xs text-gray-500 mb-3">
        {article.source?.name} — {new Date(article.publishedAt).toLocaleString()}
      </p>

      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="text-orange-600 hover:underline mb-3 inline-block"
      >
        Read more
      </a>

      <div>
        <button
          onClick={handleBookmark}
          disabled={bookmarked || loading}
          className={`px-4 py-2 rounded-md text-white ${
            bookmarked
              ? 'bg-green-600 cursor-default'
              : 'bg-orange-600 hover:bg-orange-700'
          } focus:outline-none focus:ring-2 focus:ring-orange-400`}
        >
          {loading ? 'Saving...' : bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default NewsCard;
