// src/schemas/contactSchema.js
import { z } from 'zod';
import { VALIDATION_MESSAGES as MSG } from '../constants/validationMessages';
import { VALIDATION_LIMITS as LIMITS } from '../constants/validationLimits';

export const contactSchema = z.object({
  name: z
    .string()
    .min(LIMITS.REQUIRED_MIN_LENGTH, MSG.NAME_REQUIRED)
    .max(LIMITS.CONTACT_NAME_MAX, MSG.NAME_TOO_LONG),
  email: z.string().min(LIMITS.REQUIRED_MIN_LENGTH, MSG.EMAIL_REQUIRED).email(MSG.EMAIL_INVALID),
  message: z
    .string()
    .min(LIMITS.REQUIRED_MIN_LENGTH, MSG.MESSAGE_REQUIRED)
    .max(LIMITS.MESSAGE_MAX, MSG.MESSAGE_TOO_LONG),
});