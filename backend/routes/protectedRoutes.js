// backend/routes/protectedRoutes.js
import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import { getCurrentUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', authenticate, getCurrentUser);

export default router;
