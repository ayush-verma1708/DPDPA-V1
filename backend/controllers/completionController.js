import CompletionStatus from '../models/completionStatusSchema.js';
import ControlFamily from '../models/controlFamily.js';
import Control from '../models/control.js';
import Action from '../models/action.js';
import Asset from '../models/asset.model.js';
import { Scoped } from '../models/scoped.model.js';

// Controller function to get status for controls
export async function getControlStatus(req, res) {
  const { assetId, scopeId } = req.query;

  try {
    // Fetch all controls
    const controls = await Control.find().exec();

    if (!controls.length) {
      return res.status(404).json({ message: 'No controls found.' });
    }

    const result = [];

    for (const control of controls) {
      // Query for completion statuses related to this control
      const statusQuery = { controlId: control._id, assetId };
      if (scopeId) statusQuery.scopeId = scopeId;

      const completionStatuses = await CompletionStatus.find({
        ...statusQuery,
      }).exec();
      const totalActions = completionStatuses.length;
      const completedActions = completionStatuses.filter(
        (status) => status.isCompleted
      ).length;

      result.push({
        controlId: control._id,
        controlName: control.section, // Assuming `section` is a relevant field in Control
        totalActions,
        completedActions,
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching control status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// Controller function to get status for control families
export async function getControlFamilyStatus(req, res) {
  const { assetId, scopeId } = req.query;

  try {
    // Fetch control families
    const controlFamilies = await ControlFamily.find().exec();

    if (!controlFamilies.length) {
      return res.status(404).json({ message: 'No control families found.' });
    }

    const result = [];

    for (const family of controlFamilies) {
      // Fetch controls related to this control family
      const controls = await Control.find({
        control_Family_Id: family._id,
      }).exec();
      const totalControls = controls.length;

      let completedControls = 0;

      for (const control of controls) {
        // Fetch completion status
        const statusQuery = { controlId: control._id, assetId };
        if (scopeId) statusQuery.scopeId = scopeId;

        const completionStatuses = await CompletionStatus.find({
          ...statusQuery,
          isCompleted: true,
        }).exec();
        completedControls += completionStatuses.length;
      }

      result.push({
        familyId: family._id,
        familyName: family.name, // assuming `name` field exists in ControlFamily schema
        totalControls,
        completedControls,
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching control family status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
