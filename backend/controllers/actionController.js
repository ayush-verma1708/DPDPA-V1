import Action from '../models/action.js';
import { getNextActionId } from '../utils/autoIncrementId.js';
import Control from '../models/control.js';

// Get all actions
export const getActions = async (req, res) => {
  try {
    const actions = await Action.find().populate('control_Id');
    res.json(actions);
  } catch (error) {
    console.error('Error fetching actions:', error);
    res.status(500).json({ message: 'Error fetching actions', error: error.message });
  }
};

// Create a new action
export const createAction = async (req, res) => {
  try {
    const { variable_id, control_Id, isDPDPA } = req.body;

    // Validate presence of control_Id
    if (!control_Id) {
      return res.status(400).json({ message: 'Control ID is required' });
    }

    // Check if the control exists
    const control = await Control.findById(control_Id);
    if (!control) {
      return res.status(404).json({ message: 'Control does not exist' });
    }

    // Generate the next fixed ID for the new action
    const fixedId = await getNextActionId();

    // Create a new action instance
    const action = new Action({
      fixed_id: fixedId,
      variable_id,
      control_Id,
      isDPDPA
    });

    // Save the new action to the database
    await action.save();

    // Respond with the created action
    res.status(201).json(action);
  } catch (error) {
    console.error('Error creating action:', error);
    res.status(400).json({ message: 'Error creating action', error: error.message });
  }
};

// Update an action
export const updateAction = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the Action exists
    const action = await Action.findById(id);
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    // Check if action is not editable
    if (action.isDPDPA) {
      return res.status(403).json({ message: 'Cannot edit an action with isDPDPA set to true' });
    }

    // Update the action
    const updatedAction = await Action.findByIdAndUpdate(id, req.body, { new: true }).populate('control_Id');
    res.json(updatedAction);
  } catch (error) {
    console.error('Error updating action:', error);
    res.status(400).json({ message: 'Error updating action', error: error.message });
  }
};

// Delete an action
export const deleteAction = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the Action exists
    const action = await Action.findById(id);
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    // Check if action is not deletable
    if (action.isDPDPA) {
      return res.status(403).json({ message: 'Cannot delete an action with isDPDPA set to true' });
    }

    // Delete the Action
    await Action.findByIdAndDelete(id);
    res.json({ message: 'Action deleted successfully' });
  } catch (error) {
    console.error('Error deleting action:', error);
    res.status(500).json({ message: 'Error deleting action', error: error.message });
  }
};
