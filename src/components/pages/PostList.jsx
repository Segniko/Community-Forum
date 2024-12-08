import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePost } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon as BookmarkOutline
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import DOMPurify from 'dompurify';

function PostList() {
  const { posts, loading, categories, hasMore, loadMore, votePost, toggleBookmark, searchPosts } = usePost();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const observer = useRef();

  const lastPostRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const filters = {
        category: selectedCategory !== 'All' ? selectedCategory : undefined
      };
      const results = await searchPosts(searchQuery, filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVote = async (postId, voteType) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }
    await votePost(postId, voteType);
  };

  const handleBookmark = async (postId) => {
    if (!user) {
      toast.error('Please sign in to bookmark posts');
      return;
    }
    await toggleBookmark(postId);
  };

  const getDisplayPosts = () => {
    const displayPosts = searchQuery ? searchResults : posts;
    
    let filteredPosts = selectedCategory === 'All'
      ? displayPosts
      : displayPosts.filter(post => post.category === selectedCategory);

    // Sort posts
    return [...filteredPosts].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostVoted':
          return b.votes - a.votes;
        case 'mostCommented':
          return b.commentCount - a.commentCount;
        default:
          return 0;
      }
    });
  };

  const truncateContent = (content) => {
    const cleanContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
    return cleanContent.length > 200
      ? cleanContent.substring(0, 200) + '...'
      : cleanContent;
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="input-field pl-10 w-full"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <Link to="/create-post" className="btn-primary whitespace-nowrap">
            Create Post
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedCategory === 'All'
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <select
            className="input-field"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostVoted">Most Voted</option>
            <option value="mostCommented">Most Commented</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {loading && !searchQuery ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : getDisplayPosts().length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? 'No posts found matching your search'
                : 'No posts available'}
            </p>
          </div>
        ) : (
          getDisplayPosts().map((post, index) => {
            const isLastPost = index === getDisplayPosts().length - 1;
            
            return (
              <div
                key={post.id}
                ref={isLastPost ? lastPostRef : null}
                className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4"
              >
                <div className="flex gap-4">
                  <div className="flex flex-col items-center space-y-1">
                    <button
                      onClick={() => handleVote(post.id, 'up')}
                      className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        post.votedBy?.includes(user?.uid)
                          ? 'text-primary-500'
                          : 'text-gray-400'
                      }`}
                    >
                      <ChevronUpIcon className="h-6 w-6" />
                    </button>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {post.votes}
                    </span>
                    <button
                      onClick={() => handleVote(post.id, 'down')}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                    >
                      <ChevronDownIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-primary-500">
                        {post.category}
                      </span>
                      <span>•</span>
                      <span>Posted by {post.author}</span>
                      <span>•</span>
                      <span>
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>

                    <Link
                      to={`/post/${post.id}`}
                      className="block mt-2 group"
                    >
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-500">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {truncateContent(post.content)}
                      </p>
                    </Link>

                    <div className="mt-4 flex items-center gap-6">
                      <Link
                        to={`/post/${post.id}#comments`}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        <span>{post.commentCount} comments</span>
                      </Link>

                      <button
                        onClick={() => handleBookmark(post.id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {post.bookmarks?.includes(user?.uid) ? (
                          <BookmarkSolid className="h-5 w-5 text-primary-500" />
                        ) : (
                          <BookmarkOutline className="h-5 w-5" />
                        )}
                        <span>
                          {post.bookmarks?.includes(user?.uid)
                            ? 'Bookmarked'
                            : 'Bookmark'}
                        </span>
                      </button>
                    </div>

                    {post.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!loading && hasMore && !searchQuery && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 text-primary-600 hover:text-primary-500"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default PostList;
