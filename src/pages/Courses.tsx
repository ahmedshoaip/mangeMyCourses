import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Course, CourseInput, CourseStatus } from '../types/course';
import CourseForm from '../components/CourseForm';
import CourseTable from '../components/CourseTable';
import { useCourseStore } from '../store/courseStore';

const Courses: React.FC = () => {
  const { t } = useTranslation();
  const { courses, addCourse, updateCourse, deleteCourse } = useCourseStore();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CourseStatus>('All');

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [courses, searchQuery, statusFilter]);

  const handleAddOrUpdate = (input: CourseInput) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, input);
      setEditingCourse(null);
    } else {
      addCourse(input);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm(t('common.confirm_delete'))) {
      deleteCourse(id);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('courses.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('courses.subtitle')}</p>
      </div>

      <div className="mb-12">
        <CourseForm
          onSubmit={handleAddOrUpdate}
          editingCourse={editingCourse}
          onCancel={() => setEditingCourse(null)}
        />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 rtl:left-auto rtl:right-0 rtl:pr-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.filter')}:</label>
            <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
              {(['All', 'Active', 'Inactive'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    statusFilter === status
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {status === 'All' ? t('common.all') : status === 'Active' ? t('common.active') : t('common.inactive')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {t('courses.list_title')}
              <span className="ml-3 px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full rtl:mr-3 rtl:ml-0">
                {filteredCourses.length} {t('common.results')}
              </span>
            </h2>
          </div>
          <CourseTable
            courses={filteredCourses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Courses;
