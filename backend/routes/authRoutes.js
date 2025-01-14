import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { login, getCurrentUser } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     description: Authenticate a user and return a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, token returned
 *       401:
 *         description: Authentication failed
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/create-user:
 *   post:
 *     tags: [Auth]
 *     summary: Create a new user
 *     description: Register a new user with a hashed password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Error creating user
 */
router.post('/create-user', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     description: Retrieve the current authenticated user's information.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, getCurrentUser);

export default router;

// import express from 'express';
// import { authenticate } from '../middleware/authenticate.js';
// import { login, getCurrentUser } from '../controllers/authController.js';

// const router = express.Router();

// // Login route
// router.post('/login', login);

// // Create User route
// router.post('/create-user', async (req, res) => {
//   const { username, password, role } = req.body;
//   try {
//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword, role });
//     await user.save();
//     res.status(201).json({ msg: 'User created successfully' });
//   } catch (err) {
//     res.status(400).json({ msg: err.message });
//   }
// });

// // Get current user
// router.get('/me', authenticate, getCurrentUser);

// export default router;

// // import jwt from 'jsonwebtoken';
// // import bcrypt from 'bcryptjs';
// // import User from '../models/User.js';
// // import auth from '../middleware/auth.js';
// // import adminAuth from '../middleware/adminAuth.js';
// // import { login, getCurrentUser } from '../controllers/authController.js';

// // import { authenticate } from '../middleware/authenticate.js';

// // const router = express.Router();

// // // Login route
// // router.post('/login', login);

// // router.post('/create-user', auth, async (req, res) => {
// //   const { username, password, role } = req.body;
// //   try {
// //       const user = new User({ username, password, role });
// //       await user.save();
// //       res.status(201).json({ msg: 'User created successfully' });
// //   } catch (err) {
// //       res.status(400).json({ msg: err.message });
// //   }
// // });

// // router.get('/me', authenticate, getCurrentUser);

// // export default router;
