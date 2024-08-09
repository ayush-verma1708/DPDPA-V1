import { Asset } from "../models/asset.model.js";
import { It } from "../models/it.model.js"
import { AsyncHandler } from "../utils/asyncHandler.js";

const addIt = AsyncHandler(async (req, res) => {
  const { name, desc, asset } = req.body;
  console.log(req.body);
  if ([name, desc, asset].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }
  try {
    const assetDetail = await Asset.findById(asset);
    if (!assetDetail) {
      return res.status(404).json({ error: "Asset not found" });
    }
    const it = new It({ name, desc, asset: assetDetail._id });
    await it.save();
    res.status(201).json(it);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const getItInAsset = AsyncHandler( async (req, res)=>{
    try {
        const { assetId } = req.params;
        const it = await It.find({asset: assetId })
        if (!it || it.length === 0) {
            res.status(404).json({ message: 'No scoped found for this asset ID' });
        }
        res.status(200).json(it);
    } catch (error) {
        console.log(error);
        new ApiError(500, "error while getting scoped")
    }
  })

export { addIt, getItInAsset };
