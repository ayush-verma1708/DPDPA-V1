import CompletionStatus from '../models/CompletionStatusSchema.js';

// Create or update completion status
// export const createOrUpdateStatus = async (req, res) => {
//   const { actionId, assetId, scopeId, controlId, familyId, isCompleted, username } = req.body;
//   try {
//     let status = await CompletionStatus.findOne({ actionId, assetId, scopeId, controlId, familyId });
//     if (status) {
//       status.isCompleted = isCompleted;
//       status.completedAt = isCompleted ? new Date() : null;
//       status.username = username; // Update username
//       await status.save();
//     } else {
//       status = new CompletionStatus({
//         actionId, assetId, scopeId, controlId, familyId, isCompleted, username,
//         completedAt: isCompleted ? new Date() : null
//       });
//       await status.save();
//     }
//     res.status(200).json(status);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const createOrUpdateStatus = async (req, res) => {
//   const { actionId, assetId, scopeId, controlId, familyId, isCompleted, username } = req.body;
//   try {
//     let status = await CompletionStatus.findOne({ actionId, assetId, scopeId, controlId, familyId });
//     if (status) {
//       status.isCompleted = isCompleted;
//       status.completedAt = isCompleted ? new Date() : null;
//       status.username = username;
//       await status.save();
//     } else {
//       status = new CompletionStatus({
//         actionId, assetId, scopeId, controlId, familyId, isCompleted, username,
//         completedAt: isCompleted ? new Date() : null
//       });
//       await status.save();
//     }
//     res.status(200).json(status);
//   } catch (err) {
//     console.error('Error in createOrUpdateStatus:', err);
//     res.status(500).json({ error: err.message });
//   }
// };

export const createOrUpdateStatus = async (req, res) => {
  const { actionId, assetId, scopeId, controlId, familyId, isCompleted, username } = req.body;

  try {
    // Find the existing status based on the unique combination of identifiers
    let status = await CompletionStatus.findOne({ actionId, assetId, scopeId, controlId, familyId });

    // Log the isCompleted value for debugging
    console.log('isCompleted:', isCompleted);

    if (status) {
      // Update existing status
      status.isCompleted = isCompleted;
      status.completedAt = isCompleted ? new Date() : status.completedAt; // Only update if isCompleted is true
      status.username = username;
      await status.save();
    } else {
      // Create new status entry
      status = new CompletionStatus({
        actionId,
        assetId,
        scopeId,
        controlId,
        familyId,
        isCompleted,
        username,
        completedAt: isCompleted ? new Date() : null, // Set completedAt only if isCompleted is true
      });
      await status.save();
    }

    // Return the saved or updated status
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
    const status = await CompletionStatus.findOne({ actionId, assetId, scopeId, controlId, familyId });
    res.status(200).json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Create or update completion status
// export const createOrUpdateStatus = async (req, res) => {
//   const { actionId, assetId, scopeId, controlId, familyId, isCompleted, username } = req.body;
//   try {
//     let status = await CompletionStatus.findOne({ actionId, assetId, scopeId, controlId, familyId });
//     if (status) {
//       status.isCompleted = isCompleted;
//       status.completedAt = isCompleted ? new Date() : null;
//       status.username = username; // Update username
//       await status.save();
//     } else {
//       status = new CompletionStatus({
//         actionId, assetId, scopeId, controlId, familyId, isCompleted, username,
//         completedAt: isCompleted ? new Date() : null
//       });
//       await status.save();
//     }
//     res.status(200).json(status);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Fetch completion status by criteria
// // export const getStatus = async (req, res) => {
// //   const { actionId, assetId, scopeId, controlId, familyId } = req.query;
// //   try {
// //     const status = await CompletionStatus.findOne({ actionId, assetId, scopeId, controlId, familyId  });
// //     res.status(200).json(status);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // Fetch completion status by actionId and assetId
// export const getStatus = async (req, res) => {
//   const { actionId, assetId } = req.query;

//   // Log received query parameters for debugging
//   console.log('Received query parameters:', { actionId, assetId });

//   try {
//     // Find status using only actionId and assetId
//     const status = await CompletionStatus.findOne({ actionId, assetId });

//     if (!status) {
//       return res.status(404).json({ error: 'No matching status found' });
//     }

//     res.status(200).json(status);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
