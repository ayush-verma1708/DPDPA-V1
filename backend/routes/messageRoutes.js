// routes/messageRoutes.js
import express from 'express';
import { getMessagesForUser } from '../services/messageService.js'; // Import your service

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

export default router;
