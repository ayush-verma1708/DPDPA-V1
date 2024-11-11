// routes/newActionRoutes.js
import express from 'express';
import {
  //   createNewAction,
  //   getAllNewActions,
  //   getNewActionById,
  getNewActionByVariableId,
  getNewActionByVariableIdAndSoftwareId, // Import the new function
  //   updateNewAction,
  //   deleteNewAction,
} from '../controllers/newActionController.js';

const router = express.Router();

// Create a new action
// router.post('/newaction', createNewAction);

// // Get all actions
// router.get('/newactions', getAllNewActions);

// // Get a single action by ID
// router.get('/newaction/:id', getNewActionById);

// Get a single action by variable_id
router.get(
  '/newaction/variable/:variable_id/:software_id',
  getNewActionByVariableIdAndSoftwareId
); // New route

router.get('/newaction/variable/:variable_id', getNewActionByVariableId);
// New route
// // Update an existing action
// router.put('/newaction/:id', updateNewAction);

// // Delete an action
// router.delete('/newaction/:id', deleteNewAction);

export default router;
