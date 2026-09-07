// src/components/product/ProductCard.jsx
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercent > 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="hover-pop group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden block relative"
    >
      {hasDiscount && (
        <span className="animate-pop-in absolute top-3 left-3 z-10 bg-brand-pink text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
          {product.discountPercent}% OFF
        </span>
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

      <div className="p-5">
        <p className="text-sm text-gray-400 uppercase tracking-wide mb-1.5">
          {product.categoryName}
        </p>
        <h3 className="font-medium text-gray-800 text-lg truncate group-hover:text-brand-pink transition-colors duration-200">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-[800] text-xl text-brand-deep">₹{product.effectivePrice}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
            )}
          </div>
          {product.stock === 0 && (
            <span className="text-sm text-red-500 font-medium">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}