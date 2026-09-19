// src/schemas/addressSchema.js
import { z } from 'zod';
import { VALIDATION_MESSAGES as MSG } from '../constants/validationMessages';
import { VALIDATION_LIMITS as LIMITS, ZIP_REGEX } from '../constants/validationLimits';

export const addressSchema = z.object({
  line1: z
    .string()
    .min(LIMITS.REQUIRED_MIN_LENGTH, MSG.ADDRESS_LINE1_REQUIRED)
    .max(LIMITS.ADDRESS_LINE_MAX),
  line2: z.string().max(LIMITS.ADDRESS_LINE_MAX).optional().or(z.literal('')),
  city: z.string().min(LIMITS.REQUIRED_MIN_LENGTH, MSG.CITY_REQUIRED).max(LIMITS.CITY_MAX),
  state: z.string().min(LIMITS.REQUIRED_MIN_LENGTH, MSG.STATE_REQUIRED).max(LIMITS.STATE_MAX),
  zip: z.string().regex(ZIP_REGEX, MSG.ZIP_INVALID),
  country: z.string().min(LIMITS.REQUIRED_MIN_LENGTH, MSG.COUNTRY_REQUIRED).max(LIMITS.COUNTRY_MAX),
});