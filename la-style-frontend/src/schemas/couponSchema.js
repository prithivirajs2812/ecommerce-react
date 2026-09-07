// src/schemas/couponSchema.js
import { z } from 'zod';

export const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(30),
  discountPercent: z.coerce.number().min(0.01, 'Must be greater than 0').max(100, 'Cannot exceed 100'),
  expiryDate: z.string().nullable().optional(),
});