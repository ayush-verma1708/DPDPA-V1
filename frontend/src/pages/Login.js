// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setAuthToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make API call to login
      const res = await axios.post('http://localhost:8021/api/auth/login', { username, password });

      // Access token from the response
      const token = res.data?.data.token;

      if (token) {
        // Log the full response and token
        // console.log('Full Response:', res.data);
        // console.log('Token:', token);
        console.log('Fetched User Info:', res.data.data);

        // Update parent component state with the token
        setAuthToken(token);

        // Store token in localStorage
        localStorage.setItem('token', token);
        console.log('Token stored in localStorage:', localStorage.getItem('token'));

        // Redirect after logging and storing token
        navigate('/');
      } else {
        setError('Login failed');
        console.warn('No token found in response');
      }
    } catch (err) {
      // Log detailed error information
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
