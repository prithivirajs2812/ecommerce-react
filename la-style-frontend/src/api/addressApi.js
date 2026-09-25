// src/api/addressApi.js
import axiosInstance from './axiosInstance';
import { ADDRESS_ENDPOINTS } from './endpoints';

export const getMyAddresses = () => axiosInstance.get(ADDRESS_ENDPOINTS.ALL);
export const createAddress = (data) => axiosInstance.post(ADDRESS_ENDPOINTS.ALL, data);
export const updateAddress = (addressId, data) =>
  axiosInstance.put(ADDRESS_ENDPOINTS.BY_ID(addressId), data);
export const deleteAddress = (addressId) =>
  axiosInstance.delete(ADDRESS_ENDPOINTS.BY_ID(addressId));