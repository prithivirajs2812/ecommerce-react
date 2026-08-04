// src/pages/Wishlist.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../api/wishlistApi';
import useAuthStore from '../store/useAuthStore';

export default function Wishlist() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  // Effect 1: auth guard only.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Effect 2: fetch wishlist.
  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;

    async function loadWishlist() {
      setLoading(true);
      setError('');
      try {
        const res = await getWishlist();
        if (!ignore) setItems(res.data);
      } catch {
        if (!ignore) setError('Failed to load your wishlist. Please try again.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadWishlist();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    setError('');
    try {
      await removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove item.');
    } finally {
      setRemovingId(null);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center text-gray-400">
        Loading your wishlist...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display font-[800] text-3xl text-brand-deep mb-8">My Wishlist</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-6">Your wishlist is empty.</p>
          <Link
            to="/shop"
            className="inline-block bg-brand-pink hover:bg-pink-600 transition-colors text-white font-semibold px-6 py-3 rounded-lg"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <Link to={`/products/${item.productId}`} className="block">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                      No image
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link
                  to={`/products/${item.productId}`}
                  className="font-medium text-gray-800 hover:text-brand-pink transition-colors truncate block"
                >
                  {item.productTitle}
                </Link>

                <div className="flex items-center justify-between mt-2">
                  <span className="font-[700] text-brand-deep">₹{item.price}</span>
                  {!item.inStock && (
                    <span className="text-xs text-red-500 font-medium">Out of stock</span>
                  )}
                </div>

                <button
                  onClick={() => handleRemove(item.productId)}
                  disabled={removingId === item.productId}
                  className="w-full mt-3 text-sm text-gray-500 hover:text-red-500 disabled:opacity-50 transition-colors border border-gray-200 hover:border-red-200 rounded-lg py-2"
                >
                  {removingId === item.productId ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}