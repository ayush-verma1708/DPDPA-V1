import React, { useEffect, useState } from 'react';
import { Box, IconButton, Popover, Badge } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail'; // Import Mail icon
import MessageList from './MessageList'; // Ensure this path is correct
import { getAllMessages } from '../api/messageApi.js'; // Ensure this path is correct
import { markMessageAsRead, deleteMessage } from '../api/messageApi.js';

const MessageButton = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [messageCount, setMessageCount] = useState(0); // State to hold message count
  const [messages, setMessages] = useState([]); // State to hold the messages

  // Log the userId whenever the component renders
  useEffect(() => {
    console.log('User ID:', userId); // Log userId here
  }, [userId]);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handlePopoverClose = () => {
    setOpen(false);
  };

  // Fetch messages when the user ID changes
  const fetchMessages = async () => {
    if (!userId) return; // Ensure userId is available
    try {
      const fetchedMessages = await getAllMessages(userId); // Pass userId here
      setMessages(fetchedMessages); // Set messages in state
      // Count unread messages (assuming isRead is a property in your message schema)
      const unreadCount = fetchedMessages.filter((msg) => !msg.isRead).length;
      setMessageCount(unreadCount); // Update the count
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  useEffect(() => {
    fetchMessages(); // Initial fetch
  }, [userId]); // Depend on userId to refetch messages if it changes

  // Callback functions to refetch messages after reading or deleting
  const handleMarkAsRead = async (messageId) => {
    // Assuming markMessageAsRead is defined in messageApi.js
    await markMessageAsRead(messageId);
    await fetchMessages(); // Refetch messages after marking as read
  };

  const handleDeleteMessage = async (messageId) => {
    // Assuming deleteMessage is defined in messageApi.js
    await deleteMessage(messageId);
    await fetchMessages(); // Refetch messages after deleting
  };

  return (
    <Box>
      <IconButton
        aria-describedby={open ? 'message-popover' : undefined}
        onClick={handlePopoverOpen}
        color='inherit'
        sx={{ color: 'black' }} // Change the color to black
      >
        <Badge badgeContent={messageCount} color='error'>
          <MailIcon sx={{ color: 'black' }} />
        </Badge>
      </IconButton>
      <Popover
        id='message-popover'
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MessageList
          messages={messages}
          onMarkAsRead={handleMarkAsRead} // Pass the callback
          onDeleteMessage={handleDeleteMessage} // Pass the callback
        />
      </Popover>
    </Box>
  );
};

export default MessageButton;
