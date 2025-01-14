import express from 'express';
import {
  getNewActionByVariableId,
  getNewActionByVariableIdAndSoftwareId,
} from '../controllers/newActionController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: NewAction
 *   description: New action management
 */

/**
 * @swagger
 * /api/newaction/variable/{variable_id}/{software_id}:
 *   get:
 *     tags: [NewAction]
 *     summary: Get new action by variable_id and software_id
 *     description: Fetches a new action based on the provided variable_id and software_id.
 *     parameters:
 *       - in: path
 *         name: variable_id
 *         required: true
 *         description: The variable ID to filter the actions.
 *         schema:
 *           type: string
 *       - in: path
 *         name: software_id
 *         required: true
 *         description: The software ID to filter the actions.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: New action retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 actionId:
 *                   type: string
 *                   description: The unique ID of the action
 *                 variableId:
 *                   type: string
 *                   description: The variable ID associated with the action
 *                 softwareId:
 *                   type: string
 *                   description: The software ID associated with the action
 *       404:
 *         description: Action not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/newaction/variable/:variable_id/:software_id',
  getNewActionByVariableIdAndSoftwareId
);

/**
 * @swagger
 * /api/newaction/variable/{variable_id}:
 *   get:
 *     tags: [NewAction]
 *     summary: Get new action by variable_id
 *     description: Fetches a new action based on the provided variable_id.
 *     parameters:
 *       - in: path
 *         name: variable_id
 *         required: true
 *         description: The variable ID to filter the actions.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: New action retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 actionId:
 *                   type: string
 *                   description: The unique ID of the action
 *                 variableId:
 *                   type: string
 *                   description: The variable ID associated with the action
 *       404:
 *         description: Action not found
 *       500:
 *         description: Internal server error
 */
router.get('/newaction/variable/:variable_id', getNewActionByVariableId);

export default router;

// // routes/newActionRoutes.js
// import express from 'express';
// import {
//   //   createNewAction,
//   //   getAllNewActions,
//   //   getNewActionById,
//   getNewActionByVariableId,
//   getNewActionByVariableIdAndSoftwareId, // Import the new function
//   //   updateNewAction,
//   //   deleteNewAction,
// } from '../controllers/newActionController.js';

// const router = express.Router();

// // Create a new action
// // router.post('/newaction', createNewAction);

// // // Get all actions
// // router.get('/newactions', getAllNewActions);

// // // Get a single action by ID
// // router.get('/newaction/:id', getNewActionById);

// // Get a single action by variable_id
// router.get(
//   '/newaction/variable/:variable_id/:software_id',
//   getNewActionByVariableIdAndSoftwareId
// ); // New route

// router.get('/newaction/variable/:variable_id', getNewActionByVariableId);
// // New route
// // // Update an existing action
// // router.put('/newaction/:id', updateNewAction);

// // // Delete an action
// // router.delete('/newaction/:id', deleteNewAction);

// export default router;
