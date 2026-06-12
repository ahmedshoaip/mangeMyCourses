export type EnrollmentStatus = 'Active' | 'Stopped';

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  joinDate: string;
  status: EnrollmentStatus;
}

export type EnrollmentInput = Omit<Enrollment, 'id'>;
