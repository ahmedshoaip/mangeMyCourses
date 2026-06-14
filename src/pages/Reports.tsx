import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudentStore } from '../store/studentStore';
import { useCourseStore } from '../store/courseStore';
import { useAttendanceStore } from '../store/attendanceStore';
import { usePaymentStore } from '../store/paymentStore';
import { SectionHeader, DataBadge } from '../components/Widgets';
import { formatCurrency } from '../utils/currency';

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const [filterCourse, setFilterCourse] = useState('');
  const [filterType, setFilterType] = useState<'attendance' | 'finance'>('attendance');

  const students = useStudentStore(state => state.students);
  const courses = useCourseStore(state => state.courses);
  const attendance = useAttendanceStore(state => state.records);
  const payments = usePaymentStore(state => state.payments);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.fullName || 'Unknown';
  const getCourseName = (id: string) => courses.find(c => c.id === id)?.courseName || 'Unknown';

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <SectionHeader 
        title={t('common.reports', 'Reports')} 
        subtitle={t('reports.subtitle', 'Filter and generate detailed reports for your center.')} 
      />

      <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">{t('reports.filter_type', 'Report Type')}</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 outline-none"
          >
            <option value="attendance">{t('common.attendance', 'Attendance')}</option>
            <option value="finance">{t('common.finance', 'Finance')}</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">{t('common.course', 'Course')}</label>
          <select 
            value={filterCourse} 
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 outline-none"
          >
            <option value="">{t('common.all', 'All Courses')}</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.courseName}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {filterType === 'attendance' ? (
          <table className="w-full text-left rtl:text-right">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-sm font-semibold">{t('common.student')}</th>
                <th className="px-6 py-4 text-sm font-semibold">{t('common.course')}</th>
                <th className="px-6 py-4 text-sm font-semibold">{t('common.date')}</th>
                <th className="px-6 py-4 text-sm font-semibold">{t('common.status')}</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(r => (
                <tr key={r.id} className="border-b border-gray-50 dark:border-gray-700">
                  <td className="px-6 py-4 text-sm">{getStudentName(r.studentId)}</td>
                  <td className="px-6 py-4 text-sm">{getCourseName(filterCourse)}</td>
                  <td className="px-6 py-4 text-sm">{r.date}</td>
                  <td className="px-6 py-4">
                    <DataBadge 
                      label={t(`common.${r.status}`, r.status)} 
                      color={r.status === 'present' ? 'green' : r.status === 'absent' ? 'red' : 'yellow'} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left rtl:text-right">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-sm font-semibold">{t('common.student')}</th>
                <th className="px-6 py-4 text-sm font-semibold">{t('common.amount')}</th>
                <th className="px-6 py-4 text-sm font-semibold">{t('common.status')}</th>
                <th className="px-6 py-4 text-sm font-semibold">{t('payments.due_date')}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-700">
                  <td className="px-6 py-4 text-sm">{getStudentName(p.studentId)}</td>
                  <td className="px-6 py-4 text-sm font-bold">{formatCurrency(p.amount)}</td>
                  <td className="px-6 py-4">
                    <DataBadge 
                      label={t(`common.${p.status}`, p.status)} 
                      color={p.status === 'paid' ? 'green' : p.status === 'overdue' ? 'red' : 'yellow'} 
                    />
                  </td>
                  <td className="px-6 py-4 text-sm">{p.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;
