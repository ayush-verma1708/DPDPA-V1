import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// // backend/utils/jwt.js
// import jwt from 'jsonwebtoken';

// // Function to generate a JWT token
// export const generateToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: '1h', // Token expiration time
//   });
// };

// // Function to verify a JWT token
// export const verifyToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };

// // import jwt from 'jsonwebtoken';

// // export const generateToken = (user) => {
// //   return jwt.sign(
// //     {
// //       id: user._id,
// //       username: user.username,
// //       role: user.role,
// //     },
// //     process.env.JWT_SECRET,
// //     { expiresIn: '1h' }
// //   );
// // };

// // export const verifyToken = (token) => {
// //   return jwt.verify(token, process.env.JWT_SECRET);
// // };
