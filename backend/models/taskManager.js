// import mongoose from 'mongoose';
// const Schema = mongoose.Schema;

// const taskManagerSchema = new Schema({
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     default: 'Open'
//   },
//   asset: {
//     type: Schema.Types.ObjectId,
//     ref: 'AssetDetails',
//     required: true
//   },
//   controlFamily: {
//     type: Schema.Types.ObjectId,
//     ref: 'ControlFamily',
//     required: true
//   },
//   status: {
//     type: String,
//     enum: [
//       'Open',
//       'Delegated to IT Team',
//       'Evidence Ready',
//       'Misconfigured based on evidence study',
//       'Audit delegated',
//       'Audit non confirm',
//       'Audit Closed',
//       'Closed',
//       'Not Applicable',
//       'Risk accepted'
//     ],
//     default: 'Open'
//   },
//   dueDate: {
//     type: Date,
//     required: true
//   },
//   completionDate: {
//     type: Date
//   },
//   notes: {
//     type: String
//   }
// }, { timestamps: true });

// // Create and export the model
// const TaskManager = mongoose.model('TaskManager', taskManagerSchema);

// export default TaskManager;
