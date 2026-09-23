// src/components/home/TrendingProducts.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getTrendingProducts } from '../../api/productApi';
import ProductCard from '../product/ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import { gridContainer } from '../../utils/motionVariants';

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    getTrendingProducts(8)
      .then((res) => {
        if (!ignore) setProducts(res.data);
      })
      .catch(() => {
        if (!ignore) setProducts([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // No orders on the platform yet — skip the section rather than showing an empty grid.
  if (!loading && products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-ui text-[13px] tracking-[0.1em] text-brand-purple mb-1 font-bold">
            WHAT EVERYONE'S BUYING
          </p>
          <h2 className="font-display font-[800] text-3xl text-brand-deep">Trending Now</h2>
        </div>
        <Link
          to="/shop"
          className="text-sm text-brand-pink font-semibold hover:underline hidden md:block"
        >
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={gridContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </section>
  );
}