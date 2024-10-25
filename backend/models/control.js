import mongoose from 'mongoose';

const controlSchema = new mongoose.Schema({
  fixed_id: { type: String, unique: true },
  section: { type: String, required: true },
  section_main_desc: { type: String, required: true },
  section_desc: { type: String, required: true },
  control_type: { type: String, required: true },
  control_Family_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ControlFamily',
    required: true,
  },
  product_family_Id: {
    // Ensure field name matches your document structure
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductFamily',
  },
  isDPDPA: { type: Boolean, default: false },
  criticality: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    default: 'low',
  },
});

controlSchema.pre('remove', async function (next) {
  try {
    await Action.deleteMany({ control_Id: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

const Control = mongoose.model('Control', controlSchema);

export default Control;
