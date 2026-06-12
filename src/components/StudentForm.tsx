import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { StudentInput, Student } from '../types/student';

interface StudentFormProps {
  onSubmit: (student: StudentInput) => void;
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
    onSubmit(formData);
    setFormData({
      fullName: '',
      phoneNumber: '',
      parentPhoneNumber: '',
      notes: '',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-all duration-300">
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
            required
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
            required
            placeholder="0123456789"
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
            required
            placeholder="0987654321"
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
    </div>
  );
};

export default StudentForm;
