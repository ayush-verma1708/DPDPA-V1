import mongoose, { Types } from 'mongoose'; // Import Types from mongoose
import dotenv from 'dotenv';
import { ProductFamily } from '../models/productFamily.js'; // Adjust the path according to your project structure

dotenv.config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
// Sample data for product families
const productFamilies = [
  {
    family_name: 'Data Discovery and Classification Tools',
    category: 'Data Classification',
    software_list: [
      {
        software_name: 'Microsoft Purview',
        _id: new mongoose.Types.ObjectId('4dee85b3cec93040826f8257'),
      },
      {
        software_name: 'Varonis',
        _id: new mongoose.Types.ObjectId('d86ad779965748726c53a9d3'),
      },
      {
        software_name: 'BigID',
        _id: new mongoose.Types.ObjectId('b231ea71ab7283a479a2c6db'),
      },
      {
        software_name: 'Spirion',
        _id: new mongoose.Types.ObjectId('f93addf5012d954a1757f451'),
      },
      {
        software_name: 'Digital Guardian',
        _id: new mongoose.Types.ObjectId('92950312600a2319209d5d9f'),
      },
      {
        software_name: 'IBM Guardium',
        _id: new mongoose.Types.ObjectId('a7124cf8a5d63893661c01f6'),
      },
    ],
  },
  {
    family_name: 'Data Protection and Encryption',
    category: 'Encryption',
    software_list: [
      {
        software_name: 'Symantec',
        _id: new mongoose.Types.ObjectId('432a3116f9c8102fb698de80'),
      },
      {
        software_name: 'McAfee (now Trellix)',
        _id: new mongoose.Types.ObjectId('12c390507fc40c2c0c05b296'),
      },
      {
        software_name: 'Thales',
        _id: new mongoose.Types.ObjectId('fb85bf89fc89db0cca740c99'),
      },
      {
        software_name: 'Vormetric',
        _id: new mongoose.Types.ObjectId('b0e03fa9cfa9124baaccc1e6'),
      },
      {
        software_name: 'Microsoft Azure Information Protection',
        _id: new mongoose.Types.ObjectId('b8318ce7e43d519b50d9f85e'),
      },
      {
        software_name: 'IBM Guardium Data Encryption',
        _id: new mongoose.Types.ObjectId('908671893a13042eb3d4f8c9'),
      },
      {
        software_name: 'Kaspersky Endpoint Security',
        _id: new mongoose.Types.ObjectId('f0fea97c6c79fcd9276cf07c'),
      },
    ],
  },
  {
    family_name: 'Data Loss Prevention (DLP)',
    category: 'DLP',
    software_list: [
      {
        software_name: 'Forcepoint',
        _id: new mongoose.Types.ObjectId('51cd9af5237a42ebfbc5611d'),
      },
      {
        software_name: 'Digital Guardian',
        _id: new mongoose.Types.ObjectId('ff8379e6441523b5e10e369c'),
      },
      {
        software_name: 'Symantec DLP',
        _id: new mongoose.Types.ObjectId('2856336fe913e3e0f7a1edd1'),
      },
      {
        software_name: 'Microsoft Defender for Endpoint',
        _id: new mongoose.Types.ObjectId('9ab8a133a714ce7eb0c2d70c'),
      },
      {
        software_name: 'Trend Micro DLP',
        _id: new mongoose.Types.ObjectId('423146799951b03d2c4c39f7'),
      },
      {
        software_name: 'McAfee Total Protection for Data Loss Prevention',
        _id: new mongoose.Types.ObjectId('7a81fdecec5704abb862931e'),
      },
    ],
  },
  {
    family_name: 'Consent Management and Privacy Preference Centers',
    category: 'Consent Management',
    software_list: [
      {
        software_name: 'OneTrust',
        _id: new mongoose.Types.ObjectId('8f076043ff6309785817afda'),
      },
      {
        software_name: 'TrustArc',
        _id: new mongoose.Types.ObjectId('98fd7615ee8c38ca457a55c5'),
      },
      {
        software_name: 'Didomi',
        _id: new mongoose.Types.ObjectId('35b904d56ace121eb29177d8'),
      },
      {
        software_name: 'CookiePro',
        _id: new mongoose.Types.ObjectId('a2b432534992642a0e000e32'),
      },
      {
        software_name: 'Crownpeak',
        _id: new mongoose.Types.ObjectId('73b4b9014332ebcdabcbd2fb'),
      },
      {
        software_name: 'Usercentrics',
        _id: new mongoose.Types.ObjectId('08f2711e506a4348d65f9c1a'),
      },
    ],
  },
  {
    family_name: 'Vendor Risk Management',
    category: 'Risk Management',
    software_list: [
      {
        software_name: 'BitSight',
        _id: new mongoose.Types.ObjectId('d67c03ec6ec163f9c73bae78'),
      },
      {
        software_name: 'SecurityScorecard',
        _id: new mongoose.Types.ObjectId('de15e101935e7816d02bc88d'),
      },
      {
        software_name: 'RiskRecon',
        _id: new mongoose.Types.ObjectId('cc0ee0dfcdc17e861ce0ae99'),
      },
      {
        software_name: 'Prevalent',
        _id: new mongoose.Types.ObjectId('ddbecc77b685c33b2350c7a3'),
      },
      {
        software_name: 'Aravo',
        _id: new mongoose.Types.ObjectId('9d2e245e70505929a4c2019c'),
      },
      {
        software_name: 'ProcessUnity',
        _id: new mongoose.Types.ObjectId('822a494315d6a7c6021a4260'),
      },
    ],
  },
];

// Function to insert product families
async function insertProductFamilies() {
  try {
    await ProductFamily.deleteMany({}); // Clear existing entries if needed

    for (const family of productFamilies) {
      const productFamilyEntry = new ProductFamily({
        family_name: family.family_name,
        category: family.category,
        software_list: family.software_list.map(
          (software) => new mongoose.Types.ObjectId(software._id) // Ensure proper instantiation here as well
        ),
      });

      await productFamilyEntry.save();
      console.log(`Inserted product family: ${family.family_name}`);
    }
    console.log('All product families have been inserted.');
  } catch (error) {
    console.error('Error inserting product families:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Main function to run the script
async function main() {
  await connectDB();
  await insertProductFamilies();
}

// Execute the main function
main();

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import { ProductFamily } from '../models/productFamily.js'; // Adjust the import path as necessary

// dotenv.config(); // Load environment variables from .env file

// // Function to add product families with "Microsoft" and "ABC Software" in the software list
// async function addProductFamilies() {
//   const families = [
//     {
//       family_name: 'Data Discovery and Classification Tools',
//       category: 'Data Classification',
//     },
//     { family_name: 'Data Protection and Encryption', category: 'Encryption' },
//     { family_name: 'Data Loss Prevention (DLP)', category: 'DLP' },
//     { family_name: 'Identity and Access Management (IAM)', category: 'IAM' },
//     {
//       family_name: 'Consent Management and Privacy Preference Centers',
//       category: 'Consent Management',
//     },
//     { family_name: 'Audit and Logging Tools', category: 'Audit and Logging' },
//     {
//       family_name: 'Privacy Management Platforms',
//       category: 'Privacy Management',
//     },
//     { family_name: 'Vendor Risk Management', category: 'Risk Management' },
//     {
//       family_name: 'Breach Detection and Incident Response',
//       category: 'Incident Response',
//     },
//     {
//       family_name: 'Document and Records Management',
//       category: 'Document Management',
//     },
//     { family_name: 'Training and Awareness Programs', category: 'Training' },
//   ];

//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB successfully.');

//     // Loop through each family and add to the database
//     for (const family of families) {
//       const newFamily = new ProductFamily({
//         family_name: family.family_name,
//         category: family.category,
//         software_list: [
//           { software_name: 'Microsoft' },
//           { software_name: 'ABC Software' },
//         ],
//       });

//       // Save each family to the database
//       const savedFamily = await newFamily.save();
//       console.log(`Added family: ${savedFamily.family_name}`);
//     }

//     console.log('All product families added successfully.');
//   } catch (error) {
//     console.error('Error adding product families:', error);
//   } finally {
//     // Close the MongoDB connection after the operation
//     mongoose.connection.close();
//     console.log('MongoDB connection closed.');
//   }
// }

// // Run the function to add product families
// addProductFamilies();
