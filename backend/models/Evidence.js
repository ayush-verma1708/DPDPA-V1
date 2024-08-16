import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
  scope: { type: mongoose.Schema.Types.ObjectId, ref: 'Scope' },
  action: { type: mongoose.Schema.Types.ObjectId, ref: 'Action' },
  controlFamily: { type: mongoose.Schema.Types.ObjectId, ref: 'ControlFamily' },
  control: { type: mongoose.Schema.Types.ObjectId, ref: 'Control' },
}, { timestamps: true });

export default mongoose.model('Evidence', evidenceSchema);
