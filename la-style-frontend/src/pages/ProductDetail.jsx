// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import { addToCart } from '../api/cartApi';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlistApi';
import {
  getReviewsForProduct,
  getRatingSummary,
  createReview,
  updateReview,
  deleteReview,
} from '../api/reviewApi';
import useAuthStore from '../store/useAuthStore';
import QuantitySelector from '../components/product/QuantitySelector';
import RatingSummary from '../components/review/RatingSummary';
import ReviewList from '../components/review/ReviewList';
import ReviewForm from '../components/review/ReviewForm';
import Pagination from '../components/product/Pagination';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!accessToken;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [addStatus, setAddStatus] = useState({ type: null, message: '' });
  const [adding, setAdding] = useState(false);

  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);

  // Derived — never explicitly reset in an effect. If the user isn't
  // authenticated, the heart always renders as "not wishlisted", regardless
  // of whatever the last authenticated check happened to leave in state.
  const wishlisted = isAuthenticated && inWishlist;

  // --- reviews state ---
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(0);
  const [summary, setSummary] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

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

  // Effect: only runs the async wishlist check when authenticated.
  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;

    async function checkWishlist() {
      try {
        const res = await getWishlist();
        if (!ignore) {
          setInWishlist(res.data.some((item) => item.productId === Number(id)));
        }
      } catch {
        // Non-critical.
      }
    }

    checkWishlist();

    return () => {
      ignore = true;
    };
  }, [id, isAuthenticated]);

  // Load reviews + summary, refetchable via reloadReviews().
  const reloadReviews = async () => {
    setReviewsLoading(true);
    try {
      const [reviewsRes, summaryRes] = await Promise.all([
        getReviewsForProduct(id, reviewPage, 10),
        getRatingSummary(id),
      ]);
      setReviews(reviewsRes.data.content);
      setReviewTotalPages(reviewsRes.data.totalPages);
      setSummary(summaryRes.data);
    } catch {
      setReviewError('Failed to load reviews.');
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadReviews() {
      setReviewsLoading(true);
      setReviewError('');
      try {
        const [reviewsRes, summaryRes] = await Promise.all([
          getReviewsForProduct(id, reviewPage, 10),
          getRatingSummary(id),
        ]);
        if (!ignore) {
          setReviews(reviewsRes.data.content);
          setReviewTotalPages(reviewsRes.data.totalPages);
          setSummary(summaryRes.data);
        }
      } catch {
        if (!ignore) setReviewError('Failed to load reviews.');
      } finally {
        if (!ignore) setReviewsLoading(false);
      }
    }

    loadReviews();

    return () => {
      ignore = true;
    };
  }, [id, reviewPage]);

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

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setWishlistBusy(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        setInWishlist(false);
      } else {
        await addToWishlist(product.id);
        setInWishlist(true);
      }
    } catch {
      // Leave state as-is; next load resyncs.
    } finally {
      setWishlistBusy(false);
    }
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setEditingReview(null);
    setShowReviewForm(true);
  };

  const handleSubmitReview = async (data) => {
    setSubmittingReview(true);
    try {
      if (editingReview) {
        await updateReview(editingReview.id, { ...data, productId: Number(id) });
      } else {
        await createReview({ ...data, productId: Number(id) });
      }
      setShowReviewForm(false);
      setEditingReview(null);
      await reloadReviews();
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      await reloadReviews();
    } catch {
      setReviewError('Could not delete review. Please try again.');
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
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{product.categoryName}</p>
              <h1 className="font-display font-[800] text-3xl text-brand-deep mb-2">{product.title}</h1>
              <RatingSummary summary={summary} />
            </div>

            <button
              onClick={handleToggleWishlist}
              disabled={wishlistBusy}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="shrink-0 disabled:opacity-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-7 w-7 ${wishlisted ? 'text-brand-pink' : 'text-gray-300 hover:text-brand-pink'}`}
                fill={wishlisted ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

<div className="flex items-center gap-3 mb-4 mt-4">
  <p className="text-2xl font-[700] text-brand-pink">₹{product.effectivePrice}</p>
  {product.discountPercent > 0 && (
    <>
      <p className="text-lg text-gray-400 line-through">₹{product.price}</p>
      <span className="bg-brand-pink text-white text-xs font-bold px-2.5 py-1 rounded-full">
        {product.discountPercent}% OFF
      </span>
    </>
  )}
</div>          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

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

      <section className="mt-16 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-[800] text-2xl text-brand-deep">Reviews</h2>
          {!showReviewForm && (
            <button
              onClick={handleWriteReview}
              className="text-sm text-brand-pink font-semibold hover:underline"
            >
              Write a Review
            </button>
          )}
        </div>

        {reviewError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {reviewError}
          </div>
        )}

        {showReviewForm && (
          <div className="mb-6">
            <ReviewForm
              initialValue={editingReview}
              submitting={submittingReview}
              onSubmit={handleSubmitReview}
              onCancel={() => {
                setShowReviewForm(false);
                setEditingReview(null);
              }}
            />
          </div>
        )}

        {reviewsLoading ? (
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <ReviewList
              reviews={reviews}
              currentUserId={user?.userId}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
              isAdmin={false}
            />
            <Pagination
              currentPage={reviewPage}
              totalPages={reviewTotalPages}
              onPageChange={setReviewPage}
            />
          </>
        )}
      </section>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  return <ProductDetail key={id} />;
}