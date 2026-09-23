// src/components/product/ProductCard.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gridItem } from '../../utils/motionVariants';

const MotionLink = motion.create(Link);

export default function ProductCard({ product, compact = false }) {
  const hasDiscount = product.discountPercent > 0;

  return (
    <MotionLink
      to={`/products/${product.id}`}
      variants={gridItem}
      whileHover={{ y: compact ? -3 : -6, scale: compact ? 1.015 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden block relative"
    >
      {hasDiscount && (
        <motion.span
          initial={{ scale: 0, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
          className={`absolute z-10 bg-brand-pink text-white font-bold rounded-full shadow-md ${
            compact ? 'top-2 left-2 text-xs px-2 py-1' : 'top-3 left-3 text-sm px-3 py-1.5'
          }`}
        >
          {product.discountPercent}% OFF
        </motion.span>
      )}

      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-base">
            No image
          </div>
        )}
      </div>

      <div className={compact ? 'p-3' : 'p-5'}>
        <p className={`text-gray-400 uppercase tracking-wide ${compact ? 'text-[11px] mb-1' : 'text-sm mb-1.5'}`}>
          {product.categoryName}
        </p>
        <h3
          className={`font-medium text-gray-800 truncate group-hover:text-brand-pink transition-colors duration-200 ${
            compact ? 'text-sm' : 'text-lg'
          }`}
        >
          {product.title}
        </h3>
        <div className={`flex items-center justify-between ${compact ? 'mt-1.5' : 'mt-3'}`}>
          <div className="flex items-center gap-1.5">
            <span className={`font-[800] text-brand-deep ${compact ? 'text-base' : 'text-xl'}`}>
              ₹{product.effectivePrice}
            </span>
            {hasDiscount && (
              <span className={`text-gray-400 line-through ${compact ? 'text-xs' : 'text-sm'}`}>
                ₹{product.price}
              </span>
            )}
          </div>
          {product.stock === 0 && (
            <span className={`text-red-500 font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
              Out of stock
            </span>
          )}
        </div>
      </div>
    </MotionLink>
  );
}