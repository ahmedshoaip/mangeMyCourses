import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Enrollment } from '../types/enrollment';
import { useStudentStore } from '../store/studentStore';
import { useCourseStore } from '../store/courseStore';

interface EnrollmentTableProps {
  enrollments: Enrollment[];
  onEdit: (enrollment: Enrollment) => void;
  onStop: (id: string) => void;
}

const EnrollmentTable: React.FC<EnrollmentTableProps> = ({ 
  enrollments, 
  onEdit, 
  onStop 
}) => {
  const { t } = useTranslation();
  const students = useStudentStore((state) => state.students);
  const courses = useCourseStore((state) => state.courses);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.fullName || 'Unknown Student';
  const getCourseName = (id: string) => courses.find(c => c.id === id)?.courseName || 'Unknown Course';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('students.full_name')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('common.courses')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('enrollments.join_date')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('common.status')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  {t('common.no_results')}
                </td>
              </tr>
            ) : (
              enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {getStudentName(enrollment.studentId)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                      {getCourseName(enrollment.courseId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {enrollment.joinDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      enrollment.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 mr-1.5 ml-1.5 rounded-full ${
                        enrollment.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {enrollment.status === 'Active' ? t('common.active') : t('common.stopped')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(enrollment)}
                        className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        title={t('common.edit')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      {enrollment.status === 'Active' && (
                        <button
                          onClick={() => onStop(enrollment.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title={t('enrollments.stop_btn')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m-9-4h18c1.104 0 2 0.896 2 2v2c0 1.104-0.896 2-2 2H5c-1.104 0-2-0.896-2-2v-2c0-1.104 0.896-2 2-2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrollmentTable;
