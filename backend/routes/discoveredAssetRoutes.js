import express from 'express';
import {
  createDiscoveredAsset,
  getDiscoveredAssets,
} from '../controllers/discoveredAssetController.js';
import { processDiscoveredAsset } from '../handlers/discoveredAssetHandler.js';

const router = express.Router();

// Route to create a discovered asset
router.post('/discovered-assets', createDiscoveredAsset);

// Process a discovered asset
router.post('/discovered-assets/process', processDiscoveredAsset);

// Route to get all discovered assets
router.get('/discovered-assets', getDiscoveredAssets);

export default router;
