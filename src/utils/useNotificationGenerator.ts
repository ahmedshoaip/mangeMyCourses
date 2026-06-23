import { useEffect } from 'react';
import { usePaymentStore } from '../store/paymentStore';
import { useAttendanceStore } from '../store/attendanceStore';
import { useNotificationStore } from '../store/notificationStore';

export const useNotificationGenerator = () => {
const payments = usePaymentStore((state) => state.payments);
const attendance = useAttendanceStore((state) => state.records);

const notifications = useNotificationStore(
 (state) => state.notifications
);

const addNotification = useNotificationStore(
 (state) => state.addNotification
);

  useEffect(() => {
    // 1. Check for Overdue Payments
    payments.forEach(p => {
      const isOverdue = new Date(p.dueDate) < new Date() && p.status !== 'paid';
      if (isOverdue) {
        const exists = notifications.some(n => n.title.includes(p.id)); // Use ID in check to prevent duplicates
        if (!exists) {
          addNotification({
            title: `Payment Overdue [${p.id.slice(0,4)}]`,
            message: `A payment of $${p.amount} is overdue since ${p.dueDate}.`,
            type: 'payment'
          });
        }
      }
    });

    // 2. Check for High Absences
    const studentAbsences: Record<string, number> = {};
    attendance.forEach(r => {
      if (r.status === 'absent') {
        studentAbsences[r.studentId] = (studentAbsences[r.studentId] || 0) + 1;
      }
    });

    Object.entries(studentAbsences).forEach(([studentId, count]) => {
      if (count >= 3) {
        const exists = notifications.some(n => n.title.includes(`Absences ${studentId}`));
        if (!exists) {
          addNotification({
            title: `High Absences ${studentId}`,
            message: `Student has missed ${count} sessions. Please follow up.`,
            type: 'attendance'
          });
        }
      }
    });
  }, [payments, attendance]);
};
