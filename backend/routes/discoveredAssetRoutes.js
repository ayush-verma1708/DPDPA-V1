import express from 'express';
import {
  createDiscoveredAsset,
  getDiscoveredAssets,
} from '../controllers/discoveredAssetController.js';

const router = express.Router();

// Route to create a discovered asset
router.post('/discovered-assets', createDiscoveredAsset);

// Route to get all discovered assets
router.get('/discovered-assets', getDiscoveredAssets);

export default router;
