// messageSchema.js
import mongoose from 'mongoose';

// Message Schema for notifications
const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  message: {
    type: String,
    required: true,
  },
  completionStatusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompletionStatus',
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'read'],
    default: 'pending',
  },
  isRead: {
    // New field to track if message is read
    type: Boolean,
    default: false, // Default is false (not read)
  },
  readAt: {
    // New field to store the timestamp when message is read
    type: Date,
    default: null, // Default is null until the message is read
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Message Model
const Message = mongoose.model('Message', messageSchema);

export default Message;
