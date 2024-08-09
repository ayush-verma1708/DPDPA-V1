import mongoose from 'mongoose'

const itSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
  }
});

export const It = mongoose.model('It', itSchema);