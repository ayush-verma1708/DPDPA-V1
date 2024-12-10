import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CompletionStatus from '../../models/completionStatusSchema.js';
import ControlFamily from '../../models/controlFamily.js';
import Control from '../../models/control.js';
import Action from '../../models/action.js';
import Asset from '../../models/asset.model.js';
import { AssetDetails } from '../../models/assetDetails.model.js';
import { UserResponse } from '../../models/UserResponse.js';
import { ProductFamily } from '../../models/productFamily.js';
import Software from '../../models/software.js';
import { Scoped } from '../../models/scoped.model.js';
dotenv.config();

const companyId = '66dc1719f8bc41880e8da7ae';

export async function createCompletionData(username) {
  try {
    // await mongoose.connect(process.env.MONGODB_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   connectTimeoutMS: 30000,
    //   socketTimeoutMS: 45000,
    // });

    // console.log('Connected to MongoDB successfully.');

    // Fetch all user responses for the specified company
    const userResponses = await UserResponse.find({ companyId }).populate(
      'productFamily selectedSoftware'
    );

    // Fetch all asset details and map asset IDs to scoped IDs
    const assetDetails = await AssetDetails.find().populate('asset scoped');
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
        // Get a matching user response for the control’s product family
        const matchingUserResponse = userResponses.find((response) =>
          response.productFamily.equals(control.product_family_Id)
        );

        const selectedSoftware = matchingUserResponse?.isValid
          ? matchingUserResponse.selectedSoftware
          : null;
        const isSoftwareSelected = Boolean(matchingUserResponse?.isValid);

        for (const action of await Action.find({ control_Id: control._id })) {
          const assets = await Asset.find();

          for (const asset of assets) {
            const scopedIds = assetScopesMap.get(asset._id.toString());
            const isTask =
              family.isControlFamily && control.isControl && action.isAction;

            // Handle scoped assets
            if (scopedIds) {
              if (asset.isScoped) {
                console.log(
                  `Found ${scopedIds.size} relevant scopes for Asset ${asset.name}.`
                );

                for (const scopeId of scopedIds) {
                  const existingStatus = await CompletionStatus.findOne({
                    actionId: action._id,
                    assetId: asset._id,
                    scopeId,
                    controlId: control._id,
                    familyId: family._id,
                  });

                  if (!existingStatus) {
                    await CompletionStatus.create({
                      actionId: action._id,
                      assetId: asset._id,
                      scopeId,
                      controlId: control._id,
                      familyId: family._id,
                      selectedSoftware: selectedSoftware?._id || null,
                      isSoftwareSelected,
                      isCompleted: false,
                      isEvidenceUploaded: false,
                      isTask,
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
                            [
                              'isSoftwareSelected',
                              isSoftwareSelected.toString(),
                            ],
                            ['isTask', isTask.toString()],
                          ]),
                        },
                      ],
                    });
                  } else {
                    console.log(
                      `CompletionStatus already exists for Action ${action._id}, Asset ${asset._id}, Scope ${scopeId}`
                    );
                  }
                }
              } else {
                // Handle unscoped assets
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
                    selectedSoftware: selectedSoftware?._id || null,
                    isSoftwareSelected,
                    isCompleted: false,
                    isEvidenceUploaded: false,
                    isTask,
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
                          ['isSoftwareSelected', isSoftwareSelected.toString()],
                          ['isTask', isTask.toString()],
                        ]),
                      },
                    ],
                  });
                } else {
                  console.log(
                    `CompletionStatus already exists for Action ${action._id}, Asset ${asset._id}`
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
    console.log('Process finished');
  }
}

export default createCompletionData;
