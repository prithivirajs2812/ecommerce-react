// src/components/product/Pagination.jsx
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-2 mt-12 font-ui">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1.5 rounded-lg border border-brand-deep/12 text-[13px] text-brand-deep/70 disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-gold transition-colors"
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-lg text-[13px] font-medium transition-colors ${
            page === currentPage
              ? 'bg-brand-purple text-white'
              : 'border border-brand-deep/12 text-brand-purple/40 hover:border-brand-gold'
          }`}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-1.5 rounded-lg border border-brand-deep/12 text-[13px] text-brand-deep/70 disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-gold transition-colors"
      >
        Next
      </button>
    </div>
  );
}