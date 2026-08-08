// src/api/productApi.js — add these three
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
export const createProduct = (data) => axiosInstance.post(PRODUCT_ENDPOINTS.ALL, data);
export const updateProduct = (id, data) => axiosInstance.put(PRODUCT_ENDPOINTS.BY_ID(id), data);
export const deleteProduct = (id) => axiosInstance.delete(PRODUCT_ENDPOINTS.BY_ID(id));

export const getMyProducts = (page = 0, size = 20) =>
  axiosInstance.get(`${PRODUCT_ENDPOINTS.MINE}?page=${page}&size=${size}`);


export const getDeals = (page = 0, size = 12) =>
  axiosInstance.get(`${PRODUCT_ENDPOINTS.DEALS}?page=${page}&size=${size}`);