// src/api/contactApi.js
import axiosInstance from './axiosInstance';
import { CONTACT_ENDPOINTS, ADMIN_CONTACT_ENDPOINTS } from './endpoints';

export const submitContactMessage = (data) => axiosInstance.post(CONTACT_ENDPOINTS.BASE, data);

export const getAllContactMessages = (page = 0, size = 20) =>
  axiosInstance.get(`${ADMIN_CONTACT_ENDPOINTS.ALL}?page=${page}&size=${size}&sort=createdAt,desc`);
export const markContactMessageAsRead = (id) =>
  axiosInstance.patch(ADMIN_CONTACT_ENDPOINTS.MARK_READ(id));