// routes/messageRoutes.js
import express from 'express';
import { getMessagesForUser } from '../services/messageService.js'; // Import your service
import {
  markMessageAsRead,
  deleteMessage,
} from '../controllers/messageController.js';

const router = express.Router();

// Route to get messages for a specific user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await getMessagesForUser(userId); // Fetch messages for the user
    res.status(200).json(messages); // Return the messages in the response
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message }); // Return an error if something goes wrong
  }
});

// Route to mark a message as read
router.patch('/:id/read', async (req, res) => {
  try {
    const updatedMessage = await markMessageAsRead(req.params.id);
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a message
router.patch('/:id/delete', async (req, res) => {
  // Changed to PATCH for consistency
  try {
    const updatedMessage = await deleteMessage(req.params.id);
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
