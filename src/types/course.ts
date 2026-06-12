export type CourseStatus = 'Active' | 'Inactive';

export interface Course {
  id: string;
  courseName: string;
  monthlyPrice: number;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  description: string;
  status: CourseStatus;
  createdDate: string;
}

export type CourseInput = Omit<Course, 'id' | 'createdDate'>;
