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

  const wishlisted = isAuthenticated && inWishlist;

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
    return <div className="max-w-7xl mx-auto px-6 py-24 text-center font-ui text-brand-deep/40">Loading…</div>;
  }

  if (notFound) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="font-display text-lg text-brand-deep/60">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-14">
        <div className="aspect-square bg-brand-ivory rounded-xl overflow-hidden border border-brand-deep/8">
          {product.image ? (
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-deep/20 font-ui text-sm">No image</div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-ui text-[11px] text-brand-deep/45 tracking-[0.08em] mb-2">{product.categoryName}</p>
              <h1 className="font-display text-3xl text-brand-deep mb-3">{product.title}</h1>
              <RatingSummary summary={summary} />
            </div>

            <button
              onClick={handleToggleWishlist}
              disabled={wishlistBusy}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="shrink-0 disabled:opacity-50 transition-colors mt-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${wishlisted ? 'text-brand-pink' : 'text-brand-deep/25 hover:text-brand-pink'}`}
                fill={wishlisted ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-baseline gap-3 mb-1 mt-5">
            <p className="font-display text-2xl text-brand-deep">₹{product.effectivePrice}</p>
            {product.discountPercent > 0 && (
              <>
                <p className="text-[15px] font-ui text-brand-deep/35 line-through">₹{product.price}</p>
                <span className="border border-brand-pink/30 text-brand-pink text-[11px] font-ui font-medium px-2 py-0.5 rounded-full">
                  {product.discountPercent}% OFF
                </span>
              </>
            )}
          </div>
          <div className="h-px w-12 bg-brand-gold my-5" />

          <p className="text-[14px] font-ui text-brand-deep/65 leading-relaxed mb-6">{product.description}</p>

          <p className="text-[13px] font-ui mb-6">
            {product.stock > 0 ? (
              <span className="text-green-700">In stock — {product.stock} available</span>
            ) : (
              <span className="text-brand-pink">Out of stock</span>
            )}
          </p>

          {product.stock > 0 && (
            <>
              <div className="mb-6">
                <p className="text-[13px] font-ui font-medium text-brand-deep/70 mb-2">Quantity</p>
                <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
              </div>

              {addStatus.type && (
                <div
                  className={`text-[13px] font-ui rounded-lg px-4 py-3 mb-4 ${
                    addStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {addStatus.message}
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full md:w-auto bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white font-ui text-sm font-medium px-8 py-3 rounded-lg"
              >
                {adding ? 'Adding…' : 'Add to Cart'}
              </button>
            </>
          )}
        </div>
      </div>

      <section className="mt-20 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-brand-deep">Reviews</h2>
          {!showReviewForm && (
            <button
              onClick={handleWriteReview}
              className="text-[13px] font-ui text-brand-pink font-medium hover:underline"
            >
              Write a Review
            </button>
          )}
        </div>

        {reviewError && (
          <div className="bg-red-50 text-red-600 text-sm font-ui rounded-lg px-4 py-3 mb-4">
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
              <div key={i} className="h-20 bg-brand-deep/5 rounded-xl" />
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