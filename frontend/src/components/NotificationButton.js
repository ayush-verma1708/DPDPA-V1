import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  Backdrop,
  Badge,
  CircularProgress,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationList from './NotificationList'; // Ensure this path is correct
import { getAllNotifications } from '../api/notificationApi.js'; // Ensure this path is correct

const NotificationButton = () => {
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // State to hold notification count
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors during fetch

  // Open the drawer when the button is clicked
  const handleDrawerOpen = () => setOpen(true);

  // Close the drawer when the backdrop or close button is clicked
  const handleDrawerClose = () => setOpen(false);

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

        // Set loading to false after data is fetched
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
        setError('Failed to fetch notifications'); // Set error message
        setLoading(false); // Ensure loading stops even if there's an error
      }
    };

    fetchNotificationCount();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <Box>
      <IconButton
        onClick={handleDrawerOpen}
        color='inherit'
        sx={{ color: 'black' }} // Change the color to black
      >
        <Badge badgeContent={notificationCount} color='error'>
          <NotificationsIcon sx={{ color: 'black' }} />
        </Badge>
      </IconButton>

      {/* Drawer to show notifications in side-panel view */}
      <Drawer
        anchor='right' // This makes the drawer come from the right side
        open={open}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: '50%', // Takes up half of the page width
            height: '100%', // Takes full height
            backgroundColor: 'white', // You can customize the background color
            borderRadius: 0, // Remove rounded corners if necessary
          },
        }}
      >
        {/* Notification content */}
        <NotificationList onUnreadCountChange={setNotificationCount} />
      </Drawer>

      {/* Backdrop for blurring the background */}
      {/* <Backdrop
        open={open}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(5px)', // Apply blur effect to the background
        }}
      ></Backdrop> */}

      {/* Show loading spinner if still loading */}
      {/* Show error message if there's an error */}
      {error && <Box sx={{ color: 'red', marginTop: 2 }}>{error}</Box>}
    </Box>
  );
};

export default NotificationButton;

// import React, { useEffect, useState } from 'react';
// import { Box, IconButton, Popover, Badge } from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import NotificationList from './NotificationList'; // Ensure this path is correct
// import { getAllNotifications } from '../api/notificationApi.js'; // Ensure this path is correct

// const NotificationButton = () => {
//   const [open, setOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [notificationCount, setNotificationCount] = useState(0); // State to hold notification count

//   const handlePopoverOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//     setOpen(true);
//   };

//   const handlePopoverClose = () => {
//     setOpen(false);
//   };

//   // Fetch the count of unread notifications when the component mounts
//   useEffect(() => {
//     const fetchNotificationCount = async () => {
//       try {
//         const notifications = await getAllNotifications(); // Fetch all notifications
//         // Count unread notifications
//         const unreadCount = notifications.filter(
//           (notif) => !notif.isRead
//         ).length;
//         setNotificationCount(unreadCount); // Update the count
//       } catch (error) {
//         console.error('Failed to fetch notifications', error);
//       }
//     };

//     fetchNotificationCount();
//   }, []); // Empty dependency array ensures this runs once on mount

//   return (
//     <Box>
//       <IconButton
//         aria-describedby={open ? 'notification-popover' : undefined}
//         onClick={handlePopoverOpen}
//         color='inherit'
//         sx={{ color: 'black' }} // Change the color to black
//       >
//         <Badge badgeContent={notificationCount} color='error'>
//           <NotificationsIcon sx={{ color: 'black' }} />
//         </Badge>
//       </IconButton>
//       <Popover
//         id='notification-popover'
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
//         {/* Pass the function to update the notification count */}
//         <NotificationList onUnreadCountChange={setNotificationCount} />
//       </Popover>
//     </Box>
//   );
// };

// export default NotificationButton;
