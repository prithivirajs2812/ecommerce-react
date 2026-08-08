// src/components/product/ProductCard.jsx
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercent > 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden block relative"
    >
      {hasDiscount && (
        <span className="absolute top-3 left-3 z-10 bg-brand-pink text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {product.discountPercent}% OFF
        </span>
      )}

      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          {product.categoryName}
        </p>
        <h3 className="font-medium text-gray-800 truncate">{product.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="font-[700] text-brand-deep">₹{product.effectivePrice}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
            )}
          </div>
          {product.stock === 0 && (
            <span className="text-xs text-red-500 font-medium">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}