import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudentStore } from '../store/studentStore';
import { useAttendanceStore } from '../store/attendanceStore';
import { useCourseStore } from '../store/courseStore';
import { useEnrollmentStore } from '../store/enrollmentStore';
import type { AttendanceInput } from '../types/attendance';

const AttendanceForm: React.FC = () => {
  const { t } = useTranslation();
  const students = useStudentStore((state) => state.students);
  const courses = useCourseStore((state) => state.courses);
  const enrollments = useEnrollmentStore((state) => state.enrollments);
  const addRecord = useAttendanceStore((state) => state.addRecord);

  const [formData, setFormData] = useState<AttendanceInput>({
    studentId: '',
    courseId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    lateMinutes: 0,
  });

  // Rule 2: Filter students by course enrollment
  const filteredStudents = useMemo(() => {
    if (!formData.courseId) return [];
    const enrolledIds = enrollments
      .filter(e => e.courseId === formData.courseId && e.status === 'Active')
      .map(e => e.studentId);
    return students.filter(s => enrolledIds.includes(s.id));
  }, [formData.courseId, enrollments, students]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.courseId || !formData.date) {
      alert('يرجى ملء جميع البيانات المطلوبة');
      return;
    }

    const { success, message } = addRecord(formData);
    if (success) {
      alert('تم تسجيل الحضور بنجاح');
      setFormData({ ...formData, studentId: '', lateMinutes: 0 });
    } else {
      alert(message || 'حدث خطأ أثناء التسجيل');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">{t('attendance.log_title', 'Log Attendance')}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('common.course')}</label>
          <select
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value, studentId: '' })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">{t('enrollments.choose_course')}</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.courseName}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('common.student')}</label>
          <select
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={!formData.courseId}
          >
            <option value="">{t('enrollments.choose_student')}</option>
            {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </select>
          {!formData.courseId && <p className="text-[10px] text-amber-600 mt-1">يرجى اختيار الكورس أولاً</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('common.date')}</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('common.status')}</label>
          <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
            {(['present', 'absent', 'late'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFormData({ ...formData, status: s })}
                className={`flex-1 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                  formData.status === s
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t(`common.${s}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Rule 5: lateMinutes only for status="late" */}
        {formData.status === 'late' && (
          <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('attendance.late_minutes')}</label>
            <input
              type="number"
              min="1"
              value={formData.lateMinutes}
              onChange={(e) => setFormData({ ...formData, lateMinutes: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        )}

        <div className="lg:col-span-3 flex justify-end pt-4">
          <button type="submit" className="px-10 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceForm;

