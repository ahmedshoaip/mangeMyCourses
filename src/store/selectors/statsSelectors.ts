import { useStudentStore } from '../studentStore';
import { useCourseStore } from '../courseStore';
import { useEnrollmentStore } from '../enrollmentStore';
import { useAttendanceStore } from '../attendanceStore';
import { usePaymentStore } from '../paymentStore';
import { useRentStore } from '../rentStore';

export const useDashboardStats = () => {
  const students = useStudentStore((state) => state.students);
  const courses = useCourseStore((state) => state.courses);
  const enrollments = useEnrollmentStore((state) => state.enrollments);
  const attendance = useAttendanceStore((state) => state.records);
  const payments = usePaymentStore((state) => state.payments);
  const rent = useRentStore((state) => state.records);

  // Student Stats
  const totalStudents = students.length;
  const activeStudents = new Set(enrollments.map(e => e.studentId)).size;
  const lateStudents = new Set(payments.filter(p => p.status === 'overdue').map(p => p.studentId)).size;

  // Attendance Stats
  const totalAttendance = attendance.length;
  const absences = attendance.filter(r => r.status === 'absent').length;
  const presenceRate = totalAttendance > 0 
    ? Math.round(((totalAttendance - absences) / totalAttendance) * 100) 
    : 0;

  // Finance Stats
  const totalRevenue = payments.reduce((acc, p) => acc + (p.status === 'paid' ? p.amount : 0), 0);
  const pendingRevenue = payments.reduce((acc, p) => acc + (p.status === 'unpaid' ? p.amount : 0), 0);
  const overdueRevenue = payments.reduce((acc, p) => acc + (p.status === 'overdue' ? p.amount : 0), 0);
  const totalRent = rent.reduce((acc, r) => acc + r.totalCost, 0);
  const netProfit = totalRevenue - totalRent;

  // Course Stats
  const totalCourses = courses.length;
  const avgEnrollment = totalCourses > 0 ? (enrollments.length / totalCourses).toFixed(1) : 0;

  return {
    students: { totalStudents, activeStudents, lateStudents },
    attendance: { totalAttendance, absences, presenceRate },
    finance: { totalRevenue, pendingRevenue, overdueRevenue, totalRent, netProfit },
    courses: { totalCourses, avgEnrollment }
  };
};
