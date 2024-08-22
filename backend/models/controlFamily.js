import mongoose from 'mongoose';
import Control from './control.js';

const controlFamilySchema = new mongoose.Schema({
  fixed_id: { type: String, unique: true },
  variable_id: { type: String, required: true },
  isDPDPA: { type: Boolean, default: false }
});

controlFamilySchema.pre('remove', async function(next) {
  try {
    const controls = await Control.find({ control_family_id: this.fixed_id });
    for (const control of controls) {
      await control.remove();
    }
    next();
  } catch (err) {
    next(err);
  }
});



const ControlFamily = mongoose.model('ControlFamily', controlFamilySchema);

export default ControlFamily;
