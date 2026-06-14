import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudentStore } from '../store/studentStore';
import { useAttendanceStore } from '../store/attendanceStore';
import type { AttendanceStatus, AttendanceInput } from '../types/attendance';

const AttendanceForm: React.FC = () => {
  const { t } = useTranslation();
  const students = useStudentStore((state) => state.students);
  const addRecord = useAttendanceStore((state) => state.addRecord);

  const [formData, setFormData] = useState<AttendanceInput>({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    lateMinutes: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return;
    addRecord(formData);
    setFormData({ ...formData, studentId: '', lateMinutes: 0 });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">{t('attendance.log_title', 'Log Attendance')}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">{t('common.student')}</label>
          <select
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            required
          >
            <option value="">{t('enrollments.choose_student')}</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">{t('common.date')}</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">{t('common.status')}</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as AttendanceStatus })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
          >
            <option value="present">{t('common.present', 'Present')}</option>
            <option value="absent">{t('common.absent', 'Absent')}</option>
            <option value="late">{t('common.late', 'Late')}</option>
          </select>
        </div>

        {formData.status === 'late' && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">{t('attendance.late_minutes', 'Late Minutes')}</label>
            <input
              type="number"
              value={formData.lateMinutes}
              onChange={(e) => setFormData({ ...formData, lateMinutes: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            />
          </div>
        )}

        <div className="lg:col-span-4 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            {t('common.save', 'Save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceForm;
