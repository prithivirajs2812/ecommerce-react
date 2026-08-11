// src/pages/Contact.jsx
import { useState } from 'react';
import { submitContactMessage } from '../api/contactApi';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <input
            name="name" placeholder="Your name" value={form.name}
            onChange={handleChange} required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
          <input
            name="email" type="email" placeholder="Your email" value={form.email}
            onChange={handleChange} required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
          <textarea
            name="message" placeholder="Your message" value={form.message}
            onChange={handleChange} required rows={5} maxLength={2000}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink resize-none"
          />
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