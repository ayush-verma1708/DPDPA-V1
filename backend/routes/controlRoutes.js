import express from 'express';
import {
  getControls,
  createControl,
  updateControl,
  deleteControl
} from '../controllers/controlController.js';

const router = express.Router();

// Route to get all controls with their associated actions
router.get('/', getControls);

// Route to create a new control
router.post('/', createControl);

// Route to update an existing control by ID
router.put('/:id', updateControl);

// Route to delete a control by ID
router.delete('/:id', deleteControl);

export default router;

// import express from 'express';
// import { getControls, createControl, updateControl, deleteControl } from '../controllers/controlController.js';

// const router = express.Router();

// router.get('/', getControls);
// router.post('/', createControl);
// router.put('/:id', updateControl);
// router.delete('/:id', deleteControl);

// export default router;
