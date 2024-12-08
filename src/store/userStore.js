import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      // User state
      currentUser: null,
      users: [
        {
          id: '1',
          username: 'CommunityAdmin',
          email: 'admin@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CommunityAdmin',
          reputation: 1000,
          role: 'admin',
          joinedAt: '2024-01-01T00:00:00.000Z',
          bio: 'Community Administrator',
          following: [],
          followers: [],
          savedPosts: [],
          notifications: [],
          badges: ['Admin', 'Founder'],
          stats: {
            posts: 0,
            comments: 0,
            received_likes: 0,
          },
        },
      ],

      // Authentication actions
      login: (credentials) =>
        set((state) => {
          const user = state.users.find(
            (u) => u.email === credentials.email && u.password === credentials.password
          );
          if (user) {
            const { password, ...userWithoutPassword } = user;
            return { currentUser: userWithoutPassword };
          }
          return state;
        }),

      logout: () => set({ currentUser: null }),

      register: (userData) =>
        set((state) => {
          const newUser = {
            id: String(state.users.length + 1),
            username: userData.username,
            email: userData.email,
            password: userData.password,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
            reputation: 0,
            role: 'user',
            joinedAt: new Date().toISOString(),
            bio: '',
            following: [],
            followers: [],
            savedPosts: [],
            notifications: [],
            badges: ['New Member'],
            stats: {
              posts: 0,
              comments: 0,
              received_likes: 0,
            },
          };
          return { users: [...state.users, newUser] };
        }),

      // Profile actions
      updateProfile: (userId, updates) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, ...updates } : user
          ),
          currentUser:
            state.currentUser?.id === userId
              ? { ...state.currentUser, ...updates }
              : state.currentUser,
        })),

      // Social actions
      followUser: (followerId, followedId) =>
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id === followerId) {
              return {
                ...user,
                following: [...user.following, followedId],
              };
            }
            if (user.id === followedId) {
              return {
                ...user,
                followers: [...user.followers, followerId],
              };
            }
            return user;
          }),
        })),

      unfollowUser: (followerId, followedId) =>
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id === followerId) {
              return {
                ...user,
                following: user.following.filter((id) => id !== followedId),
              };
            }
            if (user.id === followedId) {
              return {
                ...user,
                followers: user.followers.filter((id) => id !== followerId),
              };
            }
            return user;
          }),
        })),

      // Notification actions
      addNotification: (userId, notification) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  notifications: [
                    {
                      id: Date.now().toString(),
                      ...notification,
                      read: false,
                      createdAt: new Date().toISOString(),
                    },
                    ...user.notifications,
                  ],
                }
              : user
          ),
        })),

      markNotificationAsRead: (userId, notificationId) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  notifications: user.notifications.map((n) =>
                    n.id === notificationId ? { ...n, read: true } : n
                  ),
                }
              : user
          ),
        })),

      // Post interaction actions
      savePost: (userId, postId) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? { ...user, savedPosts: [...user.savedPosts, postId] }
              : user
          ),
        })),

      unsavePost: (userId, postId) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  savedPosts: user.savedPosts.filter((id) => id !== postId),
                }
              : user
          ),
        })),

      // Reputation system
      updateReputation: (userId, points) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? { ...user, reputation: user.reputation + points }
              : user
          ),
        })),

      // Stats update
      updateStats: (userId, statType, increment = 1) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  stats: {
                    ...user.stats,
                    [statType]: user.stats[statType] + increment,
                  },
                }
              : user
          ),
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);
