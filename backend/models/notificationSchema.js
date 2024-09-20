import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date, default: null }, // New field for the timestamp when marked as read
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
