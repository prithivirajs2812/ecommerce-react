// src/components/admin/CategoryForm.jsx
import { useState } from 'react';
import { categorySchema } from '../../schemas/categorySchema';
import { validateForm } from '../../utils/validateForm';

export default function CategoryForm({ initialValue, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    name: initialValue?.name || '',
    image: initialValue?.image || '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { success, errors } = validateForm(categorySchema, form);
    if (!success) {
      setFieldErrors(errors);
      setError(Object.values(errors)[0]);
      return;
    }
    setFieldErrors({});

    try {
      await onSubmit(form);
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      if (validationErrors) {
        setError(Object.values(validationErrors)[0]);
      } else {
        setError(err.response?.data?.message || 'Could not save category.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4" noValidate>
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          maxLength={100}
          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink ${
            fieldErrors.name ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://..."
          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink ${
            fieldErrors.image ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {fieldErrors.image && <p className="text-xs text-red-500 mt-1">{fieldErrors.image}</p>}
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white text-sm font-semibold px-6 py-2.5 rounded-lg"
        >
          {submitting ? 'Saving...' : initialValue ? 'Update Category' : 'Create Category'}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>
    </form>
  );
}
