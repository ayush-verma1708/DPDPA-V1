// routes/stepTasks.js
import express from 'express';
import {
  createStep,
  createTask,
  getAllStepsWithTasks,
  updateCompletionStatus,
  deleteStepTask,
} from '../controllers/stepTaskController.js';

const router = express.Router();

router.post('/steps', createStep); // Create a new step
router.post('/tasks', createTask); // Create a new task
router.get('/steps', getAllStepsWithTasks); // Get all steps with their tasks
router.put('/step-tasks/:id/completion', updateCompletionStatus); // Update completion status
router.delete('/step-tasks/:id', deleteStepTask); // Delete a step/task

export default router;
