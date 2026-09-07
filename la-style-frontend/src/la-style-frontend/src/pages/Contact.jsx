// src/pages/Contact.jsx
import { useState } from 'react';
import { submitContactMessage } from '../api/contactApi';
import { contactSchema } from '../schemas/contactSchema';
import { validateForm } from '../utils/validateForm';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { success, errors } = validateForm(contactSchema, form);
    if (!success) {
      setFieldErrors(errors);
      setError(Object.values(errors)[0]);
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      await submitContactMessage(form);
      setSubmitted(true);
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      if (validationErrors) {
        setError(Object.values(validationErrors)[0]);
      } else {
        setError(err.response?.data?.message || 'Could not send your message. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="font-display font-[800] text-3xl text-brand-deep mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">Have a question? Send us a message and we'll get back to you.</p>

      {submitted ? (
        <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">
          Thanks for reaching out! We'll respond to your message soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <input
              name="name" placeholder="Your name" value={form.name}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                fieldErrors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
          </div>

          <div>
            <input
              name="email" type="email" placeholder="Your email" value={form.email}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                fieldErrors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <textarea
              name="message" placeholder="Your message" value={form.message}
              onChange={handleChange} rows={5} maxLength={2000}
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink resize-none ${
                fieldErrors.message ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {fieldErrors.message && <p className="text-xs text-red-500 mt-1">{fieldErrors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white font-semibold rounded-lg py-3 px-6"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
