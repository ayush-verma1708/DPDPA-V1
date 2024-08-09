import { Coverage } from "../models/coverage.model.js";
import { Scoped } from "../models/scoped.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";

const getCoverages = AsyncHandler(async (_, res) => {
  try {
    const coverages = await Coverage.find({}).populate({
      path: "scoped",
      populate: { path: "asset" },
    });
    res.json(coverages);
  } catch (error) {
    res.status(500).json(error);
  }
});

const createCoverage = AsyncHandler(async (req, res) => {
  const { coverageCount, scoped,
    criticality,
    businessOwnerName,
    businessOwnerEmail,
    itOwnerName,
    itOwnerEmail } = req.body;

  try {
    const coverage = new Coverage({ coverageCount, scoped,
      criticality,
      businessOwnerName,
      businessOwnerEmail,
      itOwnerName,
      itOwnerEmail });
    await coverage.save();
    res.status(201).json(coverage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const updateCoverage = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { coverageCount, scopedId } = req.body;
  const coverageDetail = await Scoped.findById(scopedId);
  const coverage = await Coverage.findByIdAndUpdate(
    id,
    { coverageCount, scoped: coverageDetail._id },
    { new: true }
  );
  if (!coverage) {
    res.status(404).json({ message: "Coverage not found" });
  } else {
    res.status(201).json(coverage);
  }
});

const deleteCoverage = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const coverage = await Coverage.findByIdAndDelete(id);
  if (!coverage) {
    res.status(404).json({ message: "Coverage not found" });
  } else {
    res.json({ message: "Coverage deleted successfully" });
  }
});

export { createCoverage, getCoverages, updateCoverage, deleteCoverage };