import mongoose from 'mongoose'

const scopedSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  desc: {
    type: String,
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
  }
},{timestamps: true});

export const Scoped = mongoose.model('Scoped', scopedSchema);
