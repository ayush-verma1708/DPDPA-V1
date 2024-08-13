import ControlFamily from '../models/controlFamily.js';
import Control from '../models/control.js';
import Action from '../models/action.js';

const getNextSequence = async (model, prefix) => {
  try {
    // Find the last entry that matches the prefix
    const lastEntry = await model.findOne({ fixed_id: { $regex: `^${prefix}` } })
      .sort({ fixed_id: -1 })
      .exec();

    let nextSequence = 1; // Default starting sequence if no entries are found

    if (lastEntry) {
      // Extract the numeric part of the fixed_id (e.g., 01 from C01)
      const lastID = lastEntry.fixed_id;
      console.log('Last ID found:', lastID);  // Debugging log

      const lastSequence = parseInt(lastID.replace(prefix, ''), 10);
      console.log('Last Sequence extracted:', lastSequence);  // Debugging log

      // If parsing fails, default to 1, otherwise increment the sequence
      nextSequence = isNaN(lastSequence) ? 1 : lastSequence + 1;
    }

    // Return the next fixed_id, e.g., C01, C02, ..., C92
    const newFixedId = `${prefix}${String(nextSequence).padStart(4, '0')}`;
    console.log('New Fixed ID generated:', newFixedId);  // Debugging log
    return newFixedId;

  } catch (error) {
    console.error('Error generating next sequence:', error);  // Log any errors
    throw new Error('Error generating next sequence');
  }
};

export const getNextControlFamilyId = () => getNextSequence(ControlFamily, 'CF');
export const getNextControlId = () => getNextSequence(Control, 'C');
export const getNextActionId = () => getNextSequence(Action, 'A');
