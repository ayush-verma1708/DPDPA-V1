import { Router } from 'express';
import {AsyncHandler} from '../utils/asyncHandler.js'; // Default import
import { createUser, getUsers, updateUser, deleteUser } from '../controllers/user.controller.js';

const userRoutes = Router();

// Handle GET requests for users
userRoutes.route('/').get(AsyncHandler(async (req, res) => {
    await getUsers(req, res);
}));

// Handle POST requests for creating users
userRoutes.route('/').post(AsyncHandler(async (req, res) => {
    await createUser(req, res);
}));

// Handle PUT requests for updating users
userRoutes.route('/:id').put(AsyncHandler(async (req, res) => {
    await updateUser(req, res);
}));

// Handle DELETE requests for deleting users
userRoutes.route('/:id').delete(AsyncHandler(async (req, res) => {
    await deleteUser(req, res);
}));

export default userRoutes;

