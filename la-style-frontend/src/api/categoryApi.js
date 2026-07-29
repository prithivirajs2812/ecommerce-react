// src/api/categoryApi.js
import axiosInstance from './axiosInstance';
import { CATEGORY_ENDPOINTS } from './endpoints';

export const getAllCategories = () => axiosInstance.get(CATEGORY_ENDPOINTS.ALL);