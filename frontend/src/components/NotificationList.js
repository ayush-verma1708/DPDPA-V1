import React, { useEffect, useState } from 'react';
import {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '../api/notificationApi.js'; // Adjust the import path as needed
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  Paper,
} from '@mui/material';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getAllNotifications();
        setNotifications(data);
      } catch (err) {
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

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
        {notifications.map((notification) => (
          <React.Fragment key={notification._id}>
            <ListItem
              sx={{
                backgroundColor: notification.isRead ? '#e8f5e9' : '#ffe0b2',
                borderRadius: '8px',
                mb: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: 2, // Added padding
              }}
            >
              <ListItemText
                primary={<strong>{notification.message}</strong>}
                secondary={
                  <Typography variant='body2' color='text.secondary'>
                    Status: {notification.isRead ? 'Read' : 'Unread'}
                  </Typography>
                }
              />
              <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                {/* <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleMarkAsRead(notification._id)}
                  disabled={notification.isRead}
                  sx={{
                    backgroundColor: notification.isRead
                      ? '#c8e6c9'
                      : '#4caf50',
                    color: 'white',
                    padding: '6px 12px', // Added padding
                    '&:hover': {
                      backgroundColor: notification.isRead
                        ? '#c8e6c9'
                        : '#388e3c',
                    },
                  }}
                >
                  Mark as Read
                </Button>
                <Button
                  variant='outlined'
                  color='error'
                  size='small'
                  onClick={() => handleDeleteNotification(notification._id)}
                  sx={{
                    padding: '6px 12px', // Added padding
                  }}
                >
                  Delete
                </Button> */}
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default NotificationList;
