// src/components/review/RatingSummary.jsx
import StarRating from './StarRating';

export default function RatingSummary({ summary }) {
  if (!summary || summary.totalReviews === 0) {
    return <p className="text-sm text-gray-400">No ratings yet</p>;
  }

  return (
    <div className="flex items-center gap-2">
      <StarRating value={Math.round(summary.averageRating)} />
      <span className="text-sm text-gray-600">
        {summary.averageRating.toFixed(1)} ({summary.totalReviews} review{summary.totalReviews === 1 ? '' : 's'})
      </span>
    </div>
  );
}