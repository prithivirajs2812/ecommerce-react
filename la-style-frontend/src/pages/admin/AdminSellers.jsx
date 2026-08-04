// src/pages/admin/AdminCoupons.jsx
import { useState, useEffect } from 'react';
import { getAllCoupons, createCoupon, updateCoupon, deactivateCoupon } from '../../api/couponApi';
import AdminLayout from '../../components/admin/AdminLayout';
import NotAdminFallback from '../../components/admin/NotAdminFallback';
import CouponForm from '../../components/admin/CouponForm';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      setForbidden(false);
      try {
        const res = await getAllCoupons();
        if (!ignore) setCoupons(res.data);
      } catch (err) {
        if (ignore) return;
        if (err.response?.status === 403) {
          setForbidden(true);
        } else {
          setError('Failed to load coupons.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const handleCreate = () => {
    setEditingCoupon(null);
    setShowForm(true);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingCoupon) {
        const res = await updateCoupon(editingCoupon.id, data);
        setCoupons((prev) => prev.map((c) => (c.id === res.data.id ? res.data : c)));
      } else {
        const res = await createCoupon(data);
        setCoupons((prev) => [res.data, ...prev]);
      }
      setShowForm(false);
      setEditingCoupon(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (couponId) => {
    setDeactivatingId(couponId);
    setError('');
    try {
      const res = await deactivateCoupon(couponId);
      setCoupons((prev) => prev.map((c) => (c.id === couponId ? res.data : c)));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not deactivate coupon.');
    } finally {
      setDeactivatingId(null);
    }
  };

  return (
    <AdminLayout>
      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : forbidden ? (
        <NotAdminFallback />
      ) : (
        <>
          <div className="flex justify-end mb-6">
            {!showForm && (
              <button
                onClick={handleCreate}
                className="bg-brand-pink hover:bg-pink-600 transition-colors text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
              >
                + New Coupon
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          {showForm && (
            <div className="mb-8">
              <CouponForm
                initialValue={editingCoupon}
                submitting={submitting}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingCoupon(null);
                }}
              />
            </div>
          )}

          {coupons.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No coupons created yet.</p>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="py-3 px-6 font-medium">Code</th>
                    <th className="py-3 px-6 font-medium">Discount</th>
                    <th className="py-3 px-6 font-medium">Expiry</th>
                    <th className="py-3 px-6 font-medium">Status</th>
                    <th className="py-3 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td className="py-3 px-6 font-medium text-gray-800">{coupon.code}</td>
                      <td className="py-3 px-6 text-gray-600">{coupon.discountPercent}%</td>
                      <td className="py-3 px-6 text-gray-500">
                        {coupon.expiryDate
                          ? new Date(coupon.expiryDate).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })
                          : 'No expiry'}
                      </td>
                      <td className="py-3 px-6">
                        <span className={coupon.active ? 'text-green-600' : 'text-gray-400'}>
                          {coupon.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-brand-pink font-semibold hover:underline mr-4"
                        >
                          Edit
                        </button>
                        {coupon.active && (
                          <button
                            onClick={() => handleDeactivate(coupon.id)}
                            disabled={deactivatingId === coupon.id}
                            className="text-gray-500 hover:text-red-500 disabled:opacity-50"
                          >
                            {deactivatingId === coupon.id ? 'Deactivating...' : 'Deactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}