import express from 'express';
import { analyzePacketsController } from '../controllers/packetController.js';

const router = express.Router();

// Define POST route
router.post('/analyze-packets', analyzePacketsController);

export default router;
