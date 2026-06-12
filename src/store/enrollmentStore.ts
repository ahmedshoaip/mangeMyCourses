import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Enrollment } from '../types/enrollment';

interface EnrollmentState {
  enrollments: Enrollment[];
  addEnrollment: (enrollment: Omit<Enrollment, 'id'>) => void;
  updateEnrollment: (id: string, updates: Partial<Omit<Enrollment, 'id'>>) => void;
  deleteEnrollment: (id: string) => void;
  getEnrollmentById: (id: string) => Enrollment | undefined;
}

export const useEnrollmentStore = create<EnrollmentState>()(
  persist(
    (set, get) => ({
      enrollments: [],
      addEnrollment: (enrollment) =>
        set((state) => ({
          enrollments: [
            ...state.enrollments,
            {
              ...enrollment,
              id: crypto.randomUUID(),
            },
          ],
        })),
      updateEnrollment: (id, updates) =>
        set((state) => ({
          enrollments: state.enrollments.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      deleteEnrollment: (id) =>
        set((state) => ({
          enrollments: state.enrollments.filter((e) => e.id !== id),
        })),
      getEnrollmentById: (id) => get().enrollments.find((e) => e.id === id),
    }),
    {
      name: 'edumanage_enrollments',
    }
  )
);
