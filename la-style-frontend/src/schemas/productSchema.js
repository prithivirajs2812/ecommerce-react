// src/schemas/productSchema.js
import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.coerce.number({ invalid_type_error: 'Please select a category' }),
  image: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  discountPercent: z.coerce.number().min(0).max(90).nullable().optional(),
});