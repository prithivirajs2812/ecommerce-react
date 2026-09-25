// src/schemas/categorySchema.js
import { z } from 'zod';
import { VALIDATION_MESSAGES as MSG } from '../constants/validationMessages';
import { VALIDATION_LIMITS as LIMITS } from '../constants/validationLimits';

export const categorySchema = z.object({
  name: z
    .string()
    .min(LIMITS.REQUIRED_MIN_LENGTH, MSG.CATEGORY_NAME_REQUIRED)
    .max(LIMITS.CATEGORY_NAME_MAX, MSG.CATEGORY_NAME_TOO_LONG),
  image: z.string().url(MSG.IMAGE_URL_INVALID).optional().or(z.literal('')),
});
