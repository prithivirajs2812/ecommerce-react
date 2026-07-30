// src/components/order/OrderStatusBadge.jsx
const STATUS_STYLES = {
  PENDING:   'bg-yellow-50 text-yellow-700',
  CONFIRMED: 'bg-blue-50 text-blue-700',
  SHIPPED:   'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-700',
  RETURNED:  'bg-gray-100 text-gray-600',
};

export default function OrderStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
      {status}
    </span>
  );
}