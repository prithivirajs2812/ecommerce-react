// src/pages/SellerDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSellerDashboard } from '../api/dashboardApi';

export default function SellerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      setLoading(true);
      setError('');
      try {
        const res = await getSellerDashboard();
        if (!ignore) setData(res.data);
      } catch {
        if (!ignore) setError('Failed to load your dashboard. Please try again.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-400">
        Loading your dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-[800] text-3xl text-brand-deep">Seller Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/seller/orders" className="text-sm text-brand-pink font-semibold hover:underline">
            Customer Orders →
          </Link>
          <Link to="/seller/products" className="text-sm text-brand-pink font-semibold hover:underline">
            Manage Products →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        <StatCard label="Total Orders" value={data.totalOrders} />
        <StatCard label="Total Revenue" value={`₹${data.totalRevenue}`} />
        <StatCard label="Units Sold" value={data.totalUnitsSold} />
        <StatCard label="Products Listed" value={data.totalProducts} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Top Performing Products</h2>

        {data.topProducts.length === 0 ? (
          <p className="text-gray-500 text-sm py-6">
            No sales data yet. Once your products start selling, top performers will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="py-2 font-medium">Product</th>
                  <th className="py-2 font-medium text-right">Units Sold</th>
                  <th className="py-2 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.topProducts.map((product) => (
                  <tr key={product.productId}>
                    <td className="py-3">
                      <Link
                        to={`/products/${product.productId}`}
                        className="text-gray-800 hover:text-brand-pink transition-colors font-medium"
                      >
                        {product.productTitle}
                      </Link>
                    </td>
                    <td className="py-3 text-right text-gray-600">{product.unitsSold}</td>
                    <td className="py-3 text-right font-[700] text-brand-deep">₹{product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
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