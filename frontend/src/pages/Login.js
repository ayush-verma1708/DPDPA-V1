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

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   TextField,
//   Button,
//   Container,
//   Box,
//   Typography,
//   Alert,
// } from '@mui/material';
// import './Login.css';
// import { checkFormCompletion, fetchCurrentUser } from '../api/userApi';

// const Login = ({ setAuthToken }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const { data: loginData } = await axios.post(
//         'http://localhost:8021/api/auth/login',
//         { email, password }
//       );

//       const token = loginData?.data.token;

//       if (token) {
//         setAuthToken(token);
//         localStorage.setItem('token', token);

//         // Fetch current user data and form completion status
//         const { data: userData } = await fetchCurrentUser(token);
//         const hasCompletedCompanyForm = await checkFormCompletion(userData._id);

//         if (!hasCompletedCompanyForm && userData.role === 'Admin') {
//           navigate('/onboarding');
//         } else {
//           navigate('/dashboard');
//         }
//       } else {
//         setError('Login failed: No token provided');
//       }
//     } catch (err) {
//       console.error(
//         'Login error:',
//         err.response ? err.response.data : err.message
//       );
//       setError('Invalid credentials or server error');
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '100vh',
//         backgroundImage: 'url(/assets/DPDPAImage.png)', // Ensure this path is correct
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundAttachment: 'fixed',
//         padding: '20px',
//       }}
//     >
//       <Container
//         maxWidth='sm'
//         sx={{
//           backgroundColor: 'white',
//           padding: '3rem',
//           borderRadius: '10px',
//           boxShadow: 3,
//           zIndex: 2,
//         }}
//       >
//         {/* Logo */}
//         <Box textAlign='center' mb={4}>
//           <img
//             src='/assets/DPDPA_logo.png'
//             alt='DPDPA Logo'
//             style={{ width: '60%', maxWidth: '220px' }}
//           />
//         </Box>

//         {/* Login Form */}
//         <Box component='form' onSubmit={handleLogin}>
//           <Typography variant='h5' align='center' mb={2} color='primary'>
//             Login
//           </Typography>

//           {/* Error message */}
//           {error && (
//             <Alert severity='error' sx={{ marginBottom: '1rem' }}>
//               {error}
//             </Alert>
//           )}

//           {/* Email field */}
//           <TextField
//             label='Email'
//             type='email'
//             fullWidth
//             margin='normal'
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           {/* Password field */}
//           <TextField
//             label='Password'
//             type='password'
//             fullWidth
//             margin='normal'
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           {/* Login button */}
//           <Button
//             variant='contained'
//             color='primary'
//             fullWidth
//             sx={{ marginTop: '1rem' }}
//             type='submit'
//           >
//             Login
//           </Button>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default Login;

// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import {
// //   TextField,
// //   Button,
// //   Container,
// //   Box,
// //   Typography,
// //   Alert,
// // } from '@mui/material';
// // import './Login.css';
// // import { checkFormCompletion, fetchCurrentUser } from '../api/userApi';

// // const Login = ({ setAuthToken }) => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const navigate = useNavigate();

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const { data: loginData } = await axios.post(
// //         'http://localhost:8021/api/auth/login',
// //         {
// //           email,
// //           password,
// //         }
// //       );

// //       const token = loginData?.data.token;

// //       if (token) {
// //         setAuthToken(token);
// //         localStorage.setItem('token', token);

// //         // Fetch current user data and form completion status
// //         const { data: userData } = await fetchCurrentUser(token);
// //         const hasCompletedCompanyForm = await checkFormCompletion(userData._id);

// //         if (!hasCompletedCompanyForm && userData.role === 'Admin') {
// //           navigate('/onboarding');
// //         } else {
// //           navigate('/dashboard');
// //         }
// //       } else {
// //         setError('Login failed: No token provided');
// //       }
// //     } catch (err) {
// //       console.error(
// //         'Login error:',
// //         err.response ? err.response.data : err.message
// //       );
// //       setError('Invalid credentials or server error');
// //     }
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         display: 'flex',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         minHeight: '100vh',
// //         backgroundImage: 'url(/path-to-your-image.jpg)', // Replace with the path to your background image
// //         backgroundSize: 'cover',
// //         backgroundPosition: 'center',
// //         backgroundAttachment: 'fixed',
// //       }}
// //     >
// //       <Container
// //         maxWidth='sm'
// //         sx={{
// //           backgroundColor: 'white',
// //           padding: '2rem',
// //           borderRadius: '8px',
// //           boxShadow: 3,
// //         }}
// //       >
// //         {/* Logo */}
// //         <Box textAlign='center' mb={4}>
// //           <img
// //             src='/assets/DPDPA_logo.png'
// //             alt='DPDPA Software Logo'
// //             style={{ width: '50%', maxWidth: '200px' }}
// //           />
// //         </Box>

// //         {/* Login Form */}
// //         <Box
// //           component='form'
// //           onSubmit={handleLogin}
// //           sx={{
// //             backgroundColor: 'white',
// //             padding: '2rem',
// //             borderRadius: '8px',
// //             boxShadow: 3,
// //           }}
// //         >
// //           <Typography variant='h5' align='center' mb={2} color='primary'>
// //             Login
// //           </Typography>

// //           {/* Error message */}
// //           {error && (
// //             <Alert severity='error' sx={{ marginBottom: '1rem' }}>
// //               {error}
// //             </Alert>
// //           )}

// //           {/* Email field */}
// //           <TextField
// //             label='Email'
// //             type='email'
// //             fullWidth
// //             margin='normal'
// //             required
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //           />

// //           {/* Password field */}
// //           <TextField
// //             label='Password'
// //             type='password'
// //             fullWidth
// //             margin='normal'
// //             required
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //           />

// //           {/* Login button */}
// //           <Button
// //             variant='contained'
// //             color='primary'
// //             fullWidth
// //             sx={{ marginTop: '1rem' }}
// //             type='submit'
// //           >
// //             Login
// //           </Button>
// //         </Box>
// //       </Container>
// //     </Box>
// //   );
// // };

// // export default Login;

// // // // src/pages/Login.js
// // // import { useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import axios from 'axios';
// // // import './Login.css';
// // // import { checkFormCompletion, fetchCurrentUser } from '../api/userApi';

// // // const Login = ({ setAuthToken }) => {
// // //   const [email, setEmail] = useState(''); // Changed from username to email
// // //   const [password, setPassword] = useState('');
// // //   const [error, setError] = useState('');
// // //   const handleLogin = async (e) => {
// // //     e.preventDefault();
// // //     try {
// // //       // API call for login
// // //       const { data: loginData } = await axios.post(
// // //         'http://localhost:8021/api/auth/login',
// // //         {
// // //           email, // Use email for login
// // //           password,
// // //         }
// // //       );

// // //       const token = loginData?.data.token;

// // //       if (token) {
// // //         setAuthToken(token);
// // //         localStorage.setItem('token', token);

// // //         // Fetch current user data and form completion status
// // //         const { data: userData } = await fetchCurrentUser(token);
// // //         const hasCompletedCompanyForm = await checkFormCompletion(userData._id);

// // //         // Navigate based on form completion and role
// // //         if (!hasCompletedCompanyForm && userData.role === 'Admin') {
// // //           navigate('/onboarding');
// // //         } else {
// // //           navigate('/dashboard');
// // //         }
// // //       } else {
// // //         setError('Login failed: No token provided');
// // //         console.warn('No token found in response');
// // //       }
// // //     } catch (err) {
// // //       console.error(
// // //         'Login error:',
// // //         err.response ? err.response.data : err.message
// // //       );
// // //       setError('Invalid credentials or server error');
// // //     }
// // //   };
// // //   const navigate = useNavigate();

// // //   // const handleLogin = async (e) => {
// // //   //   e.preventDefault();
// // //   //   try {
// // //   //     // Make API call to login
// // //   //     const res = await axios.post('http://localhost:8021/api/auth/login', {
// // //   //       email, // Use email instead of username
// // //   //       password,
// // //   //     });

// // //   //     // Access token from the response
// // //   //     const token = res.data?.data.token;

// // //   //     if (token) {
// // //   //       setAuthToken(token);
// // //   //       const { data } = await fetchCurrentUser(token);
// // //   //       const { hasCompletedCompanyForm } = checkFormCompletion(data._id);
// // //   //       localStorage.setItem('token', token);

// // //   //       if (!hasCompletedCompanyForm && data.role === 'Admin') {
// // //   //         navigate('/onboarding');
// // //   //       } else {
// // //   //         navigate('/dashboard');
// // //   //       }
// // //   //     } else {
// // //   //       setError('Login failed');
// // //   //       console.warn('No token found in response');
// // //   //     }
// // //   //   } catch (err) {
// // //   //     console.error(
// // //   //       'Login error:',
// // //   //       err.response ? err.response.data : err.message
// // //   //     );
// // //   //     setError('Invalid credentials');
// // //   //   }
// // //   // };

// // //   return (
// // //     <div className='flex items-start pt-[5rem] justify-between w-full px-[5rem] min-h-screen bg__login-page bg-gray-100 '>
// // //       {/* <h1 className='font-bold w-fit'>DPDPA Software</h1> */}
// // //       <div className='logo'>
// // //         <img
// // //           src='/assets/DPDPA_logo.png'
// // //           alt='DPDPA Software Logo'
// // //           // className='w-fit h-auto'
// // //           className='w-1/2 md:w-1/4 lg:w-1/6 h-auto' // Adjusts width based on screen size
// // //         />
// // //       </div>

// // //       <div className='p-8 space-y-8 bg-white rounded shadow-lg'>
// // //         <h2 className='text-2xl font-bold text-center text-gray-900'>Login</h2>
// // //         {error && (
// // //           <div className='p-4 mb-4 text-sm text-red-700 bg-red-100 rounded'>
// // //             {error}
// // //           </div>
// // //         )}
// // //         <form className='login-form' onSubmit={handleLogin}>
// // //           <div>
// // //             <label
// // //               htmlFor='email'
// // //               className='block text-sm font-medium text-gray-700'
// // //             >
// // //               Email
// // //             </label>
// // //             <input
// // //               id='email'
// // //               name='email'
// // //               type='email'
// // //               autoComplete='email'
// // //               required
// // //               value={email}
// // //               onChange={(e) => setEmail(e.target.value)}
// // //               className='w-full px-3 py-2 mt-1 text-gray-900 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
// // //             />
// // //           </div>
// // //           <div>
// // //             <label
// // //               htmlFor='password'
// // //               className='block text-sm font-medium text-gray-700'
// // //             >
// // //               Password
// // //             </label>
// // //             <input
// // //               id='password'
// // //               name='password'
// // //               type='password'
// // //               autoComplete='current-password'
// // //               required
// // //               value={password}
// // //               onChange={(e) => setPassword(e.target.value)}
// // //               className='w-full px-3 py-2 mt-1 text-gray-900 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
// // //             />
// // //           </div>
// // //           <div>
// // //             <button
// // //               type='submit'
// // //               className='w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
// // //             >
// // //               Login
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Login;
