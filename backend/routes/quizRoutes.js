import express from 'express';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizzesByTrainingId,
} from '../controllers/quizController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Operations related to quizzes
 */

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     tags: [Quizzes]
 *     summary: Create a new quiz
 *     description: Create a new quiz for a training or assessment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the quiz
 *               description:
 *                 type: string
 *                 description: The description of the quiz
 *               trainingId:
 *                 type: integer
 *                 description: The ID of the training associated with the quiz
 *     responses:
 *       201:
 *         description: The quiz was created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/quizzes', createQuiz);

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     tags: [Quizzes]
 *     summary: Retrieve all quizzes
 *     description: Fetch a list of all quizzes.
 *     responses:
 *       200:
 *         description: A list of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the quiz
 *                   title:
 *                     type: string
 *                     description: The title of the quiz
 *                   description:
 *                     type: string
 *                     description: A brief description of the quiz
 *                   trainingId:
 *                     type: integer
 *                     description: The ID of the training associated with the quiz
 *       500:
 *         description: Internal server error
 */
router.get('/quizzes', getAllQuizzes);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get a single quiz by ID
 *     description: Fetch the details of a specific quiz by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the quiz
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A quiz object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the quiz
 *                 title:
 *                   type: string
 *                   description: The title of the quiz
 *                 description:
 *                   type: string
 *                   description: A brief description of the quiz
 *                 trainingId:
 *                   type: integer
 *                   description: The ID of the training associated with the quiz
 *       404:
 *         description: Quiz not found
 */
router.get('/quizzes/:id', getQuizById);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     tags: [Quizzes]
 *     summary: Update a quiz
 *     description: Update the details of an existing quiz by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the quiz
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
 *               title:
 *                 type: string
 *                 description: The title of the quiz
 *               description:
 *                 type: string
 *                 description: The description of the quiz
 *               trainingId:
 *                 type: integer
 *                 description: The ID of the training associated with the quiz
 *     responses:
 *       200:
 *         description: The quiz was updated successfully
 *       404:
 *         description: Quiz not found
 */
router.put('/quizzes/:id', updateQuiz);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     tags: [Quizzes]
 *     summary: Delete a quiz
 *     description: Delete a quiz by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the quiz to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The quiz was deleted successfully
 *       404:
 *         description: Quiz not found
 */
router.delete('/quizzes/:id', deleteQuiz);

/**
 * @swagger
 * /api/quizzes/trainings/{trainingId}:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get quizzes by training ID
 *     description: Fetch all quizzes associated with a specific training ID.
 *     parameters:
 *       - name: trainingId
 *         in: path
 *         description: The ID of the training
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of quizzes for the given training ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   trainingId:
 *                     type: integer
 *       404:
 *         description: Training not found or no quizzes available
 */
router.get('/quizzes/trainings/:trainingId', getQuizzesByTrainingId);

export default router;

// import express from 'express';
// import {
//   createQuiz,
//   getAllQuizzes,
//   getQuizById,
//   updateQuiz,
//   deleteQuiz,
//   getQuizzesByTrainingId,
// } from '../controllers/quizController.js';

// const router = express.Router();

// // Create a new quiz
// router.post('/quizzes', createQuiz);

// // Get all quizzes
// router.get('/quizzes', getAllQuizzes);

// // Get a single quiz by ID
// router.get('/quizzes/:id', getQuizById);

// // Update a quiz
// router.put('/quizzes/:id', updateQuiz);

// // Delete a quiz
// router.delete('/quizzes/:id', deleteQuiz);

// // Get quizzes by training ID
// router.get('/quizzes/trainings/:trainingId', getQuizzesByTrainingId);

// export default router;
