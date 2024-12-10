import assignmentSchema from '../models/assignmentModel.js'; // Import Assignment model
import userAnswerSchema from '../models/userAnswer.js'; // Import UserAnswer model
import quizSchema from '../models/quizModel.js'; // Import Quiz model
import trainingSchema from '../models/trainingModel.js'; // Import Training model

const updateAssignmentScore = async (userId, quizId) => {
  try {
    // Step 1: Get the UserAnswer for the provided user and quiz
    const userAnswer = await userAnswerSchema
      .findOne({
        user: userId,
        quiz: quizId,
      })
      .populate('quiz');
    if (!userAnswer) {
      throw new Error('UserAnswer not found');
    }

    // Step 2: Calculate the score by checking the correct answers
    const quiz = userAnswer.quiz;
    let score = 0;

    userAnswer.answers.forEach((answer) => {
      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId.toString()
      );
      const correctOption = question.options.find((opt) => opt.isCorrect);
      if (
        correctOption &&
        correctOption._id.toString() === answer.selectedOptionId.toString()
      ) {
        score += 1; // Increment score for correct answer
      }
    });

    // Step 3: Check if the user passed
    const passed = score >= quiz.passingScore;

    // Step 4: Find the training associated with this quiz
    const training = await trainingSchema.findById(quiz.training);
    if (!training) {
      throw new Error('Training not found');
    }

    // Step 5: Find the corresponding Assignment record
    const assignment = await assignmentSchema.findOne({
      user: userId,
      item: training._id,
      itemType: 'Training',
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Step 6: Update the assignment with the score and completion details
    assignment.score = score;
    assignment.completedAt = new Date(); // Set completion date to now
    assignment.status = passed ? 'Completed' : 'In Progress'; // Update status based on passing

    // Save the updated assignment
    await assignment.save();

    return { message: 'Assignment updated successfully' };
  } catch (error) {
    console.error(error);
    throw new Error('Error updating assignment score');
  }
};

export default updateAssignmentScore;
