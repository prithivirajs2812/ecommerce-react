// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import useAuthStore from '../store/useAuthStore';
import PasswordInput from '../components/common/PasswordInput';
import AuthLayout from '../components/layout/AuthLayout';
import { loginSchema } from '../schemas/authSchemas';
import { validateForm } from '../utils/validateForm';

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { success, errors } = validateForm(loginSchema, form);
    if (!success) {
      setFieldErrors(errors);
      setError(Object.values(errors)[0]);
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      const response = await loginUser(form);
      login(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display font-[800] text-2xl text-brand-deep mb-1">Login</h1>
      <p className="text-gray-500 text-sm mb-6">Welcome back! Please login to your account.</p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <input
            name="email" type="email" placeholder="Email" value={form.email}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink ${
              fieldErrors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
        </div>

        <div>
          <PasswordInput
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required={false}
          />
          {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white font-semibold rounded-lg py-3"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-pink font-semibold hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
