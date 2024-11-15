import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box, IconButton, Popover } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Import bell icon
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import logout icon
import useFetchUser from '../hooks/useCurrentUser'; // Adjust the path if necessary
import NotificationList from './NotificationList'; // Adjust the import path as needed
import MailIcon from '@mui/icons-material/Mail';
import NotificationButton from './NotificationButton'; // Adjust path as needed
import MessageButton from './MessageButton'; // Import the MessageButton

const Header = ({ title, handleLogout }) => {
  const token = localStorage.getItem('token');
  const { user, loading, error } = useFetchUser(token);

  // State for managing the notification panel
  const [anchorEl, setAnchorEl] = useState(null);
  // Check if user is defined before accessing its properties
  const userId = user ? user._id : null;

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  window.localStorage.setItem('company', user?.company._id);
  window.localStorage.setItem('username', user?.username);

  return (
    <AppBar
      position='static'
      sx={{ marginBottom: '2rem', backgroundColor: '#f5f5f5' }}
    >
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '33%',
            }}
          >
            <Typography variant='body1' className='text-black'>
              {user?.company?.companyDetails?.industryType === 'Healthcare' ||
              user?.company?.companyDetails?.industryType === 'Finance' ? (
                <>
                  <span className='font-bold'>
                    {user?.company?.companyDetails?.organizationName ||
                      'Company'}
                  </span>
                  <span>
                    {' '}
                    is a significant data fiduciary <br /> so all 95 controls
                    will be applied.
                  </span>
                </>
              ) : (
                <span>
                  {user?.company?.companyDetails?.organizationName || 'Company'}{' '}
                  is a regular data fiduciary <br /> so 168 controls will be
                  applied.
                </span>
              )}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '33%',
            }}
            textAlign='center'
          >
            {loading ? (
              <Typography variant='body1' sx={{ color: '#111' }}>
                Loading user data...
              </Typography>
            ) : error ? (
              <Typography variant='body1' sx={{ color: '#111' }}>
                Error loading user data
              </Typography>
            ) : user ? (
              <>
                <Typography variant='body1' sx={{ color: '#111' }}>
                  Hello, {user.username}
                </Typography>
                <Typography variant='body2' sx={{ color: '#555' }}>
                  Role: {user.role}
                </Typography>
              </>
            ) : (
              <Typography variant='body1' sx={{ color: '#111' }}>
                User not found
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Bell Icon for Notifications */}
            <NotificationButton />
            {/* Bell Icon for Messages */}
            {userId && <MessageButton userId={userId} />}
          </Box>

          <div className='flex justify-center items-center gap-3'>
            <IconButton onClick={handleLogout} sx={{ color: '#111' }}>
              <ExitToAppIcon />
            </IconButton>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// import React, { useState } from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import { Box, IconButton, Popover } from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications'; // Import bell icon
// import useFetchUser from '../hooks/useCurrentUser'; // Adjust the path if necessary
// import NotificationList from './NotificationList'; // Adjust the import path as needed
// import MailIcon from '@mui/icons-material/Mail';
// import NotificationButton from './NotificationButton'; // Adjust path as needed
// import MessageButton from './MessageButton'; // Import the MessageButton

// const Header = ({ title, handleLogout }) => {
//   const token = localStorage.getItem('token');
//   const { user, loading, error } = useFetchUser(token);

//   // State for managing the notification panel
//   const [anchorEl, setAnchorEl] = useState(null);
//   // Check if user is defined before accessing its properties
//   const userId = user ? user._id : null;

//   const handlePopoverOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handlePopoverClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);

//   window.localStorage.setItem('company', user?.company._id);
//   window.localStorage.setItem('username', user?.username);

//   return (
//     <AppBar
//       position='static'
//       sx={{ marginBottom: '2rem', backgroundColor: '#f5f5f5' }}
//     >
//       <Toolbar>
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             width: '100%',
//           }}
//         >
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//               width: '33%',
//             }}
//           >
//             <Typography variant='body1' className='text-black'>
//               {user?.company?.companyDetails?.industryType === 'Healthcare' ||
//               user?.company?.companyDetails?.industryType === 'Finance' ? (
//                 <>
//                   <span className='font-bold'>
//                     {user?.company?.companyDetails?.organizationName ||
//                       'Company'}
//                   </span>
//                   <span>
//                     {' '}
//                     is a significant data fiduciary <br /> so all 95 controls
//                     will be applied.
//                   </span>
//                 </>
//               ) : (
//                 <span>
//                   {user?.company?.companyDetails?.organizationName || 'Company'}{' '}
//                   is a regular data fiduciary <br /> so 168 controls will be
//                   applied.
//                 </span>
//               )}
//             </Typography>
//           </Box>

//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//               width: '33%',
//             }}
//             textAlign='center'
//           >
//             {loading ? (
//               <Typography variant='body1' sx={{ color: '#111' }}>
//                 Loading user data...
//               </Typography>
//             ) : error ? (
//               <Typography variant='body1' sx={{ color: '#111' }}>
//                 Error loading user data
//               </Typography>
//             ) : user ? (
//               <>
//                 <Typography variant='body1' sx={{ color: '#111' }}>
//                   Hello, {user.username}
//                 </Typography>
//                 <Typography variant='body2' sx={{ color: '#555' }}>
//                   Role: {user.role}
//                 </Typography>
//               </>
//             ) : (
//               <Typography variant='body1' sx={{ color: '#111' }}>
//                 User not found
//               </Typography>
//             )}
//           </Box>
//           {/* Bell Icon for Notifications */}
//           <Box>
//             <NotificationButton />{' '}
//             {/* Display the NotificationList component */}
//           </Box>
//           {/* Bell Icon for Messages */}
//           <Box>
//             {/* Only render MessageButton if userId is available */}
//             {userId && <MessageButton userId={userId} />}
//             {/* Display the NotificationList component */}
//           </Box>
//           <div className='flex justify-center items-center gap-3'>
//             <Button
//               color='inherit'
//               onClick={handleLogout}
//               sx={{ color: '#111', width: '33%' }}
//             >
//               Logout
//             </Button>
//           </div>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;

// // import React from 'react';
// // import AppBar from '@mui/material/AppBar';
// // import Toolbar from '@mui/material/Toolbar';
// // import Typography from '@mui/material/Typography';
// // import Button from '@mui/material/Button';
// // import { Box, IconButton, Popover } from '@mui/material';
// // import NotificationsIcon from '@mui/icons-material/Notifications'; // Import bell icon
// // import useFetchUser from '../hooks/useCurrentUser'; // Adjust the path if necessary
// // import NotificationList from './NotificationList'; // Adjust the import path as needed

// // const Header = ({ title, handleLogout }) => {
// //   const token = localStorage.getItem('token');
// //   const { user, loading, error } = useFetchUser(token);

// //   window.localStorage.setItem('company', user?.company._id);
// //   window.localStorage.setItem('username', user?.username);

// //   return (
// //     <AppBar
// //       position='static'
// //       sx={{ marginBottom: '2rem', backgroundColor: '#f5f5f5' }}
// //     >
// //       <Toolbar>
// //         <Box
// //           sx={{
// //             display: 'flex',
// //             justifyContent: 'space-between',
// //             itemsCenter: 'center',
// //           }}
// //           width='100%'
// //         >
// //           <Box
// //             sx={{
// //               display: 'flex',
// //               flexDirection: 'column',
// //               justifyContent: 'center',
// //               itemsCenter: 'center',
// //               width: '33%',
// //             }}
// //           >
// //             <Typography variant='body1' className='text-black'>
// //               {user?.company?.companyDetails?.industryType == 'Healthcare' ||
// //               user?.company?.companyDetails?.industryType == 'Finance' ? (
// //                 <>
// //                   <span className='font-bold'>
// //                     {user?.company?.companyDetails?.organizationName ||
// //                       'Company'}
// //                   </span>
// //                   <span>
// //                     {' '}
// //                     is a significant data fiduciary <br /> so all 172 controls
// //                     will be applied.
// //                   </span>
// //                 </>
// //               ) : (
// //                 <span>
// //                   {user?.company?.companyDetails?.organizationName || 'Company'}{' '}
// //                   is a regular data fiduciary <br /> so 168 controls will be
// //                   applied.
// //                 </span>
// //               )}
// //             </Typography>
// //           </Box>

// //           <Box
// //             sx={{
// //               display: 'flex',
// //               flexDirection: 'column',
// //               justifyContent: 'center',
// //               itemsCenter: 'center',
// //               width: '33%',
// //             }}
// //             textAlign='center'
// //           >
// //             {loading ? (
// //               <Typography variant='body1' sx={{ color: '#111' }}>
// //                 Loading user data...
// //               </Typography>
// //             ) : error ? (
// //               <Typography variant='body1' sx={{ color: '#111' }}>
// //                 Error loading user data
// //               </Typography>
// //             ) : user ? (
// //               <>
// //                 <Typography variant='body1' sx={{ color: '#111' }}>
// //                   Hello, {user.username}
// //                 </Typography>
// //                 <Typography variant='body2' sx={{ color: '#555' }}>
// //                   Role: {user.role}
// //                 </Typography>
// //               </>
// //             ) : (
// //               <Typography variant='body1' sx={{ color: '#111' }}>
// //                 User not found
// //               </Typography>
// //             )}
// //           </Box>
// //           {/* Bell Icon for Notifications */}
// //           <Box>
// //             <IconButton
// //               aria-describedby={open ? 'notification-popover' : undefined}
// //               onClick={handlePopoverOpen}
// //               color='inherit'
// //             >
// //               <NotificationsIcon />
// //             </IconButton>
// //             <Popover
// //               id='notification-popover'
// //               open={open}
// //               anchorEl={anchorEl}
// //               onClose={handlePopoverClose}
// //               anchorOrigin={{
// //                 vertical: 'bottom',
// //                 horizontal: 'center',
// //               }}
// //               transformOrigin={{
// //                 vertical: 'top',
// //                 horizontal: 'center',
// //               }}
// //             >
// //               <NotificationList />{' '}
// //               {/* Display the NotificationList component */}
// //             </Popover>
// //           </Box>
// //           <div className='flex justify-center items-center gap-3'>
// //             <Button
// //               color='inherit'
// //               onClick={handleLogout}
// //               sx={{ color: '#111', width: '33%' }}
// //             >
// //               Logout
// //             </Button>
// //           </div>
// //         </Box>
// //       </Toolbar>
// //     </AppBar>
// //   );
// // };

// // export default Header;
