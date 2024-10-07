import React, { useEffect, useState } from 'react';
import {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '../api/notificationApi.js'; // Adjust the import path as needed
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { CheckCircle, Delete } from '@mui/icons-material';

const NotificationList = ({ onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getAllNotifications();
        setNotifications(data);
        // Calculate unread count when notifications are fetched
        const unreadCount = data.filter((n) => !n.isRead).length;
        onUnreadCountChange(unreadCount); // Call the prop function to update the count
      } catch (err) {
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [onUnreadCountChange]); // Dependency added

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Update unread count after marking as read
      const unreadCount = notifications.filter((n) => !n.isRead).length - 1;
      onUnreadCountChange(unreadCount);
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );

      // Update unread count after deleting
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      onUnreadCountChange(unreadCount);
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color='error'>{error}</Typography>;

  return (
    <Paper
      elevation={3}
      sx={{ p: 2, borderRadius: 2, maxWidth: 400, margin: 'auto' }}
    >
      <Typography variant='h5' gutterBottom align='center'>
        Notifications
      </Typography>
      <List>
        {notifications.length === 0 ? (
          <Typography variant='body2' align='center' color='text.secondary'>
            No notifications available.
          </Typography>
        ) : (
          notifications.map((notification) => (
            <React.Fragment key={notification._id}>
              <ListItem
                sx={{
                  backgroundColor: notification.isRead ? '#e8f5e9' : '#ffe0b2',
                  borderRadius: '8px',
                  mb: 1,
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: notification.isRead
                      ? '#c8e6c9'
                      : '#ffe0b2',
                  },
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <ListItemText
                    primary={<strong>{notification.message}</strong>}
                    secondary={
                      <Typography variant='body2' color='text.secondary'>
                        Status: {notification.isRead ? 'Read' : 'Unread'}
                      </Typography>
                    }
                  />
                </Box>
                <ListItemSecondaryAction
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                >
                  <Tooltip title='Mark as Read'>
                    <IconButton
                      onClick={() => handleMarkAsRead(notification._id)}
                      disabled={notification.isRead}
                      color='success'
                      sx={{ mt: 1 }} // Margin-top for spacing
                    >
                      <CheckCircle />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <IconButton
                      onClick={() => handleDeleteNotification(notification._id)}
                      color='error'
                      sx={{ mt: 1 }} // Margin-top for spacing
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

export default NotificationList;

// import React, { useEffect, useState } from 'react';
// import {
//   getAllNotifications,
//   markNotificationAsRead,
//   deleteNotification,
// } from '../api/notificationApi.js'; // Adjust the import path as needed
// import {
//   Box,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   Divider,
//   CircularProgress,
//   Paper,
//   IconButton,
//   Tooltip,
// } from '@mui/material';
// import { CheckCircle, Delete } from '@mui/icons-material';

// const NotificationList = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const data = await getAllNotifications();
//         setNotifications(data);
//       } catch (err) {
//         setError('Failed to fetch notifications');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const handleMarkAsRead = async (id) => {
//     try {
//       await markNotificationAsRead(id);
//       setNotifications((prev) =>
//         prev.map((notification) =>
//           notification._id === id
//             ? { ...notification, isRead: true }
//             : notification
//         )
//       );
//     } catch (err) {
//       setError('Failed to mark notification as read');
//     }
//   };

//   const handleDeleteNotification = async (id) => {
//     try {
//       await deleteNotification(id);
//       setNotifications((prev) =>
//         prev.filter((notification) => notification._id !== id)
//       );
//     } catch (err) {
//       setError('Failed to delete notification');
//     }
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color='error'>{error}</Typography>;

//   return (
//     <Paper
//       elevation={3}
//       sx={{ p: 2, borderRadius: 2, maxWidth: 400, margin: 'auto' }}
//     >
//       <Typography variant='h5' gutterBottom align='center'>
//         Notifications
//       </Typography>
//       <List>
//         {notifications.length === 0 ? (
//           <Typography variant='body2' align='center' color='text.secondary'>
//             No notifications available.
//           </Typography>
//         ) : (
//           notifications.map((notification) => (
//             <React.Fragment key={notification._id}>
//               <ListItem
//                 sx={{
//                   backgroundColor: notification.isRead ? '#e8f5e9' : '#ffe0b2',
//                   borderRadius: '8px',
//                   mb: 1,
//                   transition: 'background-color 0.3s',
//                   '&:hover': {
//                     backgroundColor: notification.isRead
//                       ? '#c8e6c9'
//                       : '#ffe0b2',
//                   },
//                 }}
//               >
//                 <Box sx={{ flexGrow: 1 }}>
//                   {' '}
//                   {/* Allows text to grow and take space */}
//                   <ListItemText
//                     primary={<strong>{notification.message}</strong>}
//                     secondary={
//                       <Typography variant='body2' color='text.secondary'>
//                         Status: {notification.isRead ? 'Read' : 'Unread'}
//                       </Typography>
//                     }
//                   />
//                 </Box>
//                 <ListItemSecondaryAction
//                   sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
//                 >
//                   <Tooltip title='Mark as Read'>
//                     <IconButton
//                       onClick={() => handleMarkAsRead(notification._id)}
//                       disabled={notification.isRead}
//                       color='success'
//                       sx={{ mt: 1 }} // Margin-top for spacing
//                     >
//                       <CheckCircle />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title='Delete'>
//                     <IconButton
//                       onClick={() => handleDeleteNotification(notification._id)}
//                       color='error'
//                       sx={{ mt: 1 }} // Margin-top for spacing
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

// export default NotificationList;
