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
  const fromSeller = location.state?.from === 'seller';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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
      <div className="max-w-4xl mx-auto px-6 py-24 text-center font-ui text-brand-deep/40">
        Loading order details…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="font-display text-lg text-brand-deep/60 mb-4">Order not found.</p>
        <Link to="/orders" className="text-brand-pink font-ui text-sm font-medium hover:underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-red-500 font-ui text-sm mb-4">{error}</p>
        <Link to="/orders" className="text-brand-pink font-ui text-sm font-medium hover:underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {justPlaced && (
        <div className="border border-green-200 bg-green-50 text-green-700 text-[13px] font-ui rounded-lg px-4 py-3 mb-6">
          Your order was placed successfully!
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3 mb-10">
        <div>
          <h1 className="font-display text-3xl text-brand-deep">
            Order #{order.id}
          </h1>
          <p className="text-[13px] font-ui text-brand-deep/50 mt-1">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 bg-white rounded-xl border border-brand-deep/8 px-6 divide-y divide-brand-deep/8">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-5">
              <div className="w-16 h-16 bg-brand-ivory rounded-lg overflow-hidden shrink-0 border border-brand-deep/8">
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-deep/25 text-xs font-ui">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.productId}`}
                  className="font-display text-[15px] text-brand-deep hover:text-brand-pink transition-colors truncate block"
                >
                  {item.productTitle}
                </Link>
                <p className="text-[13px] font-ui text-brand-deep/50 mt-1">
                  ₹{item.priceAtPurchase} × {item.quantity}
                </p>
              </div>

              <div className="font-display text-[16px] text-brand-deep shrink-0">
                ₹{item.lineTotal}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-brand-deep/8 p-6 h-fit space-y-4 font-ui">
            <div>
              <h2 className="font-display text-[15px] text-brand-deep mb-2">Payment</h2>
              <p className="text-[13px] text-brand-deep/60">
                Method: <span className="font-medium text-brand-deep/80">{order.paymentMethod}</span>
              </p>
              <p className="text-[13px] text-brand-deep/60">
                Status: <span className="font-medium text-brand-deep/80">{order.paymentStatus}</span>
              </p>
            </div>

            <div className="border-t border-brand-deep/8 pt-4 flex justify-between font-display text-lg text-brand-deep">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          {canManageStatus && (
            <OrderStatusUpdater order={order} onStatusChanged={setOrder} />
          )}
        </div>
      </div>

      <Link
        to={fromSeller ? '/seller/orders' : '/orders'}
        className="inline-block mt-8 text-[13px] font-ui text-brand-pink font-medium hover:underline"
      >
        ← {fromSeller ? 'Back to Customer Orders' : 'Back to My Orders'}
      </Link>
    </div>
  );
}