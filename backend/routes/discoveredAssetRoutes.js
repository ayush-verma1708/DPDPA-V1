import express from 'express';
import {
  createDiscoveredAsset,
  getDiscoveredAssets,
} from '../controllers/discoveredAssetController.js';
import { processDiscoveredAsset } from '../handlers/discoveredAssetHandler.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DiscoveredAssets
 *   description: Discovered Asset management
 */

/**
 * @swagger
 * /api/v1/discovered-assets:
 *   post:
 *     tags: [DiscoveredAssets]
 *     summary: Create a new discovered asset
 *     description: Creates a new discovered asset entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetName:
 *                 type: string
 *                 description: The name of the discovered asset
 *               assetType:
 *                 type: string
 *                 description: The type of the discovered asset
 *               assetDetails:
 *                 type: string
 *                 description: Detailed description of the asset
 *     responses:
 *       201:
 *         description: Discovered asset created successfully
 *       400:
 *         description: Bad request, validation failed
 */
router.post('/discovered-assets', createDiscoveredAsset);

/**
 * @swagger
 * /api/v1/discovered-assets/process:
 *   post:
 *     tags: [DiscoveredAssets]
 *     summary: Process a discovered asset
 *     description: Processes a discovered asset and performs necessary actions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetId:
 *                 type: string
 *                 description: The ID of the discovered asset to process
 *     responses:
 *       200:
 *         description: Asset processed successfully
 *       400:
 *         description: Bad request, validation failed
 */
router.post('/discovered-assets/process', processDiscoveredAsset);

/**
 * @swagger
 * /api/v1/discovered-assets:
 *   get:
 *     tags: [DiscoveredAssets]
 *     summary: Get all discovered assets
 *     description: Retrieves a list of all discovered assets.
 *     responses:
 *       200:
 *         description: A list of discovered assets
 *       500:
 *         description: Internal server error
 */
router.get('/discovered-assets', getDiscoveredAssets);

export default router;

// import express from 'express';
// import {
//   createDiscoveredAsset,
//   getDiscoveredAssets,
// } from '../controllers/discoveredAssetController.js';
// import { processDiscoveredAsset } from '../handlers/discoveredAssetHandler.js';

// const router = express.Router();

// // Route to create a discovered asset
// router.post('/discovered-assets', createDiscoveredAsset);

// // Process a discovered asset
// router.post('/discovered-assets/process', processDiscoveredAsset);

// // Route to get all discovered assets
// router.get('/discovered-assets', getDiscoveredAssets);

// export default router;
