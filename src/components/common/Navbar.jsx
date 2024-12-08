import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { FaSun, FaMoon, FaBell, FaTimes } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

function Navbar() {
  const { currentUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { notifications, clearNotification } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`bg-[#141517] fixed w-full top-0 z-50 border-b border-gray-800 ${darkMode ? 'text-white' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className={`text-[#4d9eff] text-lg font-medium ${darkMode ? 'text-white' : ''}`}>Forum</span>
            <span role="img" aria-label="forum" className="text-xl">🟣</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className={`flex items-center space-x-1.5 text-gray-300 hover:text-white ${darkMode ? 'text-white' : ''}`}>
              <span>Home</span>
              <span role="img" aria-label="home">🏠</span>
            </Link>
            <Link to="/create" className={`flex items-center space-x-1.5 text-gray-300 hover:text-white ${darkMode ? 'text-white' : ''}`}>
              <span>Create Post</span>
              <span role="img" aria-label="create">📝</span>
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FaSun className="w-5 h-5 text-yellow-300" />
            ) : (
              <FaMoon className="w-5 h-5 text-yellow-300" />
            )}
          </button>

          {/* Notification Button & Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`text-yellow-300 p-1 relative ${darkMode ? 'text-white' : ''}`}
            >
              <FaBell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg py-1 ${darkMode ? 'bg-[#1a1f2e] text-white' : 'bg-white text-gray-900'} border border-gray-200 dark:border-gray-700`}>
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  {notifications.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {notifications.length} new
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`px-4 py-3 flex justify-between items-start hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <Link
            to="/login"
            className={`px-4 py-1.5 bg-[#4d9eff] text-white rounded-lg hover:bg-blue-500 flex items-center space-x-1.5 ${darkMode ? 'hover:bg-blue-600' : ''}`}
          >
            <span>Login</span>
            <span>⚡</span>
          </Link>
          <Link
            to="/register"
            className={`px-4 py-1.5 bg-[#8b5cf6] text-white rounded-lg hover:bg-purple-500 flex items-center space-x-1.5 ${darkMode ? 'hover:bg-purple-600' : ''}`}
          >
            <span>Register</span>
            <span>📝</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
