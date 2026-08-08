// src/pages/Deals.jsx
import { useState, useEffect } from 'react';
import { getDeals } from '../api/productApi';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/product/Pagination';

export default function Deals() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getDeals(page, 12);
        if (!ignore) {
          setProducts(res.data.content);
          setTotalPages(res.data.totalPages);
        }
      } catch {
        if (!ignore) setError('Failed to load deals. Please try again.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display font-[800] text-3xl text-brand-deep mb-2">Deals</h1>
      <p className="text-gray-500 mb-8">Discounted products, updated as sellers add new offers.</p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl aspect-[3/4]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No active deals right now — check back soon!</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}