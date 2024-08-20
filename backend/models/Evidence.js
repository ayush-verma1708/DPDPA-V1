import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
  scopeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scope' },
  actionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Action' },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'ControlFamily' },
  controlId: { type: mongoose.Schema.Types.ObjectId, ref: 'Control' },
  username: { type: String }, // Added username field
}, { timestamps: true });

export default mongoose.model('Evidence', evidenceSchema);
