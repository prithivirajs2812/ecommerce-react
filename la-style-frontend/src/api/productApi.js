// src/api/productApi.js
import axiosInstance from './axiosInstance';
import { PRODUCT_ENDPOINTS } from './endpoints';

export const getAllProducts = (page = 0, size = 12) =>
  axiosInstance.get(`${PRODUCT_ENDPOINTS.ALL}?page=${page}&size=${size}&sort=createdAt,desc`);

export const getProductsByCategory = (categoryId, page = 0, size = 12) =>
  axiosInstance.get(`${PRODUCT_ENDPOINTS.BY_CATEGORY(categoryId)}?page=${page}&size=${size}`);

export const searchProducts = (keyword, page = 0, size = 12) =>
  axiosInstance.get(
    `${PRODUCT_ENDPOINTS.SEARCH}?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
  );

export const getProductById = (id) => axiosInstance.get(PRODUCT_ENDPOINTS.BY_ID(id));