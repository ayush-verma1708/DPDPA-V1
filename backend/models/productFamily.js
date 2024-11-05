// models/productFamily.js
import mongoose from 'mongoose';

// Product Family model
const productFamilySchema = new mongoose.Schema({
  family_name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  // Referencing software by ObjectId, making it an array of references to Software documents
  software_list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Software', // Reference to Software model
    },
  ],
});

export const ProductFamily = mongoose.model(
  'ProductFamily',
  productFamilySchema
);
