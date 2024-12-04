import DiscoveredAsset from '../models/discoveredAsset.model.js';
import Asset from '../models/asset.model.js';
import { Scoped } from '../models/scoped.model.js';
import { AsyncHandler } from '../utils/asyncHandler.js';

// Handler for processing discovered assets
const processDiscoveredAsset = AsyncHandler(async (req, res) => {
  const { assetId, scopeId } = req.body; // Get assetId and scopeId from request body

  try {
    // Find the discovered asset
    const discoveredAsset = await DiscoveredAsset.findById(assetId);
    if (!discoveredAsset) {
      return res.status(404).json({ message: 'Discovered asset not found' });
    }

    // Check if the asset is already processed
    if (discoveredAsset.isProcessed) {
      return res
        .status(400)
        .json({ message: 'This asset has already been processed' });
    }

    // Find the discovered scope
    const discoveredScope = discoveredAsset.scopes.id(scopeId);
    if (!discoveredScope) {
      return res.status(404).json({ message: 'Discovered scope not found' });
    }

    // Check if an asset with the same name already exists
    let existingAsset = await Asset.findOne({ name: discoveredAsset.name });
    let newAsset;
    if (!existingAsset) {
      // Create a new Asset instance if it doesn't exist
      newAsset = new Asset({
        name: discoveredAsset.name,
        type: discoveredAsset.type,
        desc: discoveredAsset.desc,
        isScoped: !!scopeId, // Set isScoped based on whether scopeId is provided
      });
      await newAsset.save();
    } else {
      newAsset = existingAsset;
    }

    // Check if the scope already exists
    let existingScope = await Scoped.findOne({
      name: discoveredScope.name,
      asset: newAsset._id,
    });
    let newScope;
    if (!existingScope) {
      // Create a new Scope instance if it doesn't exist
      newScope = new Scoped({
        name: discoveredScope.name,
        desc: discoveredScope.desc,
        asset: newAsset._id, // Associate this scope with the asset
      });
      await newScope.save();
    } else {
      newScope = existingScope;
    }

    // Update the discovered asset and scope to mark them as processed
    discoveredAsset.isProcessed = true;
    discoveredAsset.processedAt = new Date();

    // Update the discovered scope to mark it as processed
    discoveredScope.isProcessed = true;

    // Save the updated discovered asset and scope
    await discoveredAsset.save();

    // Send a success response
    res.status(200).json({
      message:
        'Discovered asset and scope have been successfully processed and transferred',
      asset: newAsset,
      scope: newScope,
    });
  } catch (error) {
    console.error('Error processing discovered asset:', error);
    res
      .status(500)
      .json({ message: 'Server error: Unable to process discovered asset' });
  }
});

export { processDiscoveredAsset };
