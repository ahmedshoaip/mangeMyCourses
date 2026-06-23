import type { Student } from '../../types/student';
import type { Course } from '../../types/course';
import type { Enrollment } from '../../types/enrollment';
import type { Attendance } from '../../types/attendance';
import type { Payment } from '../../types/payment';
import type { RentRecord } from '../../types/rent';


export interface BackupMetadata {
  appName: string;
  version: string;
  createdAt: string;
}

export interface BackupData {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  attendance: Attendance[];
  payments: Payment[];
  rent: RentRecord[];
}

export interface AppBackup {
  metadata: BackupMetadata;
  data: BackupData;
}
