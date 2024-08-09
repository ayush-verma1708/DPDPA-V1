// controllers/controlFamilyController.js
import ControlFamily from '../models/controlFamily.js';
import Control from '../models/control.js';
import Action from '../models/action.js';
import { getNextControlFamilyId } from '../utils/autoIncrementId.js';

// Helper function to update info field
const updateControlFamilyInfo = async (controlFamilyId) => {
  const controlFamily = await ControlFamily.findById(controlFamilyId);
  if (!controlFamily) return;

  const controls = await Control.find({ control_Family_Id: controlFamilyId });
  const actionsCount = await Action.countDocuments({ control_Id: { $in: controls.map(c => c._id) } });

  controlFamily.info.controlsCount = controls.length;
  controlFamily.info.actionsCount = actionsCount;

  await controlFamily.save();
};

export const getControlFamilies = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching control families' });
  }
};

export const createControlFamily = async (req, res) => {
  try {
    const FixedID = await getNextControlFamilyId();
    const controlFamily = new ControlFamily({
      FixedID,
      control_Family_Id: req.body.control_Family_Id,
      name: req.body.name,
      description: req.body.description,
      isDPDPA: req.body.isDPDPA || 0
    });

    await controlFamily.save();
    res.status(201).json(controlFamily);
  } catch (error) {
    res.status(400).json({ message: 'Error creating control family' });
  }
};

export const updateControlFamily = async (req, res) => {
  try {
    const { id } = req.params;
    const controlFamily = await ControlFamily.findById(id);
    if (controlFamily.isDPDPA) {
      return res.status(403).json({ message: 'Cannot edit a control family with isDPDPA set to 1' });
    }
    const updatedControlFamily = await ControlFamily.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedControlFamily) {
      return res.status(404).json({ message: 'Control family not found' });
    }

    await updateControlFamilyInfo(id); // Update info field

    res.json(updatedControlFamily);
  } catch (error) {
    res.status(400).json({ message: 'Error updating control family' });
  }
};

export const deleteControlFamily = async (req, res) => {
  try {
    const { id } = req.params;
    const controlFamily = await ControlFamily.findById(id);
    if (controlFamily.isDPDPA) {
      return res.status(403).json({ message: 'Cannot delete a control family with isDPDPA set to 1' });
    }
    const deletedControlFamily = await ControlFamily.findByIdAndDelete(id);
    if (!deletedControlFamily) {
      return res.status(404).json({ message: 'Control family not found' });
    }

    const controls = await Control.find({ control_Family_Id: id });
    for (const control of controls) {
      await Action.deleteMany({ control_Id: control._id });
    }
    await Control.deleteMany({ control_Family_Id: id });

    res.json({ message: 'Control family and related controls and actions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting control family' });
  }
};

// // controllers/controlFamilyController.js
// import ControlFamily from '../models/controlFamily.js';
// import Control from '../models/control.js';
// import Action from '../models/action.js';
// import { getNextControlFamilyId } from '../utils/autoIncrementId.js';
// // import { updateControlFamilyCounts } from '../utils/updateCounts.js';

// export const getControlFamilies = async (req, res) => {
//   try {
//     const controlFamilies = await ControlFamily.find();
//     const result = [];

//     for (const family of controlFamilies) {
//       const controls = await Control.find({ control_Family_Id: family._id });
//       const controlsWithActions = [];

//       for (const control of controls) {
//         const actions = await Action.find({ control_Id: control._id });
//         controlsWithActions.push({ ...control._doc, actions });
//       }

//       result.push({ ...family._doc, controls: controlsWithActions });
//     }

//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching control families' });
//   }
// };

// export const createControlFamily = async (req, res) => {
//   try {
//     const FixedID = await getNextControlFamilyId();
//     const controlFamily = new ControlFamily({
//       FixedID,
//       control_Family_Id: req.body.control_Family_Id,
//       name: req.body.name,
//       description: req.body.description,
//       isDPDPA: req.body.isDPDPA || 0, // Default to 0 if not provided
//     });

//     await controlFamily.save();
//     res.status(201).json(controlFamily);
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating control family' });
//   }
// };

// export const updateControlFamily = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const controlFamily = await ControlFamily.findById(id);
//     if (controlFamily.isDPDPA) {
//       return res.status(403).json({ message: 'Cannot edit a control family with isDPDPA set to 1' });
//     }
//     const updatedControlFamily = await ControlFamily.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updatedControlFamily) {
//       return res.status(404).json({ message: 'Control family not found' });
//     }
//     res.json(updatedControlFamily);
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating control family' });
//   }
// };

// export const deleteControlFamily = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const controlFamily = await ControlFamily.findById(id);
//     if (controlFamily.isDPDPA) {
//       return res.status(403).json({ message: 'Cannot delete a control family with isDPDPA set to 1' });
//     }
//     const deletedControlFamily = await ControlFamily.findByIdAndDelete(id);
//     if (!deletedControlFamily) {
//       return res.status(404).json({ message: 'Control family not found' });
//     }

//     const controls = await Control.find({ control_Family_Id: id });
//     for (const control of controls) {
//       await Action.deleteMany({ control_Id: control._id });
//     }
//     await Control.deleteMany({ control_Family_Id: id });

//     res.json({ message: 'Control family and related controls and actions deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting control family' });
//   }
// };


// /// Updated file 



// // // controllers/controlFamilyController.js
// // import ControlFamily from '../models/controlFamily.js';
// // import Control from '../models/control.js';
// // import Action from '../models/action.js';
// // import { getNextControlFamilyId } from '../utils/autoIncrementId.js';

// // export const getControlFamilies = async (req, res) => {
// //   try {
// //     const controlFamilies = await ControlFamily.find();
// //     const result = [];

// //     for (const family of controlFamilies) {
// //       const controls = await Control.find({ control_Family_Id: family._id });
// //       const controlsWithActions = [];

// //       for (const control of controls) {
// //         const actions = await Action.find({ control_Id: control._id });
// //         controlsWithActions.push({ ...control._doc, actions });
// //       }

// //       result.push({ ...family._doc, controls: controlsWithActions });
// //     }

// //     res.json(result);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error fetching control families' });
// //   }
// // };

// // export const createControlFamily = async (req, res) => {
// //   try {
// //     const FixedID = await getNextControlFamilyId();
// //     const controlFamily = new ControlFamily({
// //       FixedID,
// //       control_Family_Id: req.body.control_Family_Id,
// //       name: req.body.name,
// //       description: req.body.description,
// //     });

// //     await controlFamily.save();
// //     res.status(201).json(controlFamily);
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error creating control family' });
// //   }
// // };

// // export const updateControlFamily = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const controlFamily = await ControlFamily.findByIdAndUpdate(id, req.body, { new: true });
// //     if (!controlFamily) {
// //       return res.status(404).json({ message: 'Control family not found' });
// //     }
// //     res.json(controlFamily);
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error updating control family' });
// //   }
// // };

// // export const deleteControlFamily = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const controlFamily = await ControlFamily.findByIdAndDelete(id);
// //     if (!controlFamily) {
// //       return res.status(404).json({ message: 'Control family not found' });
// //     }

// //     const controls = await Control.find({ control_Family_Id: id });
// //     for (const control of controls) {
// //       await Action.deleteMany({ control_Id: control._id });
// //     }
// //     await Control.deleteMany({ control_Family_Id: id });

// //     res.json({ message: 'Control family and related controls and actions deleted successfully' });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error deleting control family' });
// //   }
// // };

// // // import ControlFamily from '../models/controlFamily.js';
// // // import Control from '../models/control.js';
// // // import Action from '../models/action.js';
// // // import { getNextControlFamilyId } from '../utils/autoIncrementId.js';

// // // // Get control families along with their controls and actions
// // // export const getControlFamilies = async (req, res) => {
// // //   try {
// // //     const controlFamilies = await ControlFamily.find();
// // //     const result = [];

// // //     for (const family of controlFamilies) {
// // //       const controls = await Control.find({ control_Family_Id: family._id });
// // //       const controlsWithActions = [];

// // //       for (const control of controls) {
// // //         const actions = await Action.find({ control_Id: control._id });
// // //         controlsWithActions.push({ ...control._doc, actions });
// // //       }

// // //       result.push({ ...family._doc, controls: controlsWithActions });
// // //     }

// // //     res.json(result);
// // //   } catch (error) {
// // //     res.status(500).json({ message: 'Error fetching control families' });
// // //   }
// // // };

// // // // Create a new control family
// // // export const createControlFamily = async (req, res) => {
// // //   try {
// // //     const FixedID = await getNextControlFamilyId();
// // //     const controlFamily = new ControlFamily({
// // //       FixedID,
// // //       VariableID: req.body.VariableID || FixedID,
// // //       desc: req.body.desc,
// // //       // other fields from req.body
// // //     });

// // //     await controlFamily.save();
// // //     res.status(201).json(controlFamily);
// // //   } catch (error) {
// // //     res.status(400).json({ message: 'Error creating control family' });
// // //   }
// // // };
// // // // export const createControlFamily = async (req, res) => {
// // // //   try {
// // // //     const controlFamily = new ControlFamily(req.body);
// // // //     await controlFamily.save();
// // // //     res.status(201).json(controlFamily);
// // // //   } catch (error) {
// // // //     res.status(400).json({ message: 'Error creating control family' });
// // // //   }
// // // // };

// // // // Update a control family
// // // export const updateControlFamily = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const controlFamily = await ControlFamily.findByIdAndUpdate(id, req.body, { new: true });
// // //     if (!controlFamily) {
// // //       return res.status(404).json({ message: 'Control family not found' });
// // //     }
// // //     res.json(controlFamily);
// // //   } catch (error) {
// // //     res.status(400).json({ message: 'Error updating control family' });
// // //   }
// // // };
// // // // export const updateControlFamily = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params;
// // // //     const controlFamily = await ControlFamily.findByIdAndUpdate(id, req.body, { new: true });
// // // //     if (!controlFamily) {
// // // //       return res.status(404).json({ message: 'Control family not found' });
// // // //     }
// // // //     res.json(controlFamily);
// // // //   } catch (error) {
// // // //     res.status(400).json({ message: 'Error updating control family' });
// // // //   }
// // // // };

// // // // Delete a control family and its associated controls and actions
// // // export const deleteControlFamily = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const controlFamily = await ControlFamily.findByIdAndDelete(id);
// // //     if (!controlFamily) {
// // //       return res.status(404).json({ message: 'Control family not found' });
// // //     }

// // //     // Delete corresponding controls and their actions
// // //     const controls = await Control.find({ control_Family_Id: id });
// // //     for (const control of controls) {
// // //       await Action.deleteMany({ control_Id: control._id });
// // //     }
// // //     await Control.deleteMany({ control_Family_Id: id });

// // //     res.json({ message: 'Control family and related controls and actions deleted successfully' });
// // //   } catch (error) {
// // //     res.status(500).json({ message: 'Error deleting control family' });
// // //   }
// // // };

