// src/utils/orderStatus.js
export const VALID_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: ['RETURNED'],
  CANCELLED: [],
  RETURNED: [],
};

export function getNextStatuses(currentStatus) {
  return VALID_TRANSITIONS[currentStatus] || [];
}