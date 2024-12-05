import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    program: {
      type: String, // Name of the training program (e.g., "Compliance Training", "Technical Training")
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lectures: [
      {
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String, // URL of the lecture (could be a video link)
          required: true,
        },
        duration: {
          type: Number, // Duration of the lecture in minutes
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'trainings' }
);

export default mongoose.model('Training', trainingSchema);
