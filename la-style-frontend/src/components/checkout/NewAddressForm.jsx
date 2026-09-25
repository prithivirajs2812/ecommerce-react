// src/components/checkout/NewAddressForm.jsx
import { useState } from 'react';
import { addressSchema } from '../../schemas/addressSchema';
import { validateForm } from '../../utils/validateForm';

export default function NewAddressForm({ initialValue, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    line1: initialValue?.line1 || '',
    line2: initialValue?.line2 || '',
    city: initialValue?.city || '',
    state: initialValue?.state || '',
    zip: initialValue?.zip || '',
    country: initialValue?.country || '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { success, errors } = validateForm(addressSchema, form);
    if (!success) {
      setFieldErrors(errors);
      setError(Object.values(errors)[0]);
      return;
    }
    setFieldErrors({});
    onSave(form);
  };

  const inputClass = (field) =>
    `border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink ${
      fieldErrors[field] ? 'border-red-300' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border border-gray-200 rounded-xl p-4" noValidate>
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <div>
        <input
          name="line1" placeholder="Address line 1" value={form.line1}
          onChange={handleChange}
          className={`w-full ${inputClass('line1')}`}
        />
        {fieldErrors.line1 && <p className="text-xs text-red-500 mt-1">{fieldErrors.line1}</p>}
      </div>

      <div>
        <input
          name="line2" placeholder="Address line 2 (optional)" value={form.line2}
          onChange={handleChange}
          className={`w-full ${inputClass('line2')}`}
        />
        {fieldErrors.line2 && <p className="text-xs text-red-500 mt-1">{fieldErrors.line2}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            name="city" placeholder="City" value={form.city}
            onChange={handleChange}
            className={`w-full ${inputClass('city')}`}
          />
          {fieldErrors.city && <p className="text-xs text-red-500 mt-1">{fieldErrors.city}</p>}
        </div>
        <div>
          <input
            name="state" placeholder="State" value={form.state}
            onChange={handleChange}
            className={`w-full ${inputClass('state')}`}
          />
          {fieldErrors.state && <p className="text-xs text-red-500 mt-1">{fieldErrors.state}</p>}
        </div>
        <div>
          <input
            name="zip" placeholder="ZIP code" value={form.zip}
            onChange={handleChange}
            className={`w-full ${inputClass('zip')}`}
          />
          {fieldErrors.zip && <p className="text-xs text-red-500 mt-1">{fieldErrors.zip}</p>}
        </div>
        <div>
          <input
            name="country" placeholder="Country" value={form.country}
            onChange={handleChange}
            className={`w-full ${inputClass('country')}`}
          />
          {fieldErrors.country && <p className="text-xs text-red-500 mt-1">{fieldErrors.country}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit" disabled={saving}
          className="bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          {saving ? 'Saving...' : initialValue ? 'Update Address' : 'Save Address'}
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
