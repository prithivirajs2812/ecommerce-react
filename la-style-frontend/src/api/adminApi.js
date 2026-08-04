// src/api/adminApi.js
import axiosInstance from './axiosInstance';
import { ADMIN_ENDPOINTS } from './endpoints';

export const getAdminDashboard = () => axiosInstance.get(ADMIN_ENDPOINTS.DASHBOARD);

export const getAllUsers = (page = 0, size = 20) =>
  axiosInstance.get(`${ADMIN_ENDPOINTS.USERS}?page=${page}&size=${size}&sort=createdAt,desc`);
export const banUser = (id) => axiosInstance.patch(ADMIN_ENDPOINTS.BAN_USER(id));
export const unbanUser = (id) => axiosInstance.patch(ADMIN_ENDPOINTS.UNBAN_USER(id));

export const getAllSellers = (page = 0, size = 20) =>
  axiosInstance.get(`${ADMIN_ENDPOINTS.SELLERS}?page=${page}&size=${size}`);
export const getPendingSellers = (page = 0, size = 20) =>
  axiosInstance.get(`${ADMIN_ENDPOINTS.PENDING_SELLERS}?page=${page}&size=${size}`);
export const verifySeller = (id) => axiosInstance.patch(ADMIN_ENDPOINTS.VERIFY_SELLER(id));