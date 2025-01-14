import { Router } from 'express';
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
  getUserById,
  checkFormCompletion,
  updateFormCompletionStatus,
  getUsernameById,
} from '../controllers/user.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to user management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Fetch a list of all users in the system.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', getUsers); // Get all users

/**
 * @swagger
 * /api/users/username/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get username by user ID
 *     description: Fetch the username of a specific user by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The username of the user
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       404:
 *         description: User not found
 */
router.get('/username/:id', getUsernameById); // Get username by ID

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Create a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', createUser); // Create a new user

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user by ID
 *     description: Update the information of an existing user by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.put('/:id', updateUser); // Update user by ID

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user by ID
 *     description: Delete a user from the system by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', deleteUser); // Delete user by ID

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user information
 *     description: Fetch the information of the currently authenticated user.
 *     responses:
 *       200:
 *         description: Current user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticateToken, getCurrentUser); // Get current user info

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Fetch the details of a user by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.get('/:id', getUserById); // Get user by ID

/**
 * @swagger
 * /api/users/{id}/form-completion:
 *   get:
 *     tags: [Users]
 *     summary: Check form completion status
 *     description: Check if a user has completed the form.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user to check form completion
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The form completion status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 completed:
 *                   type: boolean
 *       404:
 *         description: User not found
 */
router.get('/:id/form-completion', checkFormCompletion); // Check form completion

/**
 * @swagger
 * /api/users/{id}/form-completion:
 *   patch:
 *     tags: [Users]
 *     summary: Update form completion status
 *     description: Update the form completion status of a user.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user to update form completion
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Form completion status updated
 *       404:
 *         description: User not found
 */
router.patch('/:id/form-completion', updateFormCompletionStatus); // Update form completion status

export default router;

// // backend/routes/userRoutes.js
// import { Router } from 'express';
// import {
//   createUser,
//   getUsers,
//   updateUser,
//   deleteUser,
//   getCurrentUser,
//   getUserById,
//   checkFormCompletion,
//   updateFormCompletionStatus,
//   getUsernameById,
// } from '../controllers/user.controller.js';
// import authenticateToken from '../middleware/authenticateToken.js';

// const router = Router();

// router.get('/', getUsers); // Get all users
// router.get('/username/:id', getUsernameById); // Get all users
// router.post('/', createUser); // Create a new user
// router.put('/:id', updateUser); // Update user by ID
// router.delete('/:id', deleteUser); // Delete user by ID
// router.get('/me', authenticateToken, getCurrentUser); // Get current user info
// router.get('/:id', getUserById);

// // Route to check if the form is completed
// router.get('/:id/form-completion', checkFormCompletion);

// // Route to update the form completion status
// router.patch('/:id/form-completion', updateFormCompletionStatus);

// export default router;

// // import { Router } from 'express';
// // import { AsyncHandler } from '../utils/asyncHandler.js';
// // import { createUser, getUsers, updateUser, deleteUser, getCurrentUser } from '../controllers/user.controller.js';

// // import { authenticate } from '../middleware/authenticate.js'; // Adjust path as needed

// // const userRoutes = Router();

// // // Handle GET requests for users
// // userRoutes.route('/').get(AsyncHandler(async (req, res) => {
// //     await getUsers(req, res);
// // }));

// // // Handle POST requests for creating users
// // userRoutes.route('/').post(AsyncHandler(async (req, res) => {
// //     await createUser(req, res);
// // }));

// // // Handle PUT requests for updating users
// // userRoutes.route('/:id').put(AsyncHandler(async (req, res) => {
// //     await updateUser(req, res);
// // }));

// // // Handle DELETE requests for deleting users
// // userRoutes.route('/:id').delete(AsyncHandler(async (req, res) => {
// //     await deleteUser(req, res);
// // }));

// // // Handle GET requests for fetching the current user's info
// // userRoutes.route('/me').get(authenticate, AsyncHandler(async (req, res) => {
// //     await getCurrentUser(req, res);
// // }));

// // export default userRoutes;

// // // import { Router } from 'express';
// // // import {AsyncHandler} from '../utils/asyncHandler.js'; // Default import
// // // import { createUser, getUsers, updateUser, deleteUser , getCurrentUser} from '../controllers/user.controller.js';

// // // const userRoutes = Router();

// // // // Handle GET requests for users
// // // userRoutes.route('/').get(AsyncHandler(async (req, res) => {
// // //     await getUsers(req, res);
// // // }));

// // // // Handle POST requests for creating users
// // // userRoutes.route('/').post(AsyncHandler(async (req, res) => {
// // //     await createUser(req, res);
// // // }));

// // // // Handle PUT requests for updating users
// // // userRoutes.route('/:id').put(AsyncHandler(async (req, res) => {
// // //     await updateUser(req, res);
// // // }));

// // // // Handle DELETE requests for deleting users
// // // userRoutes.route('/:id').delete(AsyncHandler(async (req, res) => {
// // //     await deleteUser(req, res);
// // // }));

// // // // Handle GET requests for fetching the current user's info
// // // userRoutes.route('/me').get(AsyncHandler(async (req, res) => {
// // //     await getCurrentUser(req, res);
// // // }));

// // // export default userRoutes;
