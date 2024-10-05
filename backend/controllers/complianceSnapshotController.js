import { Asset } from '../models/asset.model.js'; // Adjust the path as necessary
import CompletionStatus from '../models/completionStatusSchema.js'; // Adjust the path as necessary
import { ComplianceSnapshot } from '../models/ComplianceSnapshotSchema.js'; // Adjust the path as necessary

// import { utils, write } from 'xlsx'; // Correct import from xlsx

import { utils, write } from 'xlsx';

export const exportComplianceSnapshotToExcel = async (req, res) => {
  try {
    // Fetch the latest compliance snapshot
    const latestSnapshot = await ComplianceSnapshot.findOne()
      .sort({ timestamp: -1 })
      .populate('assets.assetId'); // Adjust based on how you structure your assets

    if (!latestSnapshot) {
      return res.status(404).json({ error: 'No compliance snapshots found' });
    }

    // Calculate aggregated fields for data analysis
    const totalAssets = latestSnapshot.assets.length; // Total number of assets
    let totalCompleted = 0; // Counter for completed assets
    let totalRiskScore = 0; // Accumulate risk score if applicable

    // Prepare the data for Excel, ensuring all fields are properly mapped
    const dataForAnalysis = latestSnapshot.assets.map((asset) => {
      const completionStatus = asset.completionStatus || {};
      const history = completionStatus.history || [];

      // Count completed assets and risk scores (if part of your dataset)
      if (completionStatus.isCompleted) {
        totalCompleted++;
      }
      totalRiskScore += completionStatus.riskScore || 0; // Assume riskScore is a field, adjust as needed

      return {
        timestamp: latestSnapshot.timestamp || '', // Fill with default or empty if missing
        totalAssets: totalAssets,
        assetId: asset.assetId._id || asset.assetId, // Asset ID (populated or default)
        name: asset.assetId.name || asset.name || 'Unknown', // Fallback for name
        type: asset.assetId.type || asset.type || 'Unknown', // Fallback for type
        description:
          asset.assetId.description || asset.desc || 'No Description',
        isScoped: asset.isScoped !== undefined ? asset.isScoped : 'N/A',
        isCompleted:
          completionStatus.isCompleted !== undefined
            ? completionStatus.isCompleted
            : 'N/A',
        feedback: completionStatus.feedback || 'No Feedback',
        riskScore: completionStatus.riskScore || 'N/A', // Adjust if not applicable
        historyCount: history.length, // Number of history entries for this asset
        // Add more fields here based on your model
      };
    });

    // Add overall calculated fields for analysis
    dataForAnalysis.push({
      timestamp: 'Summary', // Mark this row as a summary
      totalAssets: totalAssets,
      completedAssets: totalCompleted,
      totalRiskScore: totalRiskScore, // Add total risk score or other aggregated data
      // Leave other fields empty for this summary row
    });

    // Create a new workbook and add the data as a worksheet
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(dataForAnalysis);

    // Add worksheet to the workbook
    utils.book_append_sheet(
      workbook,
      worksheet,
      'Compliance Snapshot Analysis'
    );

    // Write the workbook to a buffer
    const buffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Set the response headers for file download
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=compliance_snapshot_analysis.xlsx'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    // Send the buffer
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting compliance snapshot for analysis:', error);
    res
      .status(500)
      .json({ error: 'Failed to export compliance snapshot for analysis' });
  }
};

// export const exportComplianceSnapshotToExcel = async (req, res) => {
//   try {
//     // Fetch the latest compliance snapshot
//     const latestSnapshot = await ComplianceSnapshot.findOne()
//       .sort({ timestamp: -1 })
//       .populate('assets.assetId'); // Adjust if necessary based on your data model

//     if (!latestSnapshot) {
//       return res.status(404).json({ error: 'No compliance snapshots found' });
//     }

//     // Prepare data for Excel export
//     const data = latestSnapshot.assets.map((asset) => ({
//       timestamp: latestSnapshot.timestamp,
//       totalAssets: latestSnapshot.totalAssets,
//       assetId: asset.assetId._id || asset.assetId, // Asset ID (use the populated value if available)
//       name: asset.assetId.name || asset.name,
//       type: asset.assetId.type || asset.type,
//       description: asset.assetId.description || asset.desc,
//       isScoped: asset.isScoped,
//       isCompleted: asset.completionStatus.isCompleted,
//       feedback: asset.completionStatus.feedback,
//       history: asset.completionStatus.history.map((historyEntry) => ({
//         modifiedAt: historyEntry.modifiedAt,
//         modifiedBy: historyEntry.modifiedBy,
//         ...historyEntry.changes,
//       })),
//     }));

//     // Flatten the history and create a structure for Excel
//     const flattenedData = data.flatMap((asset) => {
//       return asset.history.map((historyEntry) => ({
//         timestamp: asset.timestamp,
//         totalAssets: asset.totalAssets,
//         assetId: asset.assetId,
//         name: asset.name,
//         type: asset.type,
//         description: asset.description,
//         isScoped: asset.isScoped,
//         isCompleted: asset.isCompleted,
//         feedback: asset.feedback,
//         modifiedAt: historyEntry.modifiedAt,
//         modifiedBy: historyEntry.modifiedBy,
//         actionId: historyEntry.actionId,
//         isCompleted: historyEntry.isCompleted,
//         isEvidenceUploaded: historyEntry.isEvidenceUploaded,
//         controlId: historyEntry.controlId,
//         familyId: historyEntry.familyId,
//       }));
//     });

//     // Create a new workbook and convert the flattened data to a sheet
//     const workbook = utils.book_new();
//     const worksheet = utils.json_to_sheet(flattenedData);

//     // Add the worksheet to the workbook
//     utils.book_append_sheet(workbook, worksheet, 'Latest Compliance Snapshot');

//     // Write the workbook to a buffer
//     const buffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });

//     // Set the response headers to download the file
//     res.setHeader(
//       'Content-Disposition',
//       'attachment; filename=compliance_snapshot_latest.xlsx'
//     );
//     res.setHeader(
//       'Content-Type',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     );

//     // Send the buffer as the response
//     res.send(buffer);
//   } catch (error) {
//     console.error('Error exporting compliance snapshot to Excel:', error);
//     res.status(500).json({ error: 'Failed to export compliance snapshot' });
//   }
// };
// export const exportComplianceSnapshotToExcel = async (req, res) => {
//     try {
//       // Fetch the latest compliance snapshot
//       const latestSnapshot = await ComplianceSnapshot.findOne()
//         .sort({ timestamp: -1 })
//         .populate('assets.assetId'); // Adjust if necessary based on how you structure your assets

//       if (!latestSnapshot) {
//         return res.status(404).json({ error: 'No compliance snapshots found' });
//       }

//       // Prepare data for Excel
//       const data = latestSnapshot.assets.map((asset) => ({
//         timestamp: latestSnapshot.timestamp,
//         totalAssets: latestSnapshot.totalAssets,
//         assetId: asset.assetId,
//         name: asset.name,
//         type: asset.type,
//         desc: asset.desc,
//         isScoped: asset.isScoped,
//         isCompleted: asset.completionStatus.isCompleted,
//         feedback: asset.completionStatus.feedback,
//         history: asset.completionStatus.history.map(historyEntry => ({
//           modifiedAt: historyEntry.modifiedAt,
//           modifiedBy: historyEntry.modifiedBy,
//           ...historyEntry.changes,
//         })),
//       }));

//       // Create a new workbook and add a worksheet
//       const workbook = utils.book_new();

//       // Flattening the history for each asset to export
//       const flattenedData = data.flatMap(asset => {
//         return asset.history.map(historyEntry => ({
//           timestamp: asset.timestamp,
//           totalAssets: asset.totalAssets,
//           assetId: asset.assetId,
//           name: asset.name,
//           type: asset.type,
//           desc: asset.desc,
//           isScoped: asset.isScoped,
//           isCompleted: asset.isCompleted,
//           feedback: asset.feedback,
//           modifiedAt: historyEntry.modifiedAt,
//           modifiedBy: historyEntry.modifiedBy,
//           actionId: historyEntry.actionId,
//           isCompleted: historyEntry.isCompleted,
//           isEvidenceUploaded: historyEntry.isEvidenceUploaded,
//           controlId: historyEntry.controlId,
//           familyId: historyEntry.familyId,
//         }));
//       });

//       const worksheet = utils.json_to_sheet(flattenedData); // Convert the flattened data to a sheet

//       // Add worksheet to workbook
//       utils.book_append_sheet(workbook, worksheet, 'Latest Compliance Snapshot');

//       // Write the workbook to a buffer
//       const buffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });

//       // Set the response headers to download the file
//       res.setHeader(
//         'Content-Disposition',
//         'attachment; filename=compliance_snapshot_latest.xlsx'
//       );
//       res.setHeader(
//         'Content-Type',
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       );

//       // Send the buffer
//       res.send(buffer);
//     } catch (error) {
//       console.error('Error exporting compliance snapshot to Excel:', error);
//       res.status(500).json({ error: 'Failed to export compliance snapshot' });
//     }
//   };

// export const exportComplianceSnapshotToExcel = async (req, res) => {
//   try {
//     // Fetch the latest compliance snapshot
//     const latestSnapshot = await ComplianceSnapshot.findOne()
//       .sort({ timestamp: -1 })
//       .populate('assets.assetId');

//     if (!latestSnapshot) {
//       return res.status(404).json({ error: 'No compliance snapshots found' });
//     }

//     // Prepare data for Excel
//     const data = {
//       timestamp: latestSnapshot.timestamp,
//       totalAssets: latestSnapshot.totalAssets,
//       overallRiskScore: latestSnapshot.overallRiskScore,
//       assets: latestSnapshot.assets.map((asset) => ({
//         assetId: asset.assetId, // Populate to get full asset details
//         name: asset.name,
//         type: asset.type,
//         desc: asset.desc,
//         isScoped: asset.isScoped,
//         isCompleted: asset.completionStatus.isCompleted,
//         feedback: asset.completionStatus.feedback,
//       })),
//     };

//     // Create a new workbook and add a worksheet
//     const workbook = utils.book_new();
//     const worksheet = utils.json_to_sheet([data]); // Wrap data in an array for a single row

//     // Add worksheet to workbook
//     utils.book_append_sheet(workbook, worksheet, 'Latest Compliance Snapshot');

//     // Write the workbook to a buffer
//     const buffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });

//     // Set the response headers to download the file
//     res.setHeader(
//       'Content-Disposition',
//       'attachment; filename=compliance_snapshot_latest.xlsx'
//     );
//     res.setHeader(
//       'Content-Type',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     );

//     // Send the buffer
//     res.send(buffer);
//   } catch (error) {
//     console.error('Error exporting compliance snapshot to Excel:', error);
//     res.status(500).json({ error: 'Failed to export compliance snapshot' });
//   }
// };

// export const exportComplianceSnapshotToExcel = async (req, res) => {
//   try {
//     // Fetch all compliance snapshots
//     const snapshots = await ComplianceSnapshot.find();

//     // Prepare data for Excel
//     const data = snapshots.map((snapshot) => ({
//       timestamp: snapshot.timestamp,
//       totalAssets: snapshot.totalAssets,
//       overallRiskScore: snapshot.overallRiskScore,
//       assets: snapshot.assets.map((asset) => ({
//         assetId: asset.assetId,
//         name: asset.name,
//         type: asset.type,
//         desc: asset.desc,
//         isScoped: asset.isScoped,
//         isCompleted: asset.completionStatus.isCompleted,
//         feedback: asset.completionStatus.feedback,
//       })),
//     }));

//     // Create a new workbook and add a worksheet
//     const workbook = utils.book_new();
//     const worksheet = utils.json_to_sheet(data);

//     // Add worksheet to workbook
//     utils.book_append_sheet(workbook, worksheet, 'Compliance Snapshots');

//     // Write the workbook to a buffer
//     const buffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });

//     // Set the response headers to download the file
//     res.setHeader(
//       'Content-Disposition',
//       'attachment; filename=compliance_snapshots.xlsx'
//     );
//     res.setHeader(
//       'Content-Type',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     );

//     // Send the buffer
//     res.send(buffer);
//   } catch (error) {
//     console.error('Error exporting compliance snapshot to Excel:', error);
//     res.status(500).json({ error: 'Failed to export compliance snapshot' });
//   }
// };

export const createComplianceSnapshot = async (req, res) => {
  try {
    // Fetch all assets
    const assets = await Asset.find();

    // Prepare compliance snapshot object
    const snapshotData = {
      timestamp: new Date(),
      totalAssets: assets.length,
      assets: [],
    };

    for (const asset of assets) {
      // Get completion statuses for the asset
      const completionStatuses = await CompletionStatus.find({
        assetId: asset._id,
      });

      const assetData = {
        assetId: asset._id,
        name: asset.name,
        type: asset.type,
        desc: asset.desc,
        isScoped: asset.isScoped,
        completionStatus: {
          isCompleted: completionStatuses.every((status) => status.isCompleted),
          feedback: completionStatuses
            .map((status) => status.feedback)
            .join(', '),
          history: completionStatuses.flatMap((status) => status.history), // Flatten history arrays from all statuses
        },
      };

      snapshotData.assets.push(assetData);
    }

    // Optionally calculate overall risk score based on asset completion statuses
    // Assuming you have a function calculateOverallRisk in CompletionStatus model
    const overallRiskData = await CompletionStatus.calculateOverallRisk();
    snapshotData.overallRiskScore = overallRiskData.totalRiskScore;

    // Save the snapshot in the ComplianceSnapshot collection
    const complianceSnapshot = new ComplianceSnapshot(snapshotData);
    await complianceSnapshot.save();

    res.status(201).json(complianceSnapshot);
  } catch (error) {
    console.error('Error creating compliance snapshot:', error);
    res.status(500).json({ error: 'Failed to create compliance snapshot' });
  }
};
