import express from 'express';
import {
  addUserResponses,
  getUserResponsesByCompanyId,
} from '../controllers/userResponseController.js'; // Import the controller

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Responses
 *   description: Operations related to adding and retrieving user responses
 */

/**
 * @swagger
 * /api/user-responses/add-responses:
 *   post:
 *     tags: [User Responses]
 *     summary: Add user responses for all product families
 *     description: Add responses submitted by a user for multiple product families in one request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               responses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productFamilyId:
 *                       type: integer
 *                     answer:
 *                       type: string
 *     responses:
 *       201:
 *         description: User responses added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/add-responses', addUserResponses); // Add user responses

/**
 * @swagger
 * /api/user-responses/{companyId}:
 *   get:
 *     tags: [User Responses]
 *     summary: Get user responses by company ID
 *     description: Retrieve all the responses submitted by users for a specific company.
 *     parameters:
 *       - name: companyId
 *         in: path
 *         description: The ID of the company for which user responses are being retrieved
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user responses for the given company
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                   responses:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productFamilyId:
 *                           type: integer
 *                         answer:
 *                           type: string
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.get('/:companyId', getUserResponsesByCompanyId); // Get user responses by company ID

export default router;

// import express from 'express';
// import {
//   addUserResponses,
//   getUserResponsesByCompanyId,
// } from '../controllers/userResponseController.js'; // Import the controller

// const router = express.Router();

// // Route to add user responses for all product families
// router.post('/add-responses', addUserResponses);

// router.get('/:companyId', getUserResponsesByCompanyId);

// export default router;
