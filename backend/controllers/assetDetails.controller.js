import { Asset } from "../models/asset.model.js";
import { AssetDetails } from "../models/assetDetails.model.js";
import { Scoped } from "../models/scoped.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";

// const getAssetDetails = AsyncHandler(async (req, res) => {
//   try {
//     const assetDetails = await AssetDetails.find({})
//       .populate('asset', 'name isScoped') // Populate the asset field with its name and isScoped
//       .populate('scoped', 'name') // Populate the scoped field with its name


//     if (!Array.isArray(assetDetails)) {
//       console.error('Expected array from database query, got:', assetDetails);
//       res.status(500).json({ message: 'Unexpected response from database' });
//       return;
//     }
//     const modifiedAssetDetails = assetDetails.map(detail => {
//       if (!detail.asset.isScoped) {
//         return {
//           ...detail.toObject(),
//           scoped: { name: 'non-scoped' },
//           coverages: 0,
//         };
//       }
//       return detail;
//     });

//     res.json(modifiedAssetDetails);
//   } catch (error) {
//     res.status(500);
//     throw new Error('Server Error: Unable to fetch asset details');
//   }
// });

const getAssetDetails = AsyncHandler(async (req, res) => {
  try {
    const assetDetails = await AssetDetails.find({})
      .populate('asset', 'name isScoped') // Populate the asset field with its name and isScoped
      .populate('scoped', 'name'); // Populate the scoped field with its name

    if (!Array.isArray(assetDetails)) {
      console.error('Expected array from database query, got:', assetDetails);
      res.status(500).json({ message: 'Unexpected response from database' });
      return;
    }

    const modifiedAssetDetails = assetDetails.map(detail => {
      if (!detail.asset.isScoped) {
        return {
          ...detail.toObject(),
          scoped: { name: 'non-scoped' },
          coverages: 0,
        };
      }
      return detail;
    });

    res.json(modifiedAssetDetails);
  } catch (error) {
    console.error('Error fetching asset details:', error); // Log the full error
    res.status(500).json({ message: 'Server Error: Unable to fetch asset details' });
  }
});


// const addAssetDetails = AsyncHandler(async (req, res) => {
//   const {
//     asset,
//     scoped,
//     criticality,
//     businessOwnerName,
//     businessOwnerEmail,
//     itOwnerName,
//     itOwnerEmail,
//     coverages,
//   } = req.body;
  
//   // Fetch the Asset to check if it is scoped
//   const assets = await Asset.findById(asset);

//   if (!assets) {
//     res.status(404);
//     throw new Error('Asset not found');
//   }

//   let finalScopedId = scoped;
//   let finalCoverages = coverages;

//   if (!assets.isScoped) {
//     // If the asset is not scoped, set scoped to 'non-scoped' and coverages to 0
//     const nonScoped = await Scoped.findOne({ name: 'non-scoped' });

//     if (!nonScoped) {
//       // If 'non-scoped' does not exist, create it
//       const newNonScoped = new Scoped({ name: 'non-scoped' });
//       await newNonScoped.save();
//       finalScopedId = newNonScoped._id;
//     } else {
//       finalScopedId = nonScoped._id;
//     }

//     finalCoverages = 0;
//   }

//   const assetDetails = new AssetDetails({
//     asset: assets,
//     scoped: finalScopedId,
//     criticality,
//     businessOwnerName,
//     businessOwnerEmail,
//     itOwnerName,
//     itOwnerEmail,
//     coverages: finalCoverages,
//   });

//   const createdAssetDetails = await assetDetails.save();
//   res.status(201).json(createdAssetDetails);
// });

const updateAssetDetails = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { asset, scoped, criticality, businessOwnerName, businessOwnerEmail, itOwnerName, itOwnerEmail, coverages } = req.body;

  try {
    const assetDetail = await AssetDetails.findById(id);

    if (!assetDetail) {
      res.status(404);
      throw new Error('Asset Detail not found');
    }

    assetDetail.asset = asset || assetDetail.asset;
    assetDetail.scoped = scoped || assetDetail.scoped;
    assetDetail.criticality = criticality || assetDetail.criticality;
    assetDetail.businessOwnerName = businessOwnerName || assetDetail.businessOwnerName;
    assetDetail.businessOwnerEmail = businessOwnerEmail || assetDetail.businessOwnerEmail;
    assetDetail.itOwnerName = itOwnerName || assetDetail.itOwnerName;
    assetDetail.itOwnerEmail = itOwnerEmail || assetDetail.itOwnerEmail;
    assetDetail.coverages = coverages || assetDetail.coverages;

    const updatedAssetDetail = await assetDetail.save();

    res.json(updatedAssetDetail);
  } catch (error) {
    res.status(500);
    throw new Error('Error updating asset details');
  }
});

const deleteAssetDetails = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  
  
  try {
    const assetDetail = await AssetDetails.findByIdAndDelete(id);

    if (!assetDetail) {
      res.status(404);
      throw new Error('Asset Detail not found');
    }


    res.json({ message: 'Asset Detail removed' });
  } catch (error) {
    res.status(500);
    throw new Error('Error deleting asset details');
  }
});

const getAssetsInAssetDetails = AsyncHandler(async (req, res) => {
  const assetDetails = await AssetDetails.find().populate('asset', 'name isScoped').populate('scoped','name');
  res.status(200).json(assetDetails);
});

const getScopedInSAssetdDetails = AsyncHandler(async (req, res) => {
  const { asset } = req.params;
  
  const assetDetails = await AssetDetails.find({ asset: asset }).populate('scoped', 'name');
  

  res.status(200).json(assetDetails);
});


const addAssetDetails = AsyncHandler(async (req, res) => {
  const {
    asset,
    scoped,
    criticality,
    businessOwnerName,
    businessOwnerEmail,
    itOwnerName,
    itOwnerEmail,
    coverages,
  } = req.body;

  // Fetch the Asset to check if it is scoped
  const assets = await Asset.findById(asset);

  if (!assets) {
    res.status(404).json({ message: 'Asset not found' });
    return;
  }

  let finalScopedId = scoped;
  let finalCoverages = coverages;

  if (!assets.isScoped) {
    // If the asset is not scoped, set scoped to 'non-scoped' and coverages to 0
    const nonScoped = await Scoped.findOne({ name: 'non-scoped' });

    if (!nonScoped) {
      // If 'non-scoped' does not exist, create it
      const newNonScoped = new Scoped({ name: 'non-scoped' });
      await newNonScoped.save();
      finalScopedId = newNonScoped._id;
    } else {
      finalScopedId = nonScoped._id;
    }

    finalCoverages = 0;
  }

  const assetDetails = new AssetDetails({
    asset: assets._id,
    scoped: finalScopedId,
    criticality,
    businessOwnerName,
    businessOwnerEmail,
    itOwnerName,
    itOwnerEmail,
    coverages: finalCoverages,
  });

  const createdAssetDetails = await assetDetails.save();
  res.status(201).json(createdAssetDetails);
});

// Controller to get Asset Details by Asset ID
 const getAssetDetailsByAssetId = async (req, res) => {
  try {
    const { assetId } = req.params;

    // Find the asset details by asset ID
    const assetDetails = await AssetDetails.findOne({ asset: assetId })
      .populate('asset')    // Populate asset details
      .populate('scoped');  // Populate scope details if available

    if (!assetDetails) {
      return res.status(404).json({ message: 'Asset details not found' });
    }

    // Return the asset details
    res.status(200).json(assetDetails);
  } catch (error) {
    console.error('Error fetching asset details:', error);
    res.status(500).json({ message: 'Server error' });
  }};

export { getAssetDetails, addAssetDetails, deleteAssetDetails, updateAssetDetails, getAssetsInAssetDetails, getScopedInSAssetdDetails , getAssetDetailsByAssetId };





// import { Asset } from "../models/asset.model.js";
// import { AssetDetails } from "../models/assetDetails.model.js";
// import { Scoped } from "../models/scoped.model.js";
// import AsyncHandler from 'express-async-handler';

// // Get all AssetDetails with populated fields
// const getAssetDetails = AsyncHandler(async (req, res) => {
//   const assetDetails = await AssetDetails.find({})
//     .populate('asset', 'name isScoped')
//     .populate('scoped', 'name');

//   if (!Array.isArray(assetDetails)) {
//     console.error('Expected array from database query, got:', assetDetails);
//     res.status(500).json({ message: 'Unexpected response from database' });
//     return;
//   }

//   const modifiedAssetDetails = assetDetails.map(detail => {
//     if (!detail.asset.isScoped) {
//       return {
//         ...detail.toObject(),
//         scoped: { name: 'non-scoped' },
//         coverages: 0,
//       };
//     }
//     return detail;
//   });

//   res.json(modifiedAssetDetails);
// });

// Add new AssetDetails


 
// // Update AssetDetails by ID
// const updateAssetDetails = AsyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { asset, scoped, criticality, businessOwnerName, businessOwnerEmail, itOwnerName, itOwnerEmail, coverages } = req.body;

//   const assetDetail = await AssetDetails.findById(id);

//   if (!assetDetail) {
//     res.status(404).json({ message: 'Asset Detail not found' });
//     return;
//   }

//   assetDetail.asset = asset || assetDetail.asset;
//   assetDetail.scoped = scoped || assetDetail.scoped;
//   assetDetail.criticality = criticality || assetDetail.criticality;
//   assetDetail.businessOwnerName = businessOwnerName || assetDetail.businessOwnerName;
//   assetDetail.businessOwnerEmail = businessOwnerEmail || assetDetail.businessOwnerEmail;
//   assetDetail.itOwnerName = itOwnerName || assetDetail.itOwnerName;
//   assetDetail.itOwnerEmail = itOwnerEmail || assetDetail.itOwnerEmail;
//   assetDetail.coverages = coverages || assetDetail.coverages;

//   const updatedAssetDetail = await assetDetail.save();

//   res.json(updatedAssetDetail);
// });

// // Delete AssetDetails by ID
// const deleteAssetDetails = AsyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const assetDetail = await AssetDetails.findByIdAndDelete(id);

//   if (!assetDetail) {
//     res.status(404).json({ message: 'Asset Detail not found' });
//     return;
//   }

//   res.json({ message: 'Asset Detail removed' });
// });


// const getScopesByAsset = AsyncHandler(async (req, res) => {
//   const { assetId } = req.params;
//   console.log(`Fetching scopes for asset ID: ${assetId}`);

//   try {
//     const assetDetails = await AssetDetails.find({ 'asset._id': assetId }).select('scoped');

//     if (!assetDetails || assetDetails.length === 0) {
//       console.log(`No scopes found for asset ID: ${assetId}`);
//       return res.status(404).json({ message: 'No scopes found for the provided asset ID' });
//     }

//     const scopes = assetDetails.map(detail => detail.scoped);
//     console.log(`Found scopes: ${JSON.stringify(scopes)}`);
//     res.json(scopes);
//   } catch (error) {
//     console.error(`Error fetching scopes for asset ID: ${assetId}`, error);
//     res.status(500).json({ message: 'Server error while fetching scopes' });
//   }
// });

// // Get Scoped Details by Asset ID
// const getScopedInAsset = AsyncHandler(async (req, res) => {
//   const { assetId } = req.params;
//   const assetDetail = await AssetDetails.find({ asset: assetId })
//     .populate('scoped', 'name');

//   if (!assetDetail) {
//     res.status(404).json({ message: 'Scoped Details not found for this asset' });
//     return;
//   }

//   res.json(assetDetail);
// });




// export { getAssetDetails, getScopedInAsset, addAssetDetails, deleteAssetDetails, updateAssetDetails };





// // Fetch scopes associated with a particular asset
// // const getScopesByAsset = AsyncHandler(async (req, res) => {
// //   const { assetId } = req.params;
// //   const assetDetails = await AssetDetails.find({ 'asset._id': assetId }).populate('scoped', 'name');
  
// //   const scopes = assetDetails.map(detail => detail.scoped);
// //   res.json(scopes);
// // });

// // Fetch scopes associated with a particular asset
// // const getScopesByAsset = AsyncHandler(async (req, res) => {
// //   const { assetId } = req.params;
// //   const assetDetails = await AssetDetails.find({ 'asset._id': assetId }).select('scoped -_id');
  
// //   const scopes = assetDetails.map(detail => detail.scoped);
// //   res.json(scopes);
// // });

// // Fetch scopes associated with a particular asset
// // const getScopesByAsset = AsyncHandler(async (req, res) => {
// //   const { assetId } = req.params;
// //   console.log(`Fetching scopes for asset ID: ${assetId}`);

// //   try {
// //     const assetDetails = await AssetDetails.find({ 'asset._id': assetId }).select('scoped -_id');
    
// //     if (!assetDetails || assetDetails.length === 0) {
// //       return res.status(404).json({ message: 'No scopes found for the provided asset ID' });
// //     }

// //     const scopes = assetDetails.map(detail => detail.scoped);
// //     console.log(`Found scopes: ${JSON.stringify(scopes)}`);
// //     res.json(scopes);
// //   } catch (error) {
// //     console.error(`Error fetching scopes for asset ID: ${assetId}`, error);
// //     res.status(500).json({ message: 'Server error while fetching scopes' });
// //   }
// // });



// // import { Asset } from "../models/asset.model.js";
// // import { AssetDetails } from "../models/assetDetails.model.js";
// // import { Scoped } from "../models/scoped.model.js";
// // import { AsyncHandler } from "../utils/asyncHandler.js";

// // const getAssetDetails = AsyncHandler(async (req, res) => {
// //   try {
// //     const assetDetails = await AssetDetails.find({})
// //       .populate('asset', 'name isScoped') // Populate the asset field with its name and isScoped
// //       .populate('scoped', 'name') // Populate the scoped field with its name


// //     if (!Array.isArray(assetDetails)) {
// //       console.error('Expected array from database query, got:', assetDetails);
// //       res.status(500).json({ message: 'Unexpected response from database' });
// //       return;
// //     }
// //     const modifiedAssetDetails = assetDetails.map(detail => {
// //       if (!detail.asset.isScoped) {
// //         return {
// //           ...detail.toObject(),
// //           scoped: { name: 'non-scoped' },
// //           coverages: 0,
// //         };
// //       }
// //       return detail;
// //     });

// //     res.json(modifiedAssetDetails);
// //   } catch (error) {
// //     res.status(500);
// //     throw new Error('Server Error: Unable to fetch asset details');
// //   }
// // });

// // const addAssetDetails = AsyncHandler(async (req, res) => {
// //   const {
// //     asset,
// //     scoped,
// //     criticality,
// //     businessOwnerName,
// //     businessOwnerEmail,
// //     itOwnerName,
// //     itOwnerEmail,
// //     coverages,
// //   } = req.body;
  
// //   // Fetch the Asset to check if it is scoped
// //   const assets = await Asset.findById(asset);

// //   if (!assets) {
// //     res.status(404);
// //     throw new Error('Asset not found');
// //   }

// //   let finalScopedId = scoped;
// //   let finalCoverages = coverages;

// //   if (!assets.isScoped) {
// //     // If the asset is not scoped, set scoped to 'non-scoped' and coverages to 0
// //     const nonScoped = await Scoped.findOne({ name: 'non-scoped' });

// //     if (!nonScoped) {
// //       // If 'non-scoped' does not exist, create it
// //       const newNonScoped = new Scoped({ name: 'non-scoped' });
// //       await newNonScoped.save();
// //       finalScopedId = newNonScoped._id;
// //     } else {
// //       finalScopedId = nonScoped._id;
// //     }

// //     finalCoverages = 0;
// //   }

// //   const assetDetails = new AssetDetails({
// //     asset: assets,
// //     scoped: finalScopedId,
// //     criticality,
// //     businessOwnerName,
// //     businessOwnerEmail,
// //     itOwnerName,
// //     itOwnerEmail,
// //     coverages: finalCoverages,
// //   });

// //   const createdAssetDetails = await assetDetails.save();
// //   res.status(201).json(createdAssetDetails);
// // });

// // const updateAssetDetails = AsyncHandler(async (req, res) => {
// //   const { id } = req.params;
// //   const { asset, scoped, criticality, businessOwnerName, businessOwnerEmail, itOwnerName, itOwnerEmail, coverages } = req.body;

// //   try {
// //     const assetDetail = await AssetDetails.findById(id);

// //     if (!assetDetail) {
// //       res.status(404);
// //       throw new Error('Asset Detail not found');
// //     }

// //     assetDetail.asset = asset || assetDetail.asset;
// //     assetDetail.scoped = scoped || assetDetail.scoped;
// //     assetDetail.criticality = criticality || assetDetail.criticality;
// //     assetDetail.businessOwnerName = businessOwnerName || assetDetail.businessOwnerName;
// //     assetDetail.businessOwnerEmail = businessOwnerEmail || assetDetail.businessOwnerEmail;
// //     assetDetail.itOwnerName = itOwnerName || assetDetail.itOwnerName;
// //     assetDetail.itOwnerEmail = itOwnerEmail || assetDetail.itOwnerEmail;
// //     assetDetail.coverages = coverages || assetDetail.coverages;

// //     const updatedAssetDetail = await assetDetail.save();

// //     res.json(updatedAssetDetail);
// //   } catch (error) {
// //     res.status(500);
// //     throw new Error('Error updating asset details');
// //   }
// // });

// // const deleteAssetDetails = AsyncHandler(async (req, res) => {
// //   const { id } = req.params;
  
  
// //   try {
// //     const assetDetail = await AssetDetails.findByIdAndDelete(id);

// //     if (!assetDetail) {
// //       res.status(404);
// //       throw new Error('Asset Detail not found');
// //     }


// //     res.json({ message: 'Asset Detail removed' });
// //   } catch (error) {
// //     res.status(500);
// //     throw new Error('Error deleting asset details');
// //   }
// // });

// // export { getAssetDetails, addAssetDetails, deleteAssetDetails, updateAssetDetails };