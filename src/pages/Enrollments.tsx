import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Enrollment, EnrollmentInput, EnrollmentStatus } from '../types/enrollment';
import EnrollmentForm from '../components/EnrollmentForm';
import EnrollmentTable from '../components/EnrollmentTable';
import { useEnrollmentStore } from '../store/enrollmentStore';
import { useStudentStore } from '../store/studentStore';
import { useCourseStore } from '../store/courseStore';

const Enrollments: React.FC = () => {
  const { t } = useTranslation();
  const { enrollments, addEnrollment, updateEnrollment } = useEnrollmentStore();
  const { students } = useStudentStore();
  const { courses } = useCourseStore();
  
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  
  // Filters State
  const [studentSearch, setStudentSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | EnrollmentStatus>('All');

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((en) => {
      const student = students.find(s => s.id === en.studentId);
      const matchesStudent = student?.fullName.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesCourse = courseFilter === 'All' || en.courseId === courseFilter;
      const matchesStatus = statusFilter === 'All' || en.status === statusFilter;
      return matchesStudent && matchesCourse && matchesStatus;
    });
  }, [enrollments, students, studentSearch, courseFilter, statusFilter]);

  const handleAddOrUpdate = (input: EnrollmentInput) => {
    if (editingEnrollment) {
      updateEnrollment(editingEnrollment.id, input);
      setEditingEnrollment(null);
    } else {
      addEnrollment(input);
    }
  };

  const handleStop = (id: string) => {
    if (confirm(t('common.confirm_stop'))) {
      updateEnrollment(id, { status: 'Stopped' });
    }
  };

  const handleEdit = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('enrollments.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('enrollments.subtitle')}</p>
      </div>

      <div className="mb-12">
        <EnrollmentForm
          onSubmit={handleAddOrUpdate}
          editingEnrollment={editingEnrollment}
          onCancel={() => setEditingEnrollment(null)}
        />
      </div>

      <div className="space-y-6">
        {/* Advanced Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('common.search')} {t('common.students')}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 rtl:left-auto rtl:right-0 rtl:pr-3 flex items-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder={t('students.placeholder_name')}
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 rtl:pl-4 rtl:pr-9 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
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
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('common.status')}</label>
            <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
              {(['All', 'Active', 'Stopped'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    statusFilter === status
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {status === 'All' ? t('common.all') : status === 'Active' ? t('common.active') : t('common.stopped')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {t('enrollments.list_title')}
              <span className="ml-3 px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full rtl:mr-3 rtl:ml-0">
                {filteredEnrollments.length} {t('common.results')}
              </span>
            </h2>
          </div>
          <EnrollmentTable
            enrollments={filteredEnrollments}
            onEdit={handleEdit}
            onStop={handleStop}
          />
        </div>
      </div>
    </div>
  );
};

export default Enrollments;
