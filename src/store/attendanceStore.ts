import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Attendance, AttendanceInput } from '../types/attendance';

interface AttendanceState {
  records: Attendance[];
  addRecord: (record: AttendanceInput) => void;
  updateRecord: (id: string, updates: Partial<AttendanceInput>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByStudent: (studentId: string) => Attendance[];
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) =>
        set((state) => ({
          records: [
            ...state.records,
            { ...record, id: crypto.randomUUID() }
          ]
        })),
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
    }),
    {
      name: 'edumanage_attendance',
    }
  )
);
