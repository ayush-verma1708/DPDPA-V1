import mongoose from 'mongoose';

const userAnswerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz', // Reference to the Quiz model
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        selectedOptionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      default: 0, // Calculated based on correct answers
    },
    passed: {
      type: Boolean,
      default: false, // True if the score meets or exceeds the passing score
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'userAnswers' }
);

export default mongoose.model('UserAnswer', userAnswerSchema);
