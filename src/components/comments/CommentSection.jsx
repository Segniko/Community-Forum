import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  increment
} from 'firebase/firestore';
import { format } from 'date-fns';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
  PencilSquareIcon,
  ReplyIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';

function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setComments(fetchedComments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    const text = commentText.trim();
    if (!text) return;

    try {
      const comment = {
        postId,
        content: text,
        author: user.displayName,
        authorId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        votes: 0,
        votedBy: [],
        parentId: replyTo?.id || null
      };

      const docRef = await addDoc(collection(db, 'comments'), comment);
      
      // Update post's comment count
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: increment(1)
      });

      setComments(prev => [{id: docRef.id, ...comment}, ...prev]);
      setCommentText('');
      setReplyTo(null);
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleEdit = async (commentId, newContent) => {
    try {
      const commentRef = doc(db, 'comments', commentId);
      await updateDoc(commentRef, {
        content: newContent,
        updatedAt: new Date().toISOString()
      });

      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, content: newContent, updatedAt: new Date().toISOString() }
            : comment
        )
      );

      setEditingComment(null);
      toast.success('Comment updated successfully!');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      
      // Update post's comment count
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: increment(-1)
      });

      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setShowDeleteModal(null);
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleVote = async (commentId, voteType) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    try {
      const commentRef = doc(db, 'comments', commentId);
      const increment = voteType === 'up' ? 1 : -1;

      await updateDoc(commentRef, {
        votes: increment,
        votedBy: [...(comments.find(c => c.id === commentId).votedBy || []), user.uid]
      });

      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                votes: comment.votes + increment,
                votedBy: [...(comment.votedBy || []), user.uid]
              }
            : comment
        )
      );
    } catch (error) {
      console.error('Error voting comment:', error);
      toast.error('Failed to vote');
    }
  };

  const renderComment = (comment) => (
    <div
      key={comment.id}
      className={`p-4 ${
        comment.parentId ? 'ml-8 border-l-2 border-gray-200 dark:border-gray-700' : ''
      }`}
    >
      <div className="flex gap-4">
        {/* Vote buttons */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={() => handleVote(comment.id, 'up')}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
              comment.votedBy?.includes(user?.uid)
                ? 'text-primary-500'
                : 'text-gray-400'
            }`}
          >
            <ChevronUpIcon className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {comment.votes}
          </span>
          <button
            onClick={() => handleVote(comment.id, 'down')}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {comment.author}
            </span>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400">
              {format(new Date(comment.createdAt), 'MMM d, yyyy')}
            </span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                (edited)
              </span>
            )}
          </div>

          {editingComment?.id === comment.id ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit(comment.id, editingComment.content);
              }}
              className="mt-2"
            >
              <textarea
                value={editingComment.content}
                onChange={(e) =>
                  setEditingComment(prev => ({ ...prev, content: e.target.value }))
                }
                className="input-field"
                rows={3}
                required
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingComment(null)}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save
                </button>
              </div>
            </form>
          ) : (
            <>
              <div
                className="mt-2 text-gray-700 dark:text-gray-300 prose dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(comment.content)
                }}
              />

              <div className="mt-2 flex items-center gap-4">
                {user && (
                  <button
                    onClick={() => setReplyTo(comment)}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                  >
                    <ReplyIcon className="h-4 w-4" />
                    Reply
                  </button>
                )}

                {user?.uid === comment.authorId && (
                  <>
                    <button
                      onClick={() => setEditingComment(comment)}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(comment.id)}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <h2 className="px-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Comments
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-2">
            {replyTo && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Replying to {replyTo.author}</span>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-primary-500 hover:text-primary-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="input-field"
            rows={3}
            required
          />
          <div className="mt-2 flex justify-end">
            <button type="submit" className="btn-primary">
              {replyTo ? 'Reply' : 'Comment'}
            </button>
          </div>
        </form>
      ) : (
        <p className="p-6 text-center text-gray-500 dark:text-gray-400">
          Please{' '}
          <a href="/login" className="text-primary-500 hover:text-primary-600">
            sign in
          </a>{' '}
          to comment
        </p>
      )}

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-dark-card rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Delete Comment
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment? This action cannot be
              undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
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

export default CommentSection;
