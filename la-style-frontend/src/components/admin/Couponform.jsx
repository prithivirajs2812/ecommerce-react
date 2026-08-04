// src/components/admin/CouponForm.jsx
import { useState } from 'react';

export default function CouponForm({ initialValue, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    code: initialValue?.code || '',
    discountPercent: initialValue?.discountPercent || '',
    expiryDate: initialValue?.expiryDate ? initialValue.expiryDate.slice(0, 16) : '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit({
        code: form.code,
        discountPercent: parseFloat(form.discountPercent),
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
      });
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      if (validationErrors) {
        setError(Object.values(validationErrors)[0]);
      } else {
        setError(err.response?.data?.message || 'Could not save coupon.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          maxLength={30}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink uppercase"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percent</label>
        <input
          type="number"
          name="discountPercent"
          value={form.discountPercent}
          onChange={handleChange}
          required
          min="0.01"
          max="100"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (optional)</label>
        <input
          type="datetime-local"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white text-sm font-semibold px-6 py-2.5 rounded-lg"
        >
          {submitting ? 'Saving...' : initialValue ? 'Update Coupon' : 'Create Coupon'}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>
    </form>
  );
}