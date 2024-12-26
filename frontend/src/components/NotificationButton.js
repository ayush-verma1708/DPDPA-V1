import React, { useEffect, useState } from 'react';
import { Box, IconButton, Popover, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationList from './NotificationList'; // Ensure this path is correct
import { getAllNotifications } from '../api/notificationApi.js'; // Ensure this path is correct

const NotificationButton = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0); // State to hold notification count

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handlePopoverClose = () => {
    setOpen(false);
  };

  // Fetch the count of unread notifications when the component mounts
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const notifications = await getAllNotifications(); // Fetch all notifications
        // Count unread notifications
        const unreadCount = notifications.filter(
          (notif) => !notif.isRead
        ).length;
        setNotificationCount(unreadCount); // Update the count
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotificationCount();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <Box>
      <IconButton
        aria-describedby={open ? 'notification-popover' : undefined}
        onClick={handlePopoverOpen}
        color='inherit'
        sx={{ color: 'black' }} // Change the color to black
      >
        <Badge badgeContent={notificationCount} color='error'>
          <NotificationsIcon sx={{ color: 'black' }} />
        </Badge>
      </IconButton>
      <Popover
        id='notification-popover'
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
        {/* Pass the function to update the notification count */}
        <NotificationList onUnreadCountChange={setNotificationCount} />
      </Popover>
    </Box>
  );
};

export default NotificationButton;
