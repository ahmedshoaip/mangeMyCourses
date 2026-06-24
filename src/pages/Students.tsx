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
  
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleAddOrUpdate = (input: StudentInput) => {
    if (editingStudent) {
      const result = updateStudent(editingStudent.id, input);
      if (result.success) setEditingStudent(null);
      return result;
    } else {
      return addStudent(input);
    }
  };


  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in">
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
        />
      </div>
    </div>
  );
};

export default Students;
