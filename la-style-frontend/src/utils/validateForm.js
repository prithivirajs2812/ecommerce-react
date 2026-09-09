// src/utils/validateForm.js

/**
 * Runs a Zod schema against form data and returns a consistent shape:
 *   { success, data, errors }
 * `errors` is keyed by field name (first issue per field wins), so it can be
 * rendered either as `Object.values(errors)[0]` in a single banner (matching
 * the existing backend `validationErrors` pattern) or per-field under each
 * input via `errors.fieldName`.
 */
export function validateForm(schema, data) {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data, errors: {} };
  }

  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] ?? '_form';
    if (!errors[key]) errors[key] = issue.message;
  }

  return { success: false, data: null, errors };
}

/** Convenience for the common "just show me one message" case. */
export function firstError(errors) {
  const values = Object.values(errors);
  return values.length > 0 ? values[0] : '';
}
