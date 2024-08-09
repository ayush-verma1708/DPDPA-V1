// utils/autoIncrementId.js
import mongoose from 'mongoose';
import ControlFamily from '../models/controlFamily.js';
import Control from '../models/control.js';
import Action from '../models/action.js';

const getNextSequence = async (model, prefix) => {
  const lastEntry = await model.findOne().sort({ _id: -1 }).exec();
  let nextSequence = 1;

  if (lastEntry) {
    const lastID = lastEntry.FixedID;
    const lastSequence = parseInt(lastID.replace(prefix, ''), 10);
    nextSequence = lastSequence + 1;
  }

  return `${prefix}${String(nextSequence).padStart(2, '0')}`;
};

export const getNextControlFamilyId = () => getNextSequence(ControlFamily, 'CF');
export const getNextControlId = () => getNextSequence(Control, 'C');
export const getNextActionId = () => getNextSequence(Action, 'A');
