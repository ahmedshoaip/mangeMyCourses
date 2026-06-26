import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudentStore } from '../store/studentStore';
import { useAttendanceStore } from '../store/attendanceStore';
import { useCourseStore } from '../store/courseStore';
import { useEnrollmentStore } from '../store/enrollmentStore';
import type { AttendanceInput } from '../types/attendance';
import { attendanceSchema } from '../validation';

const AttendanceForm: React.FC = () => {
  const { t } = useTranslation();
  const students = useStudentStore((state) => state.students);
  const courses = useCourseStore((state) => state.courses);
  const enrollments = useEnrollmentStore((state) => state.enrollments);
  const addRecord = useAttendanceStore((state) => state.addRecord);

  const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const [formData, setFormData] = useState<AttendanceInput>({
    studentId: '',
    courseId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    lateMinutes: 0,
  });

  const filteredStudents = useMemo(() => {
    if (!formData.courseId) return [];
    const enrolledIds = enrollments
      .filter(e => e.courseId === formData.courseId && e.status === 'Active')
      .map(e => e.studentId);
    return students.filter(s => enrolledIds.includes(s.id));
  }, [formData.courseId, enrollments, students]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validation (Frontend/Zod)
    const validation = attendanceSchema.safeParse(formData);
    if (!validation.success) {
      setShowToast({ show: true, message: validation.error.issues[0].message, type: 'error' });
      setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }

    // 2. Submit to Store (Backend/Business Rules)
    const { success, message } = addRecord(validation.data as AttendanceInput);
    
    if (success) {
      setShowToast({ show: true, message: 'تم تسجيل الحضور بنجاح', type: 'success' });
      setFormData({ ...formData, studentId: '', lateMinutes: 0 });
    } else {
      setShowToast({ show: true, message: message || 'حدث خطأ', type: 'error' });
    }
    setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">{t('attendance.log_title', 'Log Attendance')}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.course')}</label>
          <select
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value, studentId: '' })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{t('enrollments.choose_course')}</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.courseName}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.student')}</label>
          <select
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!formData.courseId}
          >
            <option value="">{t('enrollments.choose_student')}</option>
            {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </select>
          {!formData.courseId && <p className="text-[10px] text-amber-600 mt-1">يرجى اختيار الكورس أولاً</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.date')}</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.status')}</label>
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

        {formData.status === 'late' && (
          <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('attendance.late_minutes')}</label>
            <input
              type="number"
              min="1"
              value={formData.lateMinutes}
              onChange={(e) => setFormData({ ...formData, lateMinutes: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        <div className="lg:col-span-3 flex justify-end pt-4">
          <button type="submit" className="px-10 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            {t('common.save')}
          </button>
        </div>
      </form>

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

export default AttendanceForm;
