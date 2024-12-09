import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType',
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Training', 'Quiz'], // References different types of assignable items
    },
    status: {
      type: String,
      enum: ['Assigned', 'In Progress', 'Completed'],
      default: 'Assigned',
    },
    score: {
      type: Number, // Applicable for quizzes
      default: null,
    },
    dueDate: {
      type: Date, // Optional deadline for the assignment
      default: null,
    },
    completedAt: {
      type: Date, // Date when the assignment was completed
      default: null,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'assignments',
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.model('Assignment', assignmentSchema);
