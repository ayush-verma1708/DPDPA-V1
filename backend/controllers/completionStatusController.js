import CompletionStatus from '../models/completionStatusSchema.js';

// Helper function to log changes in history
const logHistory = (completionStatus, changes, userId) => {
  if (Object.keys(changes).length > 0) {
    completionStatus.history.push({
      modifiedAt: new Date(),
      modifiedBy: userId || 'Unknown',
      changes,
    });
  }
};

export const createOrUpdateStatus = async (req, res) => {
  const {
    actionId,
    assetId,
    scopeId,
    controlId,
    familyId,
    isCompleted,
    isEvidenceUploaded,
    createdBy,
    AssignedBy,
    AssignedTo,
    status,
    action,
    feedback,
  } = req.body;

  try {
    if (!actionId || !assetId || !controlId || !familyId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let completionStatus = await CompletionStatus.findOne({
      actionId,
      assetId,
      scopeId,
      controlId,
      familyId,
    });
    const changes = {};

    if (completionStatus) {
      // Update existing status
      if (isCompleted !== undefined) changes.isCompleted = isCompleted;
      if (isEvidenceUploaded !== undefined)
        changes.isEvidenceUploaded = isEvidenceUploaded;
      if (AssignedBy) changes.AssignedBy = AssignedBy;

      if (AssignedTo) changes.AssignedTo = AssignedTo;
      if (status) changes.status = status;
      if (action) changes.action = action;
      if (feedback) changes.feedback = feedback;

      Object.assign(completionStatus, changes);
      completionStatus.completedAt = isCompleted
        ? new Date()
        : completionStatus.completedAt;

      logHistory(completionStatus, changes, AssignedBy);
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
        isEvidenceUploaded,
        createdBy,
        AssignedBy,
        AssignedTo,
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
  const {
    status,
    action,
    feedback,
    createdBy,
    AssignedTo,
    AssignedBy,
    isEvidenceUploaded,
  } = req.body;

  try {
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    const changes = {};
    if (status !== undefined) changes.status = status;
    if (action !== undefined) changes.action = action;
    if (feedback !== undefined) changes.feedback = feedback;
    if (isEvidenceUploaded !== undefined)
      changes.isEvidenceUploaded = isEvidenceUploaded;

    // Update the status and other fields
    Object.assign(completionStatus, changes);

    if (status === 'Audit Closed' || status === 'Closed') {
      completionStatus.isCompleted = true;
      completionStatus.completedAt = new Date();
    }

    logHistory(completionStatus, changes, AssignedBy);

    await completionStatus.save();
    res.status(200).json(completionStatus);
  } catch (err) {
    console.error('Error in updateStatus:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getStatus = async (req, res) => {
  const { assetId, scopeId, familyId } = req.query;

  try {
    const query = {};
    if (assetId) query.assetId = assetId;
    if (scopeId) query.scopeId = scopeId;
    if (familyId) query.familyId = familyId;

    const statuses = await CompletionStatus.find(query)
      .populate('actionId')
      .populate('assetId')
      .populate('scopeId')
      .populate('controlId')
      .populate('familyId')
      .populate('AssignedTo')
      .populate('AssignedBy')
      .populate('createdBy');

    if (statuses.length === 0) {
      return res.status(404).json({ message: 'No completion statuses found.' });
    }

    return res.status(200).json(statuses);
  } catch (err) {
    console.error('Error in getStatus:', err);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching completion statuses.' });
  }
};

export const getStatusWithHistory = async (req, res) => {
  const { completionStatusId } = req.params;

  try {
    const completionStatus = await CompletionStatus.findById(
      completionStatusId
    );

    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    res.status(200).json(completionStatus.history);
  } catch (err) {
    console.error('Error in getStatusWithHistory:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete Completion Status by ID
export const deleteStatus = async (req, res) => {
  const { completionStatusId } = req.params;

  try {
    const deletedStatus = await CompletionStatus.findByIdAndDelete(
      completionStatusId
    );

    if (!deletedStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    res.status(200).json({ message: 'CompletionStatus deleted successfully' });
  } catch (err) {
    console.error('Error in deleteStatus:', err);
    res.status(500).json({ error: err.message });
  }
};

export const delegateToIT = async (req, res) => {
  const { completionStatusId } = req.params;
  const { itOwnerId, currentUserId } = req.body;

  try {
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    const changes = {
      status: 'Delegated to IT Team',
      action: 'Delegate to IT',
      AssignedTo: itOwnerId, // Update the username field
    };

    Object.assign(completionStatus, changes);
    logHistory(completionStatus, changes, currentUserId);

    await completionStatus.save();

    res.status(200).json({ message: 'Delegated to IT Team', completionStatus });
  } catch (err) {
    console.error('Error in delegateToIT:', err);
    res.status(500).json({ error: err.message });
  }
};

// Controller for IT Team: Delegate to Auditor
// export const delegateToAuditor = async (req, res) => {
//   const { completionStatusId } = req.params;
//   const { currentUserId } = req.body;
//   defaultAuditor = '66d6d07eef980699d3d64258';
//   try {
//     let completionStatus = await CompletionStatus.findById(completionStatusId);

//     if (!completionStatus) {
//       return res.status(404).json({ error: 'CompletionStatus not found' });
//     }

//     const changes = {
//       status: 'Audit Delegated',
//       action: 'Delegate to Auditor',
//       // adding default auditor
//       AssignedBy: currentUserId,
//       AssignedTo: defaultAuditor,
//     };

//     Object.assign(completionStatus, changes);
//     logHistory(completionStatus, changes, req.body.username);

//     await completionStatus.save();

//     res.status(200).json({ message: 'Delegated to Auditor', completionStatus });
//   } catch (err) {
//     console.error('Error in delegateToAuditor:', err);
//     res.status(500).json({ error: err.message });
//   }
// };
export const delegateToAuditor = async (req, res) => {
  const { completionStatusId } = req.params; // Extracting ID from request params
  const { currentUserId, username } = req.body; // Extracting currentUserId and username from request body

  // Define default auditor
  const defaultAuditor = '66d6d07eef980699d3d64258';

  try {
    // Find the completion status by ID
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    // If no completion status is found, return 404 error
    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    // Define changes to be made
    const changes = {
      status: 'Audit Delegated', // Update status
      action: 'Delegate to Auditor', // Update action
      AssignedBy: currentUserId, // Assign current user ID
      AssignedTo: defaultAuditor, // Assign default auditor
    };

    // Merge changes into the completion status object
    Object.assign(completionStatus, changes);

    // Log history for auditing (you might want to ensure logHistory is implemented correctly)
    logHistory(completionStatus, changes, username);

    // Save the updated completion status document
    await completionStatus.save();

    // Return success response
    res.status(200).json({ message: 'Delegated to Auditor', completionStatus });
  } catch (err) {
    console.error('Error in delegateToAuditor:', err);
    // Return 500 error if something goes wrong in the try block
    res.status(500).json({ error: err.message });
  }
};

export const confirmEvidence = async (req, res) => {
  const { completionStatusId } = req.params;
  const { feedback, username } = req.body;

  try {
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    const changes = {
      status: feedback ? 'Audit Non-Confirm' : 'Audit Closed',
      action: feedback ? 'Return Evidence' : 'Confirm Evidence',
      feedback: feedback || null,
      isEvidenceUploaded: true, // Evidence is considered uploaded when confirmed
    };

    if (!feedback) {
      changes.isCompleted = true;
      changes.completedAt = new Date();
    }

    Object.assign(completionStatus, changes);
    logHistory(completionStatus, changes, username);

    await completionStatus.save();
    res.status(200).json({ message: 'Evidence processed', completionStatus });
  } catch (err) {
    console.error('Error in confirmEvidence:', err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch risk for a specific asset
export const getRiskByAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const riskData = await CompletionStatus.calculateRiskByAsset(assetId);
    res.status(200).json(riskData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch overall risk across all assets
export const getOverallRisk = async (req, res) => {
  try {
    const overallRiskData = await CompletionStatus.calculateOverallRisk();
    res.status(200).json(overallRiskData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create or Update Completion Status
// export const createOrUpdateStatus = async (req, res) => {
//   const {
//     actionId,
//     assetId,
//     scopeId,
//     controlId,
//     familyId,
//     isCompleted,

//     username,
//     status,
//     action,
//     feedback,
//   } = req.body;

//   try {
//     if (!actionId || !assetId || !controlId || !familyId) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     let completionStatus = await CompletionStatus.findOne({
//       actionId,
//       assetId,
//       scopeId,
//       controlId,
//       familyId,
//     });
//     const changes = {};

//     if (completionStatus) {
//       // Update existing status
//       if (isCompleted !== undefined) changes.isCompleted = isCompleted;
//       if (username) changes.username = username;
//       if (status) changes.status = status;
//       if (action) changes.action = action;
//       if (feedback) changes.feedback = feedback;

//       Object.assign(completionStatus, changes);
//       completionStatus.completedAt = isCompleted
//         ? new Date()
//         : completionStatus.completedAt;
//       logHistory(completionStatus, changes, username);
//       await completionStatus.save();
//     } else {
//       // Create new status entry
//       completionStatus = new CompletionStatus({
//         actionId,
//         assetId,
//         scopeId: scopeId || null,
//         controlId,
//         familyId,
//         isCompleted,
//         username,
//         status,
//         action,
//         feedback,
//         completedAt: isCompleted ? new Date() : null,
//       });
//       await completionStatus.save();
//     }

//     res.status(200).json(completionStatus);
//   } catch (err) {
//     console.error('Error in createOrUpdateStatus:', err);
//     res.status(500).json({ error: err.message });
//   }
// };
