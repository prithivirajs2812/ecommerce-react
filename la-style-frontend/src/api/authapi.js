// src/api/authApi.js
import axiosInstance from './axiosInstance';
import { AUTH_ENDPOINTS } from './endpoints';

export const registerUser = (data) => axiosInstance.post(AUTH_ENDPOINTS.REGISTER, data);
export const loginUser = (data) => axiosInstance.post(AUTH_ENDPOINTS.LOGIN, data);
export const logoutUser = (refreshToken) =>
  axiosInstance.post(AUTH_ENDPOINTS.LOGOUT, { refreshToken });