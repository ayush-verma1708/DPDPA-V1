import express from 'express';
import assignmentController from '../controllers/assignmentController.js';

const router = express.Router();

// Route to create a new assignment
router.post('/', assignmentController.createAssignment);

// Route to get all assignments
router.get('/', assignmentController.getAllAssignments);

// Route to get assignments for a specific user
router.get('/user/:userId', assignmentController.getAssignmentsByUser);

// Route to update an assignment
router.put('/:id', assignmentController.updateAssignment);

// Route to delete an assignment
router.delete('/:id', assignmentController.deleteAssignment);

// Route to assign training/quiz to all users by role
router.post('/role', assignmentController.assignToRole);

export default router;
