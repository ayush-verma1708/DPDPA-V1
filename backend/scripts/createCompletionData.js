import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CompletionStatus from '../models/completionStatusSchema.js';
import ControlFamily from '../models/controlFamily.js';
import Control from '../models/control.js';
import Action from '../models/action.js';
import { Asset } from '../models/asset.model.js';
import { Scoped } from '../models/scoped.model.js';
import { AssetDetails } from '../models/assetDetails.model.js';

dotenv.config();

export async function createCompletionData(username) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
    });

    console.log('Connected to MongoDB successfully.');

    // Fetch all asset details (from AssetDetails model)
    const assetDetails = await AssetDetails.find().populate('asset');

    // Create a map of assets to their relevant scope IDs
    const assetScopesMap = new Map();
    assetDetails.forEach((detail) => {
      const assetId = detail.asset._id.toString();
      const scopeId = detail.scoped._id.toString();
      if (!assetScopesMap.has(assetId)) {
        assetScopesMap.set(assetId, new Set());
      }
      assetScopesMap.get(assetId).add(scopeId);
    });

    console.log(`Processed ${assetScopesMap.size} assets from AssetDetails.`);

    // Fetch all control families
    const controlFamilies = await ControlFamily.find();

    for (const family of controlFamilies) {
      const controls = await Control.find({ control_Family_Id: family._id });

      for (const control of controls) {
        const actions = await Action.find({ control_Id: control._id });

        for (const action of actions) {
          const assets = await Asset.find();

          for (const asset of assets) {
            const scopedIds = assetScopesMap.get(asset._id.toString());

            if (scopedIds) {
              if (asset.isScoped) {
                console.log(
                  `Found ${scopedIds.size} relevant scopes for Asset ${asset.name}.`
                );

                for (const scopeId of scopedIds) {
                  const isTask =
                    family.isControlFamily &&
                    control.isControl &&
                    action.isAction;

                  const existingStatus = await CompletionStatus.findOne({
                    actionId: action._id,
                    assetId: asset._id,
                    scopeId: scopeId,
                    controlId: control._id,
                    familyId: family._id,
                  });

                  if (!existingStatus) {
                    await CompletionStatus.create({
                      actionId: action._id,
                      assetId: asset._id,
                      scopeId: scopeId,
                      controlId: control._id,
                      familyId: family._id,
                      isCompleted: false,
                      isEvidenceUploaded: false,
                      isTask, // set based on condition
                      createdBy: username,
                      AssignedBy: username,
                      AssignedTo: username,
                      history: [
                        {
                          modifiedAt: new Date(),
                          modifiedBy: username,
                          changes: new Map([
                            ['actionId', action._id.toString()],
                            ['assetId', asset._id.toString()],
                            ['scopeId', scopeId],
                            ['controlId', control._id.toString()],
                            ['familyId', family._id.toString()],
                            ['isCompleted', 'false'],
                            ['isEvidenceUploaded', 'false'],
                            ['isTask', isTask.toString()],
                          ]),
                        },
                      ],
                    });
                  } else {
                    console.log(
                      `CompletionStatus entry already exists for Action ${action._id}, Asset ${asset._id}, Scope ${scopeId}, Control ${control._id}, Family ${family._id}`
                    );
                  }
                }
              } else {
                const isTask =
                  family.isControlFamily &&
                  control.isControl &&
                  action.isAction;

                const existingStatus = await CompletionStatus.findOne({
                  actionId: action._id,
                  assetId: asset._id,
                  controlId: control._id,
                  familyId: family._id,
                });

                if (!existingStatus) {
                  await CompletionStatus.create({
                    actionId: action._id,
                    assetId: asset._id,
                    controlId: control._id,
                    familyId: family._id,
                    isCompleted: false,
                    isEvidenceUploaded: false,
                    isTask, // set based on condition
                    createdBy: username,
                    AssignedBy: username,
                    AssignedTo: username,
                    history: [
                      {
                        modifiedAt: new Date(),
                        modifiedBy: username,
                        changes: new Map([
                          ['actionId', action._id.toString()],
                          ['assetId', asset._id.toString()],
                          ['controlId', control._id.toString()],
                          ['familyId', family._id.toString()],
                          ['isCompleted', 'false'],
                          ['isEvidenceUploaded', 'false'],
                          ['isTask', isTask.toString()],
                        ]),
                      },
                    ],
                  });
                } else {
                  console.log(
                    `CompletionStatus entry already exists for Action ${action._id}, Asset ${asset._id}, Control ${control._id}, Family ${family._id}`
                  );
                }
              }
            } else {
              console.log(
                `Asset ${asset.name} is not associated with any relevant scopes and will be ignored.`
              );
            }
          }
        }
      }
    }

    console.log('Completion data created successfully!');
  } catch (error) {
    console.error('Error creating completion data:', error);
  } finally {
    console.log('All Entry added');
  }
}

// Run the script with a specified username
createCompletionData('66d2b72f9561977c7f364ea8');
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import CompletionStatus from '../models/completionStatusSchema.js';
// import ControlFamily from '../models/controlFamily.js';
// import Control from '../models/control.js';
// import Action from '../models/action.js';
// import { Asset } from '../models/asset.model.js';
// import { Scoped } from '../models/scoped.model.js';
// import { AssetDetails } from '../models/assetDetails.model.js'; // Adjust the import path as necessary

// // dotenv.config();

// export async function createCompletionData(username) {
//   try {
//     // Connect to MongoDB
//     // await mongoose.connect(process.env.MONGODB_URI, {
//     //   useNewUrlParser: false,
//     //   useUnifiedTopology: false,
//     // });

//     console.log('Connected to MongoDB successfully.');

//     // Fetch all asset details (from AssetDetails model)
//     const assetDetails = await AssetDetails.find().populate('asset');

//     // Create a map of assets to their relevant scope IDs
//     const assetScopesMap = new Map();
//     assetDetails.forEach((detail) => {
//       const assetId = detail.asset._id.toString();
//       const scopeId = detail.scoped._id.toString();
//       if (!assetScopesMap.has(assetId)) {
//         assetScopesMap.set(assetId, new Set());
//       }
//       assetScopesMap.get(assetId).add(scopeId);
//     });

//     console.log(`Processed ${assetScopesMap.size} assets from AssetDetails.`);

//     // Fetch all control families
//     const controlFamilies = await ControlFamily.find();

//     for (const family of controlFamilies) {
//       const controls = await Control.find({ control_Family_Id: family._id });

//       for (const control of controls) {
//         const actions = await Action.find({ control_Id: control._id });

//         for (const action of actions) {
//           const assets = await Asset.find();

//           for (const asset of assets) {
//             const scopedIds = assetScopesMap.get(asset._id.toString());

//             if (scopedIds) {
//               if (asset.isScoped) {
//                 console.log(
//                   `Found ${scopedIds.size} relevant scopes for Asset ${asset.name}.`
//                 );

//                 for (const scopeId of scopedIds) {
//                   const existingStatus = await CompletionStatus.findOne({
//                     actionId: action._id,
//                     assetId: asset._id,
//                     scopeId: scopeId,
//                     controlId: control._id,
//                     familyId: family._id,
//                   });

//                   if (!existingStatus) {
//                     await CompletionStatus.create({
//                       actionId: action._id,
//                       assetId: asset._id,
//                       scopeId: scopeId,
//                       controlId: control._id,
//                       familyId: family._id,
//                       isCompleted: false,
//                       isEvidenceUploaded: false,
//                       createdBy: username,
//                       AssignedBy: username,
//                       AssignedTo: username,
//                       history: [
//                         {
//                           modifiedAt: new Date(),
//                           modifiedBy: username,
//                           changes: new Map([
//                             ['actionId', action._id.toString()],
//                             ['assetId', asset._id.toString()],
//                             ['scopeId', scopeId],
//                             ['controlId', control._id.toString()],
//                             ['familyId', family._id.toString()],
//                             ['isCompleted', 'false'],
//                             ['isEvidenceUploaded', 'false'],
//                           ]),
//                         },
//                       ],
//                     });
//                   } else {
//                     console.log(
//                       `CompletionStatus entry already exists for Action ${action._id}, Asset ${asset._id}, Scope ${scopeId}, Control ${control._id}, Family ${family._id}`
//                     );
//                   }
//                 }
//               } else {
//                 // Handle non-scoped assets
//                 const existingStatus = await CompletionStatus.findOne({
//                   actionId: action._id,
//                   assetId: asset._id,
//                   controlId: control._id,
//                   familyId: family._id,
//                 });

//                 if (!existingStatus) {
//                   await CompletionStatus.create({
//                     actionId: action._id,
//                     assetId: asset._id,
//                     controlId: control._id,
//                     familyId: family._id,
//                     isCompleted: false,
//                     isEvidenceUploaded: false,
//                     createdBy: username,
//                     AssignedBy: username,
//                     AssignedTo: username,
//                     history: [
//                       {
//                         modifiedAt: new Date(),
//                         modifiedBy: username,
//                         changes: new Map([
//                           ['actionId', action._id.toString()],
//                           ['assetId', asset._id.toString()],
//                           ['controlId', control._id.toString()],
//                           ['familyId', family._id.toString()],
//                           ['isCompleted', 'false'],
//                           ['isEvidenceUploaded', 'false'],
//                         ]),
//                       },
//                     ],
//                   });
//                 } else {
//                   console.log(
//                     `CompletionStatus entry already exists for Action ${action._id}, Asset ${asset._id}, Control ${control._id}, Family ${family._id}`
//                   );
//                 }
//               }
//             } else {
//               console.log(
//                 `Asset ${asset.name} is not associated with any relevant scopes and will be ignored.`
//               );
//             }
//           }
//         }
//       }
//     }

//     console.log('Completion data created successfully!');
//   } catch (error) {
//     console.error('Error creating completion data:', error);
//   } finally {
//     // mongoose.connection.close();
//     console.log('All Entry added');
//   }
// }

// // Run the script with a specified username
// createCompletionData('66d2b72f9561977c7f364ea8');
