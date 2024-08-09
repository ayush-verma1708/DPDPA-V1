import mongoose from 'mongoose';

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
    default: 'user',
  }, 
  permissions: {
    view: { type: Boolean, default: false },
    add: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
  },
}, { collection: 'users' });

userSchema.methods.comparePassword = async function (password) {
  return password === this.password; // Direct comparison
};

export default mongoose.model('User', userSchema);
