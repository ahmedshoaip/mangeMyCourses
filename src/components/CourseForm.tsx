import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { CourseInput, Course } from '../types/course';

interface CourseFormProps {
  onSubmit: (course: CourseInput) => void;
  editingCourse: Course | null;
  onCancel: () => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, editingCourse, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CourseInput>({
    courseName: '',
    monthlyPrice: 0,
    daysOfWeek: [],
    startTime: '',
    endTime: '',
    description: '',
    status: 'Active',
  });

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        courseName: editingCourse.courseName,
        monthlyPrice: editingCourse.monthlyPrice,
        daysOfWeek: editingCourse.daysOfWeek,
        startTime: editingCourse.startTime,
        endTime: editingCourse.endTime,
        description: editingCourse.description,
        status: editingCourse.status,
      });
    } else {
      setFormData({
        courseName: '',
        monthlyPrice: 0,
        daysOfWeek: [],
        startTime: '',
        endTime: '',
        description: '',
        status: 'Active',
      });
    }
  }, [editingCourse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monthlyPrice' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-all duration-300">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        {editingCourse ? t('courses.edit_title') : t('courses.add_title')}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('courses.name')}</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            placeholder={t('courses.placeholder_name')}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('courses.price')}</label>
          <input
            type="number"
            name="monthlyPrice"
            value={formData.monthlyPrice}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('courses.schedule')}</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  formData.daysOfWeek.includes(day)
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t(`days.${day}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('courses.start_time')}</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('courses.end_time')}</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.status')}</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all outline-none"
          >
            <option value="Active">{t('common.active')}</option>
            <option value="Inactive">{t('common.inactive')}</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('courses.description')}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder={t('courses.placeholder_desc')}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>
        
        <div className="md:col-span-2 flex justify-end gap-3 pt-2">
          {editingCourse && (
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
            className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
          >
            {editingCourse ? t('common.update') : t('courses.add_title')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
