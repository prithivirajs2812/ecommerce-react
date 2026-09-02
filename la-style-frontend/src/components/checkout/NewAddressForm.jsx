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
    <form onSubmit={handleSubmit} className="space-y-3 border border-brand-deep/10 rounded-xl p-5 font-ui">
      <input
        name="line1" placeholder="Address line 1" value={form.line1}
        onChange={handleChange} required
        className="w-full border border-brand-deep/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
      />
      <input
        name="line2" placeholder="Address line 2 (optional)" value={form.line2}
        onChange={handleChange}
        className="w-full border border-brand-deep/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          name="city" placeholder="City" value={form.city}
          onChange={handleChange} required
          className="border border-brand-deep/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
        />
        <input
          name="state" placeholder="State" value={form.state}
          onChange={handleChange} required
          className="border border-brand-deep/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
        />
        <input
          name="zip" placeholder="ZIP code" value={form.zip}
          onChange={handleChange} required
          className="border border-brand-deep/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
        />
        <input
          name="country" placeholder="Country" value={form.country}
          onChange={handleChange} required
          className="border border-brand-deep/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
        />
      </div>
      <div className="flex gap-4 pt-1">
        <button
          type="submit" disabled={saving}
          className="bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          {saving ? 'Saving...' : 'Save Address'}
        </button>
        <button
          type="button" onClick={onCancel}
          className="text-sm text-brand-deep/45 hover:text-brand-deep transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}