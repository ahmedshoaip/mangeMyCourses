import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Attendance, AttendanceInput } from '../types/attendance';
import { attendanceSchema } from '../validation';


interface AttendanceState {
  records: Attendance[];
  addRecord: (record: AttendanceInput) => { success: boolean; message?: string };
  updateRecord: (id: string, updates: Partial<AttendanceInput>) => { success: boolean; message?: string };

  deleteRecord: (id: string) => void;
  getRecordsByStudent: (studentId: string) => Attendance[];
  getRecordsByCourseAndDate: (courseId: string, date: string) => Attendance[];
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => {
        // 1. Validation
        const validation = attendanceSchema.safeParse(record);
        if (!validation.success) {
          return { success: false, message: validation.error.issues[0].message };
        }

        const { records } = get();
        const normalized = validation.data;

        // 2. Business Rule: Unique (student + course + date)
        const isDuplicate = records.some(
          (r) => r.studentId === normalized.studentId && 
                 r.courseId === normalized.courseId && 
                 r.date === normalized.date
        );

        if (isDuplicate) {
          return { success: false, message: 'تم تسجيل الحضور لهذا الطالب مسبقاً' };
        }

        set((state) => ({
          records: [
            ...state.records,
            {
              ...normalized,
              id: crypto.randomUUID(),
            } as Attendance,
          ]
        }));

        return { success: true };
      },
      updateRecord: (id, updates) => {
        const existing = get().records.find(r => r.id === id);
        if (!existing) return { success: false, message: 'السجل غير موجود' };

        const merged = { ...existing, ...updates };
        const validation = attendanceSchema.safeParse(merged);
        
        if (!validation.success) {
          return { success: false, message: validation.error.issues[0].message };
        }

        const normalized = validation.data;

        // Business Rule for update
        const isDuplicate = get().records.some(
          (r) => r.id !== id && 
                 r.studentId === normalized.studentId && 
                 r.courseId === normalized.courseId && 
                 r.date === normalized.date
        );

        if (isDuplicate) {
          return { success: false, message: 'تم تسجيل الحضور لهذا الطالب مسبقاً' };
        }

        set((state) => ({
          records: state.records.map((r) => r.id === id ? { ...r, ...normalized } as Attendance : r)
        }));
        
        return { success: true };
      },

      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id)
        })),
      getRecordsByStudent: (studentId) =>
        get().records.filter((r) => r.studentId === studentId),
      getRecordsByCourseAndDate: (courseId, date) =>
        get().records.filter((r) => r.courseId === courseId && r.date === date),
    }),
    {
      name: 'edumanage_attendance',
    }
  )
);

