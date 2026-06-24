import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Student } from '../types/student';
import { useAttendanceStore } from './attendanceStore';
import { studentSchema } from '../validation';


interface StudentState {
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'createdDate'>) => { success: boolean; message?: string };
  updateStudent: (id: string, updates: Partial<Omit<Student, 'id'>>) => { success: boolean; message?: string };


  deleteStudent: (id: string) => { success: boolean; message?: string };
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
  addStudent: (student) => {
    // 1. Validation
    const validation = studentSchema.safeParse(student);
    if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message };

    }

    const { students } = get();
    // Force type safety after validation
    const normalized = validation.data as Omit<Student, 'id' | 'createdDate'>;

    // 2. Business Rule: Unique phone number
    if (normalized.phoneNumber) {
      const isDuplicate = students.some(s => s.phoneNumber === normalized.phoneNumber);
      if (isDuplicate) {
        return { success: false, message: 'يوجد طالب بنفس رقم الهاتف' };
      }
    }

    set((state) => ({
      students: [
        ...state.students,
        {
          ...normalized,
          id: crypto.randomUUID(),
          createdDate: new Date().toISOString().split('T')[0],
        },
      ],
    }));
    return { success: true };
  },


  updateStudent: (id, updates) => {
    // 1. Partial Validation (merging existing with updates)
    const existing = get().students.find(s => s.id === id);
    if (!existing) return { success: false, message: 'الطالب غير موجود' };
    
    const merged = { ...existing, ...updates };
    const validation = studentSchema.safeParse(merged);
    
    if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message };
    }

    const normalized = validation.data;

    // 2. Business Rule: Unique phone number
    if (normalized.phoneNumber) {
      const isDuplicate = get().students.some(s => s.phoneNumber === normalized.phoneNumber && s.id !== id);
      if (isDuplicate) {
        return { success: false, message: 'يوجد طالب بنفس رقم الهاتف' };
      }
    }

    set((state) => ({
      students: state.students.map((s) =>
        s.id === id ? { ...s, ...normalized } : s
      ),
    }));
    return { success: true };
  },

      deleteStudent: (id) => {
        // Rule 10: Check attendance
        const attendanceRecords = useAttendanceStore.getState().records;
        const hasAttendance = attendanceRecords.some(r => r.studentId === id);

        if (hasAttendance) {
          return { success: false, message: 'لا يمكن حذف هذا الطالب لوجود سجلات حضور مرتبطة به' };
        }

        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        }));
        
        return { success: true };
      },
      getStudentById: (id) => get().students.find((s) => s.id === id),
    }),
    {
      name: 'edumanage_students',
    }
  )
);

