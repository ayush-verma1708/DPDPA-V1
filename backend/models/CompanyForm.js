import mongoose from 'mongoose';

const companyFormSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number.']
  },
  companyDetails: {
    organizationName: {
      type: String,
      required: true
    },
    industryType: {
      type: String,
      enum: ['Healthcare', 'Finance', 'Education', 'Others'],
      required: true
    },
    customIndustryType: {
      type: String,
      required: function() { return this.companyDetails.industryType === 'Others'; }
    },
    numberOfEmployees: {
      type: String,
      enum: ['0-10', '10-100', '100-10000', 'Others'],
      required: true
    }
  },
  otp: {
    type: String,
    default: '9999'
  }
}, {
  timestamps: true
});

export const CompanyForm = mongoose.model('CompanyForm', companyFormSchema);
