import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAttendanceStore } from '../store/attendanceStore';
import { useStudentStore } from '../store/studentStore';

const AttendanceTable: React.FC = () => {
  const { t } = useTranslation();
  const records = useAttendanceStore((state) => state.records);
  const deleteRecord = useAttendanceStore((state) => state.deleteRecord);
  const students = useStudentStore((state) => state.students);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.fullName || 'Unknown';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('common.student')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('common.date')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('common.status')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('common.notes')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">{t('common.no_results')}</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{getStudentName(record.studentId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{record.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t(`common.${record.status}`, record.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {record.status === 'late' ? `${record.lateMinutes} min late` : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => deleteRecord(record.id)} className="text-red-500 hover:text-red-700 transition-colors p-2">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
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

export default AttendanceTable;
