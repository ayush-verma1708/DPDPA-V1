import Control from '../models/control.js';
import ControlFamily from '../models/controlFamily.js';
import Action from '../models/action.js';
import { getNextControlId } from '../utils/autoIncrementId.js';

// export const getControls = async (req, res) => {
//   try {
//     // Fetch all controls
//     const controls = await Control.find();

//     // Include associated control family data
//     const controlsWithFamily = await Promise.all(
//       controls.map(async (control) => {
//         const controlFamily = await ControlFamily.findOne({
//           fixed_id: control.control_Family_Id,
//         });
//         return {
//           ...control._doc,
//           controlFamily,
//         };
//       })
//     );

//     res.json(controlsWithFamily);
//   } catch (error) {
//     console.error('Error fetching controls:', error); // Log the error details
//     res
//       .status(500)
//       .json({ message: 'Error fetching controls', error: error.message });
//   }
// };

export const getControls = async (req, res) => {
  try {
    // Fetch all controls
    const controls = await Control.find();

    // Fetch control families for all control IDs in one query
    const controlFamilyIds = controls.map(
      (control) => control.control_Family_Id
    );
    const controlFamilies = await ControlFamily.find({
      fixed_id: { $in: controlFamilyIds },
    });

    // Create a map for quick lookup of control families by ID
    const controlFamilyMap = {};
    controlFamilies.forEach((family) => {
      controlFamilyMap[family.fixed_id] = family;
    });

    // Combine controls with their associated control family
    const controlsWithFamily = controls.map((control) => ({
      ...control._doc,
      controlFamily: controlFamilyMap[control.control_Family_Id] || null, // Use null if family is not found
    }));

    res.json(controlsWithFamily);
  } catch (error) {
    console.error('Error fetching controls:', error); // Log the error details
    res
      .status(500)
      .json({ message: 'Error fetching controls', error: error.message });
  }
};
export const createControl = async (req, res) => {
  try {
    const {
      control_Family_Id,
      section,
      section_main_desc,
      section_desc,
      control_type,
      criticality, // Add criticality here
    } = req.body;

    // Validate the presence of control_Family_Id
    if (!control_Family_Id) {
      return res.status(400).json({ message: 'Control family ID is required' });
    }

    // Validate criticality
    const allowedCriticality = ['low', 'medium', 'high', 'critical'];
    if (!allowedCriticality.includes(criticality)) {
      return res.status(400).json({ message: 'Invalid criticality value' });
    }

    // Check if the control family exists
    const controlFamily = await ControlFamily.findById(control_Family_Id);
    if (!controlFamily) {
      return res.status(404).json({ message: 'Control family does not exist' });
    }

    // Generate the next fixed ID for the new control
    const fixedId = await getNextControlId();

    // Create a new control instance
    const control = new Control({
      fixed_id: fixedId,
      section,
      section_main_desc,
      section_desc,
      control_type,
      control_Family_Id: controlFamily._id, // Use controlFamily._id directly
      criticality, // Add criticality to the new control
    });

    // Save the new control to the database
    await control.save();

    // Respond with the created control
    res.status(201).json(control);
  } catch (error) {
    // Handle errors
    res
      .status(400)
      .json({ message: 'Error creating control', error: error.message });
  }
};

// export const updateControl = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if the Control exists
//     const control = await Control.findById(id);
//     if (!control) {
//       return res.status(404).json({ message: 'Control not found' });
//     }

//     // Check if control is not editable
//     if (control.isDPDPA) {
//       return res
//         .status(403)
//         .json({ message: 'Cannot edit a control with isDPDPA set to 1' });
//     }

//     // Update the control
//     const updatedControl = await Control.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });

//     // Update ControlFamily info
//     if (updatedControl) {
//       // await updateControlFamilyInfo(updatedControl.control_Family_Id);
//       res.json(updatedControl);
//     } else {
//       res.status(404).json({ message: 'Control not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating control' });
//   }
// };

export const updateControl = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the Control exists
    const control = await Control.findById(id);
    if (!control) {
      return res.status(404).json({ message: 'Control not found' });
    }

    // Check if control is not editable
    if (control.isDPDPA) {
      return res
        .status(403)
        .json({ message: 'Cannot edit a control with isDPDPA set to true' });
    }

    // Update the control
    const updatedControl = await Control.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedControl) {
      res.json(updatedControl);
    } else {
      res.status(404).json({ message: 'Control not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating control' });
  }
};

export const deleteControl = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the Control exists
    const control = await Control.findById(id);
    if (!control) {
      return res.status(404).json({ message: 'Control not found' });
    }

    // Check if control is not deletable
    if (control.isDPDPA) {
      return res
        .status(403)
        .json({ message: 'Cannot delete a control with isDPDPA set to 1' });
    }

    // Delete the Control
    const deletedControl = await Control.findByIdAndDelete(id);

    // Delete related Actions
    await Action.deleteMany({ control_Id: id });

    // Update ControlFamily info
    // await updateControlFamilyInfo(deletedControl.control_Family_Id);

    res.json({ message: 'Control and related actions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting control' });
  }
};
