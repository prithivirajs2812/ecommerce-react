// src/schemas/productSchema.js
import { z } from 'zod';
import { VALIDATION_MESSAGES as MSG } from '../constants/validationMessages';
import { VALIDATION_LIMITS as LIMITS } from '../constants/validationLimits';

export const productSchema = z.object({
  title: z
    .string()
    .min(LIMITS.REQUIRED_MIN_LENGTH, MSG.TITLE_REQUIRED)
    .max(LIMITS.TITLE_MAX, MSG.TITLE_TOO_LONG),
  description: z
    .string()
    .max(LIMITS.DESCRIPTION_MAX, MSG.DESCRIPTION_TOO_LONG)
    .optional()
    .or(z.literal('')),
  price: z.coerce
    .number({ invalid_type_error: MSG.PRICE_REQUIRED })
    .positive(MSG.PRICE_POSITIVE),
  stock: z.coerce
    .number({ invalid_type_error: MSG.STOCK_REQUIRED })
    .int(MSG.STOCK_INTEGER)
    .min(LIMITS.STOCK_MIN, MSG.STOCK_NEGATIVE),
  categoryId: z.coerce
    .number({ invalid_type_error: MSG.CATEGORY_REQUIRED })
    .positive(MSG.CATEGORY_REQUIRED),
  image: z.string().url(MSG.IMAGE_URL_INVALID).optional().or(z.literal('')),
  discountPercent: z
    .union([
      z.coerce
        .number()
        .min(LIMITS.PRODUCT_DISCOUNT_MIN, MSG.PRODUCT_DISCOUNT_NEGATIVE)
        .max(LIMITS.PRODUCT_DISCOUNT_MAX, MSG.PRODUCT_DISCOUNT_MAX),
      z.literal(''),
    ])
    .nullable()
    .optional(),
});