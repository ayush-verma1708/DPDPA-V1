import mongoose from 'mongoose'

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
  }
});

export const Business = mongoose.model('Business', businessSchema);