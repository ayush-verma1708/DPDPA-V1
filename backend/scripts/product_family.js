import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ProductFamily } from '../models/productFamily.js'; // Adjust the import path as necessary

dotenv.config(); // Load environment variables from .env file

// Function to add product families with "Microsoft" and "ABC Software" in the software list
async function addProductFamilies() {
  const families = [
    {
      family_name: 'Data Discovery and Classification Tools',
      category: 'Data Classification',
    },
    { family_name: 'Data Protection and Encryption', category: 'Encryption' },
    { family_name: 'Data Loss Prevention (DLP)', category: 'DLP' },
    { family_name: 'Identity and Access Management (IAM)', category: 'IAM' },
    {
      family_name: 'Consent Management and Privacy Preference Centers',
      category: 'Consent Management',
    },
    { family_name: 'Audit and Logging Tools', category: 'Audit and Logging' },
    {
      family_name: 'Privacy Management Platforms',
      category: 'Privacy Management',
    },
    { family_name: 'Vendor Risk Management', category: 'Risk Management' },
    {
      family_name: 'Breach Detection and Incident Response',
      category: 'Incident Response',
    },
    {
      family_name: 'Document and Records Management',
      category: 'Document Management',
    },
    { family_name: 'Training and Awareness Programs', category: 'Training' },
  ];

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully.');

    // Loop through each family and add to the database
    for (const family of families) {
      const newFamily = new ProductFamily({
        family_name: family.family_name,
        category: family.category,
        software_list: [
          { software_name: 'Microsoft' },
          { software_name: 'ABC Software' },
        ],
      });

      // Save each family to the database
      const savedFamily = await newFamily.save();
      console.log(`Added family: ${savedFamily.family_name}`);
    }

    console.log('All product families added successfully.');
  } catch (error) {
    console.error('Error adding product families:', error);
  } finally {
    // Close the MongoDB connection after the operation
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the function to add product families
addProductFamilies();
