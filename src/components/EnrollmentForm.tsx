import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { EnrollmentInput, Enrollment } from '../types/enrollment';
import { useStudentStore } from '../store/studentStore';
import { useCourseStore } from '../store/courseStore';
import { enrollmentSchema } from '../validation';

interface EnrollmentFormProps {
  onSubmit: (enrollment: EnrollmentInput) => { success: boolean; message?: string } | void;
  editingEnrollment: Enrollment | null;
  onCancel: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  onSubmit,
  editingEnrollment,
  onCancel
}) => {
  const { t } = useTranslation();
  const students = useStudentStore((state) => state.students);
  const courses = useCourseStore((state) => state.courses);

  const [formData, setFormData] = useState<EnrollmentInput>({
    studentId: '',
    courseId: '',
    status: 'Active',
  });

  const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    if (editingEnrollment) {
      setFormData({
        studentId: editingEnrollment.studentId,
        courseId: editingEnrollment.courseId,
        status: editingEnrollment.status,
      });
    } else {
      setFormData({
        studentId: '',
        courseId: '',
        status: 'Active',
      });
    }
  }, [editingEnrollment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Zod Validation
    const validation = enrollmentSchema.safeParse(formData);
    if (!validation.success) {
      setShowToast({ show: true, message: validation.error.issues[0].message, type: 'error' });
      setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }

    // 2. Parent Submit
    const result = onSubmit(validation.data as EnrollmentInput);

    // 3. Store Result (Business Rules)
    if (result && !result.success) {
      setShowToast({ show: true, message: result.message || 'Error', type: 'error' });
      setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }

    // Success
    if (!editingEnrollment) {
      setFormData({
        studentId: '',
        courseId: '',
        status: 'Active',
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-all duration-300 relative">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        {editingEnrollment ? t('enrollments.edit_title') : t('enrollments.add_title')}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('enrollments.select_student')}</label>
          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            disabled={!!editingEnrollment}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none"
          >
            <option value="">{t('enrollments.choose_student')}</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.fullName}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('enrollments.select_course')}</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all outline-none"
          >
            <option value="">{t('enrollments.choose_course')}</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.courseName} - {c.monthlyPrice} ج.م</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.status')}</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all outline-none"
          >
            <option value="Active">{t('common.active')}</option>
            <option value="Stopped">{t('common.stopped')}</option>
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700 pt-6">
          {editingEnrollment && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t('common.cancel')}
            </button>
          )}
          <button
            type="submit"
            className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {editingEnrollment ? t('common.update') : t('enrollments.enroll_btn')}
          </button>
        </div>
      </form>

      {/* Local Toast System */}
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

export default EnrollmentForm;
