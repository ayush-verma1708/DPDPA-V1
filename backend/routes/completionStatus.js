import express from 'express';
const router = express.Router();
import * as completionStatusController from '../controllers/completionStatusController.js';


// Create or update completion status
// router.post('/', completionStatusController.createOrUpdateStatus);
router.put('/', completionStatusController.createOrUpdateStatus); // Change POST to PUT

// Fetch completion status by criteria
router.get('/', completionStatusController.getStatus);

// Delegate to IT
router.post('/delegate-to-it/:completionStatusId', completionStatusController.delegateToIT);

// Delegate to Auditor
router.post('/delegate-to-auditor/:completionStatusId', completionStatusController.delegateToAuditor);

// Confirm Evidence
router.post('/confirm-evidence/:completionStatusId', completionStatusController.confirmEvidence);

export default router;
