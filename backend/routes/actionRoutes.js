import express from 'express';
import {
  getActions,
  createAction,
  updateAction,
  deleteAction,
} from '../controllers/actionController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Actions
 *   description: API for managing actions
 */

/**
 * @swagger
 * /api/v1/actions:
 *   get:
 *     tags: [Actions]
 *     summary: Get all actions
 *     description: Retrieve a list of all actions.
 *     responses:
 *       200:
 *         description: List of actions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Action'
 */
router.get('/', getActions);

/**
 * @swagger
 * /api/v1/actions:
 *   post:
 *     tags: [Actions]
 *     summary: Create a new action
 *     description: Add a new action.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Action'
 *     responses:
 *       201:
 *         description: Action created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', createAction);

/**
 * @swagger
 * /api/v1/actions/{id}:
 *   put:
 *     tags: [Actions]
 *     summary: Update an action by ID
 *     description: Modify an existing action by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the action to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Action'
 *     responses:
 *       200:
 *         description: Action updated successfully
 *       404:
 *         description: Action not found
 */
router.put('/:id', updateAction);

/**
 * @swagger
 * /api/v1/actions/{id}:
 *   delete:
 *     tags: [Actions]
 *     summary: Delete an action by ID
 *     description: Remove an action by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the action to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Action deleted successfully
 *       404:
 *         description: Action not found
 */
router.delete('/:id', deleteAction);

export default router;

// import express from 'express';
// import {
//   getActions,
//   createAction,
//   updateAction,
//   deleteAction,
// } from '../controllers/actionController.js';

// const router = express.Router();

// // Route to get all actions
// router.get('/', getActions);

// // Route to create a new action
// router.post('/', createAction);

// // Route to update an existing action by ID
// router.put('/:id', updateAction);

// // Route to delete an action by ID
// router.delete('/:id', deleteAction);

// export default router;

// // import express from 'express';
// // import {
// //   getActions,
// //   addAction,
// //   updateAction,
// //   deleteAction,
// //   markActionAsCompleted
// // } from '../controllers/actionController.js';

// // import { uploadFile, getFile } from '../controllers/upload.controller.js';

// // const router = express.Router();

// // router.get('/', getActions);
// // router.post('/', addAction);
// // router.put('/:id', updateAction);
// // router.delete('/:id', deleteAction);
// // // router.post('/upload', uploadActionFile);
// // router.put('/mark-completed/:id', markActionAsCompleted);

// // // Route for uploading files
// // router.put('/:actionId/upload', uploadFile);

// // // Route for retrieving files
// // router.get('/files/:filename', getFile);

// // export default router;
// // import express from 'express';
// // import { getActions, createAction, updateAction, deleteAction } from '../controllers/actionController.js';

// // const router = express.Router();

// // router.get('/', getActions);
// // router.post('/', createAction);
// // router.put('/:id', updateAction);
// // router.delete('/:id', deleteAction);

// // export default router;
