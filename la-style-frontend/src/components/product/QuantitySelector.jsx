// src/components/product/QuantitySelector.jsx
export default function QuantitySelector({ quantity, onChange, max }) {
  const decrease = () => onChange(Math.max(1, quantity - 1));
  const increase = () => onChange(Math.min(max, quantity + 1));

  return (
    <div className="flex items-center border border-gray-300 rounded-lg w-fit">
      <button
        onClick={decrease}
        disabled={quantity <= 1}
        className="px-3 py-2 text-gray-600 hover:text-brand-pink disabled:opacity-30 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="w-10 text-center font-medium">{quantity}</span>
      <button
        onClick={increase}
        disabled={quantity >= max}
        className="px-3 py-2 text-gray-600 hover:text-brand-pink disabled:opacity-30 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}