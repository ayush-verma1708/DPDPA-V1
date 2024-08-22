import mongoose from 'mongoose';

const CompletionStatusSchema = new mongoose.Schema({
  actionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Action', required: true },
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  scopeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scope', required: false }, // Optional if scopeless
  controlId: { type: mongoose.Schema.Types.ObjectId, ref: 'Control', required: true },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'ControlFamily', required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  username: { type: String }, // Added username field
}, {
  timestamps: true, // This adds `createdAt` and `updatedAt` fields
});

const CompletionStatus = mongoose.model('CompletionStatus', CompletionStatusSchema);

export default CompletionStatus;
