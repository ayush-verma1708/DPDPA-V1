// import { Router } from 'express';
// import {
//   getScoped,
//   addScoped,
//   updateScoped,
//   deleteScoped,
//   getScopedInAsset,
//   getScopedNameById,
// } from '../controllers/scoped.controller.js';

// const scopedRouter = Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Scoped
//  *   description: Operations related to scoped assets
//  */

// /**
//  * @swagger
//  * /api/v1/scoped:
//  *   get:
//  *     tags: [Scoped]
//  *     summary: Get all scoped assets
//  *     description: Fetch a list of all scoped assets.
//  *     responses:
//  *       200:
//  *         description: A list of scoped assets
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: integer
//  *                   name:
//  *                     type: string
//  *                   description:
//  *                     type: string
//  *       500:
//  *         description: Internal server error
//  */
// scopedRouter.route('/').get(getScoped);

// /**
//  * @swagger
//  * /api/v1/scoped/add:
//  *   post:
//  *     tags: [Scoped]
//  *     summary: Add a new scoped asset
//  *     description: Add a new scoped asset to the system.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 description: The name of the scoped asset
//  *               description:
//  *                 type: string
//  *                 description: A brief description of the scoped asset
//  *     responses:
//  *       201:
//  *         description: The scoped asset was added successfully
//  *       400:
//  *         description: Invalid input
//  */
// scopedRouter.route('/add').post(addScoped);

// /**
//  * @swagger
//  * /api/v1/scoped/{assetId}/scoped:
//  *   get:
//  *     tags: [Scoped]
//  *     summary: Get scoped assets by asset ID
//  *     description: Fetch scoped assets associated with a specific asset ID.
//  *     parameters:
//  *       - name: assetId
//  *         in: path
//  *         description: The ID of the asset
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: A list of scoped assets
//  *       404:
//  *         description: Asset not found
//  */
// scopedRouter.route('/:assetId/scoped').get(getScoped);

// /**
//  * @swagger
//  * /api/v1/scoped/assets/{assetId}:
//  *   get:
//  *     tags: [Scoped]
//  *     summary: Get scoped assets for a specific asset ID
//  *     description: Fetch scoped assets for a specific asset ID.
//  *     parameters:
//  *       - name: assetId
//  *         in: path
//  *         description: The ID of the asset
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: A list of scoped assets for the specified asset ID
//  *       404:
//  *         description: Asset not found
//  */
// scopedRouter.route('/assets/:assetId').get(getScopedInAsset);

// /**
//  * @swagger
//  * /api/v1/scoped/scoped-update/{id}:
//  *   put:
//  *     tags: [Scoped]
//  *     summary: Update a scoped asset by ID
//  *     description: Update the details of an existing scoped asset by its ID.
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: The ID of the scoped asset to update
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 description: The name of the scoped asset
//  *               description:
//  *                 type: string
//  *                 description: A brief description of the scoped asset
//  *     responses:
//  *       200:
//  *         description: The scoped asset was updated successfully
//  *       400:
//  *         description: Invalid input
//  *       404:
//  *         description: Scoped asset not found
//  */
// scopedRouter.route('/scoped-update/:id').put(updateScoped);

// /**
//  * @swagger
//  * /api/v1/scoped/scoped-delete/{id}:
//  *   delete:
//  *     tags: [Scoped]
//  *     summary: Delete a scoped asset by ID
//  *     description: Delete a scoped asset by its ID.
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: The ID of the scoped asset to delete
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: The scoped asset was deleted successfully
//  *       404:
//  *         description: Scoped asset not found
//  */
// scopedRouter.route('/scoped-delete/:id').delete(deleteScoped);

// /**
//  * @swagger
//  * /api/v1/scoped/{id}:
//  *   get:
//  *     tags: [Scoped]
//  *     summary: Get scoped asset by ID
//  *     description: Fetch the details of a specific scoped asset by its ID.
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: The ID of the scoped asset
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: A scoped asset object
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: integer
//  *                 name:
//  *                   type: string
//  *                 description:
//  *                   type: string
//  *       404:
//  *         description: Scoped asset not found
//  */
// scopedRouter.get('/:id', getScopedNameById);

// export default scopedRouter;

import express from 'express';
import {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining,
} from '../controllers/trainingController.js';

const router = express.Router();

// Create a new training program
router.post('/trainings', createTraining);

// Get all training programs
router.get('/trainings', getAllTrainings);

// Get a single training program by ID
router.get('/trainings/:id', getTrainingById);

// Update a training program
router.put('/trainings/:id', updateTraining);

// Delete a training program
router.delete('/trainings/:id', deleteTraining);

export default router;
