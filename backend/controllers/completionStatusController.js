import CompletionStatus from '../models/completionStatusSchema.js';

// Create or Update Completion Status
export const createOrUpdateStatus = async (req, res) => {
  const { actionId, assetId, scopeId, controlId, familyId, isCompleted, username, status, action, feedback } = req.body;

  try {
    if (!actionId || !assetId || !controlId || !familyId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let completionStatus = await CompletionStatus.findOne({ actionId, assetId, scopeId, controlId, familyId });

    if (completionStatus) {
      // Update existing status
      completionStatus.isCompleted = isCompleted;
      completionStatus.completedAt = isCompleted ? new Date() : completionStatus.completedAt;
      completionStatus.username = username || completionStatus.username;
      completionStatus.status = status || completionStatus.status;
      completionStatus.action = action || completionStatus.action;
      completionStatus.feedback = feedback || completionStatus.feedback;
      await completionStatus.save();
    } else {
      // Create new status entry
      completionStatus = new CompletionStatus({
        actionId,
        assetId,
        scopeId: scopeId || null,
        controlId,
        familyId,
        isCompleted,
        username,
        status,
        action,
        feedback,
        completedAt: isCompleted ? new Date() : null,
      });
      await completionStatus.save();
    }

    res.status(200).json(completionStatus);
  } catch (err) {
    console.error('Error in createOrUpdateStatus:', err);
    res.status(500).json({ error: err.message });
  }
};


export const updateStatus = async (req, res) => {
  const { completionStatusId } = req.params;
  const { status, action, feedback, username } = req.body;

  try {
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    // Prepare the changes to be logged
    const changes = {};
    if (status !== undefined) changes.status = status;
    if (action !== undefined) changes.action = action;
    if (feedback !== undefined) changes.feedback = feedback;

    // Update the status and other fields
    completionStatus.status = status || completionStatus.status;
    completionStatus.action = action || completionStatus.action;
    completionStatus.feedback = feedback || completionStatus.feedback;

    if (status === 'Audit Closed' || status === 'Closed') {
      completionStatus.isCompleted = true;
      completionStatus.completedAt = new Date();
    }

    // Add the change history entry
    if (Object.keys(changes).length > 0) {
      completionStatus.history.push({
        modifiedAt: new Date(),
        modifiedBy: username || 'Unknown',
        changes
      });
    }

    await completionStatus.save();
    res.status(200).json(completionStatus);
  } catch (err) {
    console.error('Error in updateStatus:', err);
    res.status(500).json({ error: err.message });
  }
};


export const getStatus = async (req, res) => {
  const { actionId, assetId, scopeId, controlId, familyId } = req.query;

  try {
    // Construct query object with provided parameters
    const query = {};
    if (actionId) query.actionId = actionId;
    if (assetId) query.assetId = assetId;
    if (scopeId) query.scopeId = scopeId;
    if (controlId) query.controlId = controlId;
    if (familyId) query.familyId = familyId;

    // Fetch completion statuses based on query with populated fields
    const statuses = await CompletionStatus.find(query)
      .populate('actionId')
      .populate('assetId')
      .populate('scopeId')
      .populate('controlId')
      .populate('familyId');

    // Check if any statuses are found
    if (statuses.length === 0) {
      return res.status(404).json({ message: 'No completion statuses found.' });
    }

    // Return found statuses
    return res.status(200).json(statuses);
  } catch (err) {
    console.error('Error in getStatus:', err);
    return res.status(500).json({ error: 'An error occurred while fetching completion statuses.' });
  }
};

export const getStatusWithHistory = async (req, res) => {
  const { completionStatusId } = req.params;

  try {
    const completionStatus = await CompletionStatus.findById(completionStatusId);

    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    res.status(200).json(completionStatus.history);
  } catch (err) {
    console.error('Error in getStatusWithHistory:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update Specific Completion Status by ID
// export const updateStatus = async (req, res) => {
//   const { completionStatusId } = req.params;
//   const { status, action, feedback } = req.body;

//   try {
//     let completionStatus = await CompletionStatus.findById(completionStatusId);

//     if (!completionStatus) {
//       return res.status(404).json({ error: 'CompletionStatus not found' });
//     }

//     completionStatus.status = status || completionStatus.status;
//     completionStatus.action = action || completionStatus.action;
//     completionStatus.feedback = feedback || completionStatus.feedback;

//     if (status === 'Audit Closed' || status === 'Closed') {
//       completionStatus.isCompleted = true;
//       completionStatus.completedAt = new Date();
//     }

//     await completionStatus.save();
//     res.status(200).json(completionStatus);
//   } catch (err) {
//     console.error('Error in updateStatus:', err);
//     res.status(500).json({ error: err.message });
//   }
// };

// Delete Completion Status by ID
export const deleteStatus = async (req, res) => {
  const { completionStatusId } = req.params;

  try {
    const deletedStatus = await CompletionStatus.findByIdAndDelete(completionStatusId);

    if (!deletedStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    res.status(200).json({ message: 'CompletionStatus deleted successfully' });
  } catch (err) {
    console.error('Error in deleteStatus:', err);
    res.status(500).json({ error: err.message });
  }
};

// Controller for Compliance Team: Delegate to IT Team
export const delegateToIT = async (req, res) => {
  const { completionStatusId } = req.params;

  try {
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    completionStatus.status = 'Delegated to IT Team';
    completionStatus.action = 'Delegate to IT';
    await completionStatus.save();

    res.status(200).json({ message: 'Delegated to IT Team', completionStatus });
  } catch (err) {
    console.error('Error in delegateToIT:', err);
    res.status(500).json({ error: err.message });
  }
};

// Controller for IT Team: Delegate to Auditor
export const delegateToAuditor = async (req, res) => {
  const { completionStatusId } = req.params;

  try {
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    completionStatus.status = 'Audit Delegated';
    completionStatus.action = 'Delegate to Auditor';
    await completionStatus.save();

    res.status(200).json({ message: 'Delegated to Auditor', completionStatus });
  } catch (err) {
    console.error('Error in delegateToAuditor:', err);
    res.status(500).json({ error: err.message });
  }
};

// Controller for Auditor: Confirm Evidence or Return Evidence
export const confirmEvidence = async (req, res) => {
  const { completionStatusId } = req.params;
  const { feedback } = req.body; // Optional feedback if evidence is not confirmed

  try {
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    completionStatus.status = feedback ? 'Audit Non-Confirm' : 'Audit Closed';
    completionStatus.action = feedback ? 'Return Evidence' : 'Confirm Evidence';
    completionStatus.feedback = feedback || null;

    if (!feedback) {
      completionStatus.isCompleted = true;
      completionStatus.completedAt = new Date();
    }

    await completionStatus.save();
    res.status(200).json({ message: 'Evidence processed', completionStatus });
  } catch (err) {
    console.error('Error in confirmEvidence:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get Completion Status by Criteria
// export const getStatus = async (req, res) => {
//   const { actionId, assetId, scopeId, controlId, familyId } = req.query;

//   try {
//     if (!actionId && !assetId && !controlId && !familyId) {
//       return res.status(400).json({ error: 'At least one query parameter is required' });
//     }

//     const query = { actionId, assetId, scopeId, controlId, familyId };
//     Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);

//     const status = await CompletionStatus.findOne(query);
//     if (!status) {
//       return res.status(404).json({ error: 'Status not found' });
//     }

//     res.status(200).json(status);
//   } catch (err) {
//     console.error('Error in getStatus:', err);
//     res.status(500).json({ error: err.message });
//   }
// };

// Updated Get Completion Status by Criteria
// export const getStatus = async (req, res) => {
//   const { actionId, assetId, scopeId, controlId, familyId } = req.query;

//   try {
//     // Construct query object with provided parameters
//     const query = {};
//     if (actionId) query.actionId = actionId;
//     if (assetId) query.assetId = assetId;
//     if (scopeId) query.scopeId = scopeId;
//     if (controlId) query.controlId = controlId;
//     if (familyId) query.familyId = familyId;

//     // Fetch completion statuses based on query
//     const statuses = await CompletionStatus.find(query);

//     // Check if any statuses are found
//     if (statuses.length === 0) {
//       return res.status(404).json({ message: 'No completion statuses found.' });
//     }

//     // Return found statuses
//     return res.status(200).json(statuses);
//   } catch (err) {
//     console.error('Error in getStatus:', err);
//     return res.status(500).json({ error: 'An error occurred while fetching completion statuses.' });
//   }
// };