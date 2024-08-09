import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the schema for AssetDetails
const assetDetailsSchema = new Schema({
  asset: {
    type: Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  scoped: {
    type: Schema.Types.ObjectId,
    ref: 'Scoped',
  },
  criticality: {
    type: String,
    required: true
  },
  businessOwnerName: {
    type: String,
    required: true
  },
  businessOwnerEmail: {
    type: String,
    required: true
  },
  itOwnerName: {
    type: String,
    required: true
  },
  itOwnerEmail: {
    type: String,
    required: true
  },
  coverages: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

// Create and export the model
export const AssetDetails = mongoose.model('AssetDetails', assetDetailsSchema);