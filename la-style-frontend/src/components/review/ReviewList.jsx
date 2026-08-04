// src/components/review/ReviewList.jsx
import StarRating from './StarRating';

export default function ReviewList({ reviews, currentUserId, onEdit, onDelete, isAdmin }) {
  if (reviews.length === 0) {
    return <p className="text-gray-500 text-sm py-6">No reviews yet. Be the first to review this product!</p>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {reviews.map((review) => {
        const isOwner = currentUserId != null && review.userId === currentUserId;
        return (
          <div key={review.id} className="py-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-gray-800">{review.reviewerName}</p>
                <StarRating value={review.rating} />
              </div>
              <p className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>
            </div>

            {review.comment && (
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            )}

            {(isOwner || isAdmin) && (
              <div className="flex gap-4 mt-2">
                {isOwner && (
                  <button
                    onClick={() => onEdit(review)}
                    className="text-xs text-brand-pink font-semibold hover:underline"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => onDelete(review.id)}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}