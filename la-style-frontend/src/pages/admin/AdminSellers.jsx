// src/pages/admin/AdminSellers.jsx
import { useState, useEffect } from 'react';
import { getAllSellers, getPendingSellers, verifySeller } from '../../api/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import NotAdminFallback from '../../components/admin/NotAdminFallback';
import Pagination from '../../components/product/Pagination';

export default function AdminSellers() {
  const [filter, setFilter] = useState('all'); // 'all' | 'pending'
  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      setForbidden(false);
      try {
        const res = filter === 'pending'
          ? await getPendingSellers(page, 20)
          : await getAllSellers(page, 20);
        if (!ignore) {
          setSellers(res.data.content);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        if (ignore) return;
        if (err.response?.status === 403) {
          setForbidden(true);
        } else {
          setError('Failed to load sellers.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [filter, page]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(0);
  };

  const handleVerify = async (sellerId) => {
    setVerifyingId(sellerId);
    setError('');
    try {
      const res = await verifySeller(sellerId);
      setSellers((prev) =>
        filter === 'pending'
          ? prev.filter((s) => s.id !== sellerId)
          : prev.map((s) => (s.id === sellerId ? res.data : s))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Could not verify seller.');
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex gap-3 mb-6">
        {[
          { key: 'all', label: 'All Sellers' },
          { key: 'pending', label: 'Pending Verification' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              filter === tab.key
                ? 'border-brand-pink bg-pink-50/50 text-brand-pink'
                : 'border-gray-200 text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading...</div>
      ) : forbidden ? (
        <NotAdminFallback />
      ) : (
        <>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          {sellers.length === 0 ? (
            <p className="text-gray-500 text-center py-20">
              {filter === 'pending' ? 'No sellers awaiting verification.' : 'No sellers yet.'}
            </p>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="py-3 px-6 font-medium">Business Name</th>
                      <th className="py-3 px-6 font-medium">GST Number</th>
                      <th className="py-3 px-6 font-medium">Owner Email</th>
                      <th className="py-3 px-6 font-medium">Status</th>
                      <th className="py-3 px-6 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sellers.map((seller) => (
                      <tr key={seller.id}>
                        <td className="py-3 px-6 font-medium text-gray-800">{seller.businessName}</td>
                        <td className="py-3 px-6 text-gray-600">{seller.gstNumber}</td>
                        <td className="py-3 px-6 text-gray-600">{seller.ownerEmail}</td>
                        <td className="py-3 px-6">
                          <span className={seller.verified ? 'text-green-600' : 'text-yellow-600'}>
                            {seller.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-right">
                          {!seller.verified && (
                            <button
                              onClick={() => handleVerify(seller.id)}
                              disabled={verifyingId === seller.id}
                              className="text-brand-pink font-semibold hover:underline disabled:opacity-50"
                            >
                              {verifyingId === seller.id ? 'Verifying...' : 'Verify'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}
    </AdminLayout>
  );
}