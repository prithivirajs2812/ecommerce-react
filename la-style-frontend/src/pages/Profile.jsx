// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile, updateProfile, changePassword } from '../api/userApi';
import useAuthStore from '../store/useAuthStore';

export default function Profile() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Effect 1: auth guard only.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Effect 2: fetch profile.
  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;

    async function loadProfile() {
      setLoading(true);
      setLoadError('');
      try {
        const res = await getProfile();
        if (!ignore) setProfile(res.data);
      } catch {
        if (!ignore) setLoadError('Failed to load your profile. Please try again.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center text-gray-400">
        Loading your profile...
      </div>
    );
  }

  if (loadError || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-red-500 mb-4">{loadError}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-brand-pink font-semibold hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
      <h1 className="font-display font-[800] text-3xl text-brand-deep">My Profile</h1>

      <ProfileDetailsForm profile={profile} onSaved={setProfile} />
      <SellerStatusSection isSeller={profile.seller} />
      <PasswordChangeForm />
    </div>
  );
}

function ProfileDetailsForm({ profile, onSaved }) {
  const [form, setForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await updateProfile(form);
      onSaved(res.data);
      setSuccess(true);
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      if (validationErrors) {
        setError(Object.values(validationErrors)[0]);
      } else {
        setError(err.response?.data?.message || 'Could not update profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-semibold text-gray-800 mb-4">Account Details</h2>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
          Profile updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            value={profile.email}
            disabled
            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  );
}
// src/pages/Profile.jsx — only the SellerStatusSection function changes

function SellerStatusSection({ isSeller }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-semibold text-gray-800 mb-2">Seller Account</h2>

      {isSeller ? (
        <>
          <p className="text-sm text-gray-600 mb-3">
            You have a seller account on LA Style. Manage your listings and view your sales below.
          </p>
          <div className="flex gap-4">
            <Link
              to="/seller/dashboard"
              className="text-sm text-brand-pink font-semibold hover:underline"
            >
              Go to Dashboard →
            </Link>
            <Link
              to="/become-seller"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              View application status
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-3">
            Want to sell your own products on LA Style? Apply for a seller account to get started.
          </p>
          <Link
            to="/become-seller"
            className="inline-block bg-brand-pink hover:bg-pink-600 transition-colors text-white text-sm font-semibold px-5 py-2 rounded-lg"
          >
            Become a Seller
          </Link>
        </>
      )}
    </section>
  );
}





function PasswordChangeForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      if (validationErrors) {
        setError(Object.values(validationErrors)[0]);
      } else {
        setError(err.response?.data?.message || 'Could not change password. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-semibold text-gray-800 mb-4">Change Password</h2>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
          Password changed successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
          <p className="text-xs text-gray-400 mt-1">At least 8 characters, with at least one letter and one number.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
        >
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </section>
  );
}