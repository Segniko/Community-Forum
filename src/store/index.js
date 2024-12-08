import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      // Theme
      theme: typeof window !== 'undefined' 
        ? window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light'
        : 'light',
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },

      // User
      user: null,
      setUser: (user) => set({ user }),
      
      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
      clearNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      
      // User Preferences
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        digestFrequency: 'daily',
      },
      updatePreferences: (preferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),

      // Achievements
      achievements: [],
      addAchievement: (achievement) =>
        set((state) => ({
          achievements: [...state.achievements, achievement],
        })),

      // Bookmarks
      bookmarks: [],
      toggleBookmark: (postId) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(postId)
            ? state.bookmarks.filter((id) => id !== postId)
            : [...state.bookmarks, postId],
        })),
    }),
    {
      name: 'app-store',
    }
  )
)
