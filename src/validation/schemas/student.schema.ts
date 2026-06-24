import { z } from 'zod';
import { normalizeString } from '../utils/normalize';

const egyptPhoneRegex = /^01[0125][0-9]{8}$/;

export const studentSchema = z.object({
  fullName: z.string()
    .transform(normalizeString)
    .refine(val => val.length >= 3, {
      message: 'الاسم مطلوب ويجب أن يكون 3 أحرف على الأقل'
    }),
  phoneNumber: z.string()
    .transform(val => val.trim())
    .refine(val => val === '' || egyptPhoneRegex.test(val), {
      message: 'رقم الهاتف المصري غير صحيح'
    }),
  parentPhoneNumber: z.string()
    .transform(val => val.trim())
    .refine(val => val === '' || egyptPhoneRegex.test(val), {
      message: 'رقم الهاتف المصري غير صحيح'
    }),
  notes: z.string().optional().default(''),
});
