import express from 'express';
import {
  submitQuizAnswers,
  getQuizResults,
} from '../controllers/userAnswerController.js';

const router = express.Router();

// Route to submit quiz answers
router.post('/quiz/submit', submitQuizAnswers);

// Route to get quiz results for a user
router.get('/quiz/:quizId/results/:userId', getQuizResults);

export default router;
