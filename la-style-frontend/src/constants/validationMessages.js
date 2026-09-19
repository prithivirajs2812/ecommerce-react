// src/constants/validationMessages.js
// Single source of truth for every validation message used in the Zod schemas.
// Messages that mention a number are built from validationLimits.js so they stay in sync.
import { VALIDATION_LIMITS as LIMITS } from './validationLimits';

// Change a message here and it updates everywhere it's used.
export const VALIDATION_MESSAGES = Object.freeze({
  // ---- Shared / auth ----
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Enter a valid email',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: `Password must be at least ${LIMITS.PASSWORD_MIN} characters`,
  PASSWORD_NEEDS_LETTER: 'Password must contain at least one letter',
  PASSWORD_NEEDS_NUMBER: 'Password must contain at least one number',
  FIRST_NAME_REQUIRED: 'First name is required',
  FIRST_NAME_TOO_LONG: 'First name is too long',
  LAST_NAME_REQUIRED: 'Last name is required',
  LAST_NAME_TOO_LONG: 'Last name is too long',
  PHONE_INVALID: `Enter a ${LIMITS.PHONE_LENGTH}-digit phone number`,

  // ---- Contact ----
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_LONG: 'Name is too long',
  MESSAGE_REQUIRED: 'Message is required',
  MESSAGE_TOO_LONG: 'Message is too long',

  // ---- Address ----
  ADDRESS_LINE1_REQUIRED: 'Address line 1 is required',
  CITY_REQUIRED: 'City is required',
  STATE_REQUIRED: 'State is required',
  ZIP_INVALID: 'Enter a valid ZIP/postal code',
  COUNTRY_REQUIRED: 'Country is required',

  // ---- Review ----
  RATING_REQUIRED: 'Please select a star rating',
  COMMENT_TOO_LONG: `Comment must be under ${LIMITS.COMMENT_MAX} characters`,

  // ---- Coupon ----
  COUPON_CODE_REQUIRED: 'Coupon code is required',
  COUPON_CODE_TOO_LONG: 'Coupon code is too long',
  COUPON_DISCOUNT_REQUIRED: 'Discount percent is required',
  COUPON_DISCOUNT_MIN: 'Must be greater than 0',
  COUPON_DISCOUNT_MAX: `Cannot exceed ${LIMITS.COUPON_DISCOUNT_MAX}`,

  // ---- Product ----
  TITLE_REQUIRED: 'Title is required',
  TITLE_TOO_LONG: 'Title is too long',
  DESCRIPTION_TOO_LONG: 'Description is too long',
  PRICE_REQUIRED: 'Price is required',
  PRICE_POSITIVE: 'Price must be greater than 0',
  STOCK_REQUIRED: 'Stock is required',
  STOCK_INTEGER: 'Stock must be a whole number',
  STOCK_NEGATIVE: 'Stock cannot be negative',
  CATEGORY_REQUIRED: 'Please select a category',
  IMAGE_URL_INVALID: 'Enter a valid image URL',
  PRODUCT_DISCOUNT_NEGATIVE: 'Cannot be negative',
  PRODUCT_DISCOUNT_MAX: `Cannot exceed ${LIMITS.PRODUCT_DISCOUNT_MAX}`,

  // ---- Profile / change password ----
  CURRENT_PASSWORD_REQUIRED: 'Current password is required',
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your new password',
  PASSWORDS_DO_NOT_MATCH: 'New password and confirmation do not match',
});