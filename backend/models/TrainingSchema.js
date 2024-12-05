import mongoose from 'mongoose';

const TrainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: [
    {
      type: {
        type: String,
        enum: ['video', 'lecture', 'quiz'],
        required: true,
      },
      details: { type: mongoose.Schema.Types.Mixed },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  assignedRoles: [{ type: String }],
});

const Training = mongoose.model('Training', TrainingSchema);
export default Training;
