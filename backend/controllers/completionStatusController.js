import CompletionStatus from '../models/completionStatusSchema.js';

export const createOrUpdateStatus = async (req, res) => {
  const { actionId, assetId, scopeId, controlId, familyId, isCompleted, username } = req.body;

  try {
    if (!actionId || !assetId || !controlId || !familyId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let status = await CompletionStatus.findOne({ actionId, assetId, scopeId, controlId, familyId });

    if (status) {
      // Update existing status
      status.isCompleted = isCompleted;
      status.completedAt = isCompleted ? new Date() : status.completedAt;
      status.username = username;
      await status.save();
    } else {
      // Create new status entry
      status = new CompletionStatus({
        actionId,
        assetId,
        scopeId: scopeId || null,
        controlId,
        familyId,
        isCompleted,
        username,
        completedAt: isCompleted ? new Date() : null,
      });
      await status.save();
    }

    res.status(200).json(status);
  } catch (err) {
    console.error('Error in createOrUpdateStatus:', err);
    res.status(500).json({ error: err.message });
  }
};


// Fetch completion status by criteria
export const getStatus = async (req, res) => {
  const { actionId, assetId, scopeId, controlId, familyId } = req.query;

  try {
    // Ensure that at least one query parameter is provided
    if (!actionId && !assetId && !controlId && !familyId) {
      return res.status(400).json({ error: 'At least one query parameter is required' });
    }

    const query = { actionId, assetId, scopeId, controlId, familyId };
    // Remove undefined properties from the query
    Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);

    const status = await CompletionStatus.findOne(query);
    if (!status) {
      return res.status(404).json({ error: 'Status not found' });
    }

    res.status(200).json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
