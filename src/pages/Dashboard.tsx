import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDashboardStats } from '../store/selectors/statsSelectors';
import { StatCard, SectionHeader } from '../components/Widgets';
import { formatCurrency } from '../utils/currency';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const stats = useDashboardStats();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title={t('common.dashboard', 'Dashboard')} 
        subtitle={t('dashboard.subtitle', 'Overview of your educational center performance.')} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('common.students', 'Students')} 
          value={stats.students.totalStudents} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          colorClass="bg-blue-500"
          subtitle={`${stats.students.activeStudents} ${t('common.active', 'Active')}`}
        />
        <StatCard 
          title={t('common.attendance', 'Attendance')} 
          value={`${stats.attendance.presenceRate}%`} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          colorClass="bg-green-500"
          subtitle={`${stats.attendance.absences} ${t('common.absent', 'Absences')}`}
        />
        <StatCard 
          title={t('common.finance', 'Finance')} 
          value={formatCurrency(stats.finance.totalRevenue)} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          colorClass="bg-indigo-500"
          subtitle={`${formatCurrency(stats.finance.pendingRevenue)} ${t('common.pending', 'Pending')}`}
        />
        <StatCard 
          title={t('common.rent', 'Rent')} 
          value={formatCurrency(stats.finance.totalRent)} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          colorClass="bg-red-500"
          subtitle={t('dashboard.rent_expenses', 'Monthly Expenses')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">{t('dashboard.profit_overview', 'Profit Overview')}</h3>
           <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-gray-700">
                 <span className="text-gray-500 dark:text-gray-400 font-medium">{t('dashboard.total_collected', 'Total Collected')}</span>
                 <span className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(stats.finance.totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-gray-700">
                 <span className="text-gray-500 dark:text-gray-400 font-medium">{t('dashboard.total_expenses', 'Total Rent Expenses')}</span>
                 <span className="text-2xl font-bold text-red-600 dark:text-red-400">-{formatCurrency(stats.finance.totalRent)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                 <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('dashboard.net_profit', 'Net Profit')}</span>
                 <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(stats.finance.netProfit)}</span>
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">{t('dashboard.status_alerts', 'Status Alerts')}</h3>
           <div className="space-y-4">
              {stats.students.lateStudents > 0 && (
                <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                   <span className="text-red-700 dark:text-red-300 font-medium">{stats.students.lateStudents} {t('dashboard.students_overdue', 'students have overdue payments.')}</span>
                </div>
              )}
              {stats.attendance.presenceRate < 80 && (
                <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800/30">
                   <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                   <span className="text-yellow-700 dark:text-yellow-300 font-medium">{t('dashboard.low_attendance', 'Overall attendance rate is below 80%.')}</span>
                </div>
              )}
              {stats.finance.pendingRevenue > 500 && (
                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span className="text-blue-700 dark:text-blue-300 font-medium">{t('dashboard.high_pending', 'High volume of pending payments.')}</span>
                </div>
              )}
              {!stats.students.lateStudents && stats.attendance.presenceRate >= 80 && (
                 <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">{t('dashboard.no_alerts', 'Everything looks great!')}</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
