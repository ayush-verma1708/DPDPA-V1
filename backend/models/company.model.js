import mongoose, { Schema, model} from 'mongoose'

const companySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Official email is required'],
    unique: true,
    trim: true,
    index: true
  },
  address: {
    type: String,
    required: true,
  },
  industryType: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Company = model("Company", companySchema);