import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Typography,
  Box,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Delete } from '@mui/icons-material';
import { getStatusById } from '../api/completionStatusApi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const MessageList = ({
  messages = [],
  onMarkAsRead,
  onDeleteMessage,
  loading, // Add loading state
  error, // Add error state
}) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const filteredMessages = messages.filter(
    (message) => !message.isDeleted && message.status !== 'deleted'
  );

  // Function to handle link click
  const handleLinkClick = async (completionStatusId) => {
    try {
      const data = await getStatusById(completionStatusId);
      console.log('Completion Status Data:', data); // You can do whatever you want with the data
      navigate('/Compliance-Operation'); // Change this to your desired route
    } catch (error) {
      console.error('Error fetching status by ID:', error);
    }
  };

  // If loading, show a spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If there's an error, display an error message
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', color: 'red', padding: 2 }}>
        <Typography variant='body2'>{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        maxWidth: '100%',
        height: '100%', // Full height of the side panel
        overflowY: 'auto', // Allow scrolling when there are many notifications
      }}
    >
      <Typography variant='h5' gutterBottom align='center'>
        Messages
      </Typography>
      <List>
        {filteredMessages.length === 0 ? (
          <ListItem>
            <ListItemText primary='No messages available' />
          </ListItem>
        ) : (
          filteredMessages.map((message) => (
            <React.Fragment key={message._id}>
              <ListItem
                sx={{
                  backgroundColor: message.isRead ? '#e8f5e9' : '#ffe0b2',
                  borderRadius: '8px',
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant='body1' fontWeight='bold'>
                      {message.message}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant='body2'>
                        Received at:{' '}
                        <strong>
                          {new Date(message.createdAt).toLocaleString()}
                        </strong>
                      </Typography>
                      <Typography variant='body2'>
                        Task assigned:{' '}
                        <a
                          href='#'
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default link behavior
                            handleLinkClick(message.completionStatusId); // Call the function
                          }}
                        >
                          <strong>Click here</strong>
                        </a>
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction sx={{ top: '70%' }}>
                  <Tooltip title='Mark as Read'>
                    <IconButton
                      onClick={() => onMarkAsRead(message._id)} // Use the passed function
                      disabled={message.isRead}
                      color='success'
                    >
                      <CheckCircle />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <IconButton
                      onClick={() => onDeleteMessage(message._id)} // Use the passed function
                      color='error'
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
};

export default MessageList;

// import React from 'react';
// import {
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   Divider,
//   Typography,
//   Box,
//   Paper,
//   IconButton,
//   Tooltip,
// } from '@mui/material';
// import { CheckCircle, Delete } from '@mui/icons-material';
// import { getStatusById } from '../api/completionStatusApi';

// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// const MessageList = ({ messages = [], onMarkAsRead, onDeleteMessage }) => {
//   // Filter out messages that are marked as deleted or have a status of "deleted"

//   const navigate = useNavigate(); // Initialize useNavigate
//   const filteredMessages = messages.filter(
//     (message) => !message.isDeleted && message.status !== 'deleted'
//   );

//   // Function to handle link click
//   const handleLinkClick = async (completionStatusId) => {
//     try {
//       const data = await getStatusById(completionStatusId);
//       console.log('Completion Status Data:', data); // You can do whatever you want with the data
//       navigate('/Compliance-Operation'); // Change this to your desired route
//     } catch (error) {
//       console.error('Error fetching status by ID:', error);
//     }
//   };

//   return (
//     <Paper
//       elevation={3}
//       sx={{ p: 2, borderRadius: 2, maxWidth: 600, margin: 'auto' }}
//     >
//       <Typography variant='h5' gutterBottom align='center'>
//         Messages
//       </Typography>
//       <List>
//         {filteredMessages.length === 0 ? (
//           <ListItem>
//             <ListItemText primary='No messages available' />
//           </ListItem>
//         ) : (
//           filteredMessages.map((message) => (
//             <React.Fragment key={message._id}>
//               <ListItem
//                 sx={{
//                   backgroundColor: message.isRead ? '#e8f5e9' : '#ffe0b2',
//                   borderRadius: '8px',
//                   mb: 1,
//                 }}
//               >
//                 <Box sx={{ flexGrow: 1 }}>
//                   <ListItemText
//                     primary={
//                       <Typography variant='body1' fontWeight='bold'>
//                         {message.message}
//                       </Typography>
//                     }
//                     secondary={
//                       <>
//                         <Typography variant='body2'>
//                           Received at:{' '}
//                           <strong>
//                             {new Date(message.createdAt).toLocaleString()}
//                           </strong>
//                         </Typography>
//                         <Typography variant='body2'>
//                           Task assigned:{' '}
//                           <a
//                             href='#'
//                             onClick={(e) => {
//                               e.preventDefault(); // Prevent default link behavior
//                               handleLinkClick(message.completionStatusId); // Call the function
//                             }}
//                           >
//                             <strong>Click here</strong>
//                           </a>
//                         </Typography>
//                       </>
//                     }
//                   />
//                 </Box>
//                 <ListItemSecondaryAction sx={{ top: '70%' }}>
//                   <Tooltip title='Mark as Read'>
//                     <IconButton
//                       onClick={() => onMarkAsRead(message._id)} // Use the passed function
//                       disabled={message.isRead}
//                       color='success'
//                     >
//                       <CheckCircle />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title='Delete'>
//                     <IconButton
//                       onClick={() => onDeleteMessage(message._id)} // Use the passed function
//                       color='error'
//                     >
//                       <Delete />
//                     </IconButton>
//                   </Tooltip>
//                 </ListItemSecondaryAction>
//               </ListItem>
//               <Divider />
//             </React.Fragment>
//           ))
//         )}
//       </List>
//     </Paper>
//   );
// };

// export default MessageList;
