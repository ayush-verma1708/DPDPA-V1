import mongoose from 'mongoose';
import Control from './control.js';

const controlFamilySchema = new mongoose.Schema({
  FixedID: { type: String, unique: true },
  control_Family_Id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  isDPDPA: { type: Boolean, default: 0 },
  info: {
    controlsCount: { type: Number, default: 0 },
    completedControls: { type: Number, default: 0 },
    actionsCount: { type: Number, default: 0 }
  }
});

controlFamilySchema.pre('remove', async function(next) {
  try {
    const controls = await Control.find({ control_Family_Id: this._id });
    for (const control of controls) {
      await control.remove();
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Method to check if all controls are completed
controlFamilySchema.methods.checkCompletion = async function() {
  const controls = await Control.find({ control_Family_Id: this._id });
  const completedControls = controls.filter(control => control.isCompleted).length;
  this.info.completedControls = completedControls;
  if (completedControls === controls.length) {
    // Mark control family as completed if all controls are done
    this.isCompleted = true;
  } else {
    this.isCompleted = false;
  }
  await this.save();
};

const ControlFamily = mongoose.model('ControlFamily', controlFamilySchema);

export default ControlFamily;

// import mongoose from 'mongoose';
// import Control from './control.js'; 

// const controlFamilySchema = new mongoose.Schema({
//   FixedID: { type: String, unique: true },
//   control_Family_Id: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   description: { type: String },
//   isDPDPA: { type: Boolean, default: 0 }, // New field,
//   info: {
//     controlsCount: { type: Number, default: 0 },
//     actionsCount: { type: Number, default: 0 }
//   }

// });

// controlFamilySchema.pre('remove', async function(next) {
//   try {
//     const controls = await Control.find({ control_Family_Id: this._id });
//     for (const control of controls) {
//       await control.remove();
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });


// const ControlFamily = mongoose.model('ControlFamily', controlFamilySchema);
// export default ControlFamily;
