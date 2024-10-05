import express from 'express';
import {
  createComplianceSnapshot,
  exportComplianceSnapshotToExcel,
} from '../controllers/complianceSnapshotController.js';

const router = express.Router();

// Route to create a compliance snapshot
router.post('/', createComplianceSnapshot);
router.get('/export', exportComplianceSnapshotToExcel); // Add this route

// You can add more routes here for fetching, updating, or deleting snapshots

export default router;
