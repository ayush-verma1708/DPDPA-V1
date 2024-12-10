import UserAnswer from '../models/userAnswer.js';
import Quiz from '../models/quizModel.js';

export const submitQuizAnswers = async (req, res) => {
  const { userId, quizId, answers } = req.body;

  try {
    // Validate quiz existence
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate the score
    let score = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers.find(
        (ans) => ans.questionId === String(question._id)
      );
      if (userAnswer) {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        if (String(userAnswer.selectedOptionId) === String(correctOption._id)) {
          score++;
        }
      }
    });

    // Determine if user passed
    const passingScore = quiz.passingScore;
    const passed = (score / quiz.questions.length) * 100 >= passingScore;

    // Save user answer
    const userAnswerRecord = new UserAnswer({
      user: userId,
      quiz: quizId,
      answers,
      score,
      passed,
    });

    await userAnswerRecord.save();

    res.status(201).json({
      message: 'Quiz submitted successfully',
      score,
      passed,
    });
  } catch (error) {
    console.error('Error submitting quiz answers:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getQuizResults = async (req, res) => {
  const { userId, quizId } = req.params;

  try {
    const userAnswers = await UserAnswer.findOne({ user: userId, quiz: quizId })
      .populate('quiz')
      .populate('user');

    if (!userAnswers) {
      return res.status(404).json({ message: 'Results not found' });
    }

    res.status(200).json(userAnswers);
  } catch (error) {
    console.error('Error fetching quiz results:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
