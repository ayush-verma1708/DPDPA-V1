import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import useFetchUser from '../hooks/useCurrentUser'; // Adjust the path if necessary

const Header = ({ title, handleLogout }) => {
  const token = localStorage.getItem('token');
  const { user, loading, error } = useFetchUser(token);

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
            itemsCenter: 'center',
          }}
          width='100%'
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              itemsCenter: 'center',
              width: '33%',
            }}
          >
            <Typography variant='body1' className='text-black'>
              {user?.company?.companyDetails?.industryType == 'Healthcare' ||
              user?.company?.companyDetails?.industryType == 'Finance' ? (
                <>
                  <span className='font-bold'>
                    {user?.company?.companyDetails?.organizationName ||
                      'Company'}
                  </span>
                  <span>
                    {' '}
                    is a significant data fiduciary <br /> so all 172 controls
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
              itemsCenter: 'center',
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

          <div className='flex justify-center items-center gap-3'>
            <Button
              color='inherit'
              onClick={handleLogout}
              sx={{ color: '#111', width: '33%' }}
            >
              Logout
            </Button>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
