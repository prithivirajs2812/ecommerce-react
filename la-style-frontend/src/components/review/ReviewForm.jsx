// src/components/review/ReviewForm.jsx
import { useState } from 'react';
import StarRating from './StarRating';

export default function ReviewForm({ initialValue, onSubmit, onCancel, submitting }) {
  const [rating, setRating] = useState(initialValue?.rating || 0);
  const [comment, setComment] = useState(initialValue?.comment || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    try {
      await onSubmit({ rating, comment: comment.trim() });
    } catch (err) {
      const validationErrors = err.response?.data?.validationErrors;
      if (validationErrors) {
        setError(Object.values(validationErrors)[0]);
      } else {
        setError(err.response?.data?.message || 'Could not submit your review. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl p-4 space-y-3">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Your rating</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Share your thoughts about this product (optional)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand-pink hover:bg-pink-600 disabled:opacity-60 transition-colors text-white text-sm font-semibold px-5 py-2 rounded-lg"
        >
          {submitting ? 'Submitting...' : initialValue ? 'Update Review' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}