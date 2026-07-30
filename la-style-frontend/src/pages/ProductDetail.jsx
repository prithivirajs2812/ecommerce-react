// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import { addToCart } from '../api/cartApi';
import useAuthStore from '../store/useAuthStore';
import QuantitySelector from '../components/product/QuantitySelector';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [addStatus, setAddStatus] = useState({ type: null, message: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await getProductById(id);
        if (!ignore) setProduct(res.data);
      } catch (err) {
        if (!ignore && err.response?.status === 404) {
          setNotFound(true);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAdding(true);
    setAddStatus({ type: null, message: '' });

    try {
      await addToCart(product.id, quantity);
      setAddStatus({ type: 'success', message: 'Added to cart!' });
    } catch (err) {
      setAddStatus({
        type: 'error',
        message: err.response?.data?.message || 'Could not add to cart. Please try again.',
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-6 py-20 text-center text-gray-400">Loading...</div>;
  }

  if (notFound) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-12">
      <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
        )}
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{product.categoryName}</p>
        <h1 className="font-display font-[800] text-3xl text-brand-deep mb-3">{product.title}</h1>
        <p className="text-2xl font-[700] text-brand-pink mb-4">₹{product.price}</p>
        <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

        <p className="text-sm mb-6">
          {product.stock > 0 ? (
            <span className="text-green-600 font-medium">In stock ({product.stock} available)</span>
          ) : (
            <span className="text-red-500 font-medium">Out of stock</span>
          )}
        </p>

        {product.stock > 0 && (
          <>
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
              <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
            </div>

            {addStatus.type && (
              <div
                className={`text-sm rounded-lg px-4 py-3 mb-4 ${
                  addStatus.type === 'success'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {addStatus.message}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full md:w-auto bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white font-semibold px-8 py-3 rounded-lg"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  return <ProductDetail key={id} />;
}