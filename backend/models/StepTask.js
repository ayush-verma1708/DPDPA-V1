// models/StepTask.js
import mongoose from 'mongoose';

const stepTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      default: '', // Optional description for tasks
    },
    stepType: {
      type: String,
      enum: ['step', 'task'], // To differentiate between steps and tasks
      required: true,
    },
    parentStep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StepTask',
      default: null, // To link tasks to their parent step
    },
    order: {
      type: Number,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null, // When the step/task was completed
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

const StepTask = mongoose.model('StepTask', stepTaskSchema);

export default StepTask;
