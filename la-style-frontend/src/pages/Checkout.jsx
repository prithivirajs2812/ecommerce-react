// src/pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart } from '../api/cartApi';
import { getMyAddresses, createAddress } from '../api/addressApi';
import { checkout } from '../api/orderApi';
import useAuthStore from '../store/useAuthStore';
import NewAddressForm from '../components/checkout/NewAddressForm';

export default function Checkout() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  // Effect 1: auth guard only.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Effect 2: load cart + addresses — only once we know we're authenticated.
  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;

    async function loadCheckoutData() {
      setLoading(true);
      setError('');
      try {
        const [cartRes, addressRes] = await Promise.all([getCart(), getMyAddresses()]);
        if (ignore) return;

        if (cartRes.data.items.length === 0) {
          navigate('/cart');
          return;
        }

        setCart(cartRes.data);
        setAddresses(addressRes.data);
        if (addressRes.data.length > 0) {
          setSelectedAddressId(addressRes.data[0].id);
        } else {
          setShowNewAddressForm(true);
        }
      } catch {
        if (!ignore) setError('Failed to load checkout details. Please try again.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadCheckoutData();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, navigate]);

  const handleSaveAddress = async (addressData) => {
    setSavingAddress(true);
    setError('');
    try {
      const res = await createAddress(addressData);
      setAddresses((prev) => [...prev, res.data]);
      setSelectedAddressId(res.data.id);
      setShowNewAddressForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save address.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select or add a shipping address.');
      return;
    }

    setPlacingOrder(true);
    setError('');

    try {
      const res = await checkout({
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: couponCode.trim() || null,
      });
      navigate(`/orders/${res.data.id}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place your order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400">
        Loading checkout...
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/cart" className="text-brand-pink font-semibold hover:underline">
          Back to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display font-[800] text-3xl text-brand-deep mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="font-semibold text-gray-800 mb-3">Shipping Address</h2>
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${
                    selectedAddressId === addr.id ? 'border-brand-pink bg-pink-50/50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1"
                  />
                  <div className="text-sm text-gray-700">
                    <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                    <p>{addr.city}, {addr.state} {addr.zip}</p>
                    <p>{addr.country}</p>
                  </div>
                </label>
              ))}

              {showNewAddressForm ? (
                <NewAddressForm
                  onSave={handleSaveAddress}
                  onCancel={() => setShowNewAddressForm(false)}
                  saving={savingAddress}
                />
              ) : (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-sm text-brand-pink font-semibold hover:underline"
                >
                  + Add a new address
                </button>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-3">Payment Method</h2>
            <div className="flex gap-3">
              {['COD', 'CARD', 'UPI'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    paymentMethod === method
                      ? 'border-brand-pink bg-pink-50/50 text-brand-pink'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {method === 'COD' ? 'Cash on Delivery' : method}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-3">Coupon Code</h2>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code (optional)"
              className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
            />
          </section>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="truncate pr-2">{item.productTitle} × {item.quantity}</span>
              <span className="shrink-0">₹{item.subtotal}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-[700] text-brand-deep">
            <span>Total</span>
            <span>₹{cart.totalAmount}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="w-full mt-6 bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white font-semibold py-3 rounded-lg"
          >
            {placingOrder ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}