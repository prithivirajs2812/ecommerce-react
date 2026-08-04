// src/api/sellerApi.js
import axiosInstance from './axiosInstance';
import { SELLER_ENDPOINTS } from './endpoints';

export const registerAsSeller = (data) => axiosInstance.post(SELLER_ENDPOINTS.REGISTER, data);
export const getMySellerProfile = () => axiosInstance.get(SELLER_ENDPOINTS.ME);