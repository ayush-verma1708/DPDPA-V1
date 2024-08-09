import express from 'express';
import { getControlFamilies, createControlFamily, updateControlFamily, deleteControlFamily } from '../controllers/controlFamilyController.js';

const router = express.Router();

router.get('/', getControlFamilies);
router.post('/', createControlFamily);
router.put('/:id', updateControlFamily);
router.delete('/:id', deleteControlFamily);



export default router;
