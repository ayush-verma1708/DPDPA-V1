import express from 'express';
import { createOrUpdateStatus, getStatus, updateStatus, deleteStatus, delegateToIT, delegateToAuditor, confirmEvidence } from '../controllers/completionStatusController.js';

const router = express.Router();

// Route to create or update a status
router.post('/', createOrUpdateStatus);

// Route to get status by criteria
router.get('/', getStatus);

// Route to update status by ID
router.put('/:completionStatusId', updateStatus);

// Route to delete status by ID
router.delete('/:completionStatusId', deleteStatus);

// Route for Compliance Team to delegate to IT Team
router.put('/:completionStatusId/delegate-it', delegateToIT);

// Route for IT Team to delegate to Auditor
router.put('/:completionStatusId/delegate-auditor', delegateToAuditor);

// Route for Auditor to confirm or return evidence
router.put('/:completionStatusId/confirm-evidence', confirmEvidence);

export default router;

// import express from 'express';
// const router = express.Router();
// import * as completionStatusController from '../controllers/completionStatusController.js';


// // Create or update completion status
// // router.post('/', completionStatusController.createOrUpdateStatus);
// router.put('/', completionStatusController.createOrUpdateStatus); // Change POST to PUT

// // Fetch completion status by criteria
// router.get('/', completionStatusController.getStatus);

// // Delegate to IT
// router.post('/delegate-to-it/:completionStatusId', completionStatusController.delegateToIT);

// // Delegate to Auditor
// router.post('/delegate-to-auditor/:completionStatusId', completionStatusController.delegateToAuditor);

// // Confirm Evidence
// router.post('/confirm-evidence/:completionStatusId', completionStatusController.confirmEvidence);

// export default router;
