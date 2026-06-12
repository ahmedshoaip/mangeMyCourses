import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Student } from '../types/student';

interface StudentState {
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'createdDate'>) => void;
  updateStudent: (id: string, updates: Partial<Omit<Student, 'id'>>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
}

const initialStudents: Student[] = [
  {
    id: 's1',
    fullName: 'Ahmed Mohamed',
    phoneNumber: '01001234567',
    parentPhoneNumber: '01229876543',
    notes: 'Needs extra help with math.',
    createdDate: '2026-06-05',
  },
  {
    id: 's2',
    fullName: 'Sara Ali',
    phoneNumber: '01112334455',
    parentPhoneNumber: '01556677889',
    notes: 'Excellent student.',
    createdDate: '2026-06-08',
  },
];

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      students: initialStudents,
      addStudent: (student) =>
        set((state) => ({
          students: [
            ...state.students,
            {
              ...student,
              id: crypto.randomUUID(),
              createdDate: new Date().toISOString().split('T')[0],
            },
          ],
        })),
      updateStudent: (id, updates) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),
      getStudentById: (id) => get().students.find((s) => s.id === id),
    }),
    {
      name: 'edumanage_students',
    }
  )
);
