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

// export const getStatus = async (req, res) => {
//   const { assetId, scopeId, familyId } = req.query;

//   try {
//     const query = {};
//     if (assetId) query.assetId = assetId;
//     if (scopeId) query.scopeId = scopeId;
//     if (familyId) query.familyId = familyId;

//     // Fetching completion statuses with necessary data in one go
//     const statuses = await CompletionStatus.find(query)
//       .lean() // Use lean for faster performance
//       .populate({
//         path: 'actionId',
//         select: 'fixed_id', // Specify only needed fields
//       })
//       .populate({
//         path: 'assetId',
//         select: 'username', // Include username for assigned to field
//       })
//       .populate({
//         path: 'scopeId',
//         select: 'name', // Include name for scope
//       })
//       .populate({
//         path: 'controlId',
//         select: 'section_desc', // Include description for control
//       })
//       .populate({
//         path: 'familyId',
//         select: 'name', // Include name for family
//       })
//       .populate({
//         path: 'AssignedTo',
//         select: 'username', // Include username for AssignedTo
//       })
//       .populate({
//         path: 'AssignedBy',
//         select: 'username', // Include username for AssignedBy
//       })
//       .populate({
//         path: 'createdBy',
//         select: 'username', // Include username for createdBy
//       });

//     // Map through the statuses to format data according to table fields
//     const formattedStatuses = statuses.map((status) => ({
//       _id: status._id,
//       actionId: status.actionId, // Will contain only fixed_id
//       controlId: status.controlId, // Will contain only section_desc
//       assetId: status.assetId, // Will contain only username
//       scopeId: status.scopeId, // Will contain only name
//       familyId: status.familyId, // Will contain only name
//       AssignedTo: status.AssignedTo, // Will contain only username
//       AssignedBy: status.AssignedBy, // Will contain only username
//       createdBy: status.createdBy, // Will contain only username
//       feedback: status.feedback || 'N/A',
//       status: status.status || 'N/A',
//       isEvidenceUploaded: status.isEvidenceUploaded,
//       history: status.history,
//     }));

//     if (formattedStatuses.length === 0) {
//       return res.status(404).json({ message: 'No completion statuses found.' });
//     }

//     return res.status(200).json(formattedStatuses);
//   } catch (err) {
//     console.error('Error in getStatus:', err);
//     return res.status(500).json({
//       error: 'An error occurred while fetching completion statuses.',
//     });
//   }
// };

// export const getStatus = async (req, res) => {
//   const { assetId, scopeId, familyId } = req.query;

//   try {
//     const query = {};
//     if (assetId) query.assetId = assetId;
//     if (scopeId) query.scopeId = scopeId;
//     if (familyId) query.familyId = familyId;

//     // Fetching completion statuses with necessary data in one go
//     const statuses = await CompletionStatus.find(query)
//       .lean() // Use lean for faster performance
//       .populate({
//         path: 'actionId',
//         select: 'name description', // Specify only needed fields
//       })
//       .populate({
//         path: 'assetId',
//         select: 'name type', // Specify only needed fields
//       })
//       .populate({
//         path: 'scopeId',
//         select: 'name', // Specify only needed fields
//       })
//       .populate({
//         path: 'controlId',
//         select: 'name', // Specify only needed fields
//       })
//       .populate({
//         path: 'familyId',
//         select: 'name', // Specify only needed fields
//       })
//       .populate({
//         path: 'AssignedTo',
//         select: 'name email', // Specify only needed fields
//       })
//       .populate({
//         path: 'AssignedBy',
//         select: 'name email', // Specify only needed fields
//       })
//       .populate({
//         path: 'createdBy',
//         select: 'name email', // Specify only needed fields
//       });

//     if (statuses.length === 0) {
//       return res.status(404).json({ message: 'No completion statuses found.' });
//     }

//     return res.status(200).json(statuses);
//   } catch (err) {
//     console.error('Error in getStatus:', err);
//     return res.status(500).json({
//       error: 'An error occurred while fetching completion statuses.',
//     });
//   }
// };

// export const getStatus = async (req, res) => {
//   const { assetId, scopeId, familyId } = req.query;

//   try {
//     const query = {};
//     if (assetId) query.assetId = assetId;
//     if (scopeId) query.scopeId = scopeId;
//     if (familyId) query.familyId = familyId;

//     const statuses = await CompletionStatus.find(query)
//       .populate('actionId')
//       .populate('assetId')
//       .populate('scopeId')
//       .populate('controlId')
//       .populate('familyId')
//       .populate('AssignedTo')
//       .populate('AssignedBy')
//       .populate('createdBy');

//     if (statuses.length === 0) {
//       return res.status(404).json({ message: 'No completion statuses found.' });
//     }

//     return res.status(200).json(statuses);
//   } catch (err) {
//     console.error('Error in getStatus:', err);
//     return res
//       .status(500)
//       .json({ error: 'An error occurred while fetching completion statuses.' });
//   }
// };

// export const getStatus = async (req, res) => {
//   const { assetId, scopeId, familyId, currentUserId, role } = req.query;

//   try {
//     const query = {};

//     // Add filtering based on query params (assetId, scopeId, familyId)
//     if (assetId) query.assetId = assetId;
//     if (scopeId) query.scopeId = scopeId;
//     if (familyId) query.familyId = familyId;

//     // Role-based filtering logic
//     if (role === 'Admin' || role === 'Compliance Team') {
//       // No additional filtering for Admin and Compliance Team, they can view all data
//     } else {
//       // For other roles, filter statuses based on assigned roles
//       query.$or = [
//         { 'AssignedTo._id': currentUserId },
//         { 'AssignedBy._id': currentUserId },
//       ];
//     }

//     // Fetching completion statuses with necessary data
//     const statuses = await CompletionStatus.find(query)
//       .lean() // Use lean for faster performance
//       .populate({
//         path: 'actionId',
//         select: 'fixed_id', // Specify only needed fields
//       })
//       .populate({
//         path: 'assetId',
//         select: 'username', // Include username for assigned to field
//       })
//       .populate({
//         path: 'scopeId',
//         select: 'name', // Include name for scope
//       })
//       .populate({
//         path: 'controlId',
//         select: 'section_desc', // Include description for control
//       })
//       .populate({
//         path: 'familyId',
//         select: 'name', // Include name for family
//       })
//       .populate({
//         path: 'AssignedTo',
//         select: 'username', // Include username for AssignedTo
//       })
//       .populate({
//         path: 'AssignedBy',
//         select: 'username', // Include username for AssignedBy
//       })
//       .populate({
//         path: 'createdBy',
//         select: 'username', // Include username for createdBy
//       });

//     // Map through the statuses to format data according to table fields
//     const formattedStatuses = statuses.map((status) => ({
//       _id: status._id,
//       actionId: status.actionId, // Will contain only fixed_id
//       controlId: status.controlId, // Will contain only section_desc
//       assetId: status.assetId, // Will contain only username
//       scopeId: status.scopeId, // Will contain only name
//       familyId: status.familyId, // Will contain only name
//       AssignedTo: status.AssignedTo, // Will contain only username
//       AssignedBy: status.AssignedBy, // Will contain only username
//       createdBy: status.createdBy, // Will contain only username
//       feedback: status.feedback || 'N/A',
//       status: status.status || 'N/A',
//       isEvidenceUploaded: status.isEvidenceUploaded,
//       history: status.history,
//     }));

//     if (formattedStatuses.length === 0) {
//       return res.status(404).json({ message: 'No completion statuses found.' });
//     }

//     return res.status(200).json(formattedStatuses);
//   } catch (err) {
//     console.error('Error in getStatus:', err);
//     return res.status(500).json({
//       error: 'An error occurred while fetching completion statuses.',
//     });
//   }
// };
export const getStatus = async (req, res) => {
  const { assetId, scopeId, familyId, currentUserId, role } = req.query;

  try {
    const query = {};

    // Add filtering based on query params (assetId, scopeId, familyId)
    if (assetId) query.assetId = assetId;
    if (scopeId) query.scopeId = scopeId;
    if (familyId) query.familyId = familyId;

    // Role-based filtering logic
    if (role === 'Admin' || role === 'Compliance Team') {
      // No additional filtering for Admin and Compliance Team, they can view all data
    } else {
      // For other roles, filter statuses based on assigned roles
      query.$or = [
        { 'AssignedTo._id': currentUserId }, // Show statuses assigned to the user
        { 'AssignedBy._id': currentUserId }, // Show statuses created by the user
      ];
    }

    // Fetching completion statuses with necessary data
    const statuses = await CompletionStatus.find(query)
      .lean() // Use lean for faster performance
      .populate({
        path: 'actionId',
        select: 'fixed_id', // Specify only needed fields
      })
      .populate({
        path: 'assetId',
        select: 'username', // Include username for assigned to field
      })
      .populate({
        path: 'scopeId',
        select: 'name', // Include name for scope
      })
      .populate({
        path: 'controlId',
        select: 'section_desc', // Include description for control
      })
      .populate({
        path: 'familyId',
        select: 'name', // Include name for family
      })
      .populate({
        path: 'AssignedTo',
        select: 'username', // Include username for AssignedTo
      })
      .populate({
        path: 'AssignedBy',
        select: 'username', // Include username for AssignedBy
      })
      .populate({
        path: 'createdBy',
        select: 'username', // Include username for createdBy
      });

    // Map through the statuses to format data according to table fields
    const formattedStatuses = statuses.map((status) => ({
      _id: status._id,
      actionId: status.actionId, // Will contain only fixed_id
      controlId: status.controlId, // Will contain only section_desc
      assetId: status.assetId, // Will contain only username
      scopeId: status.scopeId, // Will contain only name
      familyId: status.familyId, // Will contain only name
      AssignedTo: status.AssignedTo, // Will contain only username
      AssignedBy: status.AssignedBy, // Will contain only username
      createdBy: status.createdBy, // Will contain only username
      feedback: status.feedback || 'N/A',
      status: status.status || 'N/A',
      isEvidenceUploaded: status.isEvidenceUploaded,
      history: status.history,
    }));

    if (formattedStatuses.length === 0) {
      return res.status(404).json({ message: 'No completion statuses found.' });
    }

    return res.status(200).json(formattedStatuses);
  } catch (err) {
    console.error('Error in getStatus:', err);
    return res.status(500).json({
      error: 'An error occurred while fetching completion statuses.',
    });
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

export const delegateToExternalAuditor = async (req, res) => {
  const { completionStatusId } = req.params; // Extracting ID from request params
  const { currentUserId, username } = req.body; // Extracting currentUserId and username from request body

  // Define default auditor
  const defaultExternalAuditor = '66f5509b121a8c3a25a91924';

  try {
    // Find the completion status by ID
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    // If no completion status is found, return 404 error
    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    // Define changes to be made
    const changes = {
      status: 'External Audit Delegated', // Update status
      action: 'Delegate to External Auditor', // Update action
      AssignedBy: currentUserId, // Assign current user ID
      AssignedTo: defaultExternalAuditor, // Assign default auditor
    };

    // Merge changes into the completion status object
    Object.assign(completionStatus, changes);

    // Log history for auditing (you might want to ensure logHistory is implemented correctly)
    logHistory(completionStatus, changes, username);

    // Save the updated completion status document
    await completionStatus.save();

    // Return success response
    res
      .status(200)
      .json({ message: 'Delegated to External Auditor', completionStatus });
  } catch (err) {
    console.error('Error in delegateToExternalAuditor:', err);
    // Return 500 error if something goes wrong in the try block
    res.status(500).json({ error: err.message });
  }
};

export const confirmEvidence = async (req, res) => {
  const { completionStatusId } = req.params;
  const { feedback, currentUserId } = req.body;

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
      createdBy: currentUserId,
    };

    if (!feedback) {
      changes.isCompleted = true;
      changes.completedAt = new Date();
    }

    Object.assign(completionStatus, changes);
    logHistory(completionStatus, changes, currentUserId);

    await completionStatus.save();
    res.status(200).json({ message: 'Evidence processed', completionStatus });
  } catch (err) {
    console.error('Error in confirmEvidence:', err);
    res.status(500).json({ error: err.message });
  }
};

export const raiseQuery = async (req, res) => {
  const { completionStatusId } = req.params;
  const { feedback, currentUserId } = req.body;

  try {
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    const changes = {
      status: 'Wrong Evidence',
      feedback: feedback || null,
      createdBy: currentUserId,
    };

    Object.assign(completionStatus, changes);
    logHistory(completionStatus, changes, currentUserId);

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
