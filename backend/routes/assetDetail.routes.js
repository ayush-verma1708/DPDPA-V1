// routes/assetDetails.js
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

assetDetailRouter.route('/').get(getAssetDetails);
assetDetailRouter.route('/add').post(addAssetDetails);
assetDetailRouter.route('/:id').put(updateAssetDetails);
assetDetailRouter.route('/:id').delete(deleteAssetDetails);
assetDetailRouter.route('/assets/').get(getAssetsInAssetDetails);
assetDetailRouter.route('/scoped/:asset').get(getScopedInSAssetdDetails);
assetDetailRouter.route('/:assetId').get(getAssetDetailsByAssetId);
assetDetailRouter.route('/assetDetails/:id').get(getAssetDetailsById);
assetDetailRouter.route('/scope/:id').get(getScopeNameById);

export default assetDetailRouter;

// import { Router } from 'express';
// import {getAssetDetailsByAssetId , addAssetDetails, deleteAssetDetails, getAssetDetails, getAssetsInAssetDetails, getScopedInSAssetdDetails, updateAssetDetails } from '../controllers/assetDetails.controller.js';

// const assetDetailRouter = Router();

// assetDetailRouter.route("/").get(getAssetDetails);
// assetDetailRouter.route("/add").post(addAssetDetails);
// assetDetailRouter.route('/:id').put(updateAssetDetails);
// assetDetailRouter.route("/:id").delete(deleteAssetDetails);
// assetDetailRouter.route("/assets/").get(getAssetsInAssetDetails);
// assetDetailRouter.route("/scoped/:asset").get(getScopedInSAssetdDetails);
// assetDetailRouter.route('/assetDetails/:assetId', getAssetDetailsByAssetId);

// export default assetDetailRouter;

// // import { Router } from 'express';
// // import {
// //   getAssetDetails,
// //   addAssetDetails,
// //   // getScopesByAsset,
// //   updateAssetDetails,
// //   deleteAssetDetails,
// //   getScopedInAsset
// // } from '../controllers/assetDetails.controller.js';

// // const assetDetailRouter = Router();

// // assetDetailRouter.route("/").get(getAssetDetails).post(addAssetDetails);
// // assetDetailRouter.route("/:id").put(updateAssetDetails).delete(deleteAssetDetails);
// // assetDetailRouter.route("/scoped/:assetId").get(getScopedInAsset);
// // // assetDetailRouter.route("/scopes/:assetId").get(getScopesByAsset);

// // export default assetDetailRouter;

// // // import { Router } from 'express';
// // // import { addAssetDetails, deleteAssetDetails, getAssetDetails, updateAssetDetails } from '../controllers/assetDetails.controller.js';

// // // const assetDetailRouter = Router();

// // // assetDetailRouter.route("/").get(getAssetDetails);
// // // assetDetailRouter.route("/add").post(addAssetDetails);
// // // assetDetailRouter.route('/:id').put(updateAssetDetails);
// // // assetDetailRouter.route("/:id").delete(deleteAssetDetails);

// // // export default assetDetailRouter;
