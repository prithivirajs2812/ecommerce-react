// src/pages/Orders.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getMyOrders } from '../api/orderApi';
import useAuthStore from '../store/useAuthStore';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import Pagination from '../components/product/Pagination';

export default function Orders() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '0', 10);

  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Effect 1: auth guard only — nothing else in here.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Effect 2: data fetching — only runs once we know we're authenticated.
  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;

    async function loadOrders() {
      setLoading(true);
      setError('');
      try {
        const res = await getMyOrders(page, 10);
        if (!ignore) {
          setOrders(res.data.content);
          setTotalPages(res.data.totalPages);
        }
      } catch {
        if (!ignore) setError('Failed to load your orders. Please try again.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadOrders();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, page]);

  const handlePageChange = (newPage) => setSearchParams({ page: newPage });

  if (!isAuthenticated) return null;

  // ...rest of the JSX stays exactly the same

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display font-[800] text-3xl text-brand-deep mb-8">My Orders</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-28" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/shop"
            className="inline-block bg-brand-pink hover:bg-pink-600 transition-colors text-white font-semibold px-6 py-3 rounded-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
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
                    <span className="font-[700] text-brand-deep">₹{order.totalAmount}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}