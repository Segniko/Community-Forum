import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import { FaHeart, FaRegHeart, FaTrash, FaEdit, FaShare } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { posts, getPost, likePost, addComment, deletePost } = usePosts();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    console.log('PostDetail - Looking for post ID:', postId);
    
    if (!postId) {
      setLoading(false);
      return;
    }

    try {
      const foundPost = getPost(postId);
      console.log('PostDetail - Found post:', foundPost);

      if (!foundPost) {
        console.log('PostDetail - Post not found');
        toast.error('Post not found');
        navigate('/');
        return;
      }

      setPost(foundPost);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Error loading post');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [postId, getPost, navigate]);

  const handleLike = () => {
    if (!currentUser) {
      toast.error('Please log in to like posts');
      return;
    }
    
    likePost(postId, currentUser.id);
    const updatedPost = getPost(postId);
    setPost(updatedPost);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please log in to comment');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    const commentData = {
      content: comment.trim(),
      author: {
        id: currentUser.id,
        username: currentUser.username,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`
      }
    };
    
    addComment(postId, commentData);
    setComment('');
    const updatedPost = getPost(postId);
    setPost(updatedPost);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deletePost(postId);
    setShowDeleteModal(false);
    navigate('/');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go back home
        </button>
      </div>
    );
  }

  const isAuthor = currentUser?.id === post.author.id;
  const isLiked = post.likes.includes(currentUser?.id || '');

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">
      {/* Post Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={post.author.avatar}
              alt={post.author.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{post.author.username}</p>
              <p className="text-gray-500 text-sm">
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-500"
            >
              {isLiked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
              <span>{post.likes.length}</span>
            </button>
            <button
              onClick={handleShare}
              className="text-gray-600 hover:text-blue-500"
            >
              <FaShare />
            </button>
            {isAuthor && (
              <>
                <button
                  onClick={() => navigate(`/edit/${postId}`)}
                  className="text-gray-600 hover:text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-600 hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Post Content */}
      <div className="prose max-w-none mb-8 dark:prose-invert">
        <ReactMarkdown
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={dracula}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments ({post.comments.length})</h2>
        {currentUser ? (
          <form onSubmit={handleComment} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a comment..."
              rows="3"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p className="mb-6 text-gray-600">
            Please <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/login')}>log in</span> to comment
          </p>
        )}

        <div className="space-y-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.username}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">{comment.author.username}</p>
                  <p className="text-gray-500 text-sm">
                    {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Delete Post</h3>
            <p className="mb-4">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
