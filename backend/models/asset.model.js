import mongoose from 'mongoose'

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  desc: { type: String },
  isScoped: { type: Boolean, default: false },
  
},{timestamps: true});

export const Asset = mongoose.model('Asset', assetSchema);
