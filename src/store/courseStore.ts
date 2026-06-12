import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course } from '../types/course';

interface CourseState {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'createdDate'>) => void;
  updateCourse: (id: string, updates: Partial<Omit<Course, 'id'>>) => void;
  deleteCourse: (id: string) => void;
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
      addCourse: (course) =>
        set((state) => ({
          courses: [
            ...state.courses,
            {
              ...course,
              id: crypto.randomUUID(),
              createdDate: new Date().toISOString().split('T')[0],
            },
          ],
        })),
      updateCourse: (id, updates) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteCourse: (id) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
        })),
      getCourseById: (id) => get().courses.find((c) => c.id === id),
    }),
    {
      name: 'edumanage_courses',
    }
  )
);
