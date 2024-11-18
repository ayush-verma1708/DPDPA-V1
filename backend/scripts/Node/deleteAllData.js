// deleteAllEntries.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Message from '../models/messageSchema.js'; // Adjust the path to your Message model
import CompletionStatus from '../models/completionStatusSchema.js';
import Notification from '../models/notificationSchema.js'; // Adjust the path to your Notification model
import Evidence from '../models/Evidence.js'; // Adjust the path to your Evidence model

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGODB_URI; // Use the connection string from the .env file

const deleteAllEntries = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Delete all documents from the specified schemas
    const messageDeleteResult = await Message.deleteMany({});
    console.log(`${messageDeleteResult.deletedCount} messages deleted`);

    const completionStatusDeleteResult = await CompletionStatus.deleteMany({});
    console.log(
      `${completionStatusDeleteResult.deletedCount} completion statuses deleted`
    );

    const notificationDeleteResult = await Notification.deleteMany({});
    console.log(
      `${notificationDeleteResult.deletedCount} notifications deleted`
    );

    const evidenceDeleteResult = await Evidence.deleteMany({});
    console.log(
      `${evidenceDeleteResult.deletedCount} evidence entries deleted`
    );

    // Close the database connection
    await mongoose.connection.close();
    console.log('Connection to MongoDB closed');
  } catch (error) {
    console.error('Error deleting entries:', error);
  }
};

// Run the script
deleteAllEntries();
