// src/api/endpoints.js
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
};

export const USER_ENDPOINTS = {
  ME: '/users/me',
  PASSWORD: '/users/me/password',
};


export const PRODUCT_ENDPOINTS = {
  ALL: '/products',
  BY_ID: (id) => `/products/${id}`,
  BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
  SEARCH: '/products/search',
  MINE: '/products/mine',
  DEALS: '/products/deals',
};

export const CATEGORY_ENDPOINTS = {
  ALL: '/categories',
};

export const CART_ENDPOINTS = {
  BASE: '/cart',
  ITEMS: '/cart/items',
  ITEM_BY_ID: (itemId) => `/cart/items/${itemId}`,
};

export const ADDRESS_ENDPOINTS = {
  ALL: '/users/me/addresses',
};

// src/api/endpoints.js
export const ORDER_ENDPOINTS = {
  CHECKOUT: '/orders/checkout',
  ALL: '/orders',
  BY_ID: (id) => `/orders/${id}`,
  SELLER: '/orders/seller',
};

export const WISHLIST_ENDPOINTS = {
  ALL: '/wishlist',
  BY_PRODUCT_ID: (productId) => `/wishlist/${productId}`,
};

export const REVIEW_ENDPOINTS = {
  BY_PRODUCT: (productId) => `/reviews/product/${productId}`,
  SUMMARY: (productId) => `/reviews/product/${productId}/summary`,
  BASE: '/reviews',
  BY_ID: (id) => `/reviews/${id}`,
};

export const SELLER_ENDPOINTS = {
  REGISTER: '/sellers/register',
  ME: '/sellers/me',
};

export const DASHBOARD_ENDPOINTS = {
  SELLER: '/seller/dashboard',
  ADMIN: '/admin/dashboard',
};

// src/api/endpoints.js — add these
export const ADMIN_ENDPOINTS = {
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  BAN_USER: (id) => `/admin/users/${id}/ban`,
  UNBAN_USER: (id) => `/admin/users/${id}/unban`,
  SELLERS: '/admin/sellers',
  PENDING_SELLERS: '/admin/sellers/pending',
  VERIFY_SELLER: (id) => `/admin/sellers/${id}/verify`,
};

export const COUPON_ENDPOINTS = {
  ALL: '/admin/coupons',
  BY_ID: (id) => `/admin/coupons/${id}`,
  DEACTIVATE: (id) => `/admin/coupons/${id}/deactivate`,
};


export const CONTACT_ENDPOINTS = {
  BASE: '/contact',
};

export const ADMIN_CONTACT_ENDPOINTS = {
  ALL: '/admin/contact-messages',
  MARK_READ: (id) => `/admin/contact-messages/${id}/read`,
};

export const NOTIFICATION_ENDPOINTS = {
  ALL: '/notifications',
  UNREAD_COUNT: '/notifications/unread-count',
  MARK_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',
};