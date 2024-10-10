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
} from '../controllers/completionStatusController.js';

const router = express.Router();

// Route to create or update a status
router.post('/', createOrUpdateStatus);

//GetStatusbyId
router.get('/all/:id', getCompletionStatusById);

// Route to get status by criteria
router.get('/', getStatus);

router.get('/all/', getAllStatus);

// Route to update status by ID
router.put('/:completionStatusId', updateStatus);

// Route to delete status by ID
router.delete('/:completionStatusId', deleteStatus);

// Route for Compliance Team to delegate to IT Team
router.put('/:completionStatusId/delegate-it', delegateToIT);

// Route for IT Team to delegate to Auditor
router.put('/:completionStatusId/delegate-auditor', delegateToAuditor);

// Route for Auditor to external Auditor
router.put(
  '/:completionStatusId/delegate-external-auditor',
  delegateToExternalAuditor
);

// Route for Auditor to confirm or return evidence
router.put('/:completionStatusId/confirm-evidence', confirmEvidence);

// Route for auditor to return evidence
router.put('/:completionStatusId/return-evidence', raiseQuery);

// Route for calculating risk by asset
router.get('/risk/:assetId', getRiskByAsset);

// Route for calculating overall risk
router.get('/risk-overall', getOverallRisk);

export default router;
