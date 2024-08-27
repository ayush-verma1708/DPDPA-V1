import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const username = 'adminuser';
const newPassword = 'adminpasswords';
const saltRounds = 10;

async function testUpdate() {
  try {
    // Check if MONGODB_URI is loaded
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
    });

    const newHash = await bcrypt.hash(newPassword, saltRounds);
    const result = await User.updateOne({ username }, { password: newHash });
    
    console.log('Update result:', result);
    console.log('Password updated successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testUpdate();
