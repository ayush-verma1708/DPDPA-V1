import Asset from '../models/asset.model.js';
import { Scoped } from '../models/scoped.model.js';
import { AsyncHandler } from '../utils/asyncHandler.js';

import DiscoveredAsset from '../models/discoveredAsset.model.js';

const createDiscoveredAsset = AsyncHandler(async (req, res) => {
  const { name, type, desc, scopeName, scopeDesc } = req.body;

  try {
    // Check if the discovered asset already exists
    let discoveredAsset = await DiscoveredAsset.findOne({ name });
    if (!discoveredAsset) {
      discoveredAsset = new DiscoveredAsset({
        name,
        type,
        desc,
        scopes: scopeName ? [{ name: scopeName, desc: scopeDesc }] : [],
      });
      await discoveredAsset.save();
    } else if (scopeName) {
      // Add new scope to the discovered asset if it doesn't exist
      const scopeExists = discoveredAsset.scopes.some(
        (scope) => scope.name === scopeName
      );
      if (!scopeExists) {
        discoveredAsset.scopes.push({ name: scopeName, desc: scopeDesc });
        await discoveredAsset.save();
      }
    }

    res.status(201).json({
      message: 'Discovered asset created successfully.',
      discoveredAsset,
    });
  } catch (error) {
    console.error('Error creating discovered asset:', error);
    res
      .status(500)
      .json({ message: 'Server error: Unable to create discovered asset.' });
  }
});

// const createDiscoveredAsset = AsyncHandler(async (req, res) => {
//   const { name, type, desc, scopeName, scopeDesc } = req.body;

//   try {
//     // Check if the asset already exists
//     let asset = await Asset.findOne({ name, type, desc });
//     if (!asset) {
//       asset = new Asset({
//         name,
//         type,
//         desc,
//         isScoped: true, // Assuming discovered assets are scoped
//       });
//       await asset.save();
//     }

//     // Check if the scope already exists for the given asset
//     let scoped = await Scoped.findOne({ name: scopeName, asset: asset._id });
//     if (!scoped) {
//       scoped = new Scoped({
//         name: scopeName,
//         desc: scopeDesc,
//         asset: asset._id,
//       });
//       await scoped.save();
//     }

//     // Response with asset and scope details
//     res.status(201).json({
//       message: 'Discovered asset and scope created/verified successfully.',
//       asset,
//       scoped,
//     });
//   } catch (error) {
//     console.error('Error creating discovered asset:', error);
//     res
//       .status(500)
//       .json({ message: 'Server error: Unable to create discovered asset' });
//   }
// });
// Controller to create a discovered asset
// const createDiscoveredAsset = AsyncHandler(async (req, res) => {
//   const { name, type, desc, scopeName, scopeDesc } = req.body;

//   try {
//     // Check if the asset already exists
//     let asset = await Asset.findOne({ name, type, desc });
//     if (!asset) {
//       asset = new Asset({
//         name,
//         type,
//         desc,
//         isScoped: !!scopeName, // Set isScoped based on whether a scope is provided
//       });
//       await asset.save();
//     }

//     let scoped = null;

//     // Only create or verify a scope if scopeName is provided
//     if (scopeName) {
//       // Check if the scope already exists for the given asset
//       scoped = await Scoped.findOne({ name: scopeName, asset: asset._id });
//       if (!scoped) {
//         scoped = new Scoped({
//           name: scopeName,
//           desc: scopeDesc,
//           asset: asset._id,
//         });
//         await scoped.save();
//       }
//     }

//     // Response with asset and scope details
//     res.status(201).json({
//       message: 'Discovered asset created/verified successfully.',
//       asset,
//       ...(scoped && { scoped }), // Include scope details only if it exists
//     });
//   } catch (error) {
//     console.error('Error creating discovered asset:', error);
//     res
//       .status(500)
//       .json({ message: 'Server error: Unable to create discovered asset' });
//   }
// });

// Controller to get all discovered assets
// const getDiscoveredAssets = AsyncHandler(async (req, res) => {
//   try {
//     const assets = await Asset.find()
//       .populate({ path: 'scoped', select: 'name desc', strictPopulate: false }) // Populate the related scope details
//       .sort({ createdAt: -1 }); // Sort by the most recently created assets

//     res.status(200).json(assets);
//   } catch (error) {
//     console.error('Error fetching discovered assets:', error);
//     res
//       .status(500)
//       .json({ message: 'Server error: Unable to fetch discovered assets' });
//   }
// });

const getDiscoveredAssets = AsyncHandler(async (req, res) => {
  try {
    // Fetch all discovered assets, populating the related scopes
    const discoveredAssets = await DiscoveredAsset.find()
      .populate({ path: 'scoped', select: 'name desc', strictPopulate: false }) // Populate related discovered scopes
      .sort({ createdAt: -1 }); // Sort by most recently created

    res.status(200).json({
      message: 'Discovered assets fetched successfully.',
      discoveredAssets,
    });
  } catch (error) {
    console.error('Error fetching discovered assets:', error);
    res.status(500).json({
      message: 'Server error: Unable to fetch discovered assets',
    });
  }
});

export { createDiscoveredAsset, getDiscoveredAssets };
