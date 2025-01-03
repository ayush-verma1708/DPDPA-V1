import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import './Login.css';
import { checkFormCompletion, fetchCurrentUser } from '../api/userApi';

const Login = ({ setAuthToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true); // Start loading
  //   try {
  //     const { data: loginData } = await axios.post(
  //       'http://localhost:8021/api/auth/login',
  //       { email, password }
  //     );

  //     const token = loginData?.data.token;

  //     if (token) {
  //       setAuthToken(token);
  //       localStorage.setItem('token', token);

  //       // Fetch current user data and form completion status
  //       const { data: userData } = await fetchCurrentUser(token);
  //       const hasCompletedCompanyForm = await checkFormCompletion(userData._id);

  //       console.log('user', userData.role);
  //       console.log('Form', hasCompletedCompanyForm);
  //       navigate('/onboarding');
  //       if (!hasCompletedCompanyForm && userData.role === 'Admin') {
  //       } else {
  //         navigate('/dashboard');
  //       }
  //     } else {
  //       setError('Login failed: No token provided');
  //     }
  //   } catch (err) {
  //     console.error(
  //       'Login error:',
  //       err.response ? err.response.data : err.message
  //     );
  //     setError('Invalid credentials or server error');
  //   } finally {
  //     setLoading(false); // Stop loading
  //   }
  // };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const { data: loginData } = await axios.post(
        'http://localhost:8021/api/auth/login',
        { email, password }
      );

      const token = loginData?.data.token;

      if (token) {
        setAuthToken(token);
        localStorage.setItem('token', token);

        // Fetch current user data and form completion status
        const { data: userData } = await fetchCurrentUser(token);
        const hasCompletedCompanyForm = await checkFormCompletion(userData._id);

        console.log('user', userData.role);
        console.log('Form', hasCompletedCompanyForm);

        // Navigate based on conditions
        if (!hasCompletedCompanyForm && userData.role === 'Admin') {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Login failed: No token provided');
      }
    } catch (err) {
      console.error(
        'Login error:',
        err.response ? err.response.data : err.message
      );
      setError('Invalid credentials or server error');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: 'url(/assets/DPDPAImage.png)', // Ensure this path is correct
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '20px',
      }}
    >
      <Container
        maxWidth='sm'
        sx={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '10px',
          boxShadow: 3,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Box mb={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src='/assets/DPDPA_logo.png'
            alt='DPDPA Logo'
            style={{ width: '60%', maxWidth: '220px' }}
          />
        </Box>

        {/* Login Form */}
        <Box component='form' onSubmit={handleLogin} sx={{ width: '100%' }}>
          <Typography variant='h5' align='center' mb={2} color='primary'>
            Login
          </Typography>

          {/* Error message */}
          {error && (
            <Alert severity='error' sx={{ marginBottom: '1rem' }}>
              {error}
            </Alert>
          )}

          {/* Email field */}
          <TextField
            label='Email'
            type='email'
            fullWidth
            margin='normal'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: '1rem' }}
          />

          {/* Password field */}
          <TextField
            label='Password'
            type='password'
            fullWidth
            margin='normal'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: '1rem' }}
          />

          {/* Login button */}
          <Button
            variant='contained'
            color='primary'
            fullWidth
            sx={{
              marginTop: '1rem',
              padding: '10px',
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#3b7fff', // Lighter shade on hover
              },
            }}
            type='submit'
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <CircularProgress size={24} color='inherit' /> // Show loading spinner
            ) : (
              'Login'
            )}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
