import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotificationStore } from '../store/notificationStore';
import { DataBadge } from './Widgets';

const NotificationPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const { notifications, markAsRead, deleteNotification, clearAll } = useNotificationStore();

  return (
    <div className="absolute top-16 right-0 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in zoom-in-95 duration-200 origin-top-right">
      <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/50">
        <h3 className="font-bold text-gray-800 dark:text-gray-100">{t('notifications.title', 'Notifications')}</h3>
        <button onClick={clearAll} className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">{t('notifications.clear_all', 'Clear All')}</button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            {t('notifications.empty', 'No new notifications')}
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
              onClick={() => markAsRead(n.id)}
            >
              {!n.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{n.title}</span>
                <DataBadge label={n.type} color={n.type === 'payment' ? 'red' : 'blue'} />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{n.message}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-[10px] text-gray-400">{new Date(n.date).toLocaleString()}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }} 
                  className="text-[10px] text-red-400 hover:text-red-600"
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 text-center">
        <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-700 font-medium">{t('notifications.close', 'Close Panel')}</button>
      </div>
    </div>
  );
};

export default NotificationPanel;
