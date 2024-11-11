// models/NewAction.js
import mongoose from 'mongoose';

const newActionSchema = new mongoose.Schema({
  fixed_id: { type: String, unique: true },
  variable_id: { type: String, required: true },
  control_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Control',
    required: true,
  },
  product_family_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductFamily',
    required: true,
  },
  softwareId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Software',
    required: true,
  },
  description: { type: String }, // Software-specific task description

  isDPDPA: { type: Boolean, default: false },
  isAction: { type: Boolean, default: true },
});

const NewAction = mongoose.model('NewAction', newActionSchema);

export default NewAction;
