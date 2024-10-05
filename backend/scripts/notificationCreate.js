import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CompletionStatus from '../models/completionStatusSchema.js'; // Adjust path
import Notification from '../models/notificationSchema.js';
import { Asset } from '../models/asset.model.js'; // Adjust the import path for the Asset model

dotenv.config();

export async function generateGroupedNotificationsForAssets() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully.');

    // Fetch all CompletionStatus entries where the action is not completed
    const statuses = await CompletionStatus.find({
      isCompleted: false,
    }).populate('controlId'); // Assuming 'controlId' has the criticality info

    console.log(`Found ${statuses.length} incomplete actions.`);

    // Object to track notifications for assets
    const assetNotificationMap = {};

    // Fetch asset details for the asset IDs found in statuses
    const assetIds = [...new Set(statuses.map((status) => status.assetId))]; // Unique asset IDs
    const assets = await Asset.find({ _id: { $in: assetIds } }); // Fetch all relevant assets

    const assetMap = {}; // Create a map for quick lookup of asset names
    assets.forEach((asset) => {
      assetMap[asset._id] = asset.name; // Assuming each asset has a 'name' field
    });

    // Fetch existing notifications to avoid duplicates
    const existingNotifications = await Notification.find({
      assetId: { $in: assetIds },
      isRead: false, // Only consider unread notifications
    });

    // Create a Set of existing asset IDs for quick lookup
    const existingAssetIds = new Set(
      existingNotifications.map((notif) => notif.assetId)
    );

    statuses.forEach((status) => {
      const controlCriticality = status.controlId.criticality; // Assuming criticality is stored in controlId

      // Only process if the criticality is "high" or "critical"
      if (controlCriticality === 'high' || controlCriticality === 'critical') {
        // Check if a notification for this asset already exists
        if (!existingAssetIds.has(status.assetId)) {
          // Create a message based on criticality
          const assetName = assetMap[status.assetId]; // Lookup the asset name

          let message = '';

          if (controlCriticality === 'critical') {
            message = `Critical control pending for asset "${assetName}" (ID: ${status.assetId}). Immediate attention required.`;
          } else if (controlCriticality === 'high') {
            message = `High-priority control pending for asset "${assetName}" (ID: ${status.assetId}). Please address soon.`;
          }

          // Store the notification message and asset ID for this asset
          assetNotificationMap[status.assetId] = {
            assignedTo: null, // Optionally assign a user or leave null
            message: message,
            isRead: false,
            createdAt: new Date(),
            assetId: status.assetId, // Store assetId
          };
        }
      }
    });

    // Convert the map to an array for database insertion
    const notificationsToCreate = Object.values(assetNotificationMap);

    // Insert notifications into the Notification collection
    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate);
      console.log(`Created ${notificationsToCreate.length} notifications.`);
    } else {
      console.log('No high or critical asset notifications to create.');
    }
  } catch (error) {
    console.error(
      'Error generating notifications for high and critical assets:',
      error
    );
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the script
generateGroupedNotificationsForAssets();

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import CompletionStatus from '../models/completionStatusSchema.js'; // Adjust path
// import Notification from '../models/notificationSchema.js';
// import { Asset } from '../models/asset.model.js'; // Adjust the import path for the Asset model

// dotenv.config();

// async function generateGroupedNotificationsForAssets() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB successfully.');

//     // Fetch all CompletionStatus entries where the action is not completed
//     const statuses = await CompletionStatus.find({
//       isCompleted: false,
//     }).populate('controlId'); // Assuming 'controlId' has the criticality info

//     console.log(`Found ${statuses.length} incomplete actions.`);

//     // Object to track notifications for assets
//     const assetNotificationMap = {};

//     // Fetch asset details for the asset IDs found in statuses
//     const assetIds = [...new Set(statuses.map((status) => status.assetId))]; // Unique asset IDs
//     const assets = await Asset.find({ _id: { $in: assetIds } }); // Fetch all relevant assets

//     const assetMap = {}; // Create a map for quick lookup of asset names
//     assets.forEach((asset) => {
//       assetMap[asset._id] = asset.name; // Assuming each asset has a 'name' field
//     });

//     statuses.forEach((status) => {
//       const controlCriticality = status.controlId.criticality; // Assuming criticality is stored in controlId

//       // Only process if the criticality is "high" or "critical"
//       if (controlCriticality === 'high' || controlCriticality === 'critical') {
//         // Create a message based on criticality if it doesn't exist
//         if (!assetNotificationMap[status.assetId]) {
//           const assetName = assetMap[status.assetId]; // Lookup the asset name

//           let message = '';

//           if (controlCriticality === 'critical') {
//             message = `Critical control pending for asset "${assetName}" (ID: ${status.assetId}). Immediate attention required.`;
//           } else if (controlCriticality === 'high') {
//             message = `High-priority control pending for asset "${assetName}" (ID: ${status.assetId}). Please address soon.`;
//           }

//           // Store the notification message and asset ID for this asset
//           assetNotificationMap[status.assetId] = {
//             assignedTo: null, // Optionally assign a user or leave null
//             message: message,
//             isRead: false,
//             createdAt: new Date(),
//             assetId: status.assetId, // Store assetId
//           };
//         }
//       }
//     });

//     // Convert the map to an array for database insertion
//     const notificationsToCreate = Object.values(assetNotificationMap);

//     // Insert notifications into the Notification collection
//     if (notificationsToCreate.length > 0) {
//       await Notification.insertMany(notificationsToCreate);
//       console.log(`Created ${notificationsToCreate.length} notifications.`);
//     } else {
//       console.log('No high or critical asset notifications to create.');
//     }
//   } catch (error) {
//     console.error(
//       'Error generating notifications for high and critical assets:',
//       error
//     );
//   } finally {
//     // Close MongoDB connection
//     mongoose.connection.close();
//     console.log('MongoDB connection closed.');
//   }
// }

// // Run the script
// generateGroupedNotificationsForAssets();

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import CompletionStatus from '../models/completionStatusSchema.js'; // Adjust path
// import Notification from '../models/notificationSchema.js';

// dotenv.config();

// async function generateGroupedNotificationsForAssets() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB successfully.');

//     // Fetch all CompletionStatus entries where the action is not completed
//     const statuses = await CompletionStatus.find({
//       isCompleted: false,
//     }).populate('controlId'); // Assuming 'controlId' has the criticality info

//     console.log(`Found ${statuses.length} incomplete actions.`);

//     // Object to track notifications for assets
//     const assetNotificationMap = {};

//     statuses.forEach((status) => {
//       const controlCriticality = status.controlId.criticality; // Assuming criticality is stored in controlId

//       // Only process if the criticality is "high" or "critical"
//       if (controlCriticality === 'high' || controlCriticality === 'critical') {
//         // Create a message based on criticality if it doesn't exist
//         if (!assetNotificationMap[status.assetId]) {
//           let message = '';

//           if (controlCriticality === 'critical') {
//             message = `Critical control pending for asset ${status.assetId}. Immediate attention required.`;
//           } else if (controlCriticality === 'high') {
//             message = `High-priority control pending for asset ${status.assetId}. Please address soon.`;
//           }

//           // Store the notification message and asset ID for this asset
//           assetNotificationMap[status.assetId] = {
//             assignedTo: null, // Optionally assign a user or leave null
//             message: message,
//             isRead: false,
//             createdAt: new Date(),
//             assetId: status.assetId, // Store assetId
//           };
//         }
//       }
//     });

//     // Convert the map to an array for database insertion
//     const notificationsToCreate = Object.values(assetNotificationMap);

//     // Insert notifications into the Notification collection
//     if (notificationsToCreate.length > 0) {
//       await Notification.insertMany(notificationsToCreate);
//       console.log(`Created ${notificationsToCreate.length} notifications.`);
//     } else {
//       console.log('No high or critical asset notifications to create.');
//     }
//   } catch (error) {
//     console.error(
//       'Error generating notifications for high and critical assets:',
//       error
//     );
//   } finally {
//     // Close MongoDB connection
//     mongoose.connection.close();
//     console.log('MongoDB connection closed.');
//   }
// }

// // Run the script
// generateGroupedNotificationsForAssets();

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import CompletionStatus from '../models/completionStatusSchema.js'; // Adjust path
// import Notification from '../models/notificationSchema.js';

// dotenv.config();

// async function generateGroupedNotificationsForAssets() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB successfully.');

//     // Fetch all CompletionStatus entries where the action is not completed
//     const statuses = await CompletionStatus.find({
//       isCompleted: false,
//     }).populate('controlId'); // Assuming 'controlId' has the criticality info

//     console.log(`Found ${statuses.length} incomplete actions.`);

//     // Object to track notifications for assets
//     const assetNotificationMap = {};

//     statuses.forEach((status) => {
//       const controlCriticality = status.controlId.criticality; // Assuming criticality is stored in controlId

//       // Only process if the criticality is "high" or "critical"
//       if (controlCriticality === 'high' || controlCriticality === 'critical') {
//         // Create a message based on criticality if it doesn't exist
//         if (!assetNotificationMap[status.assetId]) {
//           let message = '';

//           if (controlCriticality === 'critical') {
//             message = `Critical control pending for asset ${status.assetId}. Immediate attention required.`;
//           } else if (controlCriticality === 'high') {
//             message = `High-priority control pending for asset ${status.assetId}. Please address soon.`;
//           }

//           // Store the notification message for this asset
//           assetNotificationMap[status.assetId] = {
//             assignedTo: null, // Optionally assign a user or leave null
//             message: message,
//             isRead: false,
//             createdAt: new Date(),
//           };
//         }
//       }
//     });

//     // Convert the map to an array for database insertion
//     const notificationsToCreate = Object.values(assetNotificationMap);

//     // Insert notifications into the Notification collection
//     if (notificationsToCreate.length > 0) {
//       await Notification.insertMany(notificationsToCreate);
//       console.log(`Created ${notificationsToCreate.length} notifications.`);
//     } else {
//       console.log('No high or critical asset notifications to create.');
//     }
//   } catch (error) {
//     console.error(
//       'Error generating notifications for high and critical assets:',
//       error
//     );
//   } finally {
//     // Close MongoDB connection
//     mongoose.connection.close();
//     console.log('MongoDB connection closed.');
//   }
// }

// // Run the script
// generateGroupedNotificationsForAssets();

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import CompletionStatus from '../models/completionStatusSchema.js'; // Adjust path
// import Notification from '../models/notificationSchema.js';

// dotenv.config();

// async function generateNotificationsForHighAndCriticalAssets() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB successfully.');

//     // Fetch all CompletionStatus entries where the action is not completed and criticality is "high" or "critical"
//     const statuses = await CompletionStatus.find({
//       isCompleted: false,
//     }).populate('controlId'); // Assuming 'controlId' has the criticality info

//     console.log(`Found ${statuses.length} incomplete actions.`);

//     // Object to store the highest criticality for each asset
//     const assetNotificationMap = new Map();

//     statuses.forEach((status) => {
//       const controlCriticality = status.controlId.criticality; // Assuming criticality is stored in controlId

//       // Only process if the criticality is "high" or "critical"
//       if (controlCriticality === 'high' || controlCriticality === 'critical') {
//         // Get the current highest criticality for this asset, or set it if none exists
//         const currentCriticality =
//           assetNotificationMap.get(status.assetId) || 'low';

//         // Update the criticality if the current control has a higher criticality
//         if (
//           controlCriticality === 'critical' ||
//           (controlCriticality === 'high' && currentCriticality !== 'critical')
//         ) {
//           assetNotificationMap.set(status.assetId, controlCriticality);
//         }
//       }
//     });

//     // Create notifications based on the highest criticality for each asset
//     const notificationsToCreate = Array.from(
//       assetNotificationMap.entries()
//     ).map(([assetId, criticality]) => {
//       let message = '';

//       if (criticality === 'critical') {
//         message = `Critical control pending for asset ${assetId}. Immediate attention required.`;
//       } else if (criticality === 'high') {
//         message = `High-priority control pending for asset ${assetId}. Please address soon.`;
//       }

//       return {
//         assignedTo: null, // Optionally assign a user or leave null
//         message: message,
//         isRead: false,
//         createdAt: new Date(),
//       };
//     });

//     // Insert notifications into the Notification collection
//     if (notificationsToCreate.length > 0) {
//       await Notification.insertMany(notificationsToCreate);
//       console.log(`Created ${notificationsToCreate.length} notifications.`);
//     } else {
//       console.log('No high or critical asset notifications to create.');
//     }
//   } catch (error) {
//     console.error(
//       'Error generating notifications for high and critical assets:',
//       error
//     );
//   } finally {
//     // Close MongoDB connection
//     mongoose.connection.close();
//     console.log('MongoDB connection closed.');
//   }
// }

// // Run the script
// generateNotificationsForHighAndCriticalAssets();

// // import CompletionStatus from '../models/completionStatusSchema.js'; // Adjust path
// // import Notification from '../models/notificationSchema.js';

// // import mongoose from 'mongoose';
// // import dotenv from 'dotenv';

// // dotenv.config();

// // async function generateNotificationsForCriticalAssets() {
// //   try {
// //     // Connect to MongoDB
// //     await mongoose.connect(process.env.MONGODB_URI, {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true,
// //     });
// //     console.log('Connected to MongoDB successfully.');

// //     // Fetch all CompletionStatus entries where the action is not completed and criticality is high or above
// //     const statuses = await CompletionStatus.find({
// //       isCompleted: false,
// //     }).populate('controlId'); // Assuming 'controlId' has the criticality info

// //     console.log(`Found ${statuses.length} incomplete actions.`);

// //     const notificationsToCreate = statuses.map((status) => {
// //       // Determine the notification message based on the asset's criticality
// //       const controlCriticality = status.controlId.criticality; // Assuming criticality is stored in controlId
// //       let message = '';

// //       if (controlCriticality === 'critical') {
// //         message = `Critical control pending for asset ${status.assetId}. Immediate attention required.`;
// //       } else if (controlCriticality === 'high') {
// //         message = `High-priority control pending for asset ${status.assetId}. Please address soon.`;
// //       } else if (controlCriticality === 'medium') {
// //         message = `Medium-priority control pending for asset ${status.assetId}.`;
// //       } else {
// //         message = `Low-priority control pending for asset ${status.assetId}.`;
// //       }

// //       return {
// //         assignedTo: null, // Optionally assign a user or leave null
// //         message: message,
// //         isRead: false,
// //         createdAt: new Date(),
// //       };
// //     });

// //     // Insert notifications into the Notification collection
// //     await Notification.insertMany(notificationsToCreate);
// //     console.log(`Created ${notificationsToCreate.length} notifications.`);
// //   } catch (error) {
// //     console.error('Error generating notifications for critical assets:', error);
// //   } finally {
// //     // Close MongoDB connection
// //     mongoose.connection.close();
// //     console.log('MongoDB connection closed.');
// //   }
// // }

// // // Run the script
// // generateNotificationsForCriticalAssets();

// // // import mongoose from 'mongoose';
// // // import dotenv from 'dotenv';
// // // import CompletionStatus from '../models/completionStatusSchema.js'; // Adjust the path as necessary
// // // import Notification from '../models/notificationSchema.js'; // Adjust the path as necessary
// // // import controlSchema from '../models/control.js'; // Adjust the path as necessary
// // // import User from '../models/User.js'; // Adjust the path to the User model

// // // // Load environment variables from .env file
// // // dotenv.config();

// // // const createAdvancedNotifications = async () => {
// // //   try {
// // //     // Check if MONGODB_URI is defined
// // //     if (!process.env.MONGODB_URI) {
// // //       console.error('Error: MONGODB_URI environment variable is not defined.');
// // //       return; // Exit if the URI is not set
// // //     }

// // //     // Connect to MongoDB
// // //     await mongoose.connect(process.env.MONGODB_URI, {
// // //       useNewUrlParser: true,
// // //       useUnifiedTopology: true,
// // //     });

// // //     console.log('Connected to MongoDB successfully.');

// // //     // Fetch all completion statuses
// // //     const completionStatuses = await CompletionStatus.find()
// // //       .populate('AssignedTo') // Make sure the User model is correctly set up
// // //       .populate('controlId');

// // //     // Object to hold notifications by criticality
// // //     const notificationsByCriticality = {
// // //       high: [],
// // //       medium: [],
// // //       low: [],
// // //     };

// // //     // Loop through each completion status to create notifications
// // //     for (const status of completionStatuses) {
// // //       let message = '';

// // //       // Determine criticality
// // //       const control = await controlSchema.findById(status.controlId);
// // //       const criticality = control ? control.criticality : 'low'; // Default to 'low' if no control found

// // //       // Log the criticality for debugging purposes
// // //       console.log(
// // //         `Processing asset ${status.assetId} with criticality: ${criticality}`
// // //       );

// // //       // Create notifications based on status conditions
// // //       if (status.isCompleted) {
// // //         message = `Action for asset ${status.assetId} has been completed.`;
// // //       } else if (status.isEvidenceUploaded) {
// // //         message = `Evidence has been uploaded for the action related to asset ${status.assetId}.`;
// // //       } else if (!status.isCompleted && status.status === 'Open') {
// // //         message = `New action assigned for asset ${status.assetId}. Please review the task.`;
// // //       } else if (
// // //         !status.isCompleted &&
// // //         status.status === 'Delegated to IT Team'
// // //       ) {
// // //         message = `Action for asset ${status.assetId} has been delegated to the IT Team.`;
// // //       } else if (!status.isCompleted && status.status === 'Audit Delegated') {
// // //         message = `Action for asset ${status.assetId} has been delegated for audit.`;
// // //       } else if (!status.isCompleted && status.status === 'Risk Accepted') {
// // //         message = `Risk for asset ${status.assetId} has been accepted.`;
// // //       }

// // //       // Check if criticality is valid
// // //       if (notificationsByCriticality.hasOwnProperty(criticality)) {
// // //         // Group messages by criticality
// // //         if (message) {
// // //           notificationsByCriticality[criticality].push(message);
// // //         }
// // //       } else {
// // //         // Optionally handle unexpected criticality values
// // //         console.warn(
// // //           `Unexpected criticality value: ${criticality} for asset ${status.assetId}`
// // //         );
// // //       }
// // //     }

// // //     // Create notifications based on grouped messages
// // //     for (const [criticality, messages] of Object.entries(
// // //       notificationsByCriticality
// // //     )) {
// // //       if (messages.length > 0) {
// // //         const notificationMessage = `Criticality: ${criticality}. Notifications: ${messages.join(
// // //           ' '
// // //         )}`;

// // //         // Assuming you want to notify all users who were assigned tasks in the group
// // //         const assignedToUsers = completionStatuses
// // //           .filter((status) => status.controlId)
// // //           .map((status) => status.AssignedTo);

// // //         // Create a unique set of assigned users to avoid duplication
// // //         const uniqueAssignedToUsers = [
// // //           ...new Set(assignedToUsers.map((user) => user._id)),
// // //         ];

// // //         for (const assignedTo of uniqueAssignedToUsers) {
// // //           const notification = new Notification({
// // //             assignedTo, // Set the user the notification is for
// // //             message: notificationMessage,
// // //             createdAt: new Date(),
// // //           });

// // //           await notification.save();
// // //           console.log(
// // //             `Notification created: ${notificationMessage} for user ${assignedTo}`
// // //           );
// // //         }
// // //       }
// // //     }

// // //     console.log('All advanced notifications have been created successfully.');
// // //   } catch (error) {
// // //     console.error('Error creating advanced notifications:', error);
// // //   } finally {
// // //     // Close the connection
// // //     await mongoose.connection.close();
// // //     console.log('MongoDB connection closed.');
// // //   }
// // // };

// // // // Run the advanced notification creation function
// // // createAdvancedNotifications();
