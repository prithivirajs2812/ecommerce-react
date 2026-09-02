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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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
      <div className="max-w-4xl mx-auto px-6 py-24 text-center font-ui text-brand-deep/40">
        Loading checkout…
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-red-500 font-ui text-sm mb-4">{error}</p>
        <Link to="/cart" className="text-brand-pink font-ui text-sm font-medium hover:underline">
          Back to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-brand-deep mb-10">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm font-ui rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="font-display text-lg text-brand-deep mb-4">Shipping Address</h2>
            <div className="space-y-3 font-ui">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${
                    selectedAddressId === addr.id ? 'border-brand-gold bg-brand-ivory' : 'border-brand-deep/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1 accent-brand-pink"
                  />
                  <div className="text-[13px] text-brand-deep/75 leading-relaxed">
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
                  className="text-[13px] text-brand-pink font-medium hover:underline"
                >
                  + Add a new address
                </button>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg text-brand-deep mb-4">Payment Method</h2>
            <div className="flex gap-3 font-ui">
              {['COD', 'CARD', 'UPI'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium border transition-colors ${
                    paymentMethod === method
                      ? 'border-brand-gold bg-brand-ivory text-brand-deep'
                      : 'border-brand-deep/10 text-brand-deep/60'
                  }`}
                >
                  {method === 'COD' ? 'Cash on Delivery' : method}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg text-brand-deep mb-4">Coupon Code</h2>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code (optional)"
              className="w-full max-w-xs border border-brand-deep/15 rounded-lg px-4 py-2.5 text-sm font-ui focus:outline-none focus:ring-1 focus:ring-brand-gold"
            />
          </section>
        </div>

        <div className="bg-white rounded-xl border border-brand-deep/8 p-7 h-fit">
          <h2 className="font-display text-lg text-brand-deep mb-4">Order Summary</h2>
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-[13px] font-ui text-brand-deep/60 mb-2">
              <span className="truncate pr-2">{item.productTitle} × {item.quantity}</span>
              <span className="shrink-0">₹{item.subtotal}</span>
            </div>
          ))}
          <div className="border-t border-brand-deep/8 mt-5 pt-5 flex justify-between font-display text-lg text-brand-deep">
            <span>Total</span>
            <span>₹{cart.totalAmount}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="w-full mt-7 bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white font-ui text-sm font-medium py-3 rounded-lg"
          >
            {placingOrder ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}