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

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Operations related to notifications
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get all notifications
 *     description: Retrieve a list of all notifications.
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   read:
 *                     type: boolean
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllNotifications); // Get all notifications

/**
 * @swagger
 * /api/notifications/unread:
 *   get:
 *     tags: [Notifications]
 *     summary: Get unread notifications
 *     description: Retrieve a list of all unread notifications.
 *     responses:
 *       200:
 *         description: List of unread notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   read:
 *                     type: boolean
 *       500:
 *         description: Internal server error
 */
router.get('/unread', getUnreadNotifications); // Get unread notifications

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark notification as read
 *     description: Mark a specific notification as read by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the notification to mark as read
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id/read', markNotificationAsRead); // Mark as read

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     tags: [Notifications]
 *     summary: Create a new notification
 *     description: Create a new notification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               read:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', createNotification); // Create notification

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification
 *     description: Delete a specific notification by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the notification to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteNotification); // Delete notification

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     tags: [Notifications]
 *     summary: Update a notification
 *     description: Update the details of a specific notification by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the notification to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               read:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateNotification); // Update notification

export default router;

// import express from 'express';
// import {
//   getAllNotifications,
//   getUnreadNotifications,
//   markNotificationAsRead,
//   createNotification,
//   deleteNotification,
//   updateNotification,
// } from '../controllers/notificationController.js';

// const router = express.Router();

// // Define routes
// router.get('/', getAllNotifications); // Get all notifications
// router.get('/unread', getUnreadNotifications); // Get unread notifications
// router.put('/:id/read', markNotificationAsRead); // Mark as read
// router.post('/', createNotification); // Create notification
// router.delete('/:id', deleteNotification); // Delete notification
// router.put('/:id', updateNotification); // Update notification (optional)

// export default router;
