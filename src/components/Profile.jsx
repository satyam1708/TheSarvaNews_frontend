import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Import your local image here
import avatarImage from '../assets/images/anime-8937912_1280.png';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Use the imported local image as avatar
  const avatarUrl = avatarImage;

  // Use environment variable or fallback to localhost
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const fetchBookmarks = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch bookmarks');
        }

        const data = await res.json();
        setBookmarks(data || []);
      } catch (err) {
        setError(err.message || 'Error fetching bookmarks');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user, token, navigate, API_BASE_URL]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow-xl rounded-lg">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-28 h-28 rounded-full shadow-md border-4 border-orange-400 object-cover"
        />
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-orange-600 mb-1">{user.name}</h2>
          <p className="text-gray-700">{user.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Bookmarks */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-orange-600">Your Bookmarks</h3>
        {loading ? (
          <p>Loading bookmarks...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : bookmarks.length === 0 ? (
          <p className="text-gray-500 italic">No bookmarks saved yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="border rounded-md p-4 shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <a
                  href={bm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue-700 hover:underline"
                >
                  {bm.title}
                </a>
                <p className="text-sm text-gray-600 mt-1">{bm.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
