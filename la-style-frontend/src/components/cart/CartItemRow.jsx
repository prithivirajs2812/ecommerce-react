// src/components/cart/CartItemRow.jsx
import { Link } from 'react-router-dom';
import QuantitySelector from '../product/QuantitySelector';

export default function CartItemRow({ item, onQuantityChange, onRemove, isUpdating }) {
  const hasDiscount = item.discountPercent > 0;

  return (
    <div className="flex items-center gap-4 py-6 border-b border-brand-deep/8 last:border-0">
      <Link to={`/products/${item.productId}`} className="shrink-0">
        <div className="w-20 h-20 bg-brand-ivory rounded-lg overflow-hidden border border-brand-deep/8">
          {item.productImage ? (
            <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-deep/25 text-xs font-ui">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.productId}`}
          className="font-display text-[15px] text-brand-deep hover:text-brand-pink transition-colors truncate block"
        >
          {item.productTitle}
        </Link>
        <div className="flex items-center gap-2 mt-1 font-ui">
          <p className="text-[13px] text-brand-deep/60">₹{item.unitPrice}</p>
          {hasDiscount && (
            <p className="text-[12px] text-brand-deep/30 line-through">₹{item.originalPrice}</p>
          )}
        </div>
        {item.availableStock < item.quantity && (
          <p className="text-[12px] font-ui text-brand-pink mt-1">
            Only {item.availableStock} left in stock
          </p>
        )}
      </div>

      <QuantitySelector
        quantity={item.quantity}
        onChange={(newQty) => onQuantityChange(item.id, newQty)}
        max={item.availableStock}
      />

      <div className="w-24 text-right font-display text-[16px] text-brand-deep">
        ₹{item.subtotal}
      </div>

      <button
        onClick={() => onRemove(item.id)}
        disabled={isUpdating}
        aria-label="Remove item"
        className="text-brand-deep/30 hover:text-brand-pink transition-colors disabled:opacity-40 shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}