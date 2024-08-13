import { Router } from 'express';
import { createAsset, getAssets, getAssetById, updateAsset, deleteAsset, getScopedByAsset } from '../controllers/asset.controller.js';

const assetRouter = Router();

assetRouter.route("/add-asset").post(createAsset);
assetRouter.route("/").get(getAssets);
assetRouter.route("/:assetId/scoped").get(getScopedByAsset);
assetRouter.route("/asset-details/:id").get(getAssetById);
assetRouter.route("/asset-update/:id").put(updateAsset);
assetRouter.route("/asset-delete/:id").delete(deleteAsset);

export default assetRouter;

// import express from 'express';
// import {
//   getAssets,
//   getAssetById,
//   addAsset,
//   updateAsset,
//   deleteAsset
// } from '../controllers/asset.controller.js';

// const router = express.Router();

// router.get('/', getAssets);
// router.get('/:id', getAssetById);
// router.post('/', addAsset);
// router.put('/:id', updateAsset);
// router.delete('/:id', deleteAsset);

// export default router;

// // import { Router } from 'express';
// // import { createAsset, getAssets, getAssetById, updateAsset, deleteAsset, getScopedByAsset } from '../controllers/asset.controller.js';

// // const assetRouter = Router();

// // assetRouter.route("/add-asset").post(createAsset);
// // assetRouter.route("/").get(getAssets);
// // assetRouter.route("/:assetId/scoped").get(getScopedByAsset);
// // assetRouter.route("/asset-details/:id").get(getAssetById);
// // assetRouter.route("/asset-update/:id").put(updateAsset);
// // assetRouter.route("/asset-delete/:id").delete(deleteAsset);

// // export default assetRouter;
