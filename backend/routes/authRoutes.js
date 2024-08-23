import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import { login, getCurrentUser } from '../controllers/authController.js'; 

import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Login route
router.post('/login', login);

router.post('/create-user', auth, async (req, res) => {
  const { username, password, role } = req.body;
  try {
      const user = new User({ username, password, role });
      await user.save();
      res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
      res.status(400).json({ msg: err.message });
  }
});

router.get('/me', authenticate, getCurrentUser);

export default router;