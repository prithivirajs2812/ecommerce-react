// src/api/reviewApi.js
import axiosInstance from './axiosInstance';
import { REVIEW_ENDPOINTS } from './endpoints';

export const getReviewsForProduct = (productId, page = 0, size = 10) =>
  axiosInstance.get(`${REVIEW_ENDPOINTS.BY_PRODUCT(productId)}?page=${page}&size=${size}&sort=createdAt,desc`);

export const getRatingSummary = (productId) =>
  axiosInstance.get(REVIEW_ENDPOINTS.SUMMARY(productId));

export const createReview = (data) => axiosInstance.post(REVIEW_ENDPOINTS.BASE, data);
export const updateReview = (id, data) => axiosInstance.put(REVIEW_ENDPOINTS.BY_ID(id), data);
export const deleteReview = (id) => axiosInstance.delete(REVIEW_ENDPOINTS.BY_ID(id));