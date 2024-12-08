import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store';
import { useNotificationStore } from '../../store/notificationStore';
import { motion } from 'framer-motion';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useStore();
  const unreadCount = useNotificationStore(state => state.getUnreadCount());

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Forum ☀️
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all"
              >
                Home 🏠
              </Link>
              <Link
                to="/create-post"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all"
              >
                Create Post ✍️
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  👤 {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-red-500/25"
                >
                  Logout 👋
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  Login 🔑
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/25"
                >
                  Register 📝
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
