import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const username = 'adminuser';
const newPassword = 'adminpasswords';
const saltRounds = 10;

async function updatePassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
    });

    console.log('Connected to MongoDB');

    // Hash the new password
    const newHash = await bcrypt.hash(newPassword, saltRounds);
    console.log('New password hash:', newHash);

    // Update the user's password
    const result = await User.updateOne({ username }, { password: newHash });

    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }

    console.log('Update result:', result);
    console.log('Password updated successfully');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updatePassword();
