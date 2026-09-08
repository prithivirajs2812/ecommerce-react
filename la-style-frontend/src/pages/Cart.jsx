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
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center text-gray-400 text-lg">
          Loading your cart...
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="min-h-screen bg-brand-cream max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="press text-brand-pink font-semibold hover:underline hover:scale-105 transition-transform inline-block"
        >
          Try again
        </button>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    // Flat — no gradient. This is a transactional flow; keep it clean.
    <div className="min-h-screen bg-brand-cream">
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display font-[800] text-4xl text-brand-deep mb-8">Your Cart</h1>

      {error && (
        <div className="animate-pop-in bg-red-50 text-red-600 text-base rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {isEmpty ? (
        <div className="text-center py-24 animate-pop-in">
          <p className="text-gray-500 text-xl mb-6">Your cart is empty.</p>
          <Link
            to="/shop"
            className="press hover-pop inline-block bg-brand-pink hover:bg-pink-600 transition-colors text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-md"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm px-6">
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
                className="text-base text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear cart
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 h-fit">
            <h2 className="font-semibold text-gray-800 text-lg mb-4">Order Summary</h2>
            <div className="flex justify-between text-base text-gray-600 mb-2">
              <span>Items ({cart.totalItems})</span>
              <span>₹{cart.totalAmount}</span>
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-[700] text-xl text-brand-deep">
              <span>Total</span>
              <span>₹{cart.totalAmount}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="press w-full mt-6 bg-brand-pink hover:bg-pink-600 hover:scale-[1.02] transition-all duration-200 text-white text-lg font-semibold py-4 rounded-xl shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}