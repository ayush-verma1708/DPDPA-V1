import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  fixed_id: { type: String, unique: true },
  variable_id: { type: String, required: true },
  control_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Control', required: true },
  isDPDPA: { type: Boolean, default: false },
});

const Action = mongoose.model('Action', actionSchema);

export default Action;
