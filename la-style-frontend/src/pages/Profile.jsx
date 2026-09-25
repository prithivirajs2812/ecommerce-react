// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile, updateProfile, changePassword } from '../api/userApi';
import { getMyAddresses, createAddress, updateAddress, deleteAddress } from '../api/addressApi';
import useAuthStore from '../store/useAuthStore';
import { profileDetailsSchema, passwordChangeSchema } from '../schemas/profileSchema';
import { validateForm } from '../utils/validateForm';
import Skeleton from '../components/common/Skeleton';
import NewAddressForm from '../components/checkout/NewAddressForm';

// Same wrapper for loading, error and loaded states, so the page height never
// collapses while the profile is fetched (which is what made the footer jump
// up to the top of the screen during the route transition).
function PageBackground({ children }) {
  return <div className="min-h-screen bg-brand-cream">{children}</div>;
}

// Placeholder that mirrors the real layout: heading + two columns of cards.
function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Skeleton className="h-9 w-48 mb-8" />
      <div className="grid md:grid-cols-2 gap-4 items-start">
        <Skeleton className="h-[26rem] rounded-2xl" />
        <div className="space-y-6">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-[26rem] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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
      <PageBackground>
        <ProfileSkeleton />
      </PageBackground>
    );
  }

  if (loadError || !profile) {
    return (
      <PageBackground>
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-red-500 mb-4">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-brand-pink font-semibold hover:underline"
          >
            Try again
          </button>
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display font-[800] text-3xl text-brand-deep mb-8">My Profile</h1>

        <div className="grid md:grid-cols-2 gap-4 items-start">
          <div className="space-y-6">
            <ProfileDetailsForm profile={profile} onSaved={setProfile} />
            <AddressManager />
          </div>

          <div className="space-y-6">
            <SellerStatusSection isSeller={profile.seller} />
            <PasswordChangeForm />
          </div>
        </div>
      </div>
    </PageBackground>
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    const { success, errors } = validateForm(profileDetailsSchema, form);
    if (!success) {
      setFieldErrors(errors);
      setError(Object.values(errors)[0]);
      setSaving(false);
      return;
    }
    setFieldErrors({});

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

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                fieldErrors.firstName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {fieldErrors.firstName && <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                fieldErrors.lastName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {fieldErrors.lastName && <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>}
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
            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink ${
              fieldErrors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
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

function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getMyAddresses();
        if (!ignore) setAddresses(res.data);
      } catch {
        if (!ignore) setError('Failed to load your addresses.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const handleAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleSave = async (data) => {
    setSaving(true);
    setError('');
    try {
      if (editingAddress) {
        const res = await updateAddress(editingAddress.id, data);
        setAddresses((prev) => prev.map((a) => (a.id === res.data.id ? res.data : a)));
      } else {
        const res = await createAddress(data);
        setAddresses((prev) => [...prev, res.data]);
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    setDeletingId(addressId);
    setError('');
    try {
      await deleteAddress(addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete address.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Saved Addresses</h2>
        {!showForm && (
          <button
            onClick={handleAdd}
            className="text-sm text-brand-pink font-semibold hover:underline"
          >
            + Add Address
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      {showForm && (
        <div className="mb-4">
          <NewAddressForm
            initialValue={editingAddress}
            saving={saving}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading addresses...</p>
      ) : addresses.length === 0 && !showForm ? (
        <p className="text-sm text-gray-500">
          You haven't saved any addresses yet. They'll also be saved automatically at checkout.
        </p>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4"
            >
              <div className="text-sm text-gray-700">
                <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                <p>{addr.city}, {addr.state} {addr.zip}</p>
                <p>{addr.country}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => handleEdit(addr)}
                  className="text-xs text-brand-pink font-semibold hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={deletingId === addr.id}
                  className="text-xs text-gray-500 hover:text-red-500 disabled:opacity-50"
                >
                  {deletingId === addr.id ? 'Removing...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const { success, errors } = validateForm(passwordChangeSchema, form);
    if (!success) {
      setFieldErrors(errors);
      setError(Object.values(errors)[0]);
      return;
    }
    setFieldErrors({});

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

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink ${
              fieldErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {fieldErrors.currentPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.currentPassword}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink ${
              fieldErrors.newPassword ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <p className="text-xs text-gray-400 mt-1">At least 8 characters, with at least one letter and one number.</p>
          {fieldErrors.newPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.newPassword}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink ${
              fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
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