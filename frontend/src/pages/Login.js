// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { checkFormCompletion, fetchCurrentUser } from '../api/userApi';

const Login = ({ setAuthToken }) => {
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make API call to login
      const res = await axios.post('http://localhost:8021/api/auth/login', {
        email, // Use email instead of username
        password,
      });

      // Access token from the response
      const token = res.data?.data.token;

      if (token) {
        setAuthToken(token);
        const { data } = await fetchCurrentUser(token);
        const { hasCompletedCompanyForm } = checkFormCompletion(data._id);
        localStorage.setItem('token', token);

        if (!hasCompletedCompanyForm && data.role === 'Admin') {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Login failed');
        console.warn('No token found in response');
      }
    } catch (err) {
      console.error(
        'Login error:',
        err.response ? err.response.data : err.message
      );
      setError('Invalid credentials');
    }
  };

  return (
    <div className='flex items-start pt-[5rem] justify-between w-full px-[5rem] min-h-screen bg__login-page bg-gray-100 '>
      {/* <h1 className='font-bold w-fit'>DPDPA Software</h1> */}
      <img
        src='/assets/DPDPA_logo.jpg'
        alt='DPDPA Software Logo'
        // className='w-fit h-auto'
        className='w-1/2 md:w-1/4 lg:w-1/6 h-auto' // Adjusts width based on screen size
      />

      <div className='p-8 space-y-8 bg-white rounded shadow-lg'>
        <h2 className='text-2xl font-bold text-center text-gray-900'>Login</h2>
        {error && (
          <div className='p-4 mb-4 text-sm text-red-700 bg-red-100 rounded'>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 mt-1 text-gray-900 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 mt-1 text-gray-900 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>
          <div>
            <button
              type='submit'
              className='w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
