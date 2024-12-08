import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      
      // Add a new notification
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            { id: Date.now(), read: false, ...notification },
            ...state.notifications,
          ],
        })),

      // Mark a notification as read
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      // Mark all notifications as read
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      // Get unread count
      getUnreadCount: () => {
        const state = get();
        return state.notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'notification-store',
    }
  )
);
