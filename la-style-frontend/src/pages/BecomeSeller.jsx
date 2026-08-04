// src/pages/BecomeSeller.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAsSeller, getMySellerProfile } from '../api/sellerApi';
import useAuthStore from '../store/useAuthStore';

export default function BecomeSeller() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = !!accessToken;

  const [checking, setChecking] = useState(true);
  const [existingProfile, setExistingProfile] = useState(null);

  const [form, setForm] = useState({ businessName: '', gstNumber: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Effect 1: auth guard.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Effect 2: check if the user already has a seller profile.
  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;

    async function checkExisting() {
      setChecking(true);
      try {
        const res = await getMySellerProfile();
        if (!ignore) setExistingProfile(res.data);
      } catch {
        // 404 means no profile yet — that's the expected "eligible to apply" case.
        if (!ignore) setExistingProfile(null);
      } finally {
        if (!ignore) setChecking(false);
      }
    }

    checkExisting();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await registerAsSeller(form);
      setExistingProfile(res.data);
      setSubmitted(true);
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      if (validationErrors) {
        setError(Object.values(validationErrors)[0]);
      } else {
        setError(err.response?.data?.message || 'Could not submit your application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReLogin = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  if (checking) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center text-gray-400">
        Checking your seller status...
      </div>
    );
  }

  if (existingProfile) {
    return (
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="font-display font-[800] text-3xl text-brand-deep mb-6">Seller Account</h1>

        {submitted && (
          <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
            Application submitted! An admin needs to verify your account before you can list products.
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          <div>
            <p className="text-sm text-gray-500">Business Name</p>
            <p className="font-medium text-gray-800">{existingProfile.businessName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">GST Number</p>
            <p className="font-medium text-gray-800">{existingProfile.gstNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={`font-medium ${existingProfile.verified ? 'text-green-600' : 'text-yellow-600'}`}>
              {existingProfile.verified ? 'Verified' : 'Pending verification'}
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 text-yellow-800 text-sm rounded-lg px-4 py-3 mt-6">
          Seller permissions are attached to your login session. If you were just approved or just
          registered, log out and log back in for full seller access to take effect.
          <button
            onClick={handleReLogin}
            className="block mt-2 text-brand-pink font-semibold hover:underline"
          >
            Log out and log back in
          </button>
        </div>

        <Link to="/profile" className="inline-block mt-6 text-sm text-brand-pink font-semibold hover:underline">
          ← Back to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="font-display font-[800] text-3xl text-brand-deep mb-2">Become a Seller</h1>
      <p className="text-gray-500 text-sm mb-6">
        Fill out your business details below. An admin will review and verify your account before
        you can start listing products.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
          <input
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
          <input
            name="gstNumber"
            value={form.gstNumber}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white font-semibold rounded-lg py-3"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}