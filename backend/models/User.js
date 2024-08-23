import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Executive', 'Compliance Team', 'IT Team', 'Auditor', 'user'],
    default: 'user',
  },
  permissions: {
    view: { type: Boolean, default: false },
    add: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delegate: { type: Boolean, default: false },
    uploadEvidence: { type: Boolean, default: false },
    confirmEvidence: { type: Boolean, default: false },
  },
}, { collection: 'users' });

userSchema.methods.comparePassword = async function (inputPassword) {
  // return await bcrypt.compare(inputPassword, this.password);
   // Direct comparison, no hashing involved
   return inputPassword === this.password;
};


userSchema.pre('save', function (next) {
  // if (this.isModified('password') || this.isNew) {
  //   // this.password = bcrypt.hash(this.password, 10);
  //    // Direct comparison, no hashing involved
  //  inputPassword === this.password;
  // }
  // next();
  // Set permissions based on role
  const rolePermissions = {
    'Admin': { view: true, add: true, edit: true, delegate: true, uploadEvidence: true, confirmEvidence: true },
    'Executive': { view: true },
    'Compliance Team': { view: true, add: true, edit: true, delegate: true },
    'IT Team': { view: true, edit: true, delegate: true, uploadEvidence: true },
    'Auditor': { view: true, confirmEvidence: true },
    'user': { view: false, add: false, edit: false, delegate: false, uploadEvidence: false, confirmEvidence: false },
  };
  this.permissions = rolePermissions[this.role] || rolePermissions['user'];
  next();
});

export default mongoose.model('User', userSchema);

// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// userSchema.methods.comparePassword = async function (password) {
//   return bcrypt.compare(password, this.password);
// };
// Method to compare password


// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     enum: ['Admin', 'Executive', 'Compliance Team', 'IT Team', 'Auditor', 'user'],
//     default: 'user',
//   },
//   permissions: {
//     view: { type: Boolean, default: false },
//     add: { type: Boolean, default: false },
//     edit: { type: Boolean, default: false },
//     delegate: { type: Boolean, default: false },
//     uploadEvidence: { type: Boolean, default: false },
//     confirmEvidence: { type: Boolean, default: false },
//   },
// }, { collection: 'users' });

// userSchema.methods.comparePassword = async function (password) {
//   return password === this.password; // Replace with a hashing method in production
// };

// userSchema.pre('save', function (next) {
//   switch (this.role) {
//     case 'Admin':
//       this.permissions = { view: true, add: true, edit: true, delegate: true, uploadEvidence: true, confirmEvidence: true };
//       break;
//     case 'Executive':
//       this.permissions = { view: true };
//       break;
//     case 'Compliance Team':
//       this.permissions = { view: true, add: true, edit: true, delegate: true };
//       break;
//     case 'IT Team':
//       this.permissions = { view: true, edit: true, delegate: true, uploadEvidence: true };
//       break;
//     case 'Auditor':
//       this.permissions = { view: true, confirmEvidence: true };
//       break;
//     default:
//       this.permissions = { view: false, add: false, edit: false, delegate: false, uploadEvidence: false, confirmEvidence: false };
//       break;
//   }
//   next();
// });

// export default mongoose.model('User', userSchema);

// // import mongoose from 'mongoose';

// // const userSchema = new mongoose.Schema({
// //   username: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //   },
// //   password: {
// //     type: String,
// //     required: true,
// //   },
// //   role: {
// //     type: String,
// //     default: 'user',
// //   }, 
// //   permissions: {
// //     view: { type: Boolean, default: false },
// //     add: { type: Boolean, default: false },
// //     edit: { type: Boolean, default: false },
// //   },
// // }, { collection: 'users' });

// // userSchema.methods.comparePassword = async function (password) {
// //   return password === this.password; // Direct comparison
// // };

// // export default mongoose.model('User', userSchema);
