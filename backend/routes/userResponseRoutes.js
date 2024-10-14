import express from 'express';
import {
  addUserResponses,
  getUserResponsesByCompanyId,
} from '../controllers/userResponseController.js'; // Import the controller

const router = express.Router();

// Route to add user responses for all product families
router.post('/add-responses', addUserResponses);

router.get('/:companyId', getUserResponsesByCompanyId);

export default router;
