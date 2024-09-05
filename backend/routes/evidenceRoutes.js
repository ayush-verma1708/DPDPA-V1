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

// Route to upload a file and create a new evidence record
router.post('/upload', uploadFile, createEvidence);

// Route to get all evidence records
router.get('/', getAllEvidences);

// Route to get evidence by ID
router.get('/:id', getEvidenceById);

// Route to update evidence by ID
router.put('/:id', updateEvidence);

// Route to delete evidence by ID
router.delete('/:id', deleteEvidence);


router.post('/params', getEvidenceByParams);

export default router;
