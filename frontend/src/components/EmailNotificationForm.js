// EmailNotificationForm.js
import React, { useState } from 'react';
import axios from 'axios';

const EmailNotificationForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/send-notification', { email, subject, message });
      alert(response.data.message);
    } catch (error) {
      alert('Error sending notification');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Recipient Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button type="submit">Send Notification</button>
    </form>
  );
};

export default EmailNotificationForm;
