import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Action from '../models/Action.js'; // The existing model
import Software from '../models/Software.js';
import { ProductFamily } from '../models/ProductFamily.js';
import NewAction from '../models/NewAction.js'; // Import the new model

// Utility function to generate a sequential Fixed ID (e.g., A0001, A0002, ...)
async function generateFixedId() {
  try {
    const lastAction = await NewAction.findOne().sort({ fixed_id: -1 }); // Find the latest action to get the last fixed_id
    const lastFixedId = lastAction ? lastAction.fixed_id : 'A0000'; // Default to A0000 if no action found

    const fixedNumber = parseInt(lastFixedId.substring(1)) + 1; // Increment the number part
    return `A${fixedNumber.toString().padStart(4, '0')}`; // Return the new Fixed ID
  } catch (error) {
    console.error('Error generating Fixed ID:', error);
    throw error;
  }
}

// Utility function to generate Variable ID (e.g., actionId_controlId_productId_softwareId)
function generateVariableId(actionId, controlId, productId, softwareId) {
  return `${actionId}_${controlId}_${productId}_${softwareId}`; // Include softwareId in variableId
}

async function createActionTasks() {
  try {
    // Load environment variables
    dotenv.config();

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully.');

    // Fetch all existing action entries where isAction is 'yes'
    const actions = await Action.find({ isAction: 'yes' });

    if (!actions || actions.length === 0) {
      throw new Error('No actions found in the database with isAction: "yes".');
    }

    // Iterate through each action entry
    for (const action of actions) {
      // Fetch product family using product_family_Id from the action entry
      const productFamily = await ProductFamily.findById(
        action.product_family_Id
      );

      if (!productFamily) {
        console.error(`ProductFamily not found for action ID: ${action._id}`);
        continue; // Skip this action and move to the next
      }

      // Fetch each software associated with the product family
      for (const softwareId of productFamily.software_list) {
        // Check if the software exists in the database
        const software = await Software.findById(softwareId);
        if (!software) {
          console.error(`Software not found for ID: ${softwareId}`);
          continue; // Skip to the next software
        }

        // Generate Fixed ID (A0001, A0002, etc.)
        const fixedId = await generateFixedId();

        // Generate Variable ID (actionId_controlId_productId_softwareId)
        const variableId = generateVariableId(
          action._id,
          action.control_Id,
          productFamily._id,
          softwareId // Include softwareId here
        );

        // Generate a more informative task description
        const description = `Action ID: ${action._id}, Control ID: ${action.control_Id}, Product Family ID: ${productFamily._id}, Software ID: ${softwareId} - Task: Complete setup for ${software.software_name}.`;

        // Create a new action entry for the NewAction model
        const newAction = new NewAction({
          fixed_id: fixedId, // Generated Fixed ID (e.g., A0001)
          variable_id: variableId, // Generated Variable ID (e.g., actionId_controlId_productId_softwareId)
          control_Id: action.control_Id, // Use existing control ID
          product_family_Id: action.product_family_Id,
          softwareId: software._id,
          description: description, // Updated dynamic task description
          isDPDPA: action.isDPDPA,
          isAction: action.isAction,
        });

        // Save the new action
        await newAction.save();
        console.log(
          `Created new action for software: ${software.software_name} in action ID: ${action._id}`
        );
      }
    }

    console.log(
      'Action tasks created successfully for all software in each Product Family!'
    );
  } catch (error) {
    console.error('Error during action task creation:', error);
  } finally {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }
}

// Run the script
createActionTasks();
