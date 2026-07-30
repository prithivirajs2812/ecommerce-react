// src/api/axiosInstance.js
import axios from 'axios';
import { API_BASE_URL } from '../config/env';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- helpers for reading/writing the zustand-persisted auth state directly ---
// (kept out of the store itself so this file has no React/zustand dependency)
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

function writeTokens({ accessToken, refreshToken }) {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return;
  const parsed = JSON.parse(stored);
  parsed.state = {
    ...parsed.state,
    accessToken,
    refreshToken: refreshToken ?? parsed.state.refreshToken,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
}

function clearAuthAndRedirect() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = '/login';
}

// --- request interceptor: attach current access token ---
axiosInstance.interceptors.request.use((config) => {
  const state = readAuthState();
  if (state?.accessToken) {
    config.headers.Authorization = `Bearer ${state.accessToken}`;
  }
  return config;
});

// --- refresh coordination: only one refresh call in flight at a time ---
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
      // Not a recoverable 401, or we've already retried this request once,
      // or it's the refresh/login call itself failing — give up.
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
      // A refresh is already in flight — wait for it instead of firing another.
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
      // Use a bare axios call (not axiosInstance) to avoid re-triggering
      // these same interceptors on the refresh request itself.
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