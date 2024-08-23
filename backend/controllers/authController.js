import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { AsyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// const login = AsyncHandler(async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });
//   if (!user || !(await user.comparePassword(password))) {
//     throw new ApiError(401, 'Invalid username or password');
//   }

//   const token = generateToken(user);
//   res.status(200).json(new ApiResponse(200, { token }, 'Login successful'));
// });

// const login = AsyncHandler(async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });
//   if (!user || !(await user.comparePassword(password))) {
//     throw new ApiError(401, 'Invalid username or password');
//   }

//   const token = generateToken(user);
//   res.status(200).json(new ApiResponse(200, { token }, 'Login successful'));
// });

const login = AsyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log('Username:', username);
  console.log('Password:', password);

  const user = await User.findOne({ username });
  if (!user) {
    console.log('User not found');
    throw new ApiError(401, 'Invalid username or password');
  }

  const isMatch = await user.comparePassword(password);
  console.log('Password match:', isMatch);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid username or password');
  }

  const token = generateToken(user);
  res.status(200).json(new ApiResponse(200, { token }, 'Login successful'));
});


const getCurrentUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password'); // Exclude password field
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  res.status(200).json(new ApiResponse(200, user, 'Current user retrieved successfully.'));
});

export { login, getCurrentUser };

// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import bcrypt from 'bcryptjs';
// import dotenv from 'dotenv';

// dotenv.config();

// const secret = process.env.JWT_SECRET;

// // export const login = async (req, res) => {
// //   const { username, password } = req.body;

// //   try {
// //     const user = await User.findOne({ username });
// //     if (!user) {
// //       return res.status(400).json({ message: 'Invalid credentials' });
// //     }

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: 'Invalid credentials' });
// //     }

// //     const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '1h' });

// //     res.json({ token });
// //   } catch (err) {
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };
// export const login = async (req, res) => {
//   const { username, password } = req.body;
//   // Bypass password check for testing
//   const token = 'dummy_token'; // Replace with a dummy token or remove token generation
//   res.json({ token });
// };

// export const verifyToken = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, secret);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// // const User = require('../models/User');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');

// // const secret = 'your_jwt_secret'; // Replace with your own secret key

// // exports.login = async (req, res) => {
// //   const { username, password } = req.body;

// //   try {
// //     const user = await User.findOne({ username });
// //     if (!user) {
// //       return res.status(400).json({ message: 'Invalid credentials' });
// //     }

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: 'Invalid credentials' });
// //     }

// //     const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });

// //     res.json({ token });
// //   } catch (err) {
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // exports.protected = (req, res) => {
// //   res.json({ message: 'You are authorized' });
// // };

// // exports.verifyToken = (req, res, next) => {
// //   const token = req.header('x-auth-token');

// //   if (!token) {
// //     return res.status(401).json({ message: 'No token, authorization denied' });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, secret);
// //     req.user = decoded.userId;
// //     next();
// //   } catch (err) {
// //     res.status(401).json({ message: 'Token is not valid' });
// //   }
// // };
