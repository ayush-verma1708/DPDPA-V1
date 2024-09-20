import Notification from '../models/notificationSchema.js';

// Fetch all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

// Fetch unread notifications
export const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isRead: false }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    res.status(500).json({ error: 'Error fetching unread notifications' });
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Error marking notification as read' });
  }
};

// Create a new notification
export const createNotification = async (req, res) => {
  const { assignedTo, message } = req.body;

  if (!assignedTo || !message) {
    return res
      .status(400)
      .json({ error: 'Assigned user and message are required' });
  }

  try {
    const newNotification = new Notification({ assignedTo, message });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Error creating notification' });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );

    if (!deletedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Error deleting notification' });
  }
};

// Update a notification (Optional)
export const updateNotification = async (req, res) => {
  const notificationId = req.params.id;
  const { message } = req.body;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { message },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Error updating notification' });
  }
};

// import Notification from '../models/notificationSchema.js';

// // Fetch all notifications
// export const getAllNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find({
//       assignedTo: req.userId,
//     }).sort({ createdAt: -1 });
//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     res.status(500).json({ error: 'Error fetching notifications' });
//   }
// };

// // Fetch unread notifications
// export const getUnreadNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find({
//       assignedTo: req.userId,
//       isRead: false,
//     }).sort({ createdAt: -1 });
//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error('Error fetching unread notifications:', error);
//     res.status(500).json({ error: 'Error fetching unread notifications' });
//   }
// };

// // Mark a notification as read
// export const markNotificationAsRead = async (req, res) => {
//   const notificationId = req.params.id;

//   try {
//     const updatedNotification = await Notification.findByIdAndUpdate(
//       notificationId,
//       { isRead: true, readAt: new Date() },
//       { new: true }
//     );

//     if (!updatedNotification) {
//       return res.status(404).json({ error: 'Notification not found' });
//     }

//     res.status(200).json(updatedNotification);
//   } catch (error) {
//     console.error('Error marking notification as read:', error);
//     res.status(500).json({ error: 'Error marking notification as read' });
//   }
// };

// // Create a new notification
// export const createNotification = async (req, res) => {
//   const { assignedTo, message } = req.body;

//   if (!assignedTo || !message) {
//     return res
//       .status(400)
//       .json({ error: 'Assigned user and message are required' });
//   }

//   try {
//     const newNotification = new Notification({ assignedTo, message });
//     await newNotification.save();
//     res.status(201).json(newNotification);
//   } catch (error) {
//     console.error('Error creating notification:', error);
//     res.status(500).json({ error: 'Error creating notification' });
//   }
// };

// // Delete a notification
// export const deleteNotification = async (req, res) => {
//   const notificationId = req.params.id;

//   try {
//     const deletedNotification = await Notification.findByIdAndDelete(
//       notificationId
//     );

//     if (!deletedNotification) {
//       return res.status(404).json({ error: 'Notification not found' });
//     }

//     res.status(204).send(); // No content response
//   } catch (error) {
//     console.error('Error deleting notification:', error);
//     res.status(500).json({ error: 'Error deleting notification' });
//   }
// };

// // Update a notification (Optional)
// export const updateNotification = async (req, res) => {
//   const notificationId = req.params.id;
//   const { message } = req.body;

//   try {
//     const updatedNotification = await Notification.findByIdAndUpdate(
//       notificationId,
//       { message },
//       { new: true }
//     );

//     if (!updatedNotification) {
//       return res.status(404).json({ error: 'Notification not found' });
//     }

//     res.status(200).json(updatedNotification);
//   } catch (error) {
//     console.error('Error updating notification:', error);
//     res.status(500).json({ error: 'Error updating notification' });
//   }
// };
