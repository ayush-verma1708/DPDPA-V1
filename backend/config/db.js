import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Increase this value as needed
      }
    );
    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; // Ensure the error is propagated
  }
};
