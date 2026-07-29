// src/api/endpoints.js

export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
};

export const PRODUCT_ENDPOINTS = {
  ALL: '/products',
  BY_ID: (id) => `/products/${id}`,
  BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
  SEARCH: '/products/search',
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

export const ORDER_ENDPOINTS = {
  CHECKOUT: '/orders/checkout',
  ALL: '/orders',
  BY_ID: (id) => `/orders/${id}`,
};