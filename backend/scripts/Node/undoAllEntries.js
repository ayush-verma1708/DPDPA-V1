import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CompletionStatus from '../models/completionStatusSchema.js';

dotenv.config();

async function resetCompletionStatus() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB successfully.');

    // Update all entries in CompletionStatus to set isCompleted to false
    const result = await CompletionStatus.updateMany(
      {},
      { $set: { isCompleted: false } }
    );

    console.log(`Updated ${result.modifiedCount} entries to set isCompleted to false.`);
  } catch (error) {
    console.error('Error resetting completion status:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the script
resetCompletionStatus();
