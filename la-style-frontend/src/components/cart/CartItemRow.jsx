// src/components/cart/CartItemRow.jsx
import { Link } from 'react-router-dom';
import QuantitySelector from '../product/QuantitySelector';

export default function CartItemRow({ item, onQuantityChange, onRemove, isUpdating }) {
  return (
    <div className="flex items-center gap-4 py-5 border-b border-gray-100 last:border-0">
      <Link to={`/products/${item.productId}`} className="shrink-0">
        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden">
          {item.productImage ? (
            <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.productId}`}
          className="font-medium text-gray-800 hover:text-brand-pink transition-colors truncate block"
        >
          {item.productTitle}
        </Link>
        <p className="text-sm text-gray-500 mt-1">₹{item.unitPrice}</p>
        {item.availableStock < item.quantity && (
          <p className="text-xs text-red-500 mt-1">
            Only {item.availableStock} left in stock
          </p>
        )}
      </div>

      <QuantitySelector
        quantity={item.quantity}
        onChange={(newQty) => onQuantityChange(item.id, newQty)}
        max={item.availableStock}
      />

      <div className="w-24 text-right font-[700] text-brand-deep">
        ₹{item.subtotal}
      </div>

      <button
        onClick={() => onRemove(item.id)}
        disabled={isUpdating}
        aria-label="Remove item"
        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}