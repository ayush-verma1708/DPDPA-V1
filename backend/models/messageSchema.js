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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Message Model
const Message = mongoose.model('Message', messageSchema);

export default Message;
