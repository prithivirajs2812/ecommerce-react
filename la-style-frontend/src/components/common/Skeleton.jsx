// src/components/common/Skeleton.jsx

/**
 * A single shimmering placeholder block. Compose these to build
 * skeleton layouts (product cards, list rows, stat tiles, etc).
 * Uses the `.skeleton-shimmer` class defined in index.css.
 */
export default function Skeleton({ className = '' }) {
  return <div className={`skeleton-shimmer rounded-xl ${className}`} />;
}

/** Ready-made skeleton matching ProductCard's shape, for grid loading states. */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <Skeleton className="aspect-square rounded-none" />
      <div className="p-5 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-1/3 mt-1" />
      </div>
    </div>
  );
}