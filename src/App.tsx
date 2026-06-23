import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Enrollments from './pages/Enrollments';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AttendancePage from './pages/Attendance';
import PaymentForm from './components/PaymentForm';
import PaymentTable from './components/PaymentTable';
import RentCalculator from './components/RentCalculator';
import NotificationPanel from './components/NotificationPanel';
import { useNotificationStore } from './store/notificationStore';
import { useSettingsStore } from './store/settingsStore';
import { useNotificationGenerator } from './utils/useNotificationGenerator';

type Module = 'Dashboard' | 'Students' | 'Courses' | 'Enrollments' | 'Attendance' | 'Payments' | 'Rent' | 'Reports' | 'Settings';

function App() {
  const { t } = useTranslation();
  const [activeModule, setActiveModule] = useState<Module>('Dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  const { theme } = useSettingsStore();
  const notifications = useNotificationStore(state => state.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useNotificationGenerator();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col font-sans">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hidden lg:block">
              EduManage
            </span>
          </div>

          <nav className="flex items-center gap-0.5 md:gap-1">
            {(['Dashboard', 'Students', 'Courses', 'Enrollments', 'Attendance', 'Payments', 'Rent', 'Reports', 'Settings'] as Module[]).map((m) => (
              <button
                key={m}
                onClick={() => setActiveModule(m)}
                className={`text-[9px] md:text-xs lg:text-sm font-semibold px-1 md:px-3 py-5 transition-all outline-none border-b-2 ${activeModule === m
                    ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 bg-indigo-50/20 dark:bg-indigo-900/10'
                    : 'text-gray-500 hover:text-indigo-500 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
              >
                {t(`common.${m.toLowerCase()}`)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 transition-colors relative ${unreadCount > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
            </div>

            <button
              onClick={() => setActiveModule('Settings')}
              className={`p-2 rounded-full transition-colors ${activeModule === 'Settings' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {activeModule === 'Dashboard' && <Dashboard />}
          {activeModule === 'Students' && <Students />}
          {activeModule === 'Courses' && <Courses />}
          {activeModule === 'Enrollments' && <Enrollments />}
          {activeModule === 'Attendance' && <AttendancePage />}
          {activeModule === 'Payments' && (
            <div className="space-y-8 animate-in zoom-in duration-300">
              <PaymentForm />
              <PaymentTable />
            </div>
          )}
          {activeModule === 'Rent' && <RentCalculator />}
          {activeModule === 'Reports' && <Reports />}
          {activeModule === 'Settings' && <Settings />}
        </div>
      </main>

      <footer className="mt-auto py-10 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} EduManage. {t('common.footer_copy')}.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
