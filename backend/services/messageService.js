// services/messageService.js
import Message from '../models/messageSchema.js'; // Adjust the path as necessary

// Fetch messages for a specific user
export const getMessagesForUser = async (userId) => {
  try {
    return await Message.find({ userId }) // Find messages by userId
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .populate('userId', 'username'); // Populate the userId field to get username
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error; // Propagate the error
  }
};

// Existing createMessage function
export const createMessage = async (
  userId,
  messageContent,
  completionStatusId
) => {
  try {
    console.log(userId);
    const message = new Message({
      userId,
      message: messageContent,
      completionStatusId,
    });
    await message.save();
  } catch (error) {
    console.error('Error creating message:', error);
  }
};
