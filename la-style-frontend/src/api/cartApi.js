// src/api/cartApi.js
import axiosInstance from './axiosInstance';
import { CART_ENDPOINTS } from './endpoints';

export const getCart = () => axiosInstance.get(CART_ENDPOINTS.BASE);
export const addToCart = (productId, quantity) =>
  axiosInstance.post(CART_ENDPOINTS.ITEMS, { productId, quantity });
export const updateCartItem = (itemId, quantity) =>
  axiosInstance.put(CART_ENDPOINTS.ITEM_BY_ID(itemId), { quantity });
export const removeCartItem = (itemId) =>
  axiosInstance.delete(CART_ENDPOINTS.ITEM_BY_ID(itemId));
export const clearCart = () => axiosInstance.delete(CART_ENDPOINTS.BASE);