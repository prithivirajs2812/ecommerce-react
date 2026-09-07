// src/schemas/contactSchema.js
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message is too long'),
});
