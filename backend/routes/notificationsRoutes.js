import express from 'express';
import {
  getAllNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  createNotification,
  deleteNotification,
  updateNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

// Define routes
router.get('/', getAllNotifications); // Get all notifications
router.get('/unread', getUnreadNotifications); // Get unread notifications
router.put('/:id/read', markNotificationAsRead); // Mark as read
router.post('/', createNotification); // Create notification
router.delete('/:id', deleteNotification); // Delete notification
router.put('/:id', updateNotification); // Update notification (optional)

export default router;
