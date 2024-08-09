// utils/updateCounts.js
import ControlFamily from '../models/controlFamily.js';
import Control from '../models/control.js';
import Action from '../models/action.js';

export const updateControlFamilyCounts = async (controlFamilyId) => {
  const controlsCount = await Control.countDocuments({ control_Family_Id: controlFamilyId });
  const actionsCount = await Action.countDocuments({ control_Id: { $in: (await Control.find({ control_Family_Id: controlFamilyId })).map(control => control._id) } });

  await ControlFamily.findByIdAndUpdate(controlFamilyId, { 'info.controlsCount': controlsCount, 'info.actionsCount': actionsCount });
};

export const updateControlCounts = async (controlId) => {
  const actionsCount = await Action.countDocuments({ control_Id: controlId });

  await Control.findByIdAndUpdate(controlId, { 'info.actionsCount': actionsCount });
};
