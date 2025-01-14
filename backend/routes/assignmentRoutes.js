import express from 'express';
import assignmentController from '../controllers/assignmentController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: API for managing assignments
 */

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     tags: [Assignments]
 *     summary: Create a new assignment
 *     description: Create a new assignment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', assignmentController.createAssignment);

/**
 * @swagger
 * /api/assignments:
 *   get:
 *     tags: [Assignments]
 *     summary: Get all assignments
 *     description: Retrieve a list of all assignments.
 *     responses:
 *       200:
 *         description: List of assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 */
router.get('/', assignmentController.getAllAssignments);

/**
 * @swagger
 * /api/assignments/user/{userId}:
 *   get:
 *     tags: [Assignments]
 *     summary: Get assignments for a specific user
 *     description: Retrieve assignments for a specific user by user ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The ID of the user to retrieve assignments for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignments retrieved successfully
 *       404:
 *         description: User or assignments not found
 */
router.get('/user/:userId', assignmentController.getAssignmentsByUser);

/**
 * @swagger
 * /api/assignments/{id}:
 *   put:
 *     tags: [Assignments]
 *     summary: Update an assignment
 *     description: Update an assignment by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the assignment to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *       404:
 *         description: Assignment not found
 */
router.put('/:id', assignmentController.updateAssignment);

/**
 * @swagger
 * /api/assignments/{id}:
 *   delete:
 *     tags: [Assignments]
 *     summary: Delete an assignment
 *     description: Delete an assignment by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the assignment to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 */
router.delete('/:id', assignmentController.deleteAssignment);

/**
 * @swagger
 * /api/assignments/role:
 *   post:
 *     tags: [Assignments]
 *     summary: Assign training/quiz to all users by role
 *     description: Assign a training or quiz to all users with a specific role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleAssignment'
 *     responses:
 *       200:
 *         description: Assignment to role completed successfully
 *       400:
 *         description: Invalid input
 */
router.post('/role', assignmentController.assignToRole);

export default router;

// import express from 'express';
// import assignmentController from '../controllers/assignmentController.js';

// const router = express.Router();

// // Route to create a new assignment
// router.post('/', assignmentController.createAssignment);

// // Route to get all assignments
// router.get('/', assignmentController.getAllAssignments);

// // Route to get assignments for a specific user
// router.get('/user/:userId', assignmentController.getAssignmentsByUser);

// // Route to update an assignment
// router.put('/:id', assignmentController.updateAssignment);

// // Route to delete an assignment
// router.delete('/:id', assignmentController.deleteAssignment);

// // Route to assign training/quiz to all users by role
// router.post('/role', assignmentController.assignToRole);

// export default router;
