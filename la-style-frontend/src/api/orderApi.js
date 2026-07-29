// src/api/orderApi.js
import axiosInstance from './axiosInstance';
import { ORDER_ENDPOINTS } from './endpoints';

export const checkout = (data) => axiosInstance.post(ORDER_ENDPOINTS.CHECKOUT, data);
export const getMyOrders = (page = 0, size = 10) =>
  axiosInstance.get(`${ORDER_ENDPOINTS.ALL}?page=${page}&size=${size}`);
export const getOrderById = (id) => axiosInstance.get(ORDER_ENDPOINTS.BY_ID(id));