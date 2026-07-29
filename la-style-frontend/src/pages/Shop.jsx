// src/pages/Shop.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllProducts, getProductsByCategory } from '../api/productApi';
import { getAllCategories } from '../api/categoryApi';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/product/Pagination';

function ProductGrid({ selectedCategory, page, onPageChange }) {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const request = selectedCategory
      ? getProductsByCategory(selectedCategory, page)
      : getAllProducts(page);

    request
      .then((res) => {
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [page, selectedCategory]);

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-2xl aspect-[3/4]" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-gray-500 text-center py-20">No products found.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}

export default function Shop() {
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '0', 10);

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleCategorySelect = (categoryId) => {
    if (categoryId === null) {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId, page: '0' });
    }
  };

  const handlePageChange = (newPage) => {
    const params = { page: newPage };
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display font-[800] text-3xl text-brand-deep mb-8">Shop</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 shrink-0">
          <h2 className="font-semibold text-gray-800 mb-3">Category</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => handleCategorySelect(null)}
                className={`text-left w-full hover:text-brand-pink transition-colors ${
                  !selectedCategory ? 'text-brand-pink font-semibold' : 'text-gray-600'
                }`}
              >
                All Products
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`text-left w-full hover:text-brand-pink transition-colors ${
                    selectedCategory === String(cat.id) ? 'text-brand-pink font-semibold' : 'text-gray-600'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1">
          <ProductGrid
            key={`${selectedCategory || 'all'}-${page}`}
            selectedCategory={selectedCategory}
            page={page}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
}