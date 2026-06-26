import { z } from 'zod';

export const rentSchema = z.object({
  rate: z.coerce.number().min(0, { message: 'السعر لا يمكن أن يكون سالباً' }),
  usageHours: z.coerce.number().min(0, { message: 'عدد الساعات لا يمكن أن يكون سالباً' }),
  date: z.string().min(1, { message: 'التاريخ مطلوب' }),
  notes: z.string().optional(),
});
