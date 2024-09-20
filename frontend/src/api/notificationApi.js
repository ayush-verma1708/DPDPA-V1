import axios from 'axios';

const API_URL = 'http://localhost:8021/api/notifications'; // Update with your actual API URL

// Fetch all notifications
const getAllNotifications = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Fetch unread notifications
const getUnreadNotifications = async () => {
  const response = await axios.get(`${API_URL}/unread`);
  return response.data;
};

// Mark notification as read
const markNotificationAsRead = async (notificationId) => {
  const response = await axios.put(`${API_URL}/${notificationId}/read`);
  return response.data;
};

// Create a new notification
const createNotification = async (notificationData) => {
  const response = await axios.post(API_URL, notificationData);
  return response.data;
};

// Delete a notification
const deleteNotification = async (notificationId) => {
  const response = await axios.delete(`${API_URL}/${notificationId}`);
  return response.data;
};

// Update a notification
const updateNotification = async (notificationId, updatedData) => {
  const response = await axios.put(`${API_URL}/${notificationId}`, updatedData);
  return response.data;
};

export {
  updateNotification,
  deleteNotification,
  createNotification,
  markNotificationAsRead,
  getAllNotifications,
  getUnreadNotifications,
};
