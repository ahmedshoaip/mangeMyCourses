import { z } from 'zod';

export const paymentSchema = z.object({
  studentId: z.string().min(1, { message: 'يجب اختيار طالب' }),
  amount: z.coerce.number().min(0, { message: 'المبلغ لا يمكن أن يكون سالباً' }),
  dueDate: z.string().min(1, { message: 'تاريخ الاستحقاق مطلوب' }),
  status: z.enum(['paid', 'unpaid', 'overdue'], {
    message: 'يجب اختيار حالة الدفع',
  }),
  courseId: z.string().optional(),
  notes: z.string().optional(),
});
