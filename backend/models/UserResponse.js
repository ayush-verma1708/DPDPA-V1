import mongoose from 'mongoose';

// Define the user response schema
const userResponseSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming companyId is an ObjectId
      required: true,
      ref: 'CompanyForm', // Reference to CompanyForm model
    },
    productFamily: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the product family
      required: true,
      ref: 'ProductFamily',
    },
    selectedSoftware: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Software model
      ref: 'Software',
      default: null, // Can be null if no software is selected
    },
    otherSoftware: {
      type: String, // For additional software input if 'Others' is selected
      default: '',
    },
    isValid: {
      type: Boolean,
      required: true,
      default: false, // Consider defaulting to false if not provided
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create the model
export const UserResponse = mongoose.model('UserResponse', userResponseSchema);

// import mongoose from 'mongoose';

// const userResponseSchema = new mongoose.Schema(
//   {
//     companyId: {
//       type: mongoose.Schema.Types.ObjectId, // Assuming companyId is an ObjectId
//       required: true,
//       ref: 'CompanyForm', // Assuming you have a Company model. Adjust as needed.
//     },
//     productFamily: {
//       type: mongoose.Schema.Types.ObjectId, // Reference to the product family
//       required: true,
//       ref: 'ProductFamily',
//     },
//     selectedSoftware: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Software', // Assuming Software is another model
//       default: null, // Can be null if no software is selected
//     },
//     otherSoftware: {
//       type: String, // Only required if 'Others' is selected
//       default: '',
//     },
//     isValid: {
//       type: Boolean,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export const UserResponse = mongoose.model('UserResponse', userResponseSchema);
