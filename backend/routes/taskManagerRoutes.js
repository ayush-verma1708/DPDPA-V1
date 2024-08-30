import express from 'express';
import TaskManagerController from '../controllers/TaskManager.js'; // Adjust the path as needed

const router = express.Router();

// Middleware to check if user is authenticated
import { authenticate } from '../middleware/authenticate.js'; // Adjust the path as needed

// Apply the authentication middleware to all routes
router.use(authenticate);

// Create a new task (Compliance Team only)
router.post('/tasks', TaskManagerController.createTask);

// Update task status (IT Team, Auditor)
router.patch('/tasks/:id/status', TaskManagerController.updateTaskStatus);

// Get all tasks (all roles)
router.get('/tasks', TaskManagerController.getAllTasks);

// Get a single task by ID (all roles)
router.get('/tasks/:id', TaskManagerController.getTaskById);

// Delete a task (Admin only)
router.delete('/tasks/:id', TaskManagerController.deleteTask);

export default router;
