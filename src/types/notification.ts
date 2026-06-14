export type NotificationType = 'payment' | 'attendance' | 'rent' | 'system';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  isRead: boolean;
}
