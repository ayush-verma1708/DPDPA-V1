import { Scoped } from '../models/scoped.model.js';
import { AsyncHandler } from '../utils/asyncHandler.js';

const getScopes = AsyncHandler(async (req, res) => {
  const scopes = await Scope.find({});
  res.json(scopes);
});

const getScopedInAsset = AsyncHandler(async (req, res) => {
  const { assetId } = req.params;
  const scoped = await Scope.find({ assetId });
  res.json(scoped);
});

const addScope = AsyncHandler(async (req, res) => {
  const newScope = new Scope(req.body);
  const createdScope = await newScope.save();
  res.status(201).json(createdScope);
});

const updateScope = AsyncHandler(async (req, res) => {
  const scope = await Scope.findById(req.params.id);
  if (scope) {
    Object.assign(scope, req.body);
    const updatedScope = await scope.save();
    res.json(updatedScope);
  } else {
    res.status(404).json({ message: 'Scope not found' });
  }
});

const deleteScope = AsyncHandler(async (req, res) => {
  const scope = await Scope.findById(req.params.id);
  if (scope) {
    await scope.remove();
    res.json({ message: 'Scope removed' });
  } else {
    res.status(404).json({ message: 'Scope not found' });
  }
});

export {
  getScopes,
  getScopedInAsset,
  addScope,
  updateScope,
  deleteScope
};

// import { Scoped } from "../models/scoped.model.js";

// import { Asset } from "../models/asset.model.js";
// import { AsyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";

// const getScoped = AsyncHandler( async (res, _) =>{
//     try {
//         const scopes = await Scoped.find().populate('asset');
//         res.json(scopes);
//     } catch (error) {
//         new ApiError(500, error.message)
//     }
// })

// const getScopedInAsset = AsyncHandler( async (req, res)=>{
//     try {
//         const { assetId } = req.params;
//         const scoped = await Scoped.find({asset: assetId })
//         if (!scoped || scoped.length === 0) {
//             res.status(404).json({ message: 'No scoped found for this asset ID' });
//         }
//         res.status(200).json(scoped);
//     } catch (error) {
//         console.log(error);
//         new ApiError(500, "error while getting scoped")
//     }
// })

// const addScoped = AsyncHandler( async (req, res) =>{

//     const { name, desc, asset } = req.body;
//     if([name, desc, asset].some((fields) => fields?.trim() === "")){
//         throw new ApiError(400, "All fields are required.")
//     }
//     try {
//         const assetDetail = await Asset.findById(asset);
//         if (!assetDetail) {
//             return res.status(404).json({ error: 'Asset not found' });
//           }
//           const scoped = new Scoped({name,desc, asset: assetDetail._id})
//           await scoped.save();
//           res.status(201).json(scoped);
//         } catch (error) {
//           res.status(400).json({ error: error.message });
//         }
//     })

// const updateScoped = AsyncHandler(async (res, req) =>{
//     try {
//         const scoped = await Scoped.findById(req.params.id);
//         if(scoped == null){
//             return new ApiError(404, "Scoped not found");
//         }
//         scoped.name = req.body.name;
//         scoped.desc = req.body.desc;
//         scoped.asset = req.body.asset;
//         const updatedScoped = await scoped.save();
//         res.json(updatedScoped)
//     } catch (error) {
//         new ApiError(400, error.message);
//     }
// })

// const deleteScoped = AsyncHandler(async (res, req)=>{
//     try {
//         const scope = await Scoped.findById(req.perams.id);
//         if(scope == null){
//             return new ApiError(404, "Scoped not found")
//         }
//         await scope.remove();
//         res.json({message: "Scoped Deleted"})
//     } catch (error) {
//         ApiError(500, error.message)
//     }
// })

// export {getScoped, addScoped, updateScoped, deleteScoped, getScopedInAsset};