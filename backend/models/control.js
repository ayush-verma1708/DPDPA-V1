import mongoose from 'mongoose';
import Action from './action.js';

const controlSchema = new mongoose.Schema({
  FixedID: { type: String, unique: true },
  control_Id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  control_Family_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'ControlFamily', required: true },
  isDPDPA: { type: Boolean, default: 0 },
  info: {
    actionsCount: { type: Number, default: 0 },
    completedActions: { type: Number, default: 0 } // Added field
  },
  criticality: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    required: false 
  }
});

controlSchema.pre('remove', async function(next) {
  try {
    await Action.deleteMany({ control_Id: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

// Method to check if all actions are completed
controlSchema.methods.checkCompletion = async function() {
  const actions = await Action.find({ control_Id: this._id });
  const completedActions = actions.filter(action => action.isCompleted).length;
  this.info.completedActions = completedActions;
  if (completedActions === actions.length) {
    // Mark control as completed if all actions are done
    this.isCompleted = true;
  } else {
    this.isCompleted = false;
  }
  await this.save();
};

const Control = mongoose.model('Control', controlSchema);

export default Control;

// import mongoose from 'mongoose';
// import Action from './action.js'; // Adjust path as necessary

// const controlSchema = new mongoose.Schema({
//   FixedID: { type: String, unique: true },
//   control_Id: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   description: { type: String },
//   control_Family_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'ControlFamily', required: true },
//   isDPDPA: { type: Boolean, default: 0 },
//   info: {
//     actionsCount: { type: Number, default: 0 }
//   },
//   criticality: { 
//     type: String, 
//     enum: ['low', 'medium', 'high', 'critical'], 
//     required: true 
//   }
// });



// controlSchema.pre('remove', async function(next) {
//   try {
//     await Action.deleteMany({ control_Id: this._id });
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// const Control = mongoose.model('Control', controlSchema);
// export default Control;
