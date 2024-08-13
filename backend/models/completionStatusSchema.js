import mongoose from 'mongoose';

const completionStatusSchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  action: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Action',
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completionDate: {
    type: Date
  },
  isScoped: {
    type: Boolean,
    default: false
  },
  scopeName: {
    type: String,
    required: function() { return this.isScoped; } // Required if scoped
  },
  scopeInfo: {
    type: String,
    required: function() { return this.isScoped; } // Required if scoped
  }
}, { timestamps: true });

const CompletionStatus = mongoose.model('CompletionStatus', completionStatusSchema);

export default CompletionStatus;
