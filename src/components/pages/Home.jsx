import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../context/PostContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FaSearch, FaFilter, FaTimes, FaHeart, FaComment, FaEye } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();
  const { posts } = usePosts();
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Discussion', 'Question', 'Tutorial', 'Announcement'];

  const filteredAndSortedPosts = useMemo(() => {
    console.log('Available posts:', posts);
    let result = [...posts];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(post => post.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'mostLiked':
        result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        break;
      case 'mostCommented':
        result.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        break;
      default:
        break;
    }

    return result;
  }, [posts, searchTerm, selectedCategory, sortBy]);

  const handlePostClick = (postId) => {
    console.log('Clicking post with ID:', postId);
    navigate(`/post/${postId}`);
  };

  return (
    <div className={`min-h-screen pt-20 px-4 pb-12 ${darkMode ? 'bg-[#141517]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Bar */}
        <div className={`mb-8 p-4 rounded-lg shadow-md ${darkMode ? 'bg-[#1a1f2e]' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-[#242936] border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaFilter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-[#242936] border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-[#242936] border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="mostLiked">Most Liked</option>
                    <option value="mostCommented">Most Commented</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPosts.length > 0 ? (
            filteredAndSortedPosts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handlePostClick(post.id)}
                className={`rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all ${
                  darkMode ? 'bg-[#1a1f2e] hover:bg-[#1e2538]' : 'bg-white hover:bg-gray-50'
                }`}
              >
                {/* Post Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {post.author.username}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      post.category === 'Discussion' ? 'bg-blue-100 text-blue-600' :
                      post.category === 'Question' ? 'bg-green-100 text-green-600' :
                      post.category === 'Tutorial' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    } ${darkMode ? 'opacity-75' : ''}`}>
                      {post.category}
                    </span>
                  </div>

                  {/* Post Content */}
                  <h2 className={`text-xl font-semibold mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {post.title}
                  </h2>
                  <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {post.content}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`text-sm px-2 py-1 rounded-full ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className={`flex items-center space-x-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex items-center space-x-2">
                      <FaHeart className="w-4 h-4" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaComment className="w-4 h-4" />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaEye className="w-4 h-4" />
                      <span>{Math.floor(Math.random() * 1000)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={`col-span-3 text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="text-lg font-medium">No posts found</p>
              <p className="mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
