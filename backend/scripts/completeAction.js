import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CompletionStatus from '../models/completionStatusSchema.js'; // Adjust the import path as necessary

dotenv.config();

async function completeAllActionsForAsset(assetId) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully.');

    // Find all CompletionStatus entries for the specified asset
    const statuses = await CompletionStatus.find({ assetId: assetId });
    console.log(`Found ${statuses.length} CompletionStatus entries for Asset ${assetId}.`);

    // Update isCompleted to true for each status
    const updatePromises = statuses.map(status => 
      CompletionStatus.updateOne(
        { _id: status._id },
        { $set: { isCompleted: true } }
      )
    );

    await Promise.all(updatePromises);
    console.log(`Updated ${statuses.length} CompletionStatus entries to completed.`);

  } catch (error) {
    console.error('Error completing actions for asset:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the script with a specified asset ID
completeAllActionsForAsset('66ba0b04ce0bc876573faf10'); // Replace 'yourAssetId' with the actual asset ID you want to process
