import { useAuth } from '../../context/AuthContext';
import { usePost } from '../../context/PostContext';

function Profile() {
  const { user } = useAuth();
  const { posts } = usePost();

  const userPosts = posts.filter(post => post.author === user?.username);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        {user ? (
          <div>
            <p className="text-lg mb-2">
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
        ) : (
          <p className="text-lg text-gray-600">Please log in to view your profile.</p>
        )}
      </div>

      {user && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-2">{post.content}</p>
                  <p className="text-sm text-gray-500">
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't created any posts yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
