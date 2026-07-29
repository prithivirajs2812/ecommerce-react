// src/components/product/ProductCard.jsx
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
    >
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
          <span className="font-[700] text-brand-deep">₹{product.price}</span>
          {product.stock === 0 && (
            <span className="text-xs text-red-500 font-medium">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}