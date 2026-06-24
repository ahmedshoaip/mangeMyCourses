import { z } from 'zod';
import { normalizeString } from '../utils/normalize';

export const courseSchema = z.object({
  courseName: z.string()
    .transform(normalizeString)
    .refine(val => val.length > 0, {
      message: 'اسم الكورس مطلوب'
    }),
  monthlyPrice: z.coerce.number()
    .min(0, { message: 'السعر لا يمكن أن يكون سالباً' }),
  daysOfWeek: z.array(z.string())
    .min(1, { message: 'اختر يوماً واحداً على الأقل' }),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().optional().default(''),
  status: z.enum(['Active', 'Inactive']).default('Active'),
}).refine((data) => {
  if (!data.startTime || !data.endTime) return true;
  return data.endTime > data.startTime;
}, {
  message: 'وقت الانتهاء يجب أن يكون بعد وقت البداية',
  path: ['endTime'],
});
