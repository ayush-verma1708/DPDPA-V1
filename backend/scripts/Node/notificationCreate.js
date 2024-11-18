import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CompletionStatus from '../../models/completionStatusSchema.js'; // Adjust path
import Notification from '../../models/notificationSchema.js';
import { Asset } from '../../models/asset.model.js'; // Adjust the import path for the Asset model

dotenv.config(); // Load environment variables from .env file

// Function to get the formatted asset ID
function formatAssetId(assetId) {
  const assetIdStr = assetId.toString();
  // Get the last four characters and prepend with "xxxx"
  return `xxxx${assetIdStr.slice(-4)}`;
}

// Function to generate notifications based on asset status
export async function generateGroupedNotificationsForAssets() {
  try {
    // Fetch all CompletionStatus entries
    const allStatuses = await CompletionStatus.find().populate('controlId'); // Populate if needed

    console.log(`Found ${allStatuses.length} total actions.`);

    // Group CompletionStatus entries by assetId
    const assetStatusesMap = {};
    allStatuses.forEach((status) => {
      if (!assetStatusesMap[status.assetId]) {
        assetStatusesMap[status.assetId] = [];
      }
      assetStatusesMap[status.assetId].push(status);
    });

    // Object to track notifications for assets
    const assetNotificationMap = {};

    // Fetch asset details for all relevant asset IDs
    const assetIds = Object.keys(assetStatusesMap); // Unique asset IDs from statuses
    const assets = await Asset.find({ _id: { $in: assetIds } }); // Fetch all relevant assets

    const assetMap = {}; // Create a map for quick lookup of asset names
    assets.forEach((asset) => {
      assetMap[asset._id] = asset.name; // Assuming each asset has a 'name' field
    });

    // Fetch existing notifications to avoid creating duplicates
    const existingNotifications = await Notification.find({
      assetId: { $in: assetIds },
      isRead: false, // Only consider unread notifications to avoid creating duplicates
    });

    // Create a Set to track existing notifications based on assetId
    const existingAssetIds = new Set(
      existingNotifications.map((notif) => notif.assetId.toString())
    );

    // Handle statuses grouped by asset
    for (const assetId in assetStatusesMap) {
      const statuses = assetStatusesMap[assetId];

      // Check if all statuses are completed
      const allCompleted = statuses.every(
        (status) => status.isCompleted === true
      );

      const assetName = assetMap[assetId]; // Lookup the asset name
      let message = '';

      // Format the asset ID for display
      const formattedAssetId = formatAssetId(assetId);

      if (allCompleted) {
        message = `All actions completed for asset "${assetName}" (${formattedAssetId}). Good job!`;

        // Check if the asset already has a notification
        const existingNotification = existingNotifications.find(
          (notif) => notif.assetId.toString() === assetId.toString()
        );

        if (existingNotification) {
          // Update the existing notification
          existingNotification.message = message;
          existingNotification.status = 'completed'; // Update the status to completed
          await existingNotification.save();
          console.log(`Updated notification for asset "${assetName}".`);
        } else {
          // Create a new notification if it doesn't exist
          assetNotificationMap[assetId] = {
            assignedTo: null, // Optionally assign a user or leave null
            message: message,
            isRead: false,
            createdAt: new Date(),
            assetId: assetId, // Store assetId
            status: 'completed', // Set status to completed
          };
        }
      } else {
        // Handle incomplete statuses for high or critical control if needed
        for (const status of statuses) {
          // Loop through each status
          const controlCriticality = status.controlId?.criticality; // Assuming controlId exists
          if (
            controlCriticality === 'high' ||
            controlCriticality === 'critical'
          ) {
            message = `Pending actions for asset "${assetName}" (${formattedAssetId}). Please check!`;

            // Only notify for high/critical if no notification exists already
            if (!existingAssetIds.has(assetId.toString())) {
              assetNotificationMap[assetId] = {
                assignedTo: null,
                message: message,
                isRead: false,
                createdAt: new Date(),
                assetId: assetId,
                status: 'pending', // Set status to pending
              };
            }
            console.log(
              `Notification for pending actions created for asset "${assetName}".`
            );
            break; // Stop checking once a notification is created
          }
        }
      }
    }

    // Convert the map to an array for database insertion
    const notificationsToCreate = Object.values(assetNotificationMap);

    // Insert notifications into the Notification collection
    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate);
      console.log(`Created ${notificationsToCreate.length} notifications.`);
    } else {
      console.log('No relevant asset notifications to create.');
    }
  } catch (error) {
    console.error('Error generating notifications for assets:', error);
  } finally {
    console.log('All notifications processed.');
  }
}

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import CompletionStatus from '../../models/completionStatusSchema.js'; // Adjust path
// import Notification from '../models/notificationSchema.js';
// import { Asset } from '../models/asset.model.js'; // Adjust the import path for the Asset model

// dotenv.config(); // Load environment variables from .env file

// // Function to get the formatted asset ID
// function formatAssetId(assetId) {
//   const assetIdStr = assetId.toString();
//   // Get the last four characters and prepend with "xxxx"
//   return `xxxx${assetIdStr.slice(-4)}`;
// }

// // Function to generate notifications based on asset status
// export async function generateGroupedNotificationsForAssets() {
//   try {
//     // Fetch all CompletionStatus entries
//     const allStatuses = await CompletionStatus.find().populate('controlId'); // Populate if needed

//     console.log(`Found ${allStatuses.length} total actions.`);

//     // Group CompletionStatus entries by assetId
//     const assetStatusesMap = {};
//     allStatuses.forEach((status) => {
//       if (!assetStatusesMap[status.assetId]) {
//         assetStatusesMap[status.assetId] = [];
//       }
//       assetStatusesMap[status.assetId].push(status);
//     });

//     // Object to track notifications for assets
//     const assetNotificationMap = {};

//     // Fetch asset details for all relevant asset IDs
//     const assetIds = Object.keys(assetStatusesMap); // Unique asset IDs from statuses
//     const assets = await Asset.find({ _id: { $in: assetIds } }); // Fetch all relevant assets

//     const assetMap = {}; // Create a map for quick lookup of asset names
//     assets.forEach((asset) => {
//       assetMap[asset._id] = asset.name; // Assuming each asset has a 'name' field
//     });

//     // Fetch existing notifications to avoid creating duplicates
//     const existingNotifications = await Notification.find({
//       assetId: { $in: assetIds },
//       isRead: false, // Only consider unread notifications to avoid creating duplicates
//     });

//     // Create a Set to track existing notifications based on assetId
//     const existingAssetIds = new Set(
//       existingNotifications.map((notif) => notif.assetId.toString())
//     );

//     // Handle statuses grouped by asset
//     for (const assetId in assetStatusesMap) {
//       const statuses = assetStatusesMap[assetId];

//       // Check if all statuses are completed
//       const allCompleted = statuses.every(
//         (status) => status.isCompleted === true
//       );

//       const assetName = assetMap[assetId]; // Lookup the asset name
//       let message = '';

//       // Format the asset ID for display
//       const formattedAssetId = formatAssetId(assetId);

//       if (allCompleted) {
//         message = `All actions completed for asset "${assetName}" (${formattedAssetId}). Good job!`;

//         // Check if the asset already has a notification
//         const existingNotification = existingNotifications.find(
//           (notif) => notif.assetId.toString() === assetId.toString()
//         );

//         if (existingNotification) {
//           // Update the existing notification
//           existingNotification.message = message;
//           existingNotification.status = 'completed'; // Update the status to completed
//           await existingNotification.save();
//           console.log(`Updated notification for asset "${assetName}".`);
//         } else {
//           // Create a new notification if it doesn't exist
//           assetNotificationMap[assetId] = {
//             assignedTo: null, // Optionally assign a user or leave null
//             message: message,
//             isRead: false,
//             createdAt: new Date(),
//             assetId: assetId, // Store assetId
//             status: 'completed', // Set status to completed
//           };
//         }
//       } else {
//         // Handle incomplete statuses for high or critical control if needed
//         for (const status of statuses) {
//           // Loop through each status
//           const controlCriticality = status.controlId?.criticality; // Assuming controlId exists
//           if (
//             controlCriticality === 'high' ||
//             controlCriticality === 'critical'
//           ) {
//             message = `Pending actions for asset "${assetName}" (${formattedAssetId}). Please check!`;

//             // Only notify for high/critical if no notification exists already
//             if (!existingAssetIds.has(assetId.toString())) {
//               assetNotificationMap[assetId] = {
//                 assignedTo: null,
//                 message: message,
//                 isRead: false,
//                 createdAt: new Date(),
//                 assetId: assetId,
//                 status: 'pending', // Set status to pending
//               };
//             }
//             console.log(
//               `Notification for pending actions created for asset "${assetName}".`
//             );
//             break; // Stop checking once a notification is created
//           }
//         }
//       }
//     }

//     // Convert the map to an array for database insertion
//     const notificationsToCreate = Object.values(assetNotificationMap);

//     // Insert notifications into the Notification collection
//     if (notificationsToCreate.length > 0) {
//       await Notification.insertMany(notificationsToCreate);
//       console.log(`Created ${notificationsToCreate.length} notifications.`);
//     } else {
//       console.log('No relevant asset notifications to create.');
//     }
//   } catch (error) {
//     console.error('Error generating notifications for assets:', error);
//   } finally {
//     console.log('All notifications processed.');
//   }
// }

// // Run the script
// // generateGroupedNotificationsForAssets();
// export default generateGroupedNotificationsForAssets();

// // import mongoose from 'mongoose';
// // import dotenv from 'dotenv';
// // import CompletionStatus from '../models/completionStatusSchema.js'; // Adjust path
// // import Notification from '../models/notificationSchema.js';
// // import { Asset } from '../models/asset.model.js'; // Adjust the import path for the Asset model

// // dotenv.config(); // Load environment variables from .env file

// // // Function to generate notifications based on asset status
// // export async function generateGroupedNotificationsForAssets() {
// //   try {
// //     // Fetch all CompletionStatus entries
// //     const allStatuses = await CompletionStatus.find().populate('controlId'); // Populate if needed

// //     console.log(`Found ${allStatuses.length} total actions.`);

// //     // Group CompletionStatus entries by assetId
// //     const assetStatusesMap = {};
// //     allStatuses.forEach((status) => {
// //       if (!assetStatusesMap[status.assetId]) {
// //         assetStatusesMap[status.assetId] = [];
// //       }
// //       assetStatusesMap[status.assetId].push(status);
// //     });

// //     // Object to track notifications for assets
// //     const assetNotificationMap = {};

// //     // Fetch asset details for all relevant asset IDs
// //     const assetIds = Object.keys(assetStatusesMap); // Unique asset IDs from statuses
// //     const assets = await Asset.find({ _id: { $in: assetIds } }); // Fetch all relevant assets

// //     const assetMap = {}; // Create a map for quick lookup of asset names
// //     assets.forEach((asset) => {
// //       assetMap[asset._id] = asset.name; // Assuming each asset has a 'name' field
// //     });

// //     // Fetch existing notifications to avoid creating duplicates
// //     const existingNotifications = await Notification.find({
// //       assetId: { $in: assetIds },
// //       isRead: false, // Only consider unread notifications to avoid creating duplicates
// //     });

// //     // Create a Set to track existing notifications based on assetId
// //     const existingAssetIds = new Set(
// //       existingNotifications.map((notif) => notif.assetId.toString())
// //     );

// //     // Handle statuses grouped by asset
// //     for (const assetId in assetStatusesMap) {
// //       const statuses = assetStatusesMap[assetId];

// //       // Check if all statuses are completed
// //       const allCompleted = statuses.every(
// //         (status) => status.isCompleted === true
// //       );

// //       const assetName = assetMap[assetId]; // Lookup the asset name
// //       let message = '';

// //       if (allCompleted) {
// //         message = `All actions completed for asset "${assetName}""${assetId}". Good job!`;

// //         // Check if the asset already has a notification
// //         const existingNotification = existingNotifications.find(
// //           (notif) => notif.assetId.toString() === assetId.toString()
// //         );

// //         if (existingNotification) {
// //           // Update the existing notification
// //           existingNotification.message = message;
// //           existingNotification.status = 'completed'; // Update the status to completed
// //           await existingNotification.save();
// //           console.log(`Updated notification for asset "${assetName}".`);
// //         } else {
// //           // Create a new notification if it doesn't exist
// //           assetNotificationMap[assetId] = {
// //             assignedTo: null, // Optionally assign a user or leave null
// //             message: message,
// //             isRead: false,
// //             createdAt: new Date(),
// //             assetId: assetId, // Store assetId
// //             status: 'completed', // Set status to completed
// //           };
// //         }
// //       } else {
// //         // Handle incomplete statuses for high or critical control if needed
// //         for (const status of statuses) {
// //           // Loop through each status
// //           const controlCriticality = status.controlId?.criticality; // Assuming controlId exists
// //           if (
// //             controlCriticality === 'high' ||
// //             controlCriticality === 'critical'
// //           ) {
// //             message = `Pending actions for asset "${assetName}". Please check!`;

// //             // Only notify for high/critical if no notification exists already
// //             if (!existingAssetIds.has(assetId.toString())) {
// //               assetNotificationMap[assetId] = {
// //                 assignedTo: null,
// //                 message: message,
// //                 isRead: false,
// //                 createdAt: new Date(),
// //                 assetId: assetId,
// //                 status: 'pending', // Set status to pending
// //               };
// //             }
// //             console.log(
// //               `Notification for pending actions created for asset "${assetName}".`
// //             );
// //             break; // Stop checking once a notification is created
// //           }
// //         }
// //       }
// //     }

// //     // Convert the map to an array for database insertion
// //     const notificationsToCreate = Object.values(assetNotificationMap);

// //     // Insert notifications into the Notification collection
// //     if (notificationsToCreate.length > 0) {
// //       await Notification.insertMany(notificationsToCreate);
// //       console.log(`Created ${notificationsToCreate.length} notifications.`);
// //     } else {
// //       console.log('No relevant asset notifications to create.');
// //     }
// //   } catch (error) {
// //     console.error('Error generating notifications for assets:', error);
// //   } finally {
// //     console.log('All notifications processed.');
// //   }
// // }

// // // Run the script
// // generateGroupedNotificationsForAssets();
