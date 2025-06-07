import React, { useEffect, useState } from 'react';
import TheSarvaNewsHeader from './TheSarvaNewsHeader';

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [topic, setTopic] = useState('general');
  const [mode, setMode] = useState('search');

  const API_KEY = '9e2a5e901da419d97a6ca0ad0619085d';

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        let url = '';
        if (mode === 'search') {
          const keyword = 'India';
          const from = `${selectedDate}T00:00:00Z`;
          const to = `${selectedDate}T23:59:59Z`;

          url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            keyword
          )}&lang=en&from=${from}&to=${to}&sortby=publishedAt&token=${API_KEY}`;
        } else {
          url = `https://gnews.io/api/v4/top-headlines?country=in&lang=en&topic=${topic}&token=${API_KEY}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.articles && data.articles.length > 0) {
          setNews(data.articles);
        } else if (mode === 'search') {
          setNews([]);
          setError('No news found for the selected date.');
        } else {
          setNews([]);
          setError('No news found.');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setNews([]);
        setError('Failed to fetch news. Please try again.');
      }
      setLoading(false);
    };

    fetchNews();
  }, [selectedDate, topic, mode]);

  const openModal = (article) => {
    setActiveArticle(article);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveArticle(null);
  };

  // Save combined image + text details as one image
  const saveCombinedImage = (article) => {
    if (!article.image) {
      alert('No image to combine and save.');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous'; // Important for CORS - might fail if source doesn't allow
    img.src = article.image;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Limit max width for canvas
      const maxWidth = 600;
      const scaleRatio = Math.min(maxWidth / img.width, 1);
      const imgWidth = img.width * scaleRatio;
      const imgHeight = img.height * scaleRatio;

      // Canvas size: image height + extra for text
      canvas.width = imgWidth;
      canvas.height = imgHeight + 220; // space for text

      // Draw the image
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

      // White background for text
      ctx.fillStyle = 'white';
      ctx.fillRect(0, imgHeight, canvas.width, 220);

      // Text styles
      ctx.fillStyle = 'black';
      ctx.textBaseline = 'top';

      const padding = 10;
      let y = imgHeight + padding;
      const maxTextWidth = canvas.width - 2 * padding;

      // Helper to draw wrapped text
      const drawTextWrapped = (text, x, y, maxWidth, lineHeight) => {
        ctx.font = 'bold 18px Arial';
        const words = text.split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, y);
        return y + lineHeight;
      };

      // Draw Title (bold, wrapped)
      y = drawTextWrapped(article.title || 'No title', padding, y, maxTextWidth, 22);

      // Draw Author and Source (normal font)
      ctx.font = '14px Arial';
      y += 5;
      ctx.fillText(`Author: ${article.author || 'Unknown'}`, padding, y);
      y += 20;
      ctx.fillText(`Source: ${article.source?.name || 'Unknown'}`, padding, y);
      y += 20;

      // Draw Description or content wrapped
      ctx.font = 'normal 14px Arial';
      y = drawTextWrapped(
        article.description || article.content || 'No description',
        padding,
        y,
        maxTextWidth,
        18
      );

      // Export canvas to image and trigger download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Sanitize filename
        const safeTitle = (article.title || 'article').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `${safeTitle}_combined.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    };

    img.onerror = () => {
      alert('Failed to load article image for saving.');
    };
  };

  return (
    <div className="p-4">
      <TheSarvaNewsHeader/>

      {/* Filters */}
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
            <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              {article.image && (
                <img src={article.image} alt="news" className="w-full h-48 object-cover" />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-black">{article.title}</h2>
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

            {activeArticle.image && (
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full max-h-60 object-cover rounded mb-4"
              />
            )}

            <h2 className="text-2xl font-bold mb-2">{activeArticle.title}</h2>
            <p className="mb-4 text-gray-700">{activeArticle.content || activeArticle.description}</p>

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

            <div className="flex gap-4">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
