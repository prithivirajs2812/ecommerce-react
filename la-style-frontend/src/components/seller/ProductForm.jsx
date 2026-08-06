// src/components/seller/ProductForm.jsx
import { useState } from 'react';

export default function ProductForm({ initialValue, categories, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    title: initialValue?.title || '',
    description: initialValue?.description || '',
    price: initialValue?.price || '',
    stock: initialValue?.stock ?? '',
    image: initialValue?.image || '',
    categoryId: initialValue?.categoryId || '',
  });
  const [error, setError] = useState('');

  // Derived, not stored: falls back to the first category once categories
  // have loaded, without ever needing an effect to push a default into state.
  const effectiveCategoryId = form.categoryId || categories[0]?.id || '';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        categoryId: Number(effectiveCategoryId),
      });
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      if (validationErrors) {
        setError(Object.values(validationErrors)[0]);
      } else {
        setError(err.response?.data?.message || 'Could not save product. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          maxLength={200}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          maxLength={2000}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            step="1"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          name="categoryId"
          value={effectiveCategoryId}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink bg-white"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white text-sm font-semibold px-6 py-2.5 rounded-lg"
        >
          {submitting ? 'Saving...' : initialValue ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}