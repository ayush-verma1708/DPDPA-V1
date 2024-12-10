import Quiz from '../models/quizModel.js'; // Import the Quiz model
import Training from '../models/trainingModel.js'; // Import the Training model for reference

// Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, training, questions, passingScore } = req.body;

    // Check if the training exists
    const trainingExists = await Training.findById(training);
    if (!trainingExists) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    const newQuiz = new Quiz({
      title,
      training,
      questions,
      passingScore,
    });

    await newQuiz.save();
    res
      .status(201)
      .json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error creating quiz', error: error.message });
  }
};

// Get all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('training', 'title program'); // Populate the associated training program
    res.status(200).json({ quizzes });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving quizzes', error: error.message });
  }
};

// Get a single quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      'training',
      'title program'
    );
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json({ quiz });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving quiz', error: error.message });
  }
};

// Update a quiz
export const updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated quiz
    );
    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res
      .status(200)
      .json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error updating quiz', error: error.message });
  }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting quiz', error: error.message });
  }
};

export const getQuizzesByTrainingId = async (req, res) => {
  const { trainingId } = req.params;

  try {
    // Fetch quizzes for the given training ID
    const quizzes = await Quiz.find({ training: trainingId });

    if (!quizzes || quizzes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No quizzes found for this training ID' });
    }

    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
