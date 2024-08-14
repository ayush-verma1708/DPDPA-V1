import express from 'express';
const router = express.Router();
import * as completionStatusController from '../controllers/completionStatusController.js';

// Create or update completion status
router.post('/', completionStatusController.createOrUpdateStatus);

// Fetch completion status by criteria
router.get('/', completionStatusController.getStatus);

export default router;
