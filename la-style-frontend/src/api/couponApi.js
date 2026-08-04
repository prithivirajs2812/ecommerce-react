// src/api/couponApi.js
import axiosInstance from './axiosInstance';
import { COUPON_ENDPOINTS } from './endpoints';

export const getAllCoupons = () => axiosInstance.get(COUPON_ENDPOINTS.ALL);
export const createCoupon = (data) => axiosInstance.post(COUPON_ENDPOINTS.ALL, data);
export const updateCoupon = (id, data) => axiosInstance.put(COUPON_ENDPOINTS.BY_ID(id), data);
export const deactivateCoupon = (id) => axiosInstance.patch(COUPON_ENDPOINTS.DEACTIVATE(id));