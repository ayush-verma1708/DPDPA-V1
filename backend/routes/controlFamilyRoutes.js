import express from 'express';
import {
  getControlFamilies,
  createControlFamily,
  updateControlFamily,
  deleteControlFamily
} from '../controllers/controlFamilyController.js';

const router = express.Router();

// Route to get all control families
router.get('/', getControlFamilies);

// Route to create a new control family
router.post('/', createControlFamily);

// Route to update an existing control family by ID
router.put('/:id', updateControlFamily);

// Route to delete a control family by ID
router.delete('/:id', deleteControlFamily);

export default router;

// import express from 'express';
// import { getControlFamilies, createControlFamily, updateControlFamily, deleteControlFamily } from '../controllers/controlFamilyController.js';

// const router = express.Router();

// router.get('/', getControlFamilies);
// router.post('/', createControlFamily);
// router.put('/:id', updateControlFamily);
// router.delete('/:id', deleteControlFamily);



// export default router;
