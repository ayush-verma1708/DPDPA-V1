import mongoose from 'mongoose';
import CompletionStatus from '../models/completionStatusSchema.js';
import { createMessage } from '../services/messageService.js'; // Adjust the path as necessary
import {
  default_Auditor_Id,
  default_External_Auditor_Id,
} from '../constants.js';
// Helper function to log changes in history
const logHistory = (completionStatus, changes, userId) => {
  if (Object.keys(changes).length > 0) {
    completionStatus.history.push({
      modifiedAt: new Date(),
      // modifiedBy: userId || 'Unknown',
      modifiedBy: userId ? userId : null, // Use null instead of 'Unknown'
      changes,
    });
  }
};

export const getCompletionStatusById = async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    const completionStatus = await CompletionStatus.findById(id, { history: 0 }) // Exclude the history field
      .populate('actionId', '_id') // Populate only the ID of actionId
      .populate('assetId', '_id') // Populate only the ID of assetId
      .populate('scopeId', '_id') // Populate only the ID of scopeId
      .populate('controlId', '_id') // Populate only the ID of controlId
      .populate('familyId', '_id') // Populate only the ID of familyId
      .populate('selectedSoftware') // Populate only the ID of familyId
      .exec();

    if (!completionStatus) {
      return res.status(404).json({ message: 'Completion status not found' });
    }

    return res.status(200).json(completionStatus);
  } catch (error) {
    console.error('Error finding CompletionStatus by ID:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
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

      // Create a message indicating the status update
      await createMessage(
        AssignedBy,
        `Updated status for actionId ${actionId}`,
        completionStatus
      );
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

      // Create a message indicating the creation of a new status
      await createMessage(
        createdBy,
        `Created new status for actionId ${actionId}`,
        completionStatus
      );
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

// Function to get status based on filters
export const getStatus = async (req, res) => {
  try {
    const {
      actionId,
      assetId,
      scopeId,
      controlId,
      familyId,
      AssignedTo,
      status,
      currentUserId, // Ensure you receive currentUserId from query
      role, // Ensure you receive role from query
    } = req.query;

    // Build a query object dynamically based on provided query parameters
    const query = {};

    if (actionId) query.actionId = actionId;
    if (assetId) query.assetId = assetId;
    if (scopeId) query.scopeId = scopeId;
    if (controlId) query.controlId = controlId;
    if (familyId) query.familyId = familyId;
    if (AssignedTo) query.AssignedTo = AssignedTo;
    if (status) query.status = status;

    // Add condition based on user's role
    if (role !== 'Compliance Team') {
      // If the user is not in the Compliance Team, filter based on currentUserId
      query.$or = [
        { AssignedTo: currentUserId },
        { AssignedBy: currentUserId },
        { createdBy: currentUserId },
      ];
    }

    // Query the database for CompletionStatus documents that match the query
    const completionStatuses = await CompletionStatus.find(query)
      .populate(
        'actionId assetId scopeId controlId familyId AssignedTo selectedSoftware'
      )
      .populate({
        path: 'AssignedTo',
        select: 'username', // Include username for AssignedTo
      })
      .populate({
        path: 'AssignedBy',
        select: 'username role', // Include username for AssignedBy
      })
      .populate({
        path: 'createdBy',
        select: 'username', // Include username for createdBy
      })
      .populate({
        path: 'history.modifiedBy',
        select: 'username', // Include username for createdBy
      })
      .populate({
        path: 'history.changes.AssignedTo',
        select: 'username', // Include username for createdBy
      })
      .exec();

    if (completionStatuses.length === 0) {
      return res
        .status(404)
        .json({ message: 'No matching completion status found' });
    }

    // Respond with the completion statuses
    return res.status(200).json(completionStatuses);
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

export const getAllStatus = async (req, res) => {
  try {
    const {
      actionId,
      assetId,
      scopeId,
      controlId,
      familyId,
      AssignedTo,
      status,
    } = req.query;

    // Build a query object dynamically based on provided query parameters
    const query = {};

    if (actionId) query.actionId = actionId;
    if (assetId) query.assetId = assetId;
    if (scopeId) query.scopeId = scopeId;
    if (controlId) query.controlId = controlId;
    if (familyId) query.familyId = familyId;
    if (AssignedTo) query.AssignedTo = AssignedTo;
    if (status) query.status = status;

    // Query the database for CompletionStatus documents that match the query
    const completionStatuses = await CompletionStatus.find(query)
      .populate(
        'actionId assetId scopeId controlId familyId AssignedTo selectedSoftware'
      )
      .populate({
        path: 'AssignedTo',
        select: 'username', // Include username for AssignedTo
      })
      .populate({
        path: 'AssignedBy',
        select: 'username role', // Include username for AssignedBy
      })
      .populate({
        path: 'createdBy',
        select: 'username', // Include username for createdBy
      })
      .populate({
        path: 'history.modifiedBy',
        select: 'username', // Include username for createdBy
      })
      .populate({
        path: 'history.changes.AssignedTo',
        select: 'username', // Include username for createdBy
      })
      .exec();

    if (completionStatuses.length === 0) {
      return res
        .status(404)
        .json({ message: 'No matching completion status found' });
    }

    // Respond with the completion statuses
    return res.status(200).json(completionStatuses);
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
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

import path from 'path';
import fs from 'fs';

const __dirname = path
  .dirname(new URL(import.meta.url).pathname)
  .replace(/^\/([A-Za-z]):\//, '$1:/');

export const delegateToIT = async (req, res) => {
  const { completionStatusId } = req.params;
  const { itOwnerId, currentUserId } = req.body;

  try {
    let completionStatus = await CompletionStatus.findById(
      completionStatusId
    ).populate('selectedSoftware');

    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    const softwareName = completionStatus.selectedSoftware?.software_name;
    console.log('Software Name:', softwareName);

    // Folder creation logic removed

    // Proceed with the delegation logic
    const changes = {
      status: 'Delegated to IT Team',
      action: 'Delegate to IT',
      AssignedTo: itOwnerId,
    };

    Object.assign(completionStatus, changes);
    logHistory(completionStatus, changes, currentUserId);

    await completionStatus.save();

    // Create a message indicating delegation to IT
    await createMessage(
      itOwnerId,
      `Delegated to IT Team: ${itOwnerId}`,
      completionStatusId
    );

    res.status(200).json({ message: 'Delegated to IT Team', completionStatus });
  } catch (err) {
    console.error('Error in delegateToIT:', err);
    res.status(500).json({ error: err.message });
  }
};

export const delegateToAuditor = async (req, res) => {
  const { completionStatusId } = req.params; // The current user ID is expected in the body, not params.
  const { currentUserId } = req.body; // Move currentUserId to body instead of params

  // Define default auditor
  const defaultAuditor = default_Auditor_Id; // Ensure this is a valid ObjectId

  // Validate ObjectId format
  if (
    !mongoose.Types.ObjectId.isValid(currentUserId) ||
    !mongoose.Types.ObjectId.isValid(defaultAuditor)
  ) {
    return res.status(400).json({ error: 'Invalid User ID' });
  }

  try {
    // Find the completion status by ID
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    // If no completion status is found, return 404 error
    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    // Define changes to be made
    const changes = {
      status: 'Audit Delegated',
      action: 'Delegate to Auditor',
      AssignedBy: currentUserId,
      AssignedTo: defaultAuditor,
    };

    // Merge changes into the completion status object
    Object.assign(completionStatus, changes);

    // Log history for auditing
    logHistory(completionStatus, changes, currentUserId);

    // Save the updated completion status document
    await completionStatus.save();

    // Create a message indicating delegation to Auditor
    await createMessage(
      defaultAuditor,
      `Delegated to Auditor: ${defaultAuditor}`,
      completionStatusId
    );

    // Return success response
    res.status(200).json({ message: 'Delegated to Auditor', completionStatus });
  } catch (err) {
    console.error('Error in delegateToAuditor:', err);
    // Return 500 error if something goes wrong in the try block
    res.status(500).json({ error: err.message });
  }
};

export const delegateToExternalAuditor = async (req, res) => {
  const { completionStatusId } = req.params; // The current user ID is expected in the body, not params.
  const { currentUserId } = req.body; // Move currentUserId to body instead of params

  // Define default auditor
  const ExternalAuditor = default_External_Auditor_Id; // Ensure this is a valid ObjectId

  // Validate ObjectId format
  if (
    !mongoose.Types.ObjectId.isValid(currentUserId) ||
    !mongoose.Types.ObjectId.isValid(ExternalAuditor)
  ) {
    return res.status(400).json({ error: 'Invalid User ID' });
  }

  try {
    // Find the completion status by ID
    let completionStatus = await CompletionStatus.findById(completionStatusId);

    // If no completion status is found, return 404 error
    if (!completionStatus) {
      return res.status(404).json({ error: 'CompletionStatus not found' });
    }

    // Define changes to be made
    const changes = {
      status: 'External Audit Delegated',
      action: 'Delegate to External Auditor',
      AssignedBy: currentUserId,
      AssignedTo: ExternalAuditor,
    };

    // Merge changes into the completion status object
    Object.assign(completionStatus, changes);

    // Log history for auditing
    logHistory(completionStatus, changes, currentUserId);

    // Save the updated completion status document
    await completionStatus.save();

    // Create a message indicating delegation to External Auditor
    await createMessage(
      ExternalAuditor,
      `Delegated to External Auditor: ${ExternalAuditor}`,
      completionStatusId
    );

    // Return success response
    res
      .status(200)
      .json({ message: 'Delegated to External Auditor', completionStatus });
  } catch (err) {
    console.error('Error in delegateToAuditor:', err);
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
    // Create a message indicating confirmation of evidence

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

    // Create a message indicating a query was raised
    await createMessage(
      currentUserId,
      `Raised query for completionStatusId ${completionStatusId}`,
      completionStatusId
    );

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

// Setting status to "Not Applicable (Pending Auditor Confirmation)"
// export const setNotApplicable = async (req, res) => {
//   const { id } = req.params; // ID of the completion status
//   const { userId } = req.body;

//   try {
//     const completionStatus = await CompletionStatus.findById(id);
//     if (!completionStatus) {
//       return res.status(404).json({ message: 'Completion Status not found' });
//     }

//     // Log changes before updating
//     const changes = {};
//     if (
//       completionStatus.status !==
//       'Not Applicable (Pending Auditor Confirmation)'
//     )
//     {
//       changes.status = 'Not Applicable (Pending Auditor Confirmation)',
//       AssignedTo: defaultAuditor
//     }
//     if (completionStatus.isAuditorConfirmedForNotApplicable !== false) {
//       changes.isAuditorConfirmedForNotApplicable = false;
//     }

//     // Update status and confirmation fields
//     completionStatus.status = 'Not Applicable (Pending Auditor Confirmation)';
//     completionStatus.isAuditorConfirmedForNotApplicable = false;

//     // Log history
//     logHistory(completionStatus, changes, userId);

//     await completionStatus.save();
//     res.status(200).json({
//       message:
//         'Status updated to Not Applicable (Pending Auditor Confirmation)',
//       completionStatus,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating status', error });
//   }
// };

export const setNotApplicable = async (req, res) => {
  const { id } = req.params; // ID of the completion status
  const { userId } = req.body;

  try {
    const completionStatus = await CompletionStatus.findById(id);
    if (!completionStatus) {
      return res.status(404).json({ message: 'Completion Status not found' });
    }

    // Track changes for history logging
    const changes = {};
    if (
      completionStatus.status !==
      'Not Applicable (Pending Auditor Confirmation)'
    ) {
      changes.status = 'Not Applicable (Pending Auditor Confirmation)';
      changes.AssignedTo = default_Auditor_Id;
    }
    if (completionStatus.isAuditorConfirmedForNotApplicable !== false) {
      changes.isAuditorConfirmedForNotApplicable = false;
    }

    // Apply changes to the completion status object
    Object.assign(completionStatus, changes);

    // Log history with tracked changes
    logHistory(completionStatus, changes, userId);

    await completionStatus.save();

    res.status(200).json({
      message:
        'Status updated to Not Applicable (Pending Auditor Confirmation)',
      completionStatus,
    });
  } catch (error) {
    console.error('Error in setNotApplicable:', error);
    res.status(500).json({ message: 'Error updating status', error });
  }
};

// Auditor confirms "Not Applicable" status
export const confirmNotApplicable = async (req, res) => {
  const { id } = req.params; // ID of the completion status
  const { userId } = req.body;

  try {
    const completionStatus = await CompletionStatus.findById(id);
    if (!completionStatus) {
      return res.status(404).json({ message: 'Completion Status not found' });
    }

    if (
      completionStatus.status !==
      'Not Applicable (Pending Auditor Confirmation)'
    ) {
      return res
        .status(400)
        .json({ message: 'Status is not pending confirmation' });
    }

    // Log changes before updating
    const changes = {};
    if (completionStatus.status !== 'Not Applicable') {
      changes.status = 'Not Applicable';
    }
    if (completionStatus.isAuditorConfirmedForNotApplicable !== true) {
      changes.isAuditorConfirmedForNotApplicable = true;
    }

    // Update status and confirmation fields
    completionStatus.status = 'Not Applicable';
    completionStatus.isAuditorConfirmedForNotApplicable = true;

    // Log history
    logHistory(completionStatus, changes, userId);

    await completionStatus.save();
    res.status(200).json({
      message: 'Status confirmed as Not Applicable',
      completionStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming status', error });
  }
};
