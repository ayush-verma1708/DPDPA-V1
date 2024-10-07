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
