import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceTable from '../components/AttendanceTable';
import { useAttendanceStore } from '../store/attendanceStore';
import { useCourseStore } from '../store/courseStore';

const AttendancePage: React.FC = () => {
  const { t } = useTranslation();
  const records = useAttendanceStore((state) => state.records);
  const courses = useCourseStore((state) => state.courses);

  const [courseFilter, setCourseFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesCourse = courseFilter === 'All' || r.courseId === courseFilter;
      const matchesDate = !dateFilter || r.date === dateFilter;
      return matchesCourse && matchesDate;
    });
  }, [records, courseFilter, dateFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('common.attendance')}</h1>
        <p className="text-gray-600 dark:text-gray-400">تسجيل ومتابعة حضور وغياب الطلاب في الكورس.</p>
      </div>

      <div className="mb-12">
        <AttendanceForm />
      </div>

      <div className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('common.filter')} {t('common.courses')}</label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            >
              <option value="All">{t('common.all')} {t('common.courses')}</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.courseName}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('common.date')}</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              سجل الحضور
              <span className="ml-3 px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full rtl:mr-3 rtl:ml-0">
                {filteredRecords.length} {t('common.results')}
              </span>
            </h2>
          </div>
          <AttendanceTable records={filteredRecords} />
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
