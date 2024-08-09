import express from 'express';
import { getControls, createControl, updateControl, deleteControl } from '../controllers/controlController.js';

const router = express.Router();

router.get('/', getControls);
router.post('/', createControl);
router.put('/:id', updateControl);
router.delete('/:id', deleteControl);

export default router;
