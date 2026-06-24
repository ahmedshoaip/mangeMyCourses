import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { StudentInput, Student } from '../types/student';
import { studentSchema } from '../validation';

interface StudentFormProps {
  onSubmit: (student: StudentInput) => { success: boolean; message?: string } | void;
  editingStudent: Student | null;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, editingStudent, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<StudentInput>({
    fullName: '',
    phoneNumber: '',
    parentPhoneNumber: '',
    notes: '',
  });

  const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        fullName: editingStudent.fullName,
        phoneNumber: editingStudent.phoneNumber,
        parentPhoneNumber: editingStudent.parentPhoneNumber,
        notes: editingStudent.notes,
      });
    } else {
      setFormData({
        fullName: '',
        phoneNumber: '',
        parentPhoneNumber: '',
        notes: '',
      });
    }
  }, [editingStudent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Zod Validation
    const validation = studentSchema.safeParse(formData);
    if (!validation.success) {
      setShowToast({ show: true, message: validation.error.issues[0].message, type: 'error' });
      setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }

    // 2. Parent Submit
    const result = onSubmit(validation.data as StudentInput);
    
    // 3. Handle Store Result (Business Rules)
    if (result && !result.success) {
      setShowToast({ show: true, message: result.message || 'Error', type: 'error' });
      setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
      return;
    }

    // Success
    if (!editingStudent) {
      setFormData({
        fullName: '',
        phoneNumber: '',
        parentPhoneNumber: '',
        notes: '',
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-all duration-300 relative">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        {editingStudent ? t('students.edit_title') : t('students.add_title')}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('students.full_name')}</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder={t('students.placeholder_name')}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('students.phone')}</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="01xxxxxxxxx"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('students.parent_phone')}</label>
          <input
            type="tel"
            name="parentPhoneNumber"
            value={formData.parentPhoneNumber}
            onChange={handleChange}
            placeholder="01xxxxxxxxx"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.notes')}</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder={t('students.placeholder_notes')}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>
        <div className="md:col-span-2 flex justify-end gap-3 pt-2">
          {editingStudent && (
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
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all"
          >
            {editingStudent ? t('common.update') : t('common.students')}
          </button>
        </div>
      </form>

      {/* Local Toast System (Matching Settings.tsx System) */}
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

export default StudentForm;
