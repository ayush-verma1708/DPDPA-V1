import { Asset } from "../models/asset.model.js";
import { Business } from "../models/business.model.js"
import { AsyncHandler } from "../utils/asyncHandler.js";

const addBusiness = AsyncHandler(async (req, res) => {
  const { name, desc, asset } = req.body;
  if ([name, desc, asset].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }
  try {
    const assetDetail = await Asset.findById(asset);
    if (!assetDetail) {
      return res.status(404).json({ error: "Asset not found" });
    }
    const scoped = new Business({ name, desc, asset: assetDetail._id });
    await scoped.save();
    res.status(201).json(scoped);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const getBusinessInAsset = AsyncHandler( async (req, res)=>{
  try {
      const { assetId } = req.params;
      const scoped = await Business.find({asset: assetId })
      if (!scoped || scoped.length === 0) {
          res.status(404).json({ message: 'No scoped found for this asset ID' });
      }
      res.status(200).json(scoped);
  } catch (error) {
      console.log(error);
      new ApiError(500, "error while getting scoped")
  }
})

export { addBusiness, getBusinessInAsset };
