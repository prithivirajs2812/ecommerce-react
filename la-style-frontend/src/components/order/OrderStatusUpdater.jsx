// src/components/order/OrderStatusUpdater.jsx
import { useState } from 'react';
import { updateOrderStatus } from '../../api/orderApi';
import { getNextStatuses } from '../../utils/orderStatus';

const STATUS_LABELS = {
  CONFIRMED: 'Confirm Order',
  SHIPPED: 'Mark as Shipped',
  DELIVERED: 'Mark as Delivered',
  CANCELLED: 'Cancel Order',
  RETURNED: 'Mark as Returned',
};

export default function OrderStatusUpdater({ order, onStatusChanged }) {
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');

  const nextStatuses = getNextStatuses(order.status);

  if (nextStatuses.length === 0) {
    return null;
  }

  const handleUpdate = async (newStatus) => {
    setUpdating(newStatus);
    setError('');
    try {
      const res = await updateOrderStatus(order.id, newStatus);
      onStatusChanged(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update order status.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-semibold text-gray-800 mb-3">Update Order Status</h2>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-3">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {nextStatuses.map((status) => (
          <button
            key={status}
            onClick={() => handleUpdate(status)}
            disabled={updating !== null}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
              status === 'CANCELLED'
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-brand-pink text-white hover:bg-pink-600'
            }`}
          >
            {updating === status ? 'Updating...' : STATUS_LABELS[status]}
          </button>
        ))}
      </div>
    </div>
  );
}