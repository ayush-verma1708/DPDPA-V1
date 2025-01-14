import express from 'express';
import {
  getControls,
  createControl,
  updateControl,
  deleteControl,
} from '../controllers/controlController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Controls
 *   description: Control management
 */

/**
 * @swagger
 * /api/v1/controls:
 *   get:
 *     tags: [Controls]
 *     summary: Get all controls with their associated actions
 *     description: Retrieves a list of all controls and their associated actions.
 *     responses:
 *       200:
 *         description: A list of controls with their associated actions
 *       500:
 *         description: Internal server error
 */
router.get('/', getControls);

/**
 * @swagger
 * /api/v1/controls:
 *   post:
 *     tags: [Controls]
 *     summary: Create a new control
 *     description: Creates a new control entry in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the control
 *               description:
 *                 type: string
 *                 description: A brief description of the control
 *               actions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of action IDs associated with the control
 *     responses:
 *       201:
 *         description: Control created successfully
 *       400:
 *         description: Validation error or bad request
 */
router.post('/', createControl);

/**
 * @swagger
 * /api/v1/controls/{id}:
 *   put:
 *     tags: [Controls]
 *     summary: Update an existing control by ID
 *     description: Updates an existing control based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the control to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the control
 *               description:
 *                 type: string
 *                 description: A brief description of the control
 *               actions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of action IDs associated with the control
 *     responses:
 *       200:
 *         description: Control updated successfully
 *       400:
 *         description: Validation error or bad request
 *       404:
 *         description: Control not found
 */
router.put('/:id', updateControl);

/**
 * @swagger
 * /api/v1/controls/{id}:
 *   delete:
 *     tags: [Controls]
 *     summary: Delete a control by ID
 *     description: Deletes a control based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the control to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Control deleted successfully
 *       404:
 *         description: Control not found
 */
router.delete('/:id', deleteControl);

export default router;

// import express from 'express';
// import {
//   getControls,
//   createControl,
//   updateControl,
//   deleteControl
// } from '../controllers/controlController.js';

// const router = express.Router();

// // Route to get all controls with their associated actions
// router.get('/', getControls);

// // Route to create a new control
// router.post('/', createControl);

// // Route to update an existing control by ID
// router.put('/:id', updateControl);

// // Route to delete a control by ID
// router.delete('/:id', deleteControl);

// export default router;

// // import express from 'express';
// // import { getControls, createControl, updateControl, deleteControl } from '../controllers/controlController.js';

// // const router = express.Router();

// // router.get('/', getControls);
// // router.post('/', createControl);
// // router.put('/:id', updateControl);
// // router.delete('/:id', deleteControl);

// // export default router;
