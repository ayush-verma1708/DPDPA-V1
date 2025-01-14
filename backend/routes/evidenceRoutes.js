import express from 'express';
import {
  uploadFile,
  createEvidence,
  getAllEvidences,
  getEvidenceById,
  updateEvidence,
  deleteEvidence,
  getEvidenceByParams,
} from '../controllers/evidenceController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Evidence
 *   description: Evidence management
 */

/**
 * @swagger
 * /api/evidence/upload:
 *   post:
 *     tags: [Evidence]
 *     summary: Upload a file and create evidence
 *     description: Upload a file and create a new evidence record in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               evidenceDetails:
 *                 type: string
 *                 description: Additional details about the evidence
 *     responses:
 *       201:
 *         description: Evidence created successfully
 *       400:
 *         description: Bad request, validation failed
 */
router.post('/upload', uploadFile, createEvidence);

/**
 * @swagger
 * /api/evidence:
 *   get:
 *     tags: [Evidence]
 *     summary: Get all evidence records
 *     description: Retrieves a list of all evidence records.
 *     responses:
 *       200:
 *         description: A list of evidence records
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllEvidences);

/**
 * @swagger
 * /api/evidence/{id}:
 *   get:
 *     tags: [Evidence]
 *     summary: Get evidence by ID
 *     description: Retrieves evidence by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the evidence to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evidence record found
 *       404:
 *         description: Evidence not found
 */
router.get('/:id', getEvidenceById);

/**
 * @swagger
 * /api/evidence/{id}:
 *   put:
 *     tags: [Evidence]
 *     summary: Update evidence by ID
 *     description: Updates an existing evidence record by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the evidence to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               evidenceDetails:
 *                 type: string
 *                 description: Updated details of the evidence
 *     responses:
 *       200:
 *         description: Evidence updated successfully
 *       400:
 *         description: Bad request, validation failed
 *       404:
 *         description: Evidence not found
 */
router.put('/:id', updateEvidence);

/**
 * @swagger
 * /api/evidence/{id}:
 *   delete:
 *     tags: [Evidence]
 *     summary: Delete evidence by ID
 *     description: Deletes an evidence record by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the evidence to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evidence deleted successfully
 *       404:
 *         description: Evidence not found
 */
router.delete('/:id', deleteEvidence);

/**
 * @swagger
 * /api/evidence/params:
 *   post:
 *     tags: [Evidence]
 *     summary: Get evidence by parameters
 *     description: Retrieves evidence records based on the provided parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               evidenceType:
 *                 type: string
 *                 description: The type of evidence to filter by
 *               dateRange:
 *                 type: object
 *                 properties:
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     description: Start date for filtering evidence
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     description: End date for filtering evidence
 *     responses:
 *       200:
 *         description: Evidence records retrieved successfully
 *       400:
 *         description: Bad request, validation failed
 */
router.post('/params', getEvidenceByParams);

export default router;

// import express from 'express';
// import {
//   uploadFile,
//   createEvidence,
//   getAllEvidences,
//   getEvidenceById,
//   updateEvidence,
//   deleteEvidence,
//   getEvidenceByParams,
// } from '../controllers/evidenceController.js';

// const router = express.Router();

// // Route to upload a file and create a new evidence record
// router.post('/upload', uploadFile, createEvidence);

// // Route to get all evidence records
// router.get('/', getAllEvidences);

// // Route to get evidence by ID
// router.get('/:id', getEvidenceById);

// // Route to update evidence by ID
// router.put('/:id', updateEvidence);

// // Route to delete evidence by ID
// router.delete('/:id', deleteEvidence);

// router.post('/params', getEvidenceByParams);

// export default router;
