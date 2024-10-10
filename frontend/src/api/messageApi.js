// api/messageApi.js
import axios from 'axios';

export const getAllMessages = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:8021/api/messages/${userId}`
    ); // Pass userId in the endpoint
    return response.data; // Return the messages array
  } catch (error) {
    console.error('Error fetching messages', error);
    throw error;
  }
};

const BASE_URL = 'http://localhost:8021/api'; // Adjust the base URL as needed

// Function to mark a message as read
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/messages/${messageId}/read`
    );
    return response.data; // Return the updated message data
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error; // Re-throw the error for handling in the component
  }
};

// Function to delete a message (soft delete)
export const deleteMessage = async (messageId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/messages/${messageId}/delete`
    );
    return response.data; // Return the updated message data
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error; // Re-throw the error for handling in the component
  }
};
