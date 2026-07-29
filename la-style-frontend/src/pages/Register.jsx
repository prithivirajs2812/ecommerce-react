// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import useAuthStore from '../store/useAuthStore';
import PasswordInput from '../components/common/PasswordInput';
import AuthLayout from '../components/layout/AuthLayout';

export default function Register() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await registerUser(form);
      login(response.data);
      navigate('/');
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.validationErrors;
      if (validationErrors) {
        setError(Object.values(validationErrors)[0]);
      } else {
        setError(backendMessage || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display font-[800] text-2xl text-brand-deep mb-1">Create Account</h1>
      <p className="text-gray-500 text-sm mb-6">Join LA Style today!</p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            name="firstName" placeholder="First name" value={form.firstName}
            onChange={handleChange} required
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
          <input
            name="lastName" placeholder="Last name" value={form.lastName}
            onChange={handleChange} required
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>
        <input
          name="email" type="email" placeholder="Email" value={form.email}
          onChange={handleChange} required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
        <input
          name="phone" placeholder="Phone" value={form.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
        <PasswordInput
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          type="submit" disabled={loading}
          className="w-full bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white font-semibold rounded-lg py-3"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-pink font-semibold hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}