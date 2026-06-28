import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Student, StudentInput } from '../types/student';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';
import { useStudentStore } from '../store/studentStore';

const Students: React.FC = () => {
  const { t } = useTranslation();
  const studentsCount = useStudentStore((state) => state.students.length);
  const addStudent = useStudentStore((state) => state.addStudent);
  const updateStudent = useStudentStore((state) => state.updateStudent);
  const deleteStudent = useStudentStore((state) => state.deleteStudent);
  
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDeleteId, setStudentToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const handleAddOrUpdate = (input: StudentInput) => {
    if (editingStudent) {
      const result = updateStudent(editingStudent.id, input);
      if (result.success) setEditingStudent(null);
      return result;
    } else {
      return addStudent(input);
    }
  };

  const handleDeleteClick = (id: string) => {
    setStudentToDeleteId(id);
  };

  const confirmDelete = () => {
    if (!studentToDeleteId || isDeleting) return;
    setIsDeleting(true);
    const { success, message } = deleteStudent(studentToDeleteId);
    setIsDeleting(false);
    setStudentToDeleteId(null);
    
    if (success) {
      setShowToast({ show: true, message: 'تم الحذف بنجاح', type: 'success' });
    } else {
      setShowToast({ show: true, message: message || 'حدث خطأ أثناء الحذف', type: 'error' });
    }
    setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in relative">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('students.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('students.subtitle')}</p>
      </div>

      <div className="mb-12">
        <StudentForm
          onSubmit={handleAddOrUpdate}
          editingStudent={editingStudent}
          onCancel={() => setEditingStudent(null)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {t('students.list_title')}
            <span className="ml-3 px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full rtl:mr-3 rtl:ml-0">
              {studentsCount} {t('common.total')}
            </span>
          </h2>
        </div>
        <StudentTable
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Confirmation Modal */}
      {studentToDeleteId && (
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
                onClick={() => setStudentToDeleteId(null)}
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

export default Students;

