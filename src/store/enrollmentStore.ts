import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Enrollment, EnrollmentInput } from '../types/enrollment';
import { enrollmentSchema } from '../validation';


interface EnrollmentState {
  enrollments: Enrollment[];
  addEnrollment: (enrollment: EnrollmentInput) => { success: boolean; message?: string };
  updateEnrollment: (id: string, updates: Partial<EnrollmentInput>) => { success: boolean; message?: string };


  deleteEnrollment: (id: string) => void;
  getEnrollmentById: (id: string) => Enrollment | undefined;
}

export const useEnrollmentStore = create<EnrollmentState>()(
  persist(
    (set, get) => ({
      enrollments: [],
      addEnrollment: (enrollment) => {
        // 1. Validation
        const validation = enrollmentSchema.safeParse(enrollment);
        if (!validation.success) {
          return { success: false, message: validation.error.issues[0].message };
        }

        const { enrollments } = get();
        // 2. Business Rule: Unique enrollment (student + course)
        const isDuplicate = enrollments.some(
          (e) => e.studentId === enrollment.studentId && e.courseId === enrollment.courseId
        );

        if (isDuplicate) {
          return { success: false, message: 'الطالب مسجل بالفعل في هذا الكورس' };
        }

        set((state) => ({
          enrollments: [
            ...state.enrollments,
            {
              ...enrollment,
              id: crypto.randomUUID(),
              joinDate: new Date().toISOString().split('T')[0],
            },
          ],
        }));
        return { success: true };
      },

  updateEnrollment: (id, updates) => {
    // 1. Partial Validation
    const existing = get().enrollments.find(e => e.id === id);
    if (!existing) return { success: false, message: 'التسجيل غير موجود' };

    const merged = { ...existing, ...updates };
    const validation = enrollmentSchema.safeParse(merged);

    if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message };
    }

    const { enrollments } = get();
    // 2. Business Rule: Unique enrollment (student + course) - check if changed
    if (updates.studentId || updates.courseId) {
      const isDuplicate = enrollments.some(
        (e) => e.studentId === merged.studentId && e.courseId === merged.courseId && e.id !== id
      );
      if (isDuplicate) {
        return { success: false, message: 'الطالب مسجل بالفعل في هذا الكورس' };
      }
    }

    set((state) => ({
      enrollments: state.enrollments.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }));
    return { success: true };
  },

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
