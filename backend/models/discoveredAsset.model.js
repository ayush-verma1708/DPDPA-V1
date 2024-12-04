import mongoose from 'mongoose';

// Schema for Discovered Scope
const DiscoveredScopeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  isProcessed: {
    type: Boolean,
    default: false, // Indicates if the scope has been processed
  },
  processedAt: {
    type: Date, // Timestamp of when the asset was processed
  },
});

// Schema for Discovered Asset
const DiscoveredAssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure no duplicate discovered assets
  },
  type: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  scopes: [DiscoveredScopeSchema], // Array of discovered scopes
  isProcessed: {
    type: Boolean,
    default: false, // Indicates if this discovered asset has been processed
  },
  processedAt: {
    type: Date, // Timestamp of when the asset was processed
  },
});

const DiscoveredAsset = mongoose.model(
  'DiscoveredAsset',
  DiscoveredAssetSchema
);

export default DiscoveredAsset;

// import mongoose from 'mongoose';

// const DiscoveredScopeSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   desc: {
//     type: String,
//   },
// });

// const DiscoveredAssetSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true, // Ensure no duplicate discovered assets
//   },
//   type: {
//     type: String,
//     required: true,
//   },
//   desc: {
//     type: String,
//   },
//   scopes: [DiscoveredScopeSchema], // Array of discovered scopes
//   isProcessed: {
//     type: Boolean,
//     default: false, // Indicates if this discovered asset has been added to the main Asset model
//   },
// });

// const DiscoveredAsset = mongoose.model(
//   'DiscoveredAsset',
//   DiscoveredAssetSchema
// );

// export default DiscoveredAsset;
