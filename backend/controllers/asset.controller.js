import { Asset } from "../models/asset.model.js";
import { Scoped } from "../models/scoped.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";

const getAssets = AsyncHandler(async (req, res) => {
  try {
    const assets = await Asset.find({});
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const getAssetById = AsyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id).populate("coverages");
  if (asset) {
    res.json(asset);
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

const createAsset = AsyncHandler(async (req, res) => {
  const {
    name, type, desc, isScoped } = req.body;

  try {
    const newAsset = new Asset({
      name,
      type,
      desc,
      isScoped
    });

    const createdAsset = await newAsset.save();

    res
      .status(201)
      .json(new ApiResponse(201, createdAsset, "Created Asset Successfully"));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const updateAsset = AsyncHandler(async (req, res) => {
  try {
    const { name, desc } = req.body;
    const asset = await Asset.findById(req.params.id);

    if (asset) {
      asset.name = name;
      asset.desc = desc;

      const updatedAsset = await asset.save();
      res.json(updatedAsset);
    } else {
      res.status(404);
      throw new Error("Asset not found");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const deleteAsset = AsyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);

  if (asset) {
    await asset.remove();
    res.json({ message: "Asset removed" });
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

const getScopedByAsset = AsyncHandler(async (req, res) => {
  const { assetId } = req.params;
  const scoped = await Scoped.find({ asset: assetId });
  res.json(scoped);
});

export {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  getScopedByAsset,
};