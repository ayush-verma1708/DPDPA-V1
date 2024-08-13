import Control from '../models/control.js';
import ControlFamily from '../models/controlFamily.js';
import Action from '../models/action.js';
import { getNextControlId } from '../utils/autoIncrementId.js';

export const getControls = async (req, res) => {
  try {
    // Fetch all controls
    const controls = await Control.find();

    // Include associated control family data
    const controlsWithFamily = await Promise.all(controls.map(async (control) => {
      const controlFamily = await ControlFamily.findOne({ fixed_id: control.control_Family_Id });
      return {
        ...control._doc,
        controlFamily
      };
    }));

    res.json(controlsWithFamily);
  } catch (error) {
    console.error('Error fetching controls:', error);  // Log the error details
    res.status(500).json({ message: 'Error fetching controls', error: error.message });
  }
};


export const createControl = async (req, res) => {
  try {
    const { control_Family_Id, section, section_main_desc, section_desc, control_type } = req.body;

    // Validate the presence of control_Family_Id
    if (!control_Family_Id) {
      return res.status(400).json({ message: 'Control family ID is required' });
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
      control_Family_Id: controlFamily._id,  // Use controlFamily._id directly
    });

    // Save the new control to the database
    await control.save();

    // Respond with the created control
    res.status(201).json(control);
  } catch (error) {
    // Handle errors
    res.status(400).json({ message: 'Error creating control', error: error.message });
  }
};


// export const createControl = async (req, res) => {
//   try {
//     const controlFamily = await ControlFamily.findOne({ fixed_id: req.body.control_Family_Id });
    
//     if (!controlFamily) {
//       return res.status(404).json({ message: 'Control family does not exist' });
//     }

//     const fixedId = await getNextControlId();

//     const control = new Control({
//       fixed_id: fixedId,
//       section: req.body.section,
//       section_main_desc: req.body.section_main_desc,
//       section_desc: req.body.section_desc,
//       control_type: req.body.control_type,
//       control_Family_Id: controlFamily._id,  // Use controlFamily._id here
//     });

//     await control.save();
//     res.status(201).json(control);
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating control', error: error.message });
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
      return res.status(403).json({ message: 'Cannot edit a control with isDPDPA set to 1' });
    }

    // Update the control
    const updatedControl = await Control.findByIdAndUpdate(id, req.body, { new: true });

    // Update ControlFamily info
    if (updatedControl) {
      // await updateControlFamilyInfo(updatedControl.control_Family_Id);
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
      return res.status(403).json({ message: 'Cannot delete a control with isDPDPA set to 1' });
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



// export const createControl = async (req, res) => {
//   try {
//     // Find the control family by its fixed_id
//     const controlFamily = await ControlFamily.findOne({ fixed_id: req.body.control_Family_Id });

//     if (!controlFamily) {
//       return res.status(404).json({ message: 'Control family does not exist' });
//     }

//     // Generate the next control FixedID
//     const fixedId = await getNextControlId();

//     // Create the control with the generated FixedID
//     const control = new Control({
//       fixed_id: fixedId,
//       section: req.body.section,
//       section_main_desc: req.body.section_main_desc,
//       section_desc: req.body.section_desc,
//       control_type: req.body.control_type,
//       // control_Family_Id: req.body.control_Family_Id,
//       control_Family_Id: req.body.control_Family_Id,  // Update field name

//     });

//     // Save the control
//     await control.save();
//     res.status(201).json(control);
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating control', error: error.message });
//   }
// };


// import Control from '../models/control.js';
// import ControlFamily from '../models/controlFamily.js';
// import Action from '../models/action.js';
// import { getNextControlId } from '../utils/autoIncrementId.js';

// // Helper function to update info field in ControlFamily
// const updateControlFamilyInfo = async (controlFamilyId) => {
//   const controlFamily = await ControlFamily.findById(controlFamilyId);
//   if (!controlFamily) return;

//   const controls = await Control.find({ control_Family_Id: controlFamilyId });
//   const actionsCount = await Action.countDocuments({ control_Id: { $in: controls.map(c => c._id) } });

//   controlFamily.info.controlsCount = controls.length;
//   controlFamily.info.actionsCount = actionsCount;

//   await controlFamily.save();
// };

// export const getControls = async (req, res) => {
//   try {
//     // Fetch all controls
//     const controls = await Control.find();

//     // If you want to include the associated control family data, you can do something like this:
//     const controlsWithFamily = await Promise.all(controls.map(async (control) => {
//       const controlFamily = await ControlFamily.findOne({ fixed_id: control.control_Family_Id });
//       return {
//         ...control._doc,
//         controlFamily
//       };
//     }));

//     res.json(controlsWithFamily);
//   } catch (error) {
//     console.error('Error fetching controls:', error);  // Log the error details
//     res.status(500).json({ message: 'Error fetching controls', error: error.message });
//   }
// };

// // export const getControls = async (req, res) => {
// //   try {
// //     const controls = await Control.find().populate('control_Family_Id', 'name');
// //     const controlsWithActions = [];

// //     for (const control of controls) {
// //       const actions = await Action.find({ control_Id: control._id });
// //       controlsWithActions.push({ ...control._doc, actions });
// //     }

// //     res.json(controlsWithActions);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error fetching controls' });
// //   }
// // };

// // export const createControl = async (req, res) => {
// //   try {
// //     const { control_Family_Id, criticality } = req.body;

// //     // Check if ControlFamily exists
// //     const controlFamily = await ControlFamily.findById(control_Family_Id);
// //     if (!controlFamily) {
// //       return res.status(400).json({ message: 'Control family does not exist' });
// //     }

// //     // Generate a new FixedID
// //     const FixedID = await getNextControlId();

// //     // Create a new Control instance
// //     const control = new Control({
// //       FixedID,
// //       control_Id: req.body.control_Id,
// //       name: req.body.name,
// //       description: req.body.description,
// //       control_Family_Id,
// //       isDPDPA: req.body.isDPDPA || 0,
// //       criticality // Ensure this field exists in your model
// //     });

// //     // Save the control
// //     await control.save();

// //     // Update ControlFamily info
// //     await updateControlFamilyInfo(control_Family_Id);

// //     res.status(201).json(control);
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error creating control' });
// //   }
// // };

// // Function to create a new control
// export const createControl = async (req, res) => {
//   try {
//     // Check if the Control Family exists using `fixed_id`
//     const controlFamily = await ControlFamily.findOne({ fixed_id: req.body.control_Family_Id });

//     if (!controlFamily) {
//       return res.status(404).json({ message: 'Control family does not exist' });
//     }

//     // Create the new Control
//     const control = new Control({
//       fixed_id: req.body.fixed_id,
//       section: req.body.section,
//       section_main_desc: req.body.section_main_desc,
//       section_desc: req.body.section_desc,
//       control_type: req.body.control_type,
//       control_Family_Id: req.body.control_Family_Id
//     });

//     // Save the Control
//     await control.save();
//     res.status(201).json(control);
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating control', error: error.message });
//   }
// };

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
//       return res.status(403).json({ message: 'Cannot edit a control with isDPDPA set to 1' });
//     }

//     // Update the control
//     const updatedControl = await Control.findByIdAndUpdate(id, req.body, { new: true });

//     // Update ControlFamily info
//     if (updatedControl) {
//       await updateControlFamilyInfo(updatedControl.control_Family_Id);
//       res.json(updatedControl);
//     } else {
//       res.status(404).json({ message: 'Control not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating control' });
//   }
// };

// export const deleteControl = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if the Control exists
//     const control = await Control.findById(id);
//     if (!control) {
//       return res.status(404).json({ message: 'Control not found' });
//     }

//     // Check if control is not deletable
//     if (control.isDPDPA) {
//       return res.status(403).json({ message: 'Cannot delete a control with isDPDPA set to 1' });
//     }

//     // Delete the Control
//     const deletedControl = await Control.findByIdAndDelete(id);

//     // Delete related Actions
//     await Action.deleteMany({ control_Id: id });

//     // Update ControlFamily info
//     await updateControlFamilyInfo(deletedControl.control_Family_Id);

//     res.json({ message: 'Control and related actions deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting control' });
//   }
// };


// // import Control from '../models/control.js';
// // import ControlFamily from '../models/controlFamily.js';
// // import Action from '../models/action.js';
// // import { getNextControlId } from '../utils/autoIncrementId.js';

// // // Helper function to update info field in ControlFamily
// // const updateControlFamilyInfo = async (controlFamilyId) => {
// //   const controlFamily = await ControlFamily.findById(controlFamilyId);
// //   if (!controlFamily) return;

// //   const controls = await Control.find({ control_Family_Id: controlFamilyId });
// //   const actionsCount = await Action.countDocuments({ control_Id: { $in: controls.map(c => c._id) } });

// //   controlFamily.info.controlsCount = controls.length;
// //   controlFamily.info.actionsCount = actionsCount;

// //   await controlFamily.save();
// // };

// // export const getControls = async (req, res) => {
// //   try {
// //     const controls = await Control.find().populate('control_Family_Id', 'name');
// //     const controlsWithActions = [];

// //     for (const control of controls) {
// //       const actions = await Action.find({ control_Id: control._id });
// //       controlsWithActions.push({ ...control._doc, actions });
// //     }

// //     res.json(controlsWithActions);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error fetching controls' });
// //   }
// // };

// // export const createControl = async (req, res) => {
// //   try {
// //     const { control_Family_Id, criticality } = req.body;

// //     const controlFamily = await ControlFamily.findById(control_Family_Id);
// //     if (!controlFamily) {
// //       return res.status(400).json({ message: 'Control family does not exist' });
// //     }

// //     const FixedID = await getNextControlId();
// //     const control = new Control({
// //       FixedID,
// //       control_Id: req.body.control_Id,
// //       name: req.body.name,
// //       description: req.body.description,
// //       control_Family_Id,
// //       isDPDPA: req.body.isDPDPA || 0,
// //       criticality // Added field
// //     });

// //     await control.save();

// //     // Update info field in ControlFamily
// //     await updateControlFamilyInfo(control_Family_Id);

// //     res.status(201).json(control);
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error creating control' });
// //   }
// // };

// // export const updateControl = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const control = await Control.findById(id);
// //     if (control.isDPDPA) {
// //       return res.status(403).json({ message: 'Cannot edit a control with isDPDPA set to 1' });
// //     }
// //     const updatedControl = await Control.findByIdAndUpdate(id, req.body, { new: true });
// //     if (!updatedControl) {
// //       return res.status(404).json({ message: 'Control not found' });
// //     }

// //     // Update info field in ControlFamily
// //     await updateControlFamilyInfo(updatedControl.control_Family_Id);

// //     res.json(updatedControl);
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error updating control' });
// //   }
// // };

// // export const deleteControl = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const control = await Control.findById(id);
// //     if (control.isDPDPA) {
// //       return res.status(403).json({ message: 'Cannot delete a control with isDPDPA set to 1' });
// //     }
// //     const deletedControl = await Control.findByIdAndDelete(id);
// //     if (!deletedControl) {
// //       return res.status(404).json({ message: 'Control not found' });
// //     }

// //     await Action.deleteMany({ control_Id: id });

// //     // Update info field in ControlFamily
// //     await updateControlFamilyInfo(deletedControl.control_Family_Id);

// //     res.json({ message: 'Control and related actions deleted successfully' });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error deleting control' });
// //   }
// // };

// // // controllers/controlController.js
// // import Control from '../models/control.js';
// // import ControlFamily from '../models/controlFamily.js';
// // import Action from '../models/action.js';
// // import { getNextControlId } from '../utils/autoIncrementId.js';

// // // Helper function to update info field in ControlFamily
// // const updateControlFamilyInfo = async (controlFamilyId) => {
// //   const controlFamily = await ControlFamily.findById(controlFamilyId);
// //   if (!controlFamily) return;

// //   const controls = await Control.find({ control_Family_Id: controlFamilyId });
// //   const actionsCount = await Action.countDocuments({ control_Id: { $in: controls.map(c => c._id) } });

// //   controlFamily.info.controlsCount = controls.length;
// //   controlFamily.info.actionsCount = actionsCount;

// //   await controlFamily.save();
// // };

// // export const getControls = async (req, res) => {
// //   try {
// //     const controls = await Control.find().populate('control_Family_Id', 'name');
// //     const controlsWithActions = [];

// //     for (const control of controls) {
// //       const actions = await Action.find({ control_Id: control._id });
// //       controlsWithActions.push({ ...control._doc, actions });
// //     }

// //     res.json(controlsWithActions);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error fetching controls' });
// //   }
// // };

// // export const createControl = async (req, res) => {
// //   try {
// //     const { control_Family_Id } = req.body;

// //     const controlFamily = await ControlFamily.findById(control_Family_Id);
// //     if (!controlFamily) {
// //       return res.status(400).json({ message: 'Control family does not exist' });
// //     }

// //     const FixedID = await getNextControlId();
// //     const control = new Control({
// //       FixedID,
// //       control_Id: req.body.control_Id,
// //       name: req.body.name,
// //       description: req.body.description,
// //       control_Family_Id,
// //       isDPDPA: req.body.isDPDPA || 0
// //     });

// //     await control.save();

// //     // Update info field in ControlFamily
// //     await updateControlFamilyInfo(control_Family_Id);

// //     res.status(201).json(control);
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error creating control' });
// //   }
// // };

// // export const updateControl = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const control = await Control.findById(id);
// //     if (control.isDPDPA) {
// //       return res.status(403).json({ message: 'Cannot edit a control with isDPDPA set to 1' });
// //     }
// //     const updatedControl = await Control.findByIdAndUpdate(id, req.body, { new: true });
// //     if (!updatedControl) {
// //       return res.status(404).json({ message: 'Control not found' });
// //     }

// //     // Update info field in ControlFamily
// //     await updateControlFamilyInfo(updatedControl.control_Family_Id);

// //     res.json(updatedControl);
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error updating control' });
// //   }
// // };

// // export const deleteControl = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const control = await Control.findById(id);
// //     if (control.isDPDPA) {
// //       return res.status(403).json({ message: 'Cannot delete a control with isDPDPA set to 1' });
// //     }
// //     const deletedControl = await Control.findByIdAndDelete(id);
// //     if (!deletedControl) {
// //       return res.status(404).json({ message: 'Control not found' });
// //     }

// //     await Action.deleteMany({ control_Id: id });

// //     // Update info field in ControlFamily
// //     await updateControlFamilyInfo(deletedControl.control_Family_Id);

// //     res.json({ message: 'Control and related actions deleted successfully' });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error deleting control' });
// //   }
// // };

// // // // controllers/controlController.js
// // // import Control from '../models/control.js';
// // // import ControlFamily from '../models/controlFamily.js';
// // // import Action from '../models/action.js';
// // // import { getNextControlId } from '../utils/autoIncrementId.js';

// // // export const getControls = async (req, res) => {
// // //   try {
// // //     const controls = await Control.find().populate('control_Family_Id', 'name');
// // //     const controlsWithActions = [];

// // //     for (const control of controls) {
// // //       const actions = await Action.find({ control_Id: control._id });
// // //       controlsWithActions.push({ ...control._doc, actions });
// // //     }

// // //     res.json(controlsWithActions);
// // //   } catch (error) {
// // //     res.status(500).json({ message: 'Error fetching controls' });
// // //   }
// // // };

// // // export const createControl = async (req, res) => {
// // //   try {
// // //     const { control_Family_Id } = req.body;

// // //     const controlFamily = await ControlFamily.findById(control_Family_Id);
// // //     if (!controlFamily) {
// // //       return res.status(400).json({ message: 'Control family does not exist' });
// // //     }

// // //     const FixedID = await getNextControlId();
// // //     const control = new Control({
// // //       FixedID,
// // //       control_Id: req.body.control_Id,
// // //       name: req.body.name,
// // //       description: req.body.description,
// // //       control_Family_Id,
// // //       isDPDPA: req.body.isDPDPA || 0 // Default to 0 if not provided
// // //     });

// // //     await control.save();
// // //     res.status(201).json(control);
// // //   } catch (error) {
// // //     res.status(400).json({ message: 'Error creating control' });
// // //   }
// // // };

// // // export const updateControl = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const control = await Control.findById(id);
// // //     if (control.isDPDPA) {
// // //       return res.status(403).json({ message: 'Cannot edit a control with isDPDPA set to 1' });
// // //     }
// // //     const updatedControl = await Control.findByIdAndUpdate(id, req.body, { new: true });
// // //     if (!updatedControl) {
// // //       return res.status(404).json({ message: 'Control not found' });
// // //     }
// // //     res.json(updatedControl);
// // //   } catch (error) {
// // //     res.status(400).json({ message: 'Error updating control' });
// // //   }
// // // };

// // // export const deleteControl = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const control = await Control.findById(id);
// // //     if (control.isDPDPA) {
// // //       return res.status(403).json({ message: 'Cannot delete a control with isDPDPA set to 1' });
// // //     }
// // //     const deletedControl = await Control.findByIdAndDelete(id);
// // //     if (!deletedControl) {
// // //       return res.status(404).json({ message: 'Control not found' });
// // //     }

// // //     await Action.deleteMany({ control_Id: id });

// // //     res.json({ message: 'Control and related actions deleted successfully' });
// // //   } catch (error) {
// // //     res.status(500).json({ message: 'Error deleting control' });
// // //   }
// // // };

// // // // // controllers/controlController.js
// // // // import Control from '../models/control.js';
// // // // import ControlFamily from '../models/controlFamily.js';
// // // // import Action from '../models/action.js';
// // // // import { getNextControlId } from '../utils/autoIncrementId.js';

// // // // export const getControls = async (req, res) => {
// // // //   try {
// // // //     const controls = await Control.find().populate('control_Family_Id', 'name');
// // // //     const controlsWithActions = [];

// // // //     for (const control of controls) {
// // // //       const actions = await Action.find({ control_Id: control._id });
// // // //       controlsWithActions.push({ ...control._doc, actions });
// // // //     }

// // // //     res.json(controlsWithActions);
// // // //   } catch (error) {
// // // //     res.status(500).json({ message: 'Error fetching controls' });
// // // //   }
// // // // };

// // // // export const createControl = async (req, res) => {
// // // //   try {
// // // //     const { control_Family_Id } = req.body;

// // // //     const controlFamily = await ControlFamily.findById(control_Family_Id);
// // // //     if (!controlFamily) {
// // // //       return res.status(400).json({ message: 'Control family does not exist' });
// // // //     }

// // // //     const FixedID = await getNextControlId();
// // // //     const control = new Control({
// // // //       FixedID,
// // // //       control_Id: req.body.control_Id,
// // // //       name: req.body.name,
// // // //       description: req.body.description,
// // // //       control_Family_Id
// // // //     });

// // // //     await control.save();
// // // //     res.status(201).json(control);
// // // //   } catch (error) {
// // // //     res.status(400).json({ message: 'Error creating control' });
// // // //   }
// // // // };

// // // // export const updateControl = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params;
// // // //     const control = await Control.findByIdAndUpdate(id, req.body, { new: true });
// // // //     if (!control) {
// // // //       return res.status(404).json({ message: 'Control not found' });
// // // //     }
// // // //     res.json(control);
// // // //   } catch (error) {
// // // //     res.status(400).json({ message: 'Error updating control' });
// // // //   }
// // // // };

// // // // export const deleteControl = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params;
// // // //     const control = await Control.findByIdAndDelete(id);
// // // //     if (!control) {
// // // //       return res.status(404).json({ message: 'Control not found' });
// // // //     }

// // // //     await Action.deleteMany({ control_Id: id });

// // // //     res.json({ message: 'Control and related actions deleted successfully' });
// // // //   } catch (error) {
// // // //     res.status(500).json({ message: 'Error deleting control' });
// // // //   }
// // // // };

// // // // // import Control from '../models/control.js';
// // // // // import ControlFamily from '../models/controlFamily.js';
// // // // // import Action from '../models/action.js';
// // // // // import { getNextControlId } from '../utils/autoIncrementId.js';

// // // // // // Get all controls with their control family name and actions
// // // // // export const getControls = async (req, res) => {
// // // // //   try {
// // // // //     const controls = await Control.find().populate('control_Family_Id', 'name');
// // // // //     const controlsWithActions = [];

// // // // //     for (const control of controls) {
// // // // //       const actions = await Action.find({ control_Id: control._id });
// // // // //       controlsWithActions.push({ ...control._doc, actions });
// // // // //     }

// // // // //     res.json(controlsWithActions);
// // // // //   } catch (error) {
// // // // //     res.status(500).json({ message: 'Error fetching controls' });
// // // // //   }
// // // // // };

// // // // // // Create a new control
// // // // // export const createControl = async (req, res) => {
// // // // //   try {
// // // // //     const { control_Family_Id } = req.body;

// // // // //     // Check if the control family exists
// // // // //     const controlFamily = await ControlFamily.findById(control_Family_Id);
// // // // //     if (!controlFamily) {
// // // // //       return res.status(400).json({ message: 'Control family does not exist' });
// // // // //     }

// // // // //     const FixedID = await getNextControlId();
// // // // //     const control = new Control({
// // // // //       FixedID,
// // // // //       VariableID: req.body.VariableID || FixedID,
// // // // //       desc: req.body.desc,
// // // // //       control_Family_Id,
// // // // //       // other fields from req.body
// // // // //     });

// // // // //     await control.save();
// // // // //     res.status(201).json(control);
// // // // //   } catch (error) {
// // // // //     res.status(400).json({ message: 'Error creating control' });
// // // // //   }
// // // // // };

// // // // // // export const createControl = async (req, res) => {
// // // // // //   try {
// // // // // //     const { control_Family_Id } = req.body;

// // // // // //     // Check if the control family exists
// // // // // //     const controlFamily = await ControlFamily.findById(control_Family_Id);
// // // // // //     if (!controlFamily) {
// // // // // //       return res.status(400).json({ message: 'Control family does not exist' });
// // // // // //     }

// // // // // //     const control = new Control(req.body);
// // // // // //     await control.save();
// // // // // //     res.status(201).json(control);
// // // // // //   } catch (error) {
// // // // // //     res.status(400).json({ message: 'Error creating control' });
// // // // // //   }
// // // // // // };

// // // // // // Update a control
// // // // // export const updateControl = async (req, res) => {
// // // // //   try {
// // // // //     const { id } = req.params;
// // // // //     const control = await Control.findByIdAndUpdate(id, req.body, { new: true });
// // // // //     if (!control) {
// // // // //       return res.status(404).json({ message: 'Control not found' });
// // // // //     }
// // // // //     res.json(control);
// // // // //   } catch (error) {
// // // // //     res.status(400).json({ message: 'Error updating control' });
// // // // //   }
// // // // // };
// // // // // // export const updateControl = async (req, res) => {
// // // // // //   try {
// // // // // //     const { id } = req.params;
// // // // // //     const control = await Control.findByIdAndUpdate(id, req.body, { new: true });
// // // // // //     if (!control) {
// // // // // //       return res.status(404).json({ message: 'Control not found' });
// // // // // //     }
// // // // // //     res.json(control);
// // // // // //   } catch (error) {
// // // // // //     res.status(400).json({ message: 'Error updating control' });
// // // // // //   }
// // // // // // };

// // // // // // Delete a control and its associated actions
// // // // // export const deleteControl = async (req, res) => {
// // // // //   try {
// // // // //     const { id } = req.params;
// // // // //     const control = await Control.findByIdAndDelete(id);
// // // // //     if (!control) {
// // // // //       return res.status(404).json({ message: 'Control not found' });
// // // // //     }

// // // // //     // Delete corresponding actions
// // // // //     await Action.deleteMany({ control_Id: id });

// // // // //     res.json({ message: 'Control and related actions deleted successfully' });
// // // // //   } catch (error) {
// // // // //     res.status(500).json({ message: 'Error deleting control' });
// // // // //   }
// // // // // };

// // // // // // import Control from '../models/control.js';
// // // // // // import ControlFamily from '../models/controlFamily.js';

// // // // // // export const getControls = async (req, res) => {
// // // // // //   try {
// // // // // //     const controls = await Control.find().populate('control_Family_Id', 'name');
// // // // // //     res.json(controls);
// // // // // //   } catch (error) {
// // // // // //     res.status(500).json({ message: 'Error fetching controls' });
// // // // // //   }
// // // // // // };

// // // // // // export const createControl = async (req, res) => {
// // // // // //   try {
// // // // // //     const { control_Family_Id } = req.body;

// // // // // //     // Check if the control family exists
// // // // // //     const controlFamily = await ControlFamily.findById(control_Family_Id);
// // // // // //     if (!controlFamily) {
// // // // // //       return res.status(400).json({ message: 'Control family does not exist' });
// // // // // //     }

// // // // // //     const control = new Control(req.body);
// // // // // //     await control.save();
// // // // // //     res.status(201).json(control);
// // // // // //   } catch (error) {
// // // // // //     res.status(400).json({ message: 'Error creating control' });
// // // // // //   }
// // // // // // };

// // // // // // export const updateControl = async (req, res) => {
// // // // // //   try {
// // // // // //     const { id } = req.params;
// // // // // //     const control = await Control.findByIdAndUpdate(id, req.body, { new: true });
// // // // // //     if (!control) {
// // // // // //       return res.status(404).json({ message: 'Control not found' });
// // // // // //     }
// // // // // //     res.json(control);
// // // // // //   } catch (error) {
// // // // // //     res.status(400).json({ message: 'Error updating control' });
// // // // // //   }
// // // // // // };

// // // // // // export const deleteControl = async (req, res) => {
// // // // // //   try {
// // // // // //     const { id } = req.params;
// // // // // //     const control = await Control.findByIdAndDelete(id);
// // // // // //     if (!control) {
// // // // // //       return res.status(404).json({ message: 'Control not found' });
// // // // // //     }
// // // // // //     res.json({ message: 'Control deleted successfully' });
// // // // // //   } catch (error) {
// // // // // //     res.status(500).json({ message: 'Error deleting control' });
// // // // // //   }
// // // // // // };
