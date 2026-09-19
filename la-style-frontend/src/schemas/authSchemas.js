// src/schemas/authSchemas.js
import { z } from 'zod';
import { VALIDATION_MESSAGES as MSG } from '../constants/validationMessages';
import { VALIDATION_LIMITS as LIMITS, PHONE_REGEX } from '../constants/validationLimits';

export const loginSchema = z.object({
  email: z.string().min(LIMITS.REQUIRED_MIN_LENGTH, MSG.EMAIL_REQUIRED).email(MSG.EMAIL_INVALID),
  password: z.string().min(LIMITS.REQUIRED_MIN_LENGTH, MSG.PASSWORD_REQUIRED),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(LIMITS.REQUIRED_MIN_LENGTH, MSG.FIRST_NAME_REQUIRED)
    .max(LIMITS.PERSON_NAME_MAX, MSG.FIRST_NAME_TOO_LONG),
  lastName: z
    .string()
    .min(LIMITS.REQUIRED_MIN_LENGTH, MSG.LAST_NAME_REQUIRED)
    .max(LIMITS.PERSON_NAME_MAX, MSG.LAST_NAME_TOO_LONG),
  email: z.string().min(LIMITS.REQUIRED_MIN_LENGTH, MSG.EMAIL_REQUIRED).email(MSG.EMAIL_INVALID),
  phone: z.string().regex(PHONE_REGEX, MSG.PHONE_INVALID).or(z.literal('')),
  password: z
    .string()
    .min(LIMITS.PASSWORD_MIN, MSG.PASSWORD_MIN_LENGTH)
    .regex(/[A-Za-z]/, MSG.PASSWORD_NEEDS_LETTER)
    .regex(/[0-9]/, MSG.PASSWORD_NEEDS_NUMBER),
});