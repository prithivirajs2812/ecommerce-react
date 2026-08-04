// src/api/dashboardApi.js
import axiosInstance from './axiosInstance';
import { DASHBOARD_ENDPOINTS } from './endpoints';

export const getSellerDashboard = () => axiosInstance.get(DASHBOARD_ENDPOINTS.SELLER);
export const getAdminDashboard = () => axiosInstance.get(DASHBOARD_ENDPOINTS.ADMIN);