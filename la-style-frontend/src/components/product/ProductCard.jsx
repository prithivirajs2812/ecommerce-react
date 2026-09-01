// src/components/product/ProductCard.jsx
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercent > 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white rounded-xl overflow-hidden relative border border-brand-deep/8 hover:border-brand-gold/70 transition-colors duration-300"
    >
      {hasDiscount && (
        <span className="absolute top-3 left-3 z-10 bg-white/95 text-brand-deep text-[11px] font-ui font-medium px-2.5 py-1 rounded-full border border-brand-deep/10">
          −{product.discountPercent}%
        </span>
      )}

      <div className="aspect-square bg-brand-ivory overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-deep/20 text-sm font-ui">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="font-ui text-[11px] text-brand-deep/45 tracking-[0.03em] mb-1">
          {product.categoryName}
        </p>
        <h3 className="font-display text-[15px] text-brand-deep truncate">{product.title}</h3>
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-brand-deep">₹{product.effectivePrice}</span>
            {hasDiscount && (
              <span className="text-[12px] font-ui text-brand-deep/35 line-through">₹{product.price}</span>
            )}
          </div>
          {product.stock === 0 && (
            <span className="text-[11px] font-ui text-brand-pink">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}