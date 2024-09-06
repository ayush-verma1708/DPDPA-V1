import express from 'express';
import { createCompanyForm, getCompanyFormById, updateCompanyForm, deleteCompanyForm, listCompanyForms, validateFormData } from '../controllers/companyFormController.js';

const router = express.Router();

// Middleware to validate form data
router.use(validateFormData);

// Route to create a new company form entry
router.post('/create', createCompanyForm);

// Route to fetch a company form entry by ID
router.get('/:id', getCompanyFormById);

// Route to update a company form entry by ID
router.put('/:id', updateCompanyForm);

// Route to delete a company form entry by ID
router.delete('/:id', deleteCompanyForm);

// Route to list all company form entries
router.get('/', listCompanyForms);

export default router;
