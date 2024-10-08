import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    throw new ApiError(401, 'No token provided. Authorization denied.');
  }

  try {
    const decoded = jwt.verify(token, 'yourSecretKey');
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (err) {
    throw new ApiError(401, 'Token is not valid.');
  }
};

// import jwt from 'jsonwebtoken';
// import User from '../models/User.js'; // Adjust the path as needed

// export const authenticate = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
//     req.user = await User.findById(decoded.id); // Fetch user by ID from token
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // import { verifyToken } from '../utils/jwt.js';

// // const authenticate = (req, res, next) => {
// //   const authHeader = req.headers.authorization;
// //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //     return res.status(401).json({ message: 'Unauthorized' });
// //   }

// //   const token = authHeader.split(' ')[1];
// //   try {
// //     const decoded = verifyToken(token);
// //     req.user = decoded;
// //     next();
// //   } catch (error) {
// //     return res.status(401).json({ message: 'Invalid token' });
// //   }
// // };

// // export {authenticate};

// // // // backend/middlewares/authenticate.js
// // // import { verifyToken } from '../utils/jwt.js';

// // // const authenticate = (req, res, next) => {
// // //   const authHeader = req.headers.authorization;
// // //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
// // //     return res.status(401).json({ message: 'Unauthorized' });
// // //   }

// // //   const token = authHeader.split(' ')[1];
// // //   try {
// // //     const decoded = verifyToken(token);
// // //     req.user = decoded; // Add the decoded token payload to req.user
// // //     next();
// // //   } catch (error) {
// // //     return res.status(401).json({ message: 'Invalid token' });
// // //   }
// // // };

// // // export {authenticate};
