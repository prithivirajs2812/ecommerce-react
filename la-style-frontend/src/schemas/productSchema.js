// src/schemas/productSchema.js
import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional().or(z.literal('')),
  price: z.coerce
    .number({ invalid_type_error: 'Price is required' })
    .positive('Price must be greater than 0'),
  stock: z.coerce
    .number({ invalid_type_error: 'Stock is required' })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  categoryId: z.coerce
    .number({ invalid_type_error: 'Please select a category' })
    .positive('Please select a category'),
  image: z.string().url('Enter a valid image URL').optional().or(z.literal('')),
  discountPercent: z
    .union([z.coerce.number().min(0, 'Cannot be negative').max(90, 'Cannot exceed 90'), z.literal('')])
    .nullable()
    .optional(),
});
