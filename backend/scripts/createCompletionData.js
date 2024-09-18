import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CompletionStatus from '../models/completionStatusSchema.js';
import ControlFamily from '../models/controlFamily.js';
import Control from '../models/control.js';
import Action from '../models/action.js';
import { Asset } from '../models/asset.model.js';
import { Scoped } from '../models/scoped.model.js';
import { AssetDetails } from '../models/assetDetails.model.js'; // Adjust the import path as necessary

dotenv.config();

async function createCompletionData(username) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: false,
      useUnifiedTopology: false,
    });

    console.log('Connected to MongoDB successfully.');

    // Fetch all asset details (from AssetDetails model)
    const assetDetails = await AssetDetails.find().populate('asset');

    // Ensure that scoped assets are properly checked and handled
    const assetDetailsNames = new Map(
      assetDetails.map((detail) => [
        detail.asset.name,
        detail.scoped || [], // Ensure we assign an empty array if scoped is undefined
      ])
    );

    console.log(
      `Asset Details Names: ${Array.from(assetDetailsNames.keys()).join(', ')}`
    );

    // Fetch all control families
    const controlFamilies = await ControlFamily.find();
    console.log(`Control Families: ${controlFamilies.length}`);

    for (const family of controlFamilies) {
      console.log(
        `Processing Control Family: ${family.variable_id} (${family._id})`
      );

      // Fetch controls associated with this control family
      const controls = await Control.find({ control_Family_Id: family._id });
      console.log(
        `Found ${controls.length} controls for Control Family ${family.variable_id}.`
      );

      for (const control of controls) {
        console.log(`Processing Control: ${control.section} (${control._id})`);

        // Fetch actions associated with this control
        const actions = await Action.find({ control_Id: control._id });
        console.log(
          `Found ${actions.length} actions for Control ${control.section}.`
        );

        for (const action of actions) {
          console.log(
            `Processing Action: ${action.variable_id} (${action._id})`
          );

          // Fetch all assets
          const assets = await Asset.find();
          console.log(`Found ${assets.length} assets.`);

          for (const asset of assets) {
            console.log(`Processing Asset: ${asset.name} (${asset._id})`);

            // Only process assets present in assetDetails
            if (assetDetailsNames.has(asset.name)) {
              const assetScopes = assetDetailsNames.get(asset.name); // Get scoped data for this asset

              if (asset.isScoped && assetScopes.length > 0) {
                // If asset is scoped and has declared scopes in AssetDetails
                console.log(
                  `Processing ${assetScopes.length} scopes for Asset ${asset.name}.`
                );

                for (const scopeId of assetScopes) {
                  // Check if CompletionStatus entry already exists
                  const existingStatus = await CompletionStatus.findOne({
                    actionId: action._id,
                    assetId: asset._id,
                    scopeId: scopeId, // Use scopeId from AssetDetails
                    controlId: control._id,
                    familyId: family._id,
                  });

                  if (!existingStatus) {
                    // Create CompletionStatus for each scoped asset if not already present
                    await CompletionStatus.create({
                      actionId: action._id,
                      assetId: asset._id,
                      scopeId: scopeId,
                      controlId: control._id,
                      familyId: family._id,
                      isCompleted: false,
                      isEvidenceUploaded: false,
                      username: username,
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
                // Check if CompletionStatus entry already exists for non-scoped asset
                const existingStatus = await CompletionStatus.findOne({
                  actionId: action._id,
                  assetId: asset._id,
                  controlId: control._id,
                  familyId: family._id,
                });

                if (!existingStatus) {
                  // Create CompletionStatus for non-scoped asset if not already present
                  await CompletionStatus.create({
                    actionId: action._id,
                    assetId: asset._id,
                    controlId: control._id,
                    familyId: family._id,
                    isCompleted: false,
                    isEvidenceUploaded: false,
                    username: username,
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
                `Asset ${asset.name} is not in assetDetails or has no declared scopes and will be ignored.`
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
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the script with a specified username
createCompletionData('yourUsername'); // Replace 'yourUsername' with the actual username you want to use

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import CompletionStatus from '../models/completionStatusSchema.js';
// import ControlFamily from '../models/controlFamily.js';
// import Control from '../models/control.js';
// import Action from '../models/action.js';
// import { Asset } from '../models/asset.model.js';
// import { Scoped } from '../models/scoped.model.js';
// import { AssetDetails } from '../models/assetDetails.model.js'; // Adjust the import path as necessary

// dotenv.config();

// async function createCompletionData(username) {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: false,
//       useUnifiedTopology: false,
//     });

//     console.log('Connected to MongoDB successfully.');

//     // Fetch all asset details (from AssetDetails model)
//     const assetDetails = await AssetDetails.find().populate('asset');
//     const assetDetailsNames = new Set(
//       assetDetails.map((detail) => detail.asset.name)
//     );
//     console.log(
//       `Asset Details Names: ${Array.from(assetDetailsNames).join(', ')}`
//     );

//     // Fetch all control families
//     const controlFamilies = await ControlFamily.find();
//     console.log(`Control Families: ${controlFamilies.length}`);

//     for (const family of controlFamilies) {
//       console.log(
//         `Processing Control Family: ${family.variable_id} (${family._id})`
//       );

//       // Fetch controls associated with this control family
//       const controls = await Control.find({ control_Family_Id: family._id });
//       console.log(
//         `Found ${controls.length} controls for Control Family ${family.variable_id}.`
//       );

//       for (const control of controls) {
//         console.log(`Processing Control: ${control.section} (${control._id})`);

//         // Fetch actions associated with this control
//         const actions = await Action.find({ control_Id: control._id });
//         console.log(
//           `Found ${actions.length} actions for Control ${control.section}.`
//         );

//         for (const action of actions) {
//           console.log(
//             `Processing Action: ${action.variable_id} (${action._id})`
//           );

//           // Fetch all assets
//           const assets = await Asset.find();
//           console.log(`Found ${assets.length} assets.`);

//           for (const asset of assets) {
//             console.log(`Processing Asset: ${asset.name} (${asset._id})`);

//             // Only process assets present in assetDetails
//             if (assetDetailsNames.has(asset.name)) {
//               if (asset.isScoped) {
//                 // If asset is scoped, fetch all scopes associated with this asset
//                 const scopes = await Scoped.find({ asset: asset._id });
//                 console.log(
//                   `Found ${scopes.length} scopes for Asset ${asset.name}.`
//                 );

//                 for (const scope of scopes) {
//                   // Check if CompletionStatus entry already exists
//                   const existingStatus = await CompletionStatus.findOne({
//                     actionId: action._id,
//                     assetId: asset._id,
//                     scopeId: scope._id,
//                     controlId: control._id,
//                     familyId: family._id,
//                   });

//                   if (!existingStatus) {
//                     // Create CompletionStatus for each scoped asset if not already present
//                     await CompletionStatus.create({
//                       actionId: action._id,
//                       assetId: asset._id,
//                       scopeId: scope._id,
//                       controlId: control._id,
//                       familyId: family._id,
//                       isCompleted: false,
//                       isEvidenceUploaded: false,
//                       username: username,
//                       history: [
//                         {
//                           modifiedAt: new Date(),
//                           modifiedBy: username,
//                           changes: new Map([
//                             ['actionId', action._id.toString()],
//                             ['assetId', asset._id.toString()],
//                             ['scopeId', scope._id.toString()],
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
//                       `CompletionStatus entry already exists for Action ${action._id}, Asset ${asset._id}, Scope ${scope._id}, Control ${control._id}, Family ${family._id}`
//                     );
//                   }
//                 }
//               } else {
//                 // Check if CompletionStatus entry already exists
//                 const existingStatus = await CompletionStatus.findOne({
//                   actionId: action._id,
//                   assetId: asset._id,
//                   controlId: control._id,
//                   familyId: family._id,
//                 });

//                 if (!existingStatus) {
//                   // Create CompletionStatus for non-scoped asset if not already present
//                   await CompletionStatus.create({
//                     actionId: action._id,
//                     assetId: asset._id,
//                     controlId: control._id,
//                     familyId: family._id,
//                     isCompleted: false,
//                     isEvidenceUploaded: false,
//                     username: username,
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
//                 `Asset ${asset.name} is not in assetDetails and will be ignored.`
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
//     mongoose.connection.close();
//     console.log('MongoDB connection closed.');
//   }
// }

// // Run the script with a specified username
// createCompletionData('yourUsername'); // Replace 'yourUsername' with the actual username you want to use
