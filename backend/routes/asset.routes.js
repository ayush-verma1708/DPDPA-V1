import { Router } from 'express';
import {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  getScopedByAsset,
} from '../controllers/asset.controller.js';

const assetRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Assets
 *   description: API for managing assets
 */

/**
 * @swagger
 * /api/v1/assets:
 *   get:
 *     tags: [Assets]
 *     summary: Get all assets
 *     description: Retrieve a list of all assets.
 *     responses:
 *       200:
 *         description: List of assets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asset'
 */
assetRouter.route('/').get(getAssets);

/**
 * @swagger
 * /api/v1/assets/add-asset:
 *   post:
 *     tags: [Assets]
 *     summary: Create a new asset
 *     description: Add a new asset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asset'
 *     responses:
 *       201:
 *         description: Asset created successfully
 *       400:
 *         description: Invalid input
 */
assetRouter.route('/add-asset').post(createAsset);

/**
 * @swagger
 * /api/v1/assets/{assetId}/scoped:
 *   get:
 *     tags: [Assets]
 *     summary: Get scoped data by asset ID
 *     description: Retrieve scoped data for a specific asset.
 *     parameters:
 *       - name: assetId
 *         in: path
 *         description: The ID of the asset to retrieve scoped data for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scoped data retrieved successfully
 *       404:
 *         description: Asset not found
 */
assetRouter.route('/:assetId/scoped').get(getScopedByAsset);

/**
 * @swagger
 * /api/v1/assets/asset-details/{id}:
 *   get:
 *     tags: [Assets]
 *     summary: Get asset details by ID
 *     description: Retrieve detailed information for a specific asset.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the asset to retrieve details for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset details retrieved successfully
 *       404:
 *         description: Asset not found
 */
assetRouter.route('/asset-details/:id').get(getAssetById);

/**
 * @swagger
 * /api/v1/assets/asset-update/{id}:
 *   put:
 *     tags: [Assets]
 *     summary: Update an asset by ID
 *     description: Modify an existing asset by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the asset to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asset'
 *     responses:
 *       200:
 *         description: Asset updated successfully
 *       404:
 *         description: Asset not found
 */
assetRouter.route('/asset-update/:id').put(updateAsset);

/**
 * @swagger
 * /api/v1/assets/asset-delete/{id}:
 *   delete:
 *     tags: [Assets]
 *     summary: Delete an asset by ID
 *     description: Remove an asset by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the asset to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset deleted successfully
 *       404:
 *         description: Asset not found
 */
assetRouter.route('/asset-delete/:id').delete(deleteAsset);

export default assetRouter;

// import { Router } from 'express';
// import {
//   createAsset,
//   getAssets,
//   getAssetById,
//   updateAsset,
//   deleteAsset,
//   getScopedByAsset,
// } from '../controllers/asset.controller.js';

// const assetRouter = Router();

// assetRouter.route('/add-asset').post(createAsset);
// assetRouter.route('/').get(getAssets);
// assetRouter.route('/:assetId/scoped').get(getScopedByAsset);
// assetRouter.route('/asset-details/:id').get(getAssetById);
// assetRouter.route('/asset-update/:id').put(updateAsset);
// assetRouter.route('/asset-delete/:id').delete(deleteAsset);

// export default assetRouter;
