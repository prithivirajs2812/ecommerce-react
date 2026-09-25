// src/api/categoryApi.js
import axiosInstance from './axiosInstance';
import { CATEGORY_ENDPOINTS } from './endpoints';

export const getAllCategories = () => axiosInstance.get(CATEGORY_ENDPOINTS.ALL);
export const getCategoryById = (id) => axiosInstance.get(CATEGORY_ENDPOINTS.BY_ID(id));
export const createCategory = (data) => axiosInstance.post(CATEGORY_ENDPOINTS.ALL, data);
export const updateCategory = (id, data) => axiosInstance.put(CATEGORY_ENDPOINTS.BY_ID(id), data);
export const deleteCategory = (id) => axiosInstance.delete(CATEGORY_ENDPOINTS.BY_ID(id));
