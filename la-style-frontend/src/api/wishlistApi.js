// src/api/wishlistApi.js
import axiosInstance from './axiosInstance';
import { WISHLIST_ENDPOINTS } from './endpoints';

export const getWishlist = () => axiosInstance.get(WISHLIST_ENDPOINTS.ALL);
export const addToWishlist = (productId) =>
  axiosInstance.post(WISHLIST_ENDPOINTS.ALL, { productId });
export const removeFromWishlist = (productId) =>
  axiosInstance.delete(WISHLIST_ENDPOINTS.BY_PRODUCT_ID(productId));