import mongoose from 'mongoose'

const coverageSchema = new mongoose.Schema({
  coverageCount: {
    type: Number,
    default: 0,
  },
  scoped: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scoped',
    default: null
  },
  criticality: { type: Boolean, default: false }, // Add criticality field
  businessOwnerName: { type: String },
  businessOwnerEmail: { type: String },
  itOwnerName: { type: String },
  itOwnerEmail: { type: String },
},{ timestamps: true
});

export const Coverage = mongoose.model('Coverage', coverageSchema);