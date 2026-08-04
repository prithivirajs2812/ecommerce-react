// src/pages/OrderDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { getOrderById } from '../api/orderApi';
import useAuthStore from '../store/useAuthStore';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import OrderStatusUpdater from '../components/order/OrderStatusUpdater';

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const roles = useAuthStore((state) => state.roles) || [];
  const isAuthenticated = !!accessToken;
  const canManageStatus = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SELLER');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const justPlaced = location.state?.justPlaced;

  // Effect 1: auth guard only.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Effect 2: fetch the order — only once we know we're authenticated.
  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;

    async function loadOrder() {
      setLoading(true);
      setError('');
      setNotFound(false);
      try {
        const res = await getOrderById(id);
        if (!ignore) setOrder(res.data);
      } catch (err) {
        if (ignore) return;
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load order details. Please try again.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadOrder();

    return () => {
      ignore = true;
    };
  }, [id, isAuthenticated]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400">
        Loading order details...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 text-lg mb-4">Order not found.</p>
        <Link to="/orders" className="text-brand-pink font-semibold hover:underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/orders" className="text-brand-pink font-semibold hover:underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {justPlaced && (
        <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
          Your order was placed successfully!
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="font-display font-[800] text-3xl text-brand-deep">
            Order #{order.id}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm px-6 divide-y divide-gray-100">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-5">
              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.productId}`}
                  className="font-medium text-gray-800 hover:text-brand-pink transition-colors truncate block"
                >
                  {item.productTitle}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  ₹{item.priceAtPurchase} × {item.quantity}
                </p>
              </div>

              <div className="font-[700] text-brand-deep shrink-0">
                ₹{item.lineTotal}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit space-y-4">
            <div>
              <h2 className="font-semibold text-gray-800 mb-2">Payment</h2>
              <p className="text-sm text-gray-600">
                Method: <span className="font-medium">{order.paymentMethod}</span>
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium">{order.paymentStatus}</span>
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between font-[700] text-brand-deep">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          {canManageStatus && (
            <OrderStatusUpdater order={order} onStatusChanged={setOrder} />
          )}
        </div>
      </div>

      <Link to="/orders" className="inline-block mt-8 text-sm text-brand-pink font-semibold hover:underline">
        ← Back to My Orders
      </Link>
    </div>
  );
}