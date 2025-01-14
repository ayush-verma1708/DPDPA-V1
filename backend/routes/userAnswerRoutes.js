import express from 'express';
import {
  submitQuizAnswers,
  getQuizResults,
} from '../controllers/userAnswerController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Operations related to submitting quiz answers and retrieving results
 */

/**
 * @swagger
 * /api/assignments/quiz/submit:
 *   post:
 *     tags: [Assignments]
 *     summary: Submit quiz answers
 *     description: Submit a user's answers to a specific quiz.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quizId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                     answer:
 *                       type: string
 *     responses:
 *       201:
 *         description: Quiz answers submitted successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/quiz/submit', submitQuizAnswers); // Submit quiz answers

/**
 * @swagger
 * /api/assignments/quiz/{quizId}/results/{userId}:
 *   get:
 *     tags: [Assignments]
 *     summary: Get quiz results for a user
 *     description: Fetch the results of a quiz for a specific user.
 *     parameters:
 *       - name: quizId
 *         in: path
 *         description: The ID of the quiz
 *         required: true
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: path
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The results of the quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: integer
 *                 totalQuestions:
 *                   type: integer
 *                 correctAnswers:
 *                   type: integer
 *       404:
 *         description: Quiz or user not found
 *       500:
 *         description: Internal server error
 */
router.get('/quiz/:quizId/results/:userId', getQuizResults); // Get quiz results for a user

export default router;

// import express from 'express';
// import {
//   submitQuizAnswers,
//   getQuizResults,
// } from '../controllers/userAnswerController.js';

// const router = express.Router();

// // Route to submit quiz answers
// router.post('/quiz/submit', submitQuizAnswers);

// // Route to get quiz results for a user
// router.get('/quiz/:quizId/results/:userId', getQuizResults);

// export default router;
