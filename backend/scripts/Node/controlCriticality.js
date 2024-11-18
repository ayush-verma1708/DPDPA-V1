import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Control from '../models/control.js'; // Adjust the import path as necessary

dotenv.config();

// Function to generate a random criticality value
const randomCriticality = () => {
  const criticalityLevels = ['low', 'medium', 'high', 'critical'];
  return criticalityLevels[
    Math.floor(Math.random() * criticalityLevels.length)
  ];
};

async function addCriticalityToControls() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully.');

    // Find all Control documents that don't have a criticality value
    const controls = await Control.find({ criticality: { $exists: false } });
    console.log(
      `Found ${controls.length} Control entries without criticality.`
    );

    // Update each document with a random criticality value
    const updatePromises = controls.map((control) =>
      Control.updateOne(
        { _id: control._id },
        { $set: { criticality: randomCriticality() } }
      )
    );

    await Promise.all(updatePromises);
    console.log(
      `Updated ${controls.length} Control entries with criticality values.`
    );
  } catch (error) {
    console.error('Error updating criticality in controls:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the script
addCriticalityToControls();
