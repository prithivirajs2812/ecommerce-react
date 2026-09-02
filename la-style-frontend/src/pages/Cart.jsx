// src/pages/Cart.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../api/cartApi';
import useAuthStore from '../store/useAuthStore';
import CartItemRow from '../components/cart/CartItemRow';

export default function Cart() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;

    async function loadCart() {
      setLoading(true);
      setError('');
      try {
        const res = await getCart();
        if (!ignore) setCart(res.data);
      } catch {
        if (!ignore) setError('Failed to load your cart. Please try again.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadCart();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    setUpdatingItemId(itemId);
    setError('');
    try {
      const res = await updateCartItem(itemId, newQuantity);
      setCart(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update quantity.');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdatingItemId(itemId);
    setError('');
    try {
      const res = await removeCartItem(itemId);
      setCart(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove item.');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    setError('');
    try {
      await clearCart();
      setCart({ ...cart, items: [], totalItems: 0, totalAmount: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not clear cart.');
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center font-ui text-brand-deep/40">
        Loading your cart…
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="text-red-500 font-ui text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-brand-pink font-ui text-sm font-medium hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-brand-deep mb-10">Your Cart</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm font-ui rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {isEmpty ? (
        <div className="text-center py-24">
          <p className="font-display text-lg text-brand-deep/60 mb-6">Your cart is empty.</p>
          <Link
            to="/shop"
            className="inline-block bg-brand-pink hover:bg-pink-600 transition-colors text-white font-ui text-sm font-medium px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 bg-white rounded-xl border border-brand-deep/8 px-6">
            {cart.items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                isUpdating={updatingItemId === item.id}
              />
            ))}

            <div className="py-4">
              <button
                onClick={handleClearCart}
                className="text-[13px] font-ui text-brand-deep/45 hover:text-brand-pink transition-colors"
              >
                Clear cart
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-brand-deep/8 p-8 h-fit">
            <h2 className="font-display text-lg text-brand-deep mb-5">Order Summary</h2>
            <div className="flex justify-between text-[13px] font-ui text-brand-deep/60 mb-2">
              <span>Items ({cart.totalItems})</span>
              <span>₹{cart.totalAmount}</span>
            </div>
            <div className="border-t border-brand-deep/8 mt-5 pt-5 flex justify-between font-display text-lg text-brand-deep">
              <span>Total</span>
              <span>₹{cart.totalAmount}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-7 bg-brand-pink hover:bg-pink-600 transition-colors text-white font-ui text-sm font-medium py-3 rounded-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}