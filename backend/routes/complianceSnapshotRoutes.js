import express from 'express';
import {
  createComplianceSnapshot,
  exportComplianceSnapshotToExcel,
} from '../controllers/complianceSnapshotController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ComplianceSnapshot
 *   description: Compliance snapshot management
 */

/**
 * @swagger
 * /api/v1/compliance-snapshot:
 *   post:
 *     tags: [ComplianceSnapshot]
 *     summary: Create a compliance snapshot
 *     description: Creates a new compliance snapshot in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               snapshotData:
 *                 type: string
 *                 description: The data for the compliance snapshot
 *               complianceId:
 *                 type: string
 *                 description: The ID for the related compliance
 *     responses:
 *       201:
 *         description: Compliance snapshot created successfully
 *       400:
 *         description: Validation error or bad request
 */
router.post('/', createComplianceSnapshot);

/**
 * @swagger
 * /api/v1/compliance-snapshot/export:
 *   get:
 *     tags: [ComplianceSnapshot]
 *     summary: Export compliance snapshot to Excel
 *     description: Exports the compliance snapshot data to an Excel file.
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 *       500:
 *         description: Internal server error
 */
router.get('/export', exportComplianceSnapshotToExcel);

export default router;

// import express from 'express';
// import {
//   createComplianceSnapshot,
//   exportComplianceSnapshotToExcel,
// } from '../controllers/complianceSnapshotController.js';

// const router = express.Router();

// // Route to create a compliance snapshot
// router.post('/', createComplianceSnapshot);
// router.get('/export', exportComplianceSnapshotToExcel); // Add this route

// // You can add more routes here for fetching, updating, or deleting snapshots

// export default router;
