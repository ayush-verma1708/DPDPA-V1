// routes/notification.js
const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/emailService'); // Adjust the path as necessary

router.post('/send-notification', async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    await sendEmail(email, subject, message);
    res.status(200).json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
});

module.exports = router;
