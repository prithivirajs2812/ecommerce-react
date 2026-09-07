// src/utils/validateForm.js
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