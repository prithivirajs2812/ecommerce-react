// src/schemas/couponSchema.js
import { z } from 'zod';
import { VALIDATION_MESSAGES as MSG } from '../constants/validationMessages';
import { VALIDATION_LIMITS as LIMITS } from '../constants/validationLimits';

export const couponSchema = z.object({
  code: z
    .string()
    .min(LIMITS.REQUIRED_MIN_LENGTH, MSG.COUPON_CODE_REQUIRED)
    .max(LIMITS.COUPON_CODE_MAX, MSG.COUPON_CODE_TOO_LONG),
  discountPercent: z.coerce
    .number({ invalid_type_error: MSG.COUPON_DISCOUNT_REQUIRED })
    .min(LIMITS.COUPON_DISCOUNT_MIN, MSG.COUPON_DISCOUNT_MIN)
    .max(LIMITS.COUPON_DISCOUNT_MAX, MSG.COUPON_DISCOUNT_MAX),
  expiryDate: z.string().nullable().optional().or(z.literal('')),
});