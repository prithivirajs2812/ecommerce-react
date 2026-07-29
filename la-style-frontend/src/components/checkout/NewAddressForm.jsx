// src/components/checkout/NewAddressForm.jsx
import { useState } from 'react';

export default function NewAddressForm({ onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    line1: '', line2: '', city: '', state: '', zip: '', country: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border border-gray-200 rounded-xl p-4">
      <input
        name="line1" placeholder="Address line 1" value={form.line1}
        onChange={handleChange} required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
      />
      <input
        name="line2" placeholder="Address line 2 (optional)" value={form.line2}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          name="city" placeholder="City" value={form.city}
          onChange={handleChange} required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
        <input
          name="state" placeholder="State" value={form.state}
          onChange={handleChange} required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
        <input
          name="zip" placeholder="ZIP code" value={form.zip}
          onChange={handleChange} required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
        <input
          name="country" placeholder="Country" value={form.country}
          onChange={handleChange} required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          type="submit" disabled={saving}
          className="bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          {saving ? 'Saving...' : 'Save Address'}
        </button>
        <button
          type="button" onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}