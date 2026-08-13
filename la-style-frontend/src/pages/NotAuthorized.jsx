// src/pages/NotAuthorized.jsx
import { Link } from 'react-router-dom';

export default function NotAuthorized() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display font-[800] text-3xl text-brand-deep mb-3">Access Denied</h1>
      <p className="text-gray-500 mb-8">
        You don't have permission to view this page.
      </p>
      <Link
        to="/"
        className="inline-block bg-brand-pink hover:bg-pink-600 transition-colors text-white font-semibold px-6 py-3 rounded-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}