import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/settingsStore';
import { SectionHeader } from '../components/Widgets';
import { exportBackup } from '../utils/backup/exportBackup';
import { validateBackup } from '../utils/backup/validateBackup';
import { restoreBackup } from '../utils/backup/importBackup';
import type { AppBackup } from '../utils/backup/backup.types';



const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, resetSettings } = useSettingsStore();
  const [showToast, setShowToast] = React.useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [pendingBackup, setPendingBackup] = React.useState<AppBackup | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  
  const changeLanguage = (lng: 'ar' | 'en') => {
    i18n.changeLanguage(lng);
  };

  const handleExport = () => {
    exportBackup();
    setShowToast({ show: true, message: 'تم إنشاء النسخة الاحتياطية بنجاح', type: 'success' });
    setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (validateBackup(json)) {
          setPendingBackup(json);
        } else {
          setShowToast({ show: true, message: 'ملف غير صالح أو بيانات ناقصة', type: 'error' });
          setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
        }
      } catch (error) {
        setShowToast({ show: true, message: 'خطأ في قراءة ملف JSON', type: 'error' });
        setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const confirmRestore = () => {
    if (!pendingBackup) return;
    restoreBackup(pendingBackup);
    setPendingBackup(null);
    setShowToast({ show: true, message: 'تم استرجاع النسخة الاحتياطية', type: 'success' });
    
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };


  const handleFullReset = () => {
    if (confirm(t('settings.confirm_reset_data', 'This will delete ALL data (Students, Courses, Payments). Are you sure?'))) {
      localStorage.clear();
      window.location.reload();
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
      <SectionHeader 
        title={t('common.settings', 'Settings')} 
        subtitle={t('settings.subtitle', 'Manage your application preferences.')} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Language Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {t('settings.language_title', 'Language')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => changeLanguage('ar')}
              className={`p-4 rounded-xl border-2 transition-all font-bold ${i18n.language === 'ar' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-100 dark:border-gray-700 hover:border-indigo-200'}`}
            >
              العربية (RTL)
            </button>
            <button 
              onClick={() => changeLanguage('en')}
              className={`p-4 rounded-xl border-2 transition-all font-bold ${i18n.language === 'en' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-100 dark:border-gray-700 hover:border-indigo-200'}`}
            >
              English (LTR)
            </button>
          </div>
        </div>

        {/* Currency Section (Locked to EGP) */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {t('settings.currency_title', 'Currency')}
          </h3>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">{t('settings.default_currency', 'Primary Currency')}</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded-lg">EGP (ج.م)</span>
          </div>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            {t('settings.currency_locked', 'Currently limited to EGP. Future updates will support more currencies.')}
          </p>
        </div>

        {/* Interface Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.071 16.071l.707.707M7.929 7.929l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
            {t('settings.theme_title', 'Appearance')}
          </h3>
          <div className="flex gap-4">
             <button 
              onClick={() => setTheme('light')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-100 dark:border-gray-700'}`}
             >
               ☀️ Light
             </button>
             <button 
              onClick={() => setTheme('dark')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-100 dark:border-gray-700'}`}
             >
               🌙 Dark
             </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30">
          <h3 className="text-xl font-bold mb-6 text-red-600 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {t('settings.danger_zone', 'Danger Zone')}
          </h3>
          <div className="space-y-4">
            <button 
              onClick={resetSettings}
              className="w-full py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t('settings.reset_prefs', 'Reset Preferences')}
            </button>
            <button 
              onClick={handleFullReset}
              className="w-full py-3 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-all hover:scale-[1.02]"
            >
              {t('settings.delete_all', 'Delete All Data')}
            </button>
          </div>
        </div>
      </div>

      {/* Backup Section */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-900/30 mt-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          {t('settings.backup_title', 'Data Backup')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('settings.backup_description', 'Export your data to a JSON file for safekeeping.')}
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleExport}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            تصدير نسخة احتياطية
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3 bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-600 transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            استيراد نسخة احتياطية
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {pendingBackup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">ملخص النسخة الاحتياطية</h3>
            
            <div className="space-y-3 mb-8">
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400">عدد الطلاب</span>
                <span className="font-bold">{pendingBackup.data.students.length}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400">عدد الكورسات</span>
                <span className="font-bold">{pendingBackup.data.courses.length}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400">عدد التسجيلات</span>
                <span className="font-bold">{pendingBackup.data.enrollments.length}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400">عدد الحضور</span>
                <span className="font-bold">{pendingBackup.data.attendance.length}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400">عدد المدفوعات</span>
                <span className="font-bold">{pendingBackup.data.payments.length}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400">عدد الإيجارات</span>
                <span className="font-bold">{pendingBackup.data.rent.length}</span>
              </div>
              <div className="flex justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-700 dark:text-indigo-300">
                <span>تاريخ الإنشاء</span>
                <span className="font-bold">{new Date(pendingBackup.metadata.createdAt).toLocaleString('ar-EG')}</span>
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl mb-8">
              <p className="text-red-600 dark:text-red-400 font-bold text-center">
                ⚠️ سيتم استبدال البيانات الحالية بالكامل
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={confirmRestore}
                className="py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
              >
                استرجاع
              </button>
              <button 
                onClick={() => setPendingBackup(null)}
                className="py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[120] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`${showToast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold`}>
            {showToast.type === 'success' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            )}
            {showToast.message}
          </div>
        </div>
      )}

    </div>

  );
};

export default Settings;
