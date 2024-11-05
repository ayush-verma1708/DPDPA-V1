import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Software } from '../models/software.js';

dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log('Connected to MongoDB successfully.');
// Full data set including all categories and their software lists
const data = [
  {
    family_name: 'Data Discovery and Classification Tools',
    category: 'Data Classification',
    software_list: [
      {
        software_name: 'Microsoft Purview',
        _id: { $oid: '4dee85b3cec93040826f8257' },
      },
      { software_name: 'Varonis', _id: { $oid: 'd86ad779965748726c53a9d3' } },
      { software_name: 'BigID', _id: { $oid: 'b231ea71ab7283a479a2c6db' } },
      { software_name: 'Spirion', _id: { $oid: 'f93addf5012d954a1757f451' } },
      {
        software_name: 'Digital Guardian',
        _id: { $oid: '92950312600a2319209d5d9f' },
      },
      {
        software_name: 'IBM Guardium',
        _id: { $oid: 'a7124cf8a5d63893661c01f6' },
      },
    ],
  },
  {
    family_name: 'Data Protection and Encryption',
    category: 'Encryption',
    software_list: [
      { software_name: 'Symantec', _id: { $oid: '432a3116f9c8102fb698de80' } },
      {
        software_name: 'McAfee (now Trellix)',
        _id: { $oid: '12c390507fc40c2c0c05b296' },
      },
      { software_name: 'Thales', _id: { $oid: 'fb85bf89fc89db0cca740c99' } },
      { software_name: 'Vormetric', _id: { $oid: 'b0e03fa9cfa9124baaccc1e6' } },
      {
        software_name: 'Microsoft Azure Information Protection',
        _id: { $oid: 'b8318ce7e43d519b50d9f85e' },
      },
      {
        software_name: 'IBM Guardium Data Encryption',
        _id: { $oid: '908671893a13042eb3d4f8c9' },
      },
      {
        software_name: 'Kaspersky Endpoint Security',
        _id: { $oid: 'f0fea97c6c79fcd9276cf07c' },
      },
    ],
  },
  {
    family_name: 'Data Loss Prevention (DLP)',
    category: 'DLP',
    software_list: [
      {
        software_name: 'Forcepoint',
        _id: { $oid: '51cd9af5237a42ebfbc5611d' },
      },
      {
        software_name: 'Digital Guardian',
        _id: { $oid: 'ff8379e6441523b5e10e369c' },
      },
      {
        software_name: 'Symantec DLP',
        _id: { $oid: '2856336fe913e3e0f7a1edd1' },
      },
      {
        software_name: 'Microsoft Defender for Endpoint',
        _id: { $oid: '9ab8a133a714ce7eb0c2d70c' },
      },
      {
        software_name: 'Trend Micro DLP',
        _id: { $oid: '423146799951b03d2c4c39f7' },
      },
      {
        software_name: 'McAfee Total Protection for Data Loss Prevention',
        _id: { $oid: '7a81fdecec5704abb862931e' },
      },
    ],
  },
  {
    family_name: 'Consent Management and Privacy Preference Centers',
    category: 'Consent Management',
    software_list: [
      { software_name: 'OneTrust', _id: { $oid: '8f076043ff6309785817afda' } },
      { software_name: 'TrustArc', _id: { $oid: '98fd7615ee8c38ca457a55c5' } },
      { software_name: 'Didomi', _id: { $oid: '35b904d56ace121eb29177d8' } },
      { software_name: 'CookiePro', _id: { $oid: 'a2b432534992642a0e000e32' } },
      { software_name: 'Crownpeak', _id: { $oid: '73b4b9014332ebcdabcbd2fb' } },
      {
        software_name: 'Usercentrics',
        _id: { $oid: '08f2711e506a4348d65f9c1a' },
      },
    ],
  },
  {
    family_name: 'Vendor Risk Management',
    category: 'Risk Management',
    software_list: [
      { software_name: 'BitSight', _id: { $oid: 'd67c03ec6ec163f9c73bae78' } },
      {
        software_name: 'SecurityScorecard',
        _id: { $oid: 'de15e101935e7816d02bc88d' },
      },
      { software_name: 'RiskRecon', _id: { $oid: 'cc0ee0dfcdc17e861ce0ae99' } },
      { software_name: 'Prevalent', _id: { $oid: 'ddbecc77b685c33b2350c7a3' } },
      { software_name: 'Aravo', _id: { $oid: '9d2e245e70505929a4c2019c' } },
      {
        software_name: 'ProcessUnity',
        _id: { $oid: '822a494315d6a7c6021a4260' },
      },
    ],
  },
];

// Function to insert software entries
async function insertSoftwareData() {
  try {
    for (const category of data) {
      for (const software of category.software_list) {
        const softwareEntry = new Software({
          _id: new mongoose.Types.ObjectId(software._id.$oid), // Corrected ObjectId conversion
          software_name: software.software_name,
          family_name: category.family_name,
          category: category.category,
        });

        // Save the software document
        await softwareEntry.save();
        console.log(
          `Inserted software: ${software.software_name} with ID: ${software._id.$oid}`
        );
      }
    }
    console.log('All software entries have been inserted');
  } catch (error) {
    console.error('Error inserting software entries:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Call the function to insert data
insertSoftwareData();
