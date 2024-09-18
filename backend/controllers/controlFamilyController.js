import ControlFamily from '../models/controlFamily.js';
import Control from '../models/control.js';
import Action from '../models/action.js';
import { getNextControlFamilyId } from '../utils/autoIncrementId.js';

export const getControlFamilies = async (req, res) => {
  try {
    const { id } = req.query; // Use query parameter to fetch by ID
    if (id) {
      // Fetch single control family by ID
      const controlFamily = await ControlFamily.findById(id);
      if (!controlFamily) {
        return res.status(404).json({ message: 'Control family not found' });
      }
      res.json(controlFamily);
    } else {
      // Fetch all control families
      const controlFamilies = await ControlFamily.find();
      const result = [];

      for (const family of controlFamilies) {
        const controls = await Control.find({ control_Family_Id: family._id });
        const controlsWithActions = [];

        for (const control of controls) {
          const actions = await Action.find({ control_Id: control._id });
          controlsWithActions.push({ ...control._doc, actions });
        }

        result.push({ ...family._doc, controls: controlsWithActions });
      }

      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching control families' });
  }
};

// Function to generate the next FixedID
const generateNextFixedID = async () => {
  try {
    const lastControlFamily = await ControlFamily.findOne()
      .sort({ fixed_id: -1 })
      .limit(1);
    if (lastControlFamily && lastControlFamily.fixed_id) {
      const lastFixedID = lastControlFamily.fixed_id;
      const numericPart = parseInt(lastFixedID.replace('CF', ''));
      return `CF${(numericPart + 1).toString().padStart(2, '0')}`;
    }
    return 'CF01';
  } catch (error) {
    console.error('Error generating FixedID:', error);
    throw new Error('Failed to generate FixedID');
  }
};

export const createControlFamily = async (req, res) => {
  try {
    const FixedID = await generateNextFixedID();
    const controlFamily = new ControlFamily({
      fixed_id: FixedID,
      variable_id: req.body.variable_id,
    });

    await controlFamily.save();
    res.status(201).json(controlFamily);
  } catch (error) {
    console.error('Error details:', error);
    res
      .status(400)
      .json({ message: 'Error creating control family', error: error.message });
  }
};

export const updateControlFamily = async (req, res) => {
  try {
    const { id } = req.params;

    const controlFamily = await ControlFamily.findById(id);
    if (!controlFamily) {
      return res.status(404).json({ message: 'Control family not found' });
    }

    if (controlFamily.isDPDPA) {
      return res.status(403).json({
        message: 'Cannot edit a control family with isDPDPA set to 1',
      });
    }

    const updatedControlFamily = await ControlFamily.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (updatedControlFamily) {
      // await updateControlFamilyInfo(id);
      res.json(updatedControlFamily);
    } else {
      res.status(404).json({ message: 'Control family not found' });
    }
  } catch (error) {
    console.error(
      'Error updating control family:',
      error.message,
      error.stack,
      error.name,
      error.code
    );
    res
      .status(400)
      .json({ message: 'Error updating control family', error: error.message });
  }
};

export const deleteControlFamily = async (req, res) => {
  try {
    const { id } = req.params;

    const controlFamily = await ControlFamily.findById(id);
    if (!controlFamily) {
      return res.status(404).json({ message: 'Control family not found' });
    }

    if (controlFamily.isDPDPA) {
      return res.status(403).json({
        message: 'Cannot delete a control family with isDPDPA set to 1',
      });
    }

    await Control.deleteMany({ control_Family_Id: id });
    await Action.deleteMany({
      control_Id: {
        $in: (await Control.find({ control_Family_Id: id })).map((c) => c._id),
      },
    });

    await ControlFamily.findByIdAndDelete(id);

    res.json({
      message:
        'Control family and related controls and actions deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting control family' });
  }
};
