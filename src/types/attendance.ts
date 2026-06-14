export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  lateMinutes?: number;
}

export type AttendanceInput = Omit<Attendance, 'id'>;
