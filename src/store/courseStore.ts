import { create } from 'zustand';
import type { Course } from '../types/course';
import { dbService } from '../db/dbService';

interface CourseState {
  courses: Course[];
  initialized: boolean;
  initialize: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id' | 'createdDate'>) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Omit<Course, 'id'>>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  getCourseById: (id: string) => Course | undefined;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    const rawCourses = await dbService.select<any>('SELECT * FROM courses');
    const courses = rawCourses.map(c => ({
      ...c,
      daysOfWeek: JSON.parse(c.daysOfWeek || '[]')
    }));
    set({ courses, initialized: true });
  },

  addCourse: async (course) => {
    const newCourse: Course = {
      ...course,
      id: crypto.randomUUID(),
      createdDate: new Date().toISOString().split('T')[0],
    };

    await dbService.insert(
      'INSERT INTO courses (id, courseName, monthlyPrice, daysOfWeek, startTime, endTime, description, status, createdDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
          newCourse.id, 
          newCourse.courseName, 
          newCourse.monthlyPrice, 
          JSON.stringify(newCourse.daysOfWeek), 
          newCourse.startTime, 
          newCourse.endTime, 
          newCourse.description, 
          newCourse.status, 
          newCourse.createdDate
      ]
    );

    set((state) => ({
      courses: [...state.courses, newCourse],
    }));
  },

  updateCourse: async (id, updates) => {
    const fields = Object.keys(updates);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const params = fields.map(f => {
        const val = (updates as any)[f];
        return Array.isArray(val) ? JSON.stringify(val) : val;
    });

    await dbService.insert(
      `UPDATE courses SET ${setClause} WHERE id = ?`,
      [...params, id]
    );

    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  deleteCourse: async (id) => {
    await dbService.execute(`DELETE FROM courses WHERE id = '${id}'`);
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
    }));
  },

  getCourseById: (id) => get().courses.find((c) => c.id === id),
}));

