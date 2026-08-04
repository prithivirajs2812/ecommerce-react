// src/api/orderApi.js — add this
import axiosInstance from './axiosInstance';
import { ORDER_ENDPOINTS } from './endpoints';

export const checkout = (data) => axiosInstance.post(ORDER_ENDPOINTS.CHECKOUT, data);
export const getMyOrders = (page = 0, size = 10) =>
  axiosInstance.get(`${ORDER_ENDPOINTS.ALL}?page=${page}&size=${size}`);
export const getOrderById = (id) => axiosInstance.get(ORDER_ENDPOINTS.BY_ID(id));

// new
export const updateOrderStatus = (id, status) =>
  axiosInstance.put(`${ORDER_ENDPOINTS.BY_ID(id)}/status`, { status });

export const getSellerOrders = (page = 0, size = 10) =>
  axiosInstance.get(`${ORDER_ENDPOINTS.SELLER}?page=${page}&size=${size}`);