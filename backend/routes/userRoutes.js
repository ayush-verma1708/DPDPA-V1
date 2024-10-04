// backend/routes/userRoutes.js
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

router.get('/', getUsers); // Get all users
router.get('/username/:id', getUsernameById); // Get all users
router.post('/', createUser); // Create a new user
router.put('/:id', updateUser); // Update user by ID
router.delete('/:id', deleteUser); // Delete user by ID
router.get('/me', authenticateToken, getCurrentUser); // Get current user info
router.get('/:id', getUserById);

// Route to check if the form is completed
router.get('/:id/form-completion', checkFormCompletion);

// Route to update the form completion status
router.patch('/:id/form-completion', updateFormCompletionStatus);

export default router;

// import { Router } from 'express';
// import { AsyncHandler } from '../utils/asyncHandler.js';
// import { createUser, getUsers, updateUser, deleteUser, getCurrentUser } from '../controllers/user.controller.js';

// import { authenticate } from '../middleware/authenticate.js'; // Adjust path as needed

// const userRoutes = Router();

// // Handle GET requests for users
// userRoutes.route('/').get(AsyncHandler(async (req, res) => {
//     await getUsers(req, res);
// }));

// // Handle POST requests for creating users
// userRoutes.route('/').post(AsyncHandler(async (req, res) => {
//     await createUser(req, res);
// }));

// // Handle PUT requests for updating users
// userRoutes.route('/:id').put(AsyncHandler(async (req, res) => {
//     await updateUser(req, res);
// }));

// // Handle DELETE requests for deleting users
// userRoutes.route('/:id').delete(AsyncHandler(async (req, res) => {
//     await deleteUser(req, res);
// }));

// // Handle GET requests for fetching the current user's info
// userRoutes.route('/me').get(authenticate, AsyncHandler(async (req, res) => {
//     await getCurrentUser(req, res);
// }));

// export default userRoutes;

// // import { Router } from 'express';
// // import {AsyncHandler} from '../utils/asyncHandler.js'; // Default import
// // import { createUser, getUsers, updateUser, deleteUser , getCurrentUser} from '../controllers/user.controller.js';

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
// // userRoutes.route('/me').get(AsyncHandler(async (req, res) => {
// //     await getCurrentUser(req, res);
// // }));

// // export default userRoutes;
