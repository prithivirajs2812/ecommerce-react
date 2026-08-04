// src/api/axiosInstance.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../config/env';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_STORAGE_KEY = 'auth';

function readAuthState() {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return parsed?.state ?? null;
  } catch {
    return null;
  }
}

function extractRoles(accessToken) {
  try {
    const decoded = jwtDecode(accessToken);
    return decoded.roles || [];
  } catch {
    return [];
  }
}

function writeTokens({ accessToken, refreshToken }) {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return;
  const parsed = JSON.parse(stored);
  parsed.state = {
    ...parsed.state,
    accessToken,
    refreshToken: refreshToken ?? parsed.state.refreshToken,
    roles: extractRoles(accessToken),
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
}

function clearAuthAndRedirect() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = '/login';
}

axiosInstance.interceptors.request.use((config) => {
  const state = readAuthState();
  if (state?.accessToken) {
    config.headers.Authorization = `Bearer ${state.accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let refreshWaiters = [];

function subscribeToRefresh(callback) {
  refreshWaiters.push(callback);
}

function notifyRefreshed(newAccessToken) {
  refreshWaiters.forEach((cb) => cb(newAccessToken));
  refreshWaiters = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config: originalRequest } = error;

    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      if (response?.status === 401) {
        clearAuthAndRedirect();
      }
      return Promise.reject(error);
    }

    const state = readAuthState();
    if (!state?.refreshToken) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeToRefresh((newAccessToken) => {
          if (!newAccessToken) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken: state.refreshToken,
      });

      writeTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      notifyRefreshed(data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      notifyRefreshed(null);
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;