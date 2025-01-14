import express from 'express';
import {
  getControlFamilies,
  createControlFamily,
  updateControlFamily,
  deleteControlFamily,
} from '../controllers/controlFamilyController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ControlFamilies
 *   description: Control family management
 */

/**
 * @swagger
 * /api/v1/control-families:
 *   get:
 *     tags: [ControlFamilies]
 *     summary: Get all control families
 *     description: Retrieves a list of all control families.
 *     responses:
 *       200:
 *         description: A list of control families
 *       500:
 *         description: Internal server error
 */
router.get('/', getControlFamilies);

/**
 * @swagger
 * /api/v1/control-families:
 *   post:
 *     tags: [ControlFamilies]
 *     summary: Create a new control family
 *     description: Creates a new control family entry in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the control family
 *               description:
 *                 type: string
 *                 description: A brief description of the control family
 *     responses:
 *       201:
 *         description: Control family created successfully
 *       400:
 *         description: Validation error or bad request
 */
router.post('/', createControlFamily);

/**
 * @swagger
 * /api/v1/control-families/{id}:
 *   put:
 *     tags: [ControlFamilies]
 *     summary: Update an existing control family by ID
 *     description: Updates an existing control family based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the control family to update
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
 *                 description: The name of the control family
 *               description:
 *                 type: string
 *                 description: A brief description of the control family
 *     responses:
 *       200:
 *         description: Control family updated successfully
 *       400:
 *         description: Validation error or bad request
 *       404:
 *         description: Control family not found
 */
router.put('/:id', updateControlFamily);

/**
 * @swagger
 * /api/v1/control-families/{id}:
 *   delete:
 *     tags: [ControlFamilies]
 *     summary: Delete a control family by ID
 *     description: Deletes a control family based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the control family to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Control family deleted successfully
 *       404:
 *         description: Control family not found
 */
router.delete('/:id', deleteControlFamily);

export default router;

// import express from 'express';
// import {
//   getControlFamilies,
//   createControlFamily,
//   updateControlFamily,
//   deleteControlFamily
// } from '../controllers/controlFamilyController.js';

// const router = express.Router();

// // Route to get all control families
// router.get('/', getControlFamilies);

// // Route to create a new control family
// router.post('/', createControlFamily);

// // Route to update an existing control family by ID
// router.put('/:id', updateControlFamily);

// // Route to delete a control family by ID
// router.delete('/:id', deleteControlFamily);

// export default router;

// // import express from 'express';
// // import { getControlFamilies, createControlFamily, updateControlFamily, deleteControlFamily } from '../controllers/controlFamilyController.js';

// // const router = express.Router();

// // router.get('/', getControlFamilies);
// // router.post('/', createControlFamily);
// // router.put('/:id', updateControlFamily);
// // router.delete('/:id', deleteControlFamily);

// // export default router;
