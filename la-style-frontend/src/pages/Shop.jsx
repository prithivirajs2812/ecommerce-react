// src/pages/Shop.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllProducts, getProductsByCategory } from '../api/productApi';
import { getAllCategories } from '../api/categoryApi';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/product/Pagination';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { gridContainer } from '../utils/motionVariants';

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
      <div className="bg-red-50 text-red-600 text-sm font-ui rounded-lg px-4 py-3 mb-6">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-lg text-brand-deep/60">No products found.</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={gridContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
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
    <div className="min-h-screen bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="font-ui text-[20px] tracking-[0.1em] text-brand-purple mb-2 font-bold">Shop the collection</p>
        <h1 className="font-display text-3xl text-brand-deep mb-10">All Products</h1>

        <div className="flex flex-col md:flex-row gap-10">
          <aside className="md:w-52 shrink-0">
            <h2 className="font-ui text-[11px] tracking-[0.08em] text-brand-deep/50 mb-4">CATEGORY</h2>
            <ul className="space-y-1 text-sm font-ui border-l border-brand-deep/10">
              <li>
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`text-left w-full pl-4 py-1.5 border-l -ml-px transition-colors ${
                    !selectedCategory
                      ? 'border-brand-gold text-brand-deep font-medium'
                      : 'border-transparent text-brand-deep/55 hover:text-brand-deep'
                  }`}
                >
                  All Products
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`text-left w-full pl-4 py-1.5 border-l -ml-px transition-colors ${
                      selectedCategory === String(cat.id)
                        ? 'border-brand-gold text-brand-deep font-medium'
                        : 'border-transparent text-brand-deep/55 hover:text-brand-deep'
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
    </div>
  );
}