import React from 'react';
import { useUserStore } from '../../store/userStore';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export default function UserProfile({ userId }) {
  const { users, currentUser, followUser, unfollowUser } = useUserStore();
  const user = users.find((u) => u.id === userId);

  if (!user) return <div>User not found</div>;

  const isFollowing = currentUser?.following?.includes(user.id);
  const isOwnProfile = currentUser?.id === user.id;

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(currentUser.id, user.id);
    } else {
      followUser(currentUser.id, user.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500"></div>

        {/* Profile Info */}
        <div className="relative px-6 py-8">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end mb-4">
            {!isOwnProfile && currentUser && (
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } transition-colors`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
            {isOwnProfile && (
              <Link
                to="/settings"
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Edit Profile
              </Link>
            )}
          </div>

          {/* User Info */}
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {user.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{user.bio}</p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              <span>Joined {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true })}</span>
              <span className="mx-2">•</span>
              <span>{user.reputation} reputation</span>
            </div>

            {/* Stats */}
            <div className="flex space-x-6 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.stats.posts}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.followers.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.following.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Posts
        </h2>
        {/* Add PostList component here */}
      </div>
    </div>
  );
}
