// src/constants/validationLimits.js
// Every numeric rule used by the Zod schemas lives here.
// Change a limit once and the schema (and its error message) stay in sync.
export const VALIDATION_LIMITS = Object.freeze({
  // Generic
  REQUIRED_MIN_LENGTH: 1,

  // Names
  PERSON_NAME_MAX: 50,   // first name, last name
  CONTACT_NAME_MAX: 100, // contact form "name"

  // Contact
  MESSAGE_MAX: 2000,

  // Password
  PASSWORD_MIN: 8,

  // Phone
  PHONE_LENGTH: 10,

  // Address
  ADDRESS_LINE_MAX: 200,
  CITY_MAX: 100,
  STATE_MAX: 100,
  COUNTRY_MAX: 100,
  ZIP_MIN_LENGTH: 4,
  ZIP_MAX_LENGTH: 10,

  // Review
  RATING_MIN: 1,
  RATING_MAX: 5,
  COMMENT_MAX: 1000,

  // Coupon
  COUPON_CODE_MAX: 30,
  COUPON_DISCOUNT_MIN: 0.01,
  COUPON_DISCOUNT_MAX: 100,

  // Product
  TITLE_MAX: 200,
  DESCRIPTION_MAX: 2000,
  STOCK_MIN: 0,
  PRODUCT_DISCOUNT_MIN: 0,
  PRODUCT_DISCOUNT_MAX: 90,
});

// Regexes that embed the limits above, built once so the numbers aren't repeated.
export const PHONE_REGEX = new RegExp(`^\\d{${VALIDATION_LIMITS.PHONE_LENGTH}}$`);
export const ZIP_REGEX = new RegExp(
  `^\\d{${VALIDATION_LIMITS.ZIP_MIN_LENGTH},${VALIDATION_LIMITS.ZIP_MAX_LENGTH}}$`
);