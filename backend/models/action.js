import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  fixed_id: { type: String, unique: true },
  variable_id: { type: String, required: true },
  control_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Control', required: true },
  isDPDPA: { type: Boolean, default: false },
});

const Action = mongoose.model('Action', actionSchema);

export default Action;

// import mongoose from 'mongoose';



// const fileSchema = new mongoose.Schema({
//   path: { type: String, required: true },
//   name: { type: String, required: true }
// });


// const actionSchema = new mongoose.Schema({
//   FixedID: { type: String, unique: true },
//   action_Id: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   description: { type: String },
//   control_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Control', required: true },
//   isDPDPA: { type: Boolean, default: 0 },
//   info: {
//     totalActions: { type: Number, default: 0 }
//   },
//   isCompleted: { type: Boolean, default: 0 }, // Added field
//   files: [fileSchema], // Add this line to store file information
// });


// // Middleware to check and update control and control family completion status
// actionSchema.post('save', async function(doc) {
//   await checkAndUpdateActionCompletion(doc._id);
// });

// const Action = mongoose.model('Action', actionSchema);

// export default Action;

// // import mongoose from 'mongoose';

// // const actionSchema = new mongoose.Schema({
// //   FixedID: { type: String, unique: true },
// //   action_Id: { type: String, required: true, unique: true },
// //   name: { type: String, required: true },
// //   description: { type: String },
// //   control_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Control', required: true },
// //   isDPDPA: { type: Boolean, default: 0 } ,
// //   info: {
// //     totalActions: { type: Number, default: 0 }
// //   }
// // });

// // const Action = mongoose.model('Action', actionSchema);

// // export default Action;
