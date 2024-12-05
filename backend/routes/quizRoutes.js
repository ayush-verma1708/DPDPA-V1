import express from 'express';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from '../controllers/quizController.js';

const router = express.Router();

// Create a new quiz
router.post('/quizzes', createQuiz);

// Get all quizzes
router.get('/quizzes', getAllQuizzes);

// Get a single quiz by ID
router.get('/quizzes/:id', getQuizById);

// Update a quiz
router.put('/quizzes/:id', updateQuiz);

// Delete a quiz
router.delete('/quizzes/:id', deleteQuiz);

export default router;
