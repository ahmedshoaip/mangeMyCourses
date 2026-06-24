import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course } from '../types/course';
import { useAttendanceStore } from './attendanceStore';
import { courseSchema } from '../validation';


interface CourseState {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'createdDate'>) => { success: boolean; message?: string };
  updateCourse: (id: string, updates: Partial<Omit<Course, 'id'>>) => { success: boolean; message?: string };


  deleteCourse: (id: string) => { success: boolean; message?: string };
  getCourseById: (id: string) => Course | undefined;
}

const initialCourses: Course[] = [
  {
    id: 'c1',
    courseName: 'Advanced React 19',
    monthlyPrice: 150,
    daysOfWeek: ['Mon', 'Wed', 'Fri'],
    startTime: '18:00',
    endTime: '20:00',
    description: 'Deep dive into React 19 features.',
    status: 'Active',
    createdDate: '2026-05-15',
  },
  {
    id: 'c2',
    courseName: 'Fullstack JavaScript',
    monthlyPrice: 200,
    daysOfWeek: ['Tue', 'Thu'],
    startTime: '10:00',
    endTime: '13:00',
    description: 'Master Node.js and Express.',
    status: 'Active',
    createdDate: '2026-06-01',
  },
];

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: initialCourses,
      addCourse: (course) => {
        // 1. Validation
        const validation = courseSchema.safeParse(course);
        if (!validation.success) {
          return { success: false, message: validation.error.issues[0].message };
        }

        const normalized = validation.data as Omit<Course, 'id' | 'createdDate'>;

        set((state) => ({
          courses: [
            ...state.courses,
            {
              ...normalized,
              id: crypto.randomUUID(),
              createdDate: new Date().toISOString().split('T')[0],
            },
          ],
        }));
        return { success: true };
      },

  updateCourse: (id, updates) => {
    // 1. Partial Validation
    const existing = get().courses.find(c => c.id === id);
    if (!existing) return { success: false, message: 'الكورس غير موجود' };

    const merged = { ...existing, ...updates };
    const validation = courseSchema.safeParse(merged);

    if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message };
    }

    const normalized = validation.data;

    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === id ? { ...c, ...normalized } : c
      ),
    }));
    return { success: true };
  },

      deleteCourse: (id) => {
        // Rule 10: Check attendance
        const attendanceRecords = useAttendanceStore.getState().records;
        const hasAttendance = attendanceRecords.some(r => r.courseId === id);

        if (hasAttendance) {
          return { success: false, message: 'لا يمكن حذف هذا الكورس لوجود سجلات حضور مرتبطة به' };
        }

        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
        }));

        return { success: true };
      },
      getCourseById: (id) => get().courses.find((c) => c.id === id),
    }),
    {
      name: 'edumanage_courses',
    }
  )
);

