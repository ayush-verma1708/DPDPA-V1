import Software from '../models/software.js'; // Adjust this path to your actual Software model file

// dotenv.config();

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB successfully.'))
// .catch(err => console.error('MongoDB connection error:', err));

// Software data entries to insert
const softwareEntries = [
  { software_name: 'Splunk' },
  { software_name: 'LogRhythm' },
  { software_name: 'IBM QRadar' },
  { software_name: 'SolarWinds Log Analyzer' },
  { software_name: 'Securonix' },
  { software_name: 'Graylog' },
  { software_name: 'Nymity' },
  { software_name: 'Securiti.ai' },
  { software_name: 'DataGrail' },
];

// Insert function
async function insertSoftwareEntries() {
  try {
    // Insert each entry using the Software model
    await Software.insertMany(softwareEntries);
    console.log('Software entries have been inserted successfully.');
  } catch (error) {
    console.error('Error inserting software entries:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the insertion function
insertSoftwareEntries();
