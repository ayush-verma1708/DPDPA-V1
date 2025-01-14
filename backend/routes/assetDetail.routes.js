import { Router } from 'express';
import {
  getAssetDetailsByAssetId,
  addAssetDetails,
  deleteAssetDetails,
  getAssetDetails,
  getAssetsInAssetDetails,
  getScopedInSAssetdDetails,
  updateAssetDetails,
  getAssetDetailsById,
  getScopeNameById,
} from '../controllers/assetDetails.controller.js';

const assetDetailRouter = Router();

/**
 * @swagger
 * tags:
 *   name: AssetDetails
 *   description: API for managing asset details
 */

/**
 * @swagger
 * /api/v1/assetDetails:
 *   get:
 *     tags: [AssetDetails]
 *     summary: Get all asset details
 *     description: Retrieve a list of all asset details.
 *     responses:
 *       200:
 *         description: List of asset details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AssetDetail'
 */
assetDetailRouter.route('/').get(getAssetDetails);

/**
 * @swagger
 * /api/v1/assetDetails/add:
 *   post:
 *     tags: [AssetDetails]
 *     summary: Add new asset details
 *     description: Create new asset details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssetDetail'
 *     responses:
 *       201:
 *         description: Asset details added successfully
 *       400:
 *         description: Invalid input
 */
assetDetailRouter.route('/add').post(addAssetDetails);

/**
 * @swagger
 * /api/v1/assetDetails/{id}:
 *   put:
 *     tags: [AssetDetails]
 *     summary: Update asset details by ID
 *     description: Modify asset details for a specific ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the asset details to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssetDetail'
 *     responses:
 *       200:
 *         description: Asset details updated successfully
 *       404:
 *         description: Asset details not found
 */
assetDetailRouter.route('/:id').put(updateAssetDetails);

/**
 * @swagger
 * /api/v1/assetDetails/{id}:
 *   delete:
 *     tags: [AssetDetails]
 *     summary: Delete asset details by ID
 *     description: Remove asset details for a specific ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the asset details to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset details deleted successfully
 *       404:
 *         description: Asset details not found
 */
assetDetailRouter.route('/:id').delete(deleteAssetDetails);

/**
 * @swagger
 * /api/v1/assetDetails/assets:
 *   get:
 *     tags: [AssetDetails]
 *     summary: Get assets in asset details
 *     description: Retrieve assets related to asset details.
 *     responses:
 *       200:
 *         description: Assets retrieved successfully
 *       404:
 *         description: No assets found
 */
assetDetailRouter.route('/assets/').get(getAssetsInAssetDetails);

/**
 * @swagger
 * /api/v1/assetDetails/scoped/{asset}:
 *   get:
 *     tags: [AssetDetails]
 *     summary: Get scoped data for a specific asset
 *     description: Retrieve scoped data for a given asset in asset details.
 *     parameters:
 *       - name: asset
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
assetDetailRouter.route('/scoped/:asset').get(getScopedInSAssetdDetails);

/**
 * @swagger
 * /api/v1/assetDetails/{assetId}:
 *   get:
 *     tags: [AssetDetails]
 *     summary: Get asset details by asset ID
 *     description: Retrieve detailed information for a specific asset ID.
 *     parameters:
 *       - name: assetId
 *         in: path
 *         description: The ID of the asset to retrieve details for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset details retrieved successfully
 *       404:
 *         description: Asset details not found
 */
assetDetailRouter.route('/:assetId').get(getAssetDetailsByAssetId);

/**
 * @swagger
 * /api/v1/assetDetails/assetDetails/{id}:
 *   get:
 *     tags: [AssetDetails]
 *     summary: Get asset details by detail ID
 *     description: Retrieve asset details for a specific detail ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the asset detail to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset detail retrieved successfully
 *       404:
 *         description: Asset detail not found
 */
assetDetailRouter.route('/assetDetails/:id').get(getAssetDetailsById);

/**
 * @swagger
 * /api/v1/assetDetails/scope/{id}:
 *   get:
 *     tags: [AssetDetails]
 *     summary: Get scope name by ID
 *     description: Retrieve the scope name for a specific ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the scope to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scope name retrieved successfully
 *       404:
 *         description: Scope not found
 */
assetDetailRouter.route('/scope/:id').get(getScopeNameById);

export default assetDetailRouter;

// // routes/assetDetails.js
// import { Router } from 'express';
// import {
//   getAssetDetailsByAssetId,
//   addAssetDetails,
//   deleteAssetDetails,
//   getAssetDetails,
//   getAssetsInAssetDetails,
//   getScopedInSAssetdDetails,
//   updateAssetDetails,
//   getAssetDetailsById,
//   getScopeNameById,
// } from '../controllers/assetDetails.controller.js';

// const assetDetailRouter = Router();

// assetDetailRouter.route('/').get(getAssetDetails);
// assetDetailRouter.route('/add').post(addAssetDetails);
// assetDetailRouter.route('/:id').put(updateAssetDetails);
// assetDetailRouter.route('/:id').delete(deleteAssetDetails);
// assetDetailRouter.route('/assets/').get(getAssetsInAssetDetails);
// assetDetailRouter.route('/scoped/:asset').get(getScopedInSAssetdDetails);
// assetDetailRouter.route('/:assetId').get(getAssetDetailsByAssetId);
// assetDetailRouter.route('/assetDetails/:id').get(getAssetDetailsById);
// assetDetailRouter.route('/scope/:id').get(getScopeNameById);

// export default assetDetailRouter;

// // import { Router } from 'express';
// // import {getAssetDetailsByAssetId , addAssetDetails, deleteAssetDetails, getAssetDetails, getAssetsInAssetDetails, getScopedInSAssetdDetails, updateAssetDetails } from '../controllers/assetDetails.controller.js';

// // const assetDetailRouter = Router();

// // assetDetailRouter.route("/").get(getAssetDetails);
// // assetDetailRouter.route("/add").post(addAssetDetails);
// // assetDetailRouter.route('/:id').put(updateAssetDetails);
// // assetDetailRouter.route("/:id").delete(deleteAssetDetails);
// // assetDetailRouter.route("/assets/").get(getAssetsInAssetDetails);
// // assetDetailRouter.route("/scoped/:asset").get(getScopedInSAssetdDetails);
// // assetDetailRouter.route('/assetDetails/:assetId', getAssetDetailsByAssetId);

// // export default assetDetailRouter;

// // // import { Router } from 'express';
// // // import {
// // //   getAssetDetails,
// // //   addAssetDetails,
// // //   // getScopesByAsset,
// // //   updateAssetDetails,
// // //   deleteAssetDetails,
// // //   getScopedInAsset
// // // } from '../controllers/assetDetails.controller.js';

// // // const assetDetailRouter = Router();

// // // assetDetailRouter.route("/").get(getAssetDetails).post(addAssetDetails);
// // // assetDetailRouter.route("/:id").put(updateAssetDetails).delete(deleteAssetDetails);
// // // assetDetailRouter.route("/scoped/:assetId").get(getScopedInAsset);
// // // // assetDetailRouter.route("/scopes/:assetId").get(getScopesByAsset);

// // // export default assetDetailRouter;

// // // // import { Router } from 'express';
// // // // import { addAssetDetails, deleteAssetDetails, getAssetDetails, updateAssetDetails } from '../controllers/assetDetails.controller.js';

// // // // const assetDetailRouter = Router();

// // // // assetDetailRouter.route("/").get(getAssetDetails);
// // // // assetDetailRouter.route("/add").post(addAssetDetails);
// // // // assetDetailRouter.route('/:id').put(updateAssetDetails);
// // // // assetDetailRouter.route("/:id").delete(deleteAssetDetails);

// // // // export default assetDetailRouter;
