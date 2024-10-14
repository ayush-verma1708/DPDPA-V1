import mongoose from 'mongoose';

const softwareSchema = new mongoose.Schema({
  software_name: {
    type: String,
    required: true,
  },
});

const productFamilySchema = new mongoose.Schema({
  family_name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  software_list: [softwareSchema], // Embedding software documents here
});

export const ProductFamily = mongoose.model(
  'ProductFamily',
  productFamilySchema
);
