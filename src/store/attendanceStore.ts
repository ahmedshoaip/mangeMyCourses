import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Attendance, AttendanceInput } from '../types/attendance';

interface AttendanceState {
  records: Attendance[];
  addRecord: (record: AttendanceInput) => { success: boolean; message?: string };
  updateRecord: (id: string, updates: Partial<AttendanceInput>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByStudent: (studentId: string) => Attendance[];
  getRecordsByCourseAndDate: (courseId: string, date: string) => Attendance[];
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => {
        const { records } = get();
        // Rule 3: Prevent duplicate (studentId + courseId + date)
        const isDuplicate = records.some(
          (r) => r.studentId === record.studentId && 
                 r.courseId === record.courseId && 
                 r.date === record.date
        );

        if (isDuplicate) {
          return { success: false, message: 'هذا الطالب مسجل حضوره بالفعل لهذا الكورس في هذا اليوم' };
        }

        // Rule 5: lateMinutes logic
        const finalRecord: Attendance = {
          ...record,
          id: crypto.randomUUID(),
          lateMinutes: record.status === 'late' ? record.lateMinutes : undefined,
        };

        set((state) => ({
          records: [...state.records, finalRecord]
        }));

        return { success: true };
      },
      updateRecord: (id, updates) =>
        set((state) => ({
          records: state.records.map((r) => r.id === id ? { ...r, ...updates } : r)
        })),
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

