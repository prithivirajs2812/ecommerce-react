
import axiosInstance from './axiosInstance';
import { NOTIFICATION_ENDPOINTS } from './endpoints';

export const getMyNotifications = (page = 0, size = 10) =>
  axiosInstance.get(`${NOTIFICATION_ENDPOINTS.ALL}?page=${page}&size=${size}`);

export const getUnreadCount = () => axiosInstance.get(NOTIFICATION_ENDPOINTS.UNREAD_COUNT);

export const markNotificationAsRead = (id) =>
  axiosInstance.patch(NOTIFICATION_ENDPOINTS.MARK_READ(id));

export const markAllNotificationsAsRead = () =>
  axiosInstance.patch(NOTIFICATION_ENDPOINTS.MARK_ALL_READ);