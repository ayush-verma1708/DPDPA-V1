import mongoose from 'mongoose';

const userResponseSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming companyId is an ObjectId
      required: true,
      ref: 'CompanyForm', // Assuming you have a Company model. Adjust as needed.
    },
    productFamily: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the product family
      required: true,
      ref: 'ProductFamily',
    },
    selectedSoftware: {
      type: String,
      enum: ['Microsoft', 'ABC Software', 'None of these', 'Others'],
      required: true,
    },
    otherSoftware: {
      type: String, // Only required if 'Others' is selected
      default: '',
    },
  },
  { timestamps: true }
);

export const UserResponse = mongoose.model('UserResponse', userResponseSchema);
