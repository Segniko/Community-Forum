import { createContext, useContext } from 'react';
import { useStore } from '../store';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const notifications = useStore((state) => state.notifications);
  const addNotification = useStore((state) => state.addNotification);
  const clearNotification = useStore((state) => state.clearNotification);

  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      createdAt: new Date().toISOString()
    };
    
    addNotification(notification);
    toast(message, {
      icon: type === 'success' ? '✅' : 
            type === 'error' ? '❌' : 'ℹ️',
    });
  };

  const value = {
    notifications,
    showNotification,
    clearNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
