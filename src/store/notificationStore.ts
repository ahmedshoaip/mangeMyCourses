import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '../types/notification';

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'date'>) => void;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (n) => 
        set((state) => ({
          notifications: [
            {
              ...n,
              id: crypto.randomUUID(),
              isRead: false,
              date: new Date().toISOString()
            },
            ...state.notifications
          ].slice(0, 50) // Keep last 50
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n)
        })),
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        })),
      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: 'edumanage_notifications',
    }
  )
);
