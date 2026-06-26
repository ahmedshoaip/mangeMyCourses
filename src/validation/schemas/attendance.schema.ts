import { z } from 'zod';

const statusMapping = {
  'حاضر': 'present',
  'غائب': 'absent',
  'متأخر': 'late',
  'present': 'present',
  'absent': 'absent',
  'late': 'late'
} as const;

export const attendanceSchema = z.object({
  studentId: z.string().min(1, { message: 'يجب اختيار طالب' }),
  courseId: z.string().min(1, { message: 'يجب اختيار كورس' }),
  date: z.string().min(1, { message: 'التاريخ مطلوب' }),
  status: z.enum(['حاضر', 'غائب', 'متأخر', 'present', 'absent', 'late'], {
    message: 'يجب اختيار حالة الحضور',
  }).transform(val => statusMapping[val as keyof typeof statusMapping]),
  lateMinutes: z.coerce.number().min(0, { message: 'عدد الدقائق لا يمكن أن يكون سالباً' }).default(0),
}).refine((data) => {
  if (data.status !== 'late' && data.lateMinutes > 0) {
    return false;
  }
  return true;
}, {
  message: 'لا يمكن إضافة دقائق تأخير إلا إذا كانت الحالة "متأخر"',
  path: ['lateMinutes'],
});
