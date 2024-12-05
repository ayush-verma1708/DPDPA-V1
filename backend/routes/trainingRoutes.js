import express from 'express';
import {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining,
} from '../controllers/trainingController.js';

const router = express.Router();

// Create a new training program
router.post('/trainings', createTraining);

// Get all training programs
router.get('/trainings', getAllTrainings);

// Get a single training program by ID
router.get('/trainings/:id', getTrainingById);

// Update a training program
router.put('/trainings/:id', updateTraining);

// Delete a training program
router.delete('/trainings/:id', deleteTraining);

export default router;
