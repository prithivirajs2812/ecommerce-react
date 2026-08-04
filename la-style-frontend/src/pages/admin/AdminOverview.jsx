// src/pages/admin/AdminOverview.jsx
import { useState, useEffect } from 'react';
import { getAdminDashboard } from '../../api/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import NotAdminFallback from '../../components/admin/NotAdminFallback';

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      setForbidden(false);
      try {
        const res = await getAdminDashboard();
        if (!ignore) setData(res.data);
      } catch (err) {
        if (ignore) return;
        if (err.response?.status === 403) {
          setForbidden(true);
        } else {
          setError('Failed to load dashboard.');
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

  return (
    <AdminLayout>
      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : forbidden ? (
        <NotAdminFallback />
      ) : error || !data ? (
        <div className="text-center text-red-500 py-20">{error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          <StatCard label="Total Users" value={data.totalUsers} />
          <StatCard label="Total Sellers" value={data.totalSellers} />
          <StatCard label="Total Products" value={data.totalProducts} />
          <StatCard label="Total Orders" value={data.totalOrders} />
          <StatCard label="Total Revenue" value={`₹${data.totalRevenue}`} />
        </div>
      )}
    </AdminLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-[800] text-brand-deep">{value}</p>
    </div>
  );
}