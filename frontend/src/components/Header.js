import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import logout icon
import useFetchUser from '../hooks/useCurrentUser'; // Adjust the path if necessary
import NotificationButton from './NotificationButton'; // Adjust path as needed
import MessageButton from './MessageButton'; // Import the MessageButton

const Header = ({ title, handleLogout }) => {
  const token = localStorage.getItem('token');
  const { user, loading, error } = useFetchUser(token);
  const userId = user ? user._id : null;

  // window.localStorage.setItem('company', user?.company._id);
  window.localStorage.setItem('company', user?.company?._id || null);

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
              width: '20%',
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
              width: '30%',
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
            <NotificationButton />
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
