import express from 'express';
import { getControlStatus, getControlFamilyStatus } from '../controllers/completionController.js';

const router = express.Router();

router.get('/controlStatus', getControlStatus);
router.get('/controlFamilyStatus', getControlFamilyStatus);

export default router;
