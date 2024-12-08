import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FaTwitter, FaFacebook, FaLinkedin, FaLink, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export function ShareModal({ url, title, onClose }) {
  const { darkMode } = useTheme();

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className={`w-full max-w-md p-6 rounded-lg shadow-xl ${
          darkMode ? 'bg-[#1a1f2e]' : 'bg-white'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Share Post
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <FaTwitter className="w-6 h-6 text-[#1DA1F2]" />
            <span className="mt-2 text-sm">Twitter</span>
          </a>

          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <FaFacebook className="w-6 h-6 text-[#1877F2]" />
            <span className="mt-2 text-sm">Facebook</span>
          </a>

          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <FaLinkedin className="w-6 h-6 text-[#0A66C2]" />
            <span className="mt-2 text-sm">LinkedIn</span>
          </a>

          <button
            onClick={copyToClipboard}
            className={`flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <FaLink className="w-6 h-6" />
            <span className="mt-2 text-sm">Copy Link</span>
          </button>
        </div>

        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-[#242936]' : 'bg-gray-50'
        }`}>
          <p className={`text-sm mb-2 font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Share via Link
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={url}
              readOnly
              className={`flex-1 px-3 py-2 rounded border ${
                darkMode 
                  ? 'bg-[#1a1f2e] border-gray-600 text-gray-300' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              Copy
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
