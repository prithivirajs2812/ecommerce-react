// src/schemas/couponSchema.js
import { z } from 'zod';

export const couponSchema = z.object({
  code: z
    .string()
    .min(1, 'Coupon code is required')
    .max(30, 'Coupon code is too long'),
  discountPercent: z.coerce
    .number({ invalid_type_error: 'Discount percent is required' })
    .min(0.01, 'Must be greater than 0')
    .max(100, 'Cannot exceed 100'),
  expiryDate: z.string().nullable().optional().or(z.literal('')),
});
