// src/api/userApi.js
import axiosInstance from './axiosInstance';
import { USER_ENDPOINTS } from './endpoints';

export const getProfile = () => axiosInstance.get(USER_ENDPOINTS.ME);
export const updateProfile = (data) => axiosInstance.put(USER_ENDPOINTS.ME, data);
export const changePassword = (data) => axiosInstance.put(USER_ENDPOINTS.PASSWORD, data);