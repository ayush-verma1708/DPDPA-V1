import express from 'express';
import {
  createCompanyForm,
  getCompanyFormById,
  updateCompanyForm,
  deleteCompanyForm,
  listCompanyForms,
  validateFormData,
} from '../controllers/companyFormController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CompanyForm
 *   description: Company form management
 */

/**
 * @swagger
 * /api/company-form/create:
 *   post:
 *     tags: [CompanyForm]
 *     summary: Create a new company form entry
 *     description: Add a new company form to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the company
 *               address:
 *                 type: string
 *                 description: Address of the company
 *     responses:
 *       201:
 *         description: Company form created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/create', createCompanyForm);

/**
 * @swagger
 * /api/company-form/{id}:
 *   get:
 *     tags: [CompanyForm]
 *     summary: Get a company form entry by ID
 *     description: Retrieve a specific company form using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the company form
 *     responses:
 *       200:
 *         description: Company form retrieved successfully
 *       404:
 *         description: Company form not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getCompanyFormById);

/**
 * @swagger
 * /api/company-form/{id}:
 *   put:
 *     tags: [CompanyForm]
 *     summary: Update a company form entry by ID
 *     description: Update the details of an existing company form by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the company form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the company
 *               address:
 *                 type: string
 *                 description: Updated address of the company
 *     responses:
 *       200:
 *         description: Company form updated successfully
 *       404:
 *         description: Company form not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateCompanyForm);

/**
 * @swagger
 * /api/company-form/{id}:
 *   delete:
 *     tags: [CompanyForm]
 *     summary: Delete a company form entry by ID
 *     description: Remove a company form from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the company form
 *     responses:
 *       200:
 *         description: Company form deleted successfully
 *       404:
 *         description: Company form not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteCompanyForm);

/**
 * @swagger
 * /api/company-form:
 *   get:
 *     tags: [CompanyForm]
 *     summary: List all company form entries
 *     description: Retrieve a list of all company forms in the database.
 *     responses:
 *       200:
 *         description: List of company forms retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', listCompanyForms);

export default router;

// import express from 'express';
// import { createCompanyForm, getCompanyFormById, updateCompanyForm, deleteCompanyForm, listCompanyForms, validateFormData } from '../controllers/companyFormController.js';

// const router = express.Router();

// // Middleware to validate form data
// router.use(validateFormData);

// // Route to create a new company form entry
// router.post('/create', createCompanyForm);

// // Route to fetch a company form entry by ID
// router.get('/:id', getCompanyFormById);

// // Route to update a company form entry by ID
// router.put('/:id', updateCompanyForm);

// // Route to delete a company form entry by ID
// router.delete('/:id', deleteCompanyForm);

// // Route to list all company form entries
// router.get('/', listCompanyForms);

// export default router;
