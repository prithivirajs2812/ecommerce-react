// src/schemas/reviewSchema.js
import { z } from 'zod';
import { VALIDATION_MESSAGES as MSG } from '../constants/validationMessages';
import { VALIDATION_LIMITS as LIMITS } from '../constants/validationLimits';

export const reviewSchema = z.object({
  rating: z
    .number({ invalid_type_error: MSG.RATING_REQUIRED })
    .int()
    .min(LIMITS.RATING_MIN, MSG.RATING_REQUIRED)
    .max(LIMITS.RATING_MAX),
  comment: z.string().max(LIMITS.COMMENT_MAX, MSG.COMMENT_TOO_LONG).optional().or(z.literal('')),
});