// src/pages/SellerOrders.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSellerOrders } from '../api/orderApi';
import useAuthStore from '../store/useAuthStore';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import Pagination from '../components/product/Pagination';

export default function SellerOrders() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notSeller, setNotSeller] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      setNotSeller(false);
      try {
        const res = await getSellerOrders(page, 10);
        if (!ignore) {
          setOrders(res.data.content);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        if (ignore) return;
        if (err.response?.status === 403) {
          setNotSeller(true);
        } else {
          setError('Failed to load orders. Please try again.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, page]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center text-gray-400">
        Loading orders...
      </div>
    );
  }

  if (notSeller) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 text-lg mb-6">
          You need a seller account to view customer orders.
        </p>
        <button
          onClick={() => navigate('/become-seller')}
          className="inline-block bg-brand-pink hover:bg-pink-600 transition-colors text-white font-semibold px-6 py-3 rounded-lg"
        >
          Apply to Become a Seller
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display font-[800] text-3xl text-brand-deep mb-8">Customer Orders</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-20">
          No orders yet for your products.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              
<Link
  key={order.id}
  to={`/orders/${order.id}`}
  state={{ from: 'seller' }}
  className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6"
>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">Order #{order.id}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
  {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}
</span>
<span className="font-[700] text-brand-deep">₹{order.sellerSubtotal}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}