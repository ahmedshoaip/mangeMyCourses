import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Course, CourseInput, CourseStatus } from '../types/course';
import CourseForm from '../components/CourseForm';
import CourseTable from '../components/CourseTable';
import { useCourseStore } from '../store/courseStore';

const Courses: React.FC = () => {
  const { t } = useTranslation();
  const addCourse = useCourseStore((state) => state.addCourse);
  const updateCourse = useCourseStore((state) => state.updateCourse);
  const deleteCourse = useCourseStore((state) => state.deleteCourse);
  const courses = useCourseStore((state) => state.courses);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDeleteId, setCourseToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  
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
      const result = updateCourse(editingCourse.id, input);
      if (editingCourse) setEditingCourse(null);
      return result;
    } else {
      return addCourse(input);
    }
  };

  const handleDeleteClick = (id: string) => {
    setCourseToDeleteId(id);
  };

  const confirmDelete = () => {
    if (!courseToDeleteId || isDeleting) return;
    setIsDeleting(true);
    const { success, message } = deleteCourse(courseToDeleteId);
    setIsDeleting(false);
    setCourseToDeleteId(null);
    
    if (success) {
      setShowToast({ show: true, message: 'تم الحذف بنجاح', type: 'success' });
    } else {
      setShowToast({ show: true, message: message || 'حدث خطأ أثناء الحذف', type: 'error' });
    }
    setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in relative">
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
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {courseToDeleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-300 text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">تأكيد الحذف</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">سيتم حذف هذا العنصر نهائياً ولا يمكن التراجع.</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
              >
                حذف
              </button>
              <button 
                onClick={() => setCourseToDeleteId(null)}
                disabled={isDeleting}
                className="py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

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


export default Courses;
