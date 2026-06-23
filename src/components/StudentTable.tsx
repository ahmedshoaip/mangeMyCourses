import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Student } from '../types/student';
import { useStudentStore } from '../store/studentStore';
import { useAttendanceStore } from '../store/attendanceStore';

interface StudentTableProps {
  onEdit: (student: Student) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ onEdit }) => {
  const { t } = useTranslation();
  const students = useStudentStore((state) => state.students);
  const deleteStudent = useStudentStore((state) => state.deleteStudent);
  const attendanceRecords = useAttendanceStore((state) => state.records);

  const handleDelete = (id: string) => {
    if (confirm(t('common.confirm_delete'))) {
      const { success, message } = deleteStudent(id);
      if (!success) {
        alert(message);
      }
    }
  };

  const getStats = (studentId: string) => {
    const studentRecords = attendanceRecords.filter(r => r.studentId === studentId);
    const total = studentRecords.length;
    const absences = studentRecords.filter(r => r.status === 'absent').length;
    const lates = studentRecords.filter(r => r.status === 'late').length;
    const presents = studentRecords.filter(r => r.status === 'present').length;
    
    const rate = total > 0 ? Math.round(((presents + lates) / total) * 100) : 100;
    
    return { absences, lates, rate };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('students.full_name')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('students.phone')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">{t('common.attendance', 'Attendance')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">{t('common.absences', 'Absences')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  {t('common.no_results')}
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const stats = getStats(student.id);
                return (
                  <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{student.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.phoneNumber}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-bold ${stats.rate < 50 ? 'text-red-500' : 'text-green-500'}`}>
                          {stats.rate}%
                        </span>
                        <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                           <div className={`h-full ${stats.rate < 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${stats.rate}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="flex justify-center gap-4">
                         <span className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded" title="Absences">
                           {stats.absences}A
                         </span>
                         <span className="text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded" title="Lates">
                           {stats.lates}L
                         </span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title={t('common.edit')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title={t('common.delete')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
