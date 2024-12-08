import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const categoryColors = {
  Announcements: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Guides: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Rules: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  Technology: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Design: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  Development: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  Security: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Questions: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
};

function PostCard({ post }) {
  const {
    id,
    title,
    content,
    author,
    category,
    createdAt,
    votes,
    commentCount
  } = post;

  const categoryColorClass = categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';

  return (
    <Link 
      to={`/post/${id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${category === 'Announcements' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              category === 'Guides' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              category === 'Questions' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}
          >
            {category}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {content}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button 
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <ArrowUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              <span className="text-gray-900 dark:text-white font-medium">{votes}</span>
              <button 
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <ArrowDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>{commentCount} comments</span>
            </div>
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            Posted by {author}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
