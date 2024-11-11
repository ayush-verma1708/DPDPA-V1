import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  fixed_id: { type: String, unique: true },
  variable_id: { type: String, required: true },
  control_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Control',
    required: true,
  },
  // ProductFamily: { type: mongoose.Schema.Types.Mixed },
  product_family_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductFamily',
  },
  softwareId: { type: mongoose.Schema.Types.ObjectId, ref: 'Software' }, // Reference to Software
  description: { type: String }, // Software-specific task description

  isDPDPA: { type: Boolean, default: false },
  isAction: { type: String, default: true },
});

const Action = mongoose.model('Action', actionSchema);

export default Action;

// import mongoose from 'mongoose';

// const actionSchema = new mongoose.Schema({
//   fixed_id: { type: String, unique: true },
//   variable_id: { type: String, required: true },
//   control_Id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Control',
//     required: true,
//   },
//   isDPDPA: { type: Boolean, default: false },
//   isAction: { type: String, default: true },
//   // actionDesc: { type: String },
//   // ProductFamily: { type: mongoose.Schema.Types.Mixed },
//   // Software: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: 'Software', // Reference to the Software model
//   //   default: null,
//   // },
// });

// const Action = mongoose.model('Action', actionSchema);

// export default Action;
