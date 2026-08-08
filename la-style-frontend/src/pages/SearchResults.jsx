// src/pages/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '../api/productApi';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/product/Pagination';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '0', 10);

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query.trim()) return;

    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await searchProducts(query, page, 12);
        if (!ignore) {
          setProducts(res.data.content);
          setTotalPages(res.data.totalPages);
        }
      } catch {
        if (!ignore) setError('Search failed. Please try again.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [query, page]);

  const handlePageChange = (newPage) => setSearchParams({ q: query, page: newPage });

  const hasQuery = query.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display font-[800] text-3xl text-brand-deep mb-2">
        {query ? `Results for "${query}"` : 'Search'}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6 mt-4">
          {error}
        </div>
      )}

      {!hasQuery ? (
        <p className="text-gray-500 mt-8">Enter a search term to find products.</p>
      ) : loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl aspect-[3/4]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 mt-8">No products found for "{query}".</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}