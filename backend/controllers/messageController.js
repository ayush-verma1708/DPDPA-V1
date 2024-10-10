// messageController.js
import Message from '../models/messageSchema.js'; // Adjust the path as necessary

// Mark a message as read
export const markMessageAsRead = async (messageId) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        isRead: true, // Set isRead to true
        readAt: Date.now(), // Set readAt to current time
        status: 'read', // Optionally update status
      },
      { new: true } // Return the updated document
    );
    return updatedMessage;
  } catch (error) {
    throw new Error('Error marking message as read: ' + error.message);
  }
};

// Function to mark a message as deleted
export const deleteMessage = async (messageId) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        isRead: true, // Optionally mark as read (depending on your requirements)
        readAt: Date.now(), // Optionally update readAt to current time
        status: 'deleted', // Optionally update status to 'deleted' (if needed)
      },
      { new: true } // Return the updated document
    );

    if (!updatedMessage) {
      throw new Error('Message not found');
    }

    return updatedMessage;
  } catch (error) {
    throw new Error('Error deleting message: ' + error.message);
  }
};
