import express from 'express';
import {
  createOrUpdateStatus,
  getStatus,
  getAllStatus,
  updateStatus,
  deleteStatus,
  delegateToIT,
  delegateToAuditor,
  confirmEvidence,
  getRiskByAsset,
  getOverallRisk,
  raiseQuery,
  delegateToExternalAuditor,
  getCompletionStatusById,
  setNotApplicable,
  confirmNotApplicable,
} from '../controllers/completionStatusController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CompletionStatus
 *   description: Completion status management
 */

/**
 * @swagger
 * /api/v1/completion-status:
 *   post:
 *     tags: [CompletionStatus]
 *     summary: Create or update a completion status
 *     description: Creates or updates a completion status record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Status created or updated successfully
 *       400:
 *         description: Validation error
 */
router.post('/', createOrUpdateStatus);

/**
 * @swagger
 * /api/v1/completion-status/all/{id}:
 *   get:
 *     tags: [CompletionStatus]
 *     summary: Get completion status by ID
 *     description: Retrieves a specific completion status using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the completion status
 *     responses:
 *       200:
 *         description: Completion status retrieved successfully
 *       404:
 *         description: Completion status not found
 */
router.get('/all/:id', getCompletionStatusById);

/**
 * @swagger
 * /api/v1/completion-status:
 *   get:
 *     tags: [CompletionStatus]
 *     summary: Get completion statuses by criteria
 *     description: Retrieves completion statuses based on certain criteria.
 *     responses:
 *       200:
 *         description: Completion statuses retrieved successfully
 */
router.get('/', getStatus);

/**
 * @swagger
 * /api/v1/completion-status/all:
 *   get:
 *     tags: [CompletionStatus]
 *     summary: Get all completion statuses
 *     description: Retrieves all completion statuses.
 *     responses:
 *       200:
 *         description: List of all completion statuses
 */
router.get('/all/', getAllStatus);

/**
 * @swagger
 * /api/v1/completion-status/{completionStatusId}:
 *   put:
 *     tags: [CompletionStatus]
 *     summary: Update a completion status by ID
 *     description: Updates the details of a specific completion status.
 *     parameters:
 *       - in: path
 *         name: completionStatusId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the completion status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Completion status updated successfully
 *       404:
 *         description: Completion status not found
 */
router.put('/:completionStatusId', updateStatus);

/**
 * @swagger
 * /api/v1/completion-status/{completionStatusId}:
 *   delete:
 *     tags: [CompletionStatus]
 *     summary: Delete a completion status by ID
 *     description: Deletes a specific completion status from the system.
 *     parameters:
 *       - in: path
 *         name: completionStatusId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the completion status
 *     responses:
 *       200:
 *         description: Completion status deleted successfully
 *       404:
 *         description: Completion status not found
 */
router.delete('/:completionStatusId', deleteStatus);

/**
 * @swagger
 * /api/v1/completion-status/{completionStatusId}/delegate-it:
 *   put:
 *     tags: [CompletionStatus]
 *     summary: Delegate to IT team
 *     description: Delegates the completion status to the IT team.
 *     parameters:
 *       - in: path
 *         name: completionStatusId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the completion status
 *     responses:
 *       200:
 *         description: Delegated to IT team successfully
 */
router.put('/:completionStatusId/delegate-it', delegateToIT);

// Continue with similar Swagger documentation for the other routes...

export default router;

// import express from 'express';
// import {
//   createOrUpdateStatus,
//   getStatus,
//   getAllStatus,
//   updateStatus,
//   deleteStatus,
//   delegateToIT,
//   delegateToAuditor,
//   confirmEvidence,
//   getRiskByAsset,
//   getOverallRisk,
//   raiseQuery,
//   delegateToExternalAuditor,
//   getCompletionStatusById,
//   setNotApplicable,
//   confirmNotApplicable,
// } from '../controllers/completionStatusController.js';

// const router = express.Router();

// // Route to create or update a status
// router.post('/', createOrUpdateStatus);

// //GetStatusbyId
// router.get('/all/:id', getCompletionStatusById);

// // Route to get status by criteria
// router.get('/', getStatus);

// router.get('/all/', getAllStatus);

// // Route to update status by ID
// router.put('/:completionStatusId', updateStatus);

// // Route to delete status by ID
// router.delete('/:completionStatusId', deleteStatus);

// // Route for Compliance Team to delegate to IT Team
// router.put('/:completionStatusId/delegate-it', delegateToIT);

// // Route for IT Team to delegate to Auditor
// router.put('/:completionStatusId/delegate-auditor', delegateToAuditor);

// // Route for Auditor to external Auditor
// router.put(
//   '/:completionStatusId/delegate-external-auditor',
//   delegateToExternalAuditor
// );

// // Route for Auditor to confirm or return evidence
// router.put('/:completionStatusId/confirm-evidence', confirmEvidence);

// // Route for auditor to return evidence
// router.put('/:completionStatusId/return-evidence', raiseQuery);

// // Route for calculating risk by asset
// router.get('/risk/:assetId', getRiskByAsset);

// // Route for calculating overall risk
// router.get('/risk-overall', getOverallRisk);

// router.put('/:id/set-not-applicable', setNotApplicable);
// router.put('/:id/confirm-not-applicable', confirmNotApplicable);

// export default router;
