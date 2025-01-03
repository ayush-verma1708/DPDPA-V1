import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  Backdrop,
  Badge,
  CircularProgress,
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail'; // Import Mail icon
import MessageList from './MessageList'; // Ensure this path is correct
import { getAllMessages } from '../api/messageApi.js'; // Ensure this path is correct
import { markMessageAsRead, deleteMessage } from '../api/messageApi.js'; // Assuming these are defined in messageApi.js

const MessageButton = ({ userId }) => {
  const [open, setOpen] = useState(false); // State for controlling drawer open/close
  const [messageCount, setMessageCount] = useState(0); // State for unread message count
  const [messages, setMessages] = useState([]); // State to hold messages
  const [loading, setLoading] = useState(true); // Loading state while fetching messages
  const [error, setError] = useState(null); // State for tracking errors

  // Fetch messages and update message count
  const fetchMessages = async () => {
    if (!userId) return; // Ensure userId is available
    setLoading(true); // Set loading state to true while fetching
    try {
      const fetchedMessages = await getAllMessages(userId); // Fetch messages
      setMessages(fetchedMessages); // Set messages in state
      // Count unread messages
      const unreadCount = fetchedMessages.filter((msg) => !msg.isRead).length;
      setMessageCount(unreadCount); // Update unread message count
    } catch (error) {
      console.error('Failed to fetch messages', error);
      setError('Failed to fetch messages'); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    fetchMessages(); // Initial fetch when component mounts
  }, [userId]); // Re-fetch messages if userId changes

  // Mark message as read
  const handleMarkAsRead = async (messageId) => {
    await markMessageAsRead(messageId);
    await fetchMessages(); // Refetch after marking as read
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    await deleteMessage(messageId);
    await fetchMessages(); // Refetch after deleting the message
  };

  // Open the drawer (side panel)
  const handleDrawerOpen = () => setOpen(true);

  // Close the drawer (side panel)
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box>
      <IconButton
        onClick={handleDrawerOpen}
        color='inherit'
        sx={{ color: 'black' }}
      >
        <Badge badgeContent={messageCount} color='error'>
          <MailIcon sx={{ color: 'black' }} />
        </Badge>
      </IconButton>

      {/* Drawer for side panel */}
      <Drawer
        anchor='right' // Drawer slides from the right
        open={open}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: '50%', // Drawer takes up 50% of the screen width
            height: '100%', // Full height
            backgroundColor: 'white',
            borderRadius: 0,
          },
        }}
      >
        {/* Display loading spinner or messages */}
        {loading ? (
          <CircularProgress
            color='primary'
            sx={{ display: 'block', margin: 'auto' }}
          />
        ) : error ? (
          <Box sx={{ color: 'red', textAlign: 'center', marginTop: 2 }}>
            {error}
          </Box>
        ) : (
          <MessageList
            messages={messages}
            onMarkAsRead={handleMarkAsRead} // Callback to mark messages as read
            onDeleteMessage={handleDeleteMessage} // Callback to delete messages
          />
        )}
      </Drawer>
    </Box>
  );
};

export default MessageButton;

// import React, { useEffect, useState } from 'react';
// import { Box, IconButton, Popover, Badge } from '@mui/material';
// import MailIcon from '@mui/icons-material/Mail'; // Import Mail icon
// import MessageList from './MessageList'; // Ensure this path is correct
// import { getAllMessages } from '../api/messageApi.js'; // Ensure this path is correct
// import { markMessageAsRead, deleteMessage } from '../api/messageApi.js';

// const MessageButton = ({ userId }) => {
//   const [open, setOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [messageCount, setMessageCount] = useState(0); // State to hold message count
//   const [messages, setMessages] = useState([]); // State to hold the messages

//   // Log the userId whenever the component renders
//   // useEffect(() => {
//   //   // console.log('User ID:', userId); // Log userId here
//   // }, [userId]);

//   const handlePopoverOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//     setOpen(true);
//   };

//   const handlePopoverClose = () => {
//     setOpen(false);
//   };

//   // Fetch messages when the user ID changes
//   const fetchMessages = async () => {
//     if (!userId) return; // Ensure userId is available
//     try {
//       const fetchedMessages = await getAllMessages(userId); // Pass userId here
//       setMessages(fetchedMessages); // Set messages in state
//       // Count unread messages (assuming isRead is a property in your message schema)
//       const unreadCount = fetchedMessages.filter((msg) => !msg.isRead).length;
//       setMessageCount(unreadCount); // Update the count
//     } catch (error) {
//       console.error('Failed to fetch messages', error);
//     }
//   };

//   useEffect(() => {
//     fetchMessages(); // Initial fetch
//   }, [userId]); // Depend on userId to refetch messages if it changes

//   // Callback functions to refetch messages after reading or deleting
//   const handleMarkAsRead = async (messageId) => {
//     // Assuming markMessageAsRead is defined in messageApi.js
//     await markMessageAsRead(messageId);
//     await fetchMessages(); // Refetch messages after marking as read
//   };

//   const handleDeleteMessage = async (messageId) => {
//     // Assuming deleteMessage is defined in messageApi.js
//     await deleteMessage(messageId);
//     await fetchMessages(); // Refetch messages after deleting
//   };

//   return (
//     <Box>
//       <IconButton
//         aria-describedby={open ? 'message-popover' : undefined}
//         onClick={handlePopoverOpen}
//         color='inherit'
//         sx={{ color: 'black' }} // Change the color to black
//       >
//         <Badge badgeContent={messageCount} color='error'>
//           <MailIcon sx={{ color: 'black' }} />
//         </Badge>
//       </IconButton>
//       <Popover
//         id='message-popover'
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handlePopoverClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'center',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'center',
//         }}
//       >
//         <MessageList
//           messages={messages}
//           onMarkAsRead={handleMarkAsRead} // Pass the callback
//           onDeleteMessage={handleDeleteMessage} // Pass the callback
//         />
//       </Popover>
//     </Box>
//   );
// };

// export default MessageButton;
