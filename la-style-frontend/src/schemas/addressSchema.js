// src/schemas/addressSchema.js
import { z } from 'zod';

export const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required').max(200),
  line2: z.string().max(200).optional().or(z.literal('')),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  zip: z.string().regex(/^\d{4,10}$/, 'Enter a valid ZIP/postal code'),
  country: z.string().min(1, 'Country is required').max(100),
});