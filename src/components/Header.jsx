import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-50 px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-orange-600 dark:text-orange-400 text-xl font-extrabold">
        TheSarvaNews
      </Link>
      <nav className="space-x-4 text-gray-700 dark:text-gray-300 font-medium flex items-center">
        <Link to="/" className="hover:text-orange-600 dark:hover:text-orange-400">Home</Link>
        <Link to="/contact" className="hover:text-orange-600 dark:hover:text-orange-400">Contact</Link>
        <Link to="/services" className="hover:text-orange-600 dark:hover:text-orange-400">Services</Link>
        {user ? (
          <>
            <Link to="/profile" className="hover:text-orange-600 dark:hover:text-orange-400">Profile</Link>
            <Link to="/bookmarks" className="hover:text-orange-600 dark:hover:text-orange-400">Bookmarks</Link>
            <button
              onClick={logout}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600 ml-2"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-orange-600 dark:hover:text-orange-400">Login</Link>
        )}
        <DarkModeToggle />
      </nav>
    </header>
  );
}

export default Header;
