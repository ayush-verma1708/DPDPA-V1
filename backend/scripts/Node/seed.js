import mongoose from 'mongoose';
import User from '../../models/User.js'; // Adjust the import path if necessary
import bcrypt from 'bcryptjs'; // Ensure bcryptjs is installed
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB using URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB.');

    // Check if admin already exists
    const adminExists = await User.findOne({ username: 'adminuser' });
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    // Create an admin user
    const adminUser = new User({
      username: 'adminuser',
      email: 'admin@example.com', // Ensure this matches your schema
      password: 'adminpassword', // Raw password, hashed in pre-save hook
      role: 'Admin',
    });

    await adminUser.save();
    console.log('Admin user seeded successfully.');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedAdmin();
