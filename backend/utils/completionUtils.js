// utils/completionUtils.js
import Control from '../models/control.js';
import ControlFamily from '../models/controlFamily.js';
import Action from '../models/action.js';

export const checkAndUpdateActionCompletion = async (actionId) => {
  const action = await Action.findById(actionId);
  if (action && action.isCompleted) {
    await updateControlAndFamilyCompletion(action.control_Id);
  }
};

export const updateControlAndFamilyCompletion = async (controlId) => {
  const control = await Control.findById(controlId);
  if (control) {
    const actions = await Action.find({ control_Id: controlId });
    const completedActions = actions.filter(action => action.isCompleted).length;

    control.info.completedActions = completedActions;
    control.info.actionsCount = actions.length;
    control.isCompleted = (completedActions === actions.length);

    await control.save();

    await updateControlFamilyCompletion(control.control_Family_Id);
  }
};

export const updateControlFamilyCompletion = async (controlFamilyId) => {
  const controlFamily = await ControlFamily.findById(controlFamilyId);
  if (controlFamily) {
    const controls = await Control.find({ control_Family_Id: controlFamilyId });
    const completedControls = controls.filter(control => control.isCompleted).length;

    controlFamily.info.completedControls = completedControls;
    controlFamily.info.controlsCount = controls.length;
    controlFamily.isCompleted = (completedControls === controls.length);

    await controlFamily.save();
  }
};
