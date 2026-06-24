import { z } from 'zod';

export const enrollmentSchema = z.object({
  studentId: z.string().min(1, { message: 'يجب اختيار طالب' }),
  courseId: z.string().min(1, { message: 'يجب اختيار كورس' }),
});
