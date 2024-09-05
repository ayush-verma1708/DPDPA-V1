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

  return (
    <AppBar  position="static" sx= { { marginBottom : "2rem" , backgroundColor: "#f5f5f5" }}>
      <Toolbar>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography variant="body1" className="text-indigo-950">
            {title}
          </Typography>

          <Box textAlign="center">
            {loading ? (
              <Typography variant="body1" sx={{ color: '#111' }}>
                Loading user data...
              </Typography>
            ) : error ? (
              <Typography variant="body1" sx={{ color: '#111' }}>
                Error loading user data
              </Typography>
            ) : user ? (
              <>
                <Typography variant="body1" sx={{ color: '#111' }}>
                  Hello, {user.username}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  Role: {user.role}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" sx={{ color: '#111' }}>
                User not found
              </Typography>
            )}
          </Box>

          <Button color="inherit" onClick={handleLogout} sx={{ color: '#111' }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
