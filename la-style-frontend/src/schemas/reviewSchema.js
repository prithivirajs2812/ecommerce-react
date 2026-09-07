// src/schemas/reviewSchema.js
import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Please select a star rating').max(5),
  comment: z.string().max(1000, 'Comment must be under 1000 characters').optional().or(z.literal('')),
});