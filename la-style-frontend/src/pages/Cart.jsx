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
      return;
    }

    getCart()
      .then((res) => setCart(res.data))
      .catch(() => setError('Failed to load your cart. Please try again.'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

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
      <div className="max-w-5xl mx-auto px-6 py-20 text-center text-gray-400">
        Loading your cart...
      </div>
    );
  }

  if (error && !cart) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-center">
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

const isEmpty = !cart || cart.items.length === 0;


  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display font-[800] text-3xl text-brand-deep mb-8">Your Cart</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {isEmpty ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
          <Link
            to="/shop"
            className="inline-block bg-brand-pink hover:bg-pink-600 transition-colors text-white font-semibold px-6 py-3 rounded-lg"
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
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear cart
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 h-fit">
            <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Items ({cart.totalItems})</span>
              <span>₹{cart.totalAmount}</span>
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-[700] text-brand-deep">
              <span>Total</span>
              <span>₹{cart.totalAmount}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 bg-brand-pink hover:bg-pink-600 transition-colors text-white font-semibold py-3 rounded-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}