import ControlFamily from '../models/controlFamily.js';
import Control from '../models/control.js';
import Action from '../models/action.js';
import { getNextControlFamilyId } from '../utils/autoIncrementId.js';

// // Helper function to update the info field in ControlFamily
// const updateControlFamilyInfo = async (controlFamilyId) => {
//   const controlFamily = await ControlFamily.findById(controlFamilyId);
//   if (!controlFamily) return;

//   const controls = await Control.find({ control_Family_Id: controlFamilyId });
//   const actionsCount = await Action.countDocuments({ control_Id: { $in: controls.map(c => c._id) } });

//   controlFamily.info.controlsCount = controls.length;
//   controlFamily.info.actionsCount = actionsCount;

//   await controlFamily.save();
// };

// export const getControlFamilies = async (req, res) => {
//   try {
//     // If ID is provided in query, fetch the specific control family
//     if (req.query.id) {
//       const controlFamily = await ControlFamily.findOne({ fixed_id: req.query.id });
//       if (!controlFamily) {
//         return res.status(404).json({ message: 'Control family not found' });
//       }

//       const controls = await Control.find({ control_Family_Id: controlFamily._id });
//       const controlsWithActions = [];

//       for (const control of controls) {
//         const actions = await Action.find({ control_Id: control._id });
//         controlsWithActions.push({ ...control._doc, actions });
//       }

//       return res.json({ ...controlFamily._doc, controls: controlsWithActions });
//     }

//     // Fetch all control families
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

export const getControlFamilies = async (req, res) => {
  try {
    const { id } = req.query; // Use query parameter to fetch by ID
    if (id) {
      const controlFamily = await ControlFamily.findById(id);

      console.log(controlFamily);

      if (!controlFamily) {
        return res.status(404).json({ message: 'Control family not found' });
      }
      res.json(controlFamily);
    } else {
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

// export const updateControlFamily = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const controlFamily = await ControlFamily.findById(id);
//     if (!controlFamily) {
//       return res.status(404).json({ message: 'Control family not found' });
//     }

//     if (controlFamily.isDPDPA) {
//       return res.status(403).json({ message: 'Cannot edit a control family with isDPDPA set to 1' });
//     }

//     const updatedControlFamily = await ControlFamily.findByIdAndUpdate(id, req.body, { new: true });

//     if (updatedControlFamily) {
//       await updateControlFamilyInfo(id);
//       res.json(updatedControlFamily);
//     } else {
//       res.status(404).json({ message: 'Control family not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating control family' });
//   }
// };

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

// import ControlFamily from '../models/controlFamily.js';
// import Control from '../models/control.js';
// import Action from '../models/action.js';
// import { getNextControlFamilyId } from '../utils/autoIncrementId.js';

// // Helper function to update the info field in ControlFamily
// const updateControlFamilyInfo = async (controlFamilyId) => {
//   const controlFamily = await ControlFamily.findById(controlFamilyId);
//   if (!controlFamily) return;

//   const controls = await Control.find({ control_Family_Id: controlFamilyId });
//   const actionsCount = await Action.countDocuments({ control_Id: { $in: controls.map(c => c._id) } });

//   controlFamily.info.controlsCount = controls.length;
//   controlFamily.info.actionsCount = actionsCount;

//   await controlFamily.save();
// };

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

// // export const createControlFamily = async (req, res) => {
// //   try {
// //     const FixedID = await getNextControlFamilyId();
// //     const controlFamily = new ControlFamily({
// //       FixedID,
// //       control_Family_Id: req.body.control_Family_Id,
// //       name: req.body.name,
// //       description: req.body.description,
// //       isDPDPA: req.body.isDPDPA || 0
// //     });

// //     await controlFamily.save();
// //     res.status(201).json(controlFamily);
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error creating control family' });
// //   }
// // };

// const generateNextFixedID = async () => {
//   try {
//     // Fetch the last control family
//     const lastControlFamily = await ControlFamily.findOne().sort({ 'fixed_id': -1 }).limit(1);

//     if (lastControlFamily && lastControlFamily.fixed_id) {
//       // Extract the numeric part and increment it
//       const lastFixedID = lastControlFamily.fixed_id;
//       const numericPart = parseInt(lastFixedID.replace('CF', ''));
//       return `CF${(numericPart + 1).toString().padStart(2, '0')}`;
//     }

//     // If no control families exist, start with CF01
//     return 'CF01';
//   } catch (error) {
//     console.error('Error generating FixedID:', error);
//     throw new Error('Failed to generate FixedID');
//   }
// };

// export const createControlFamily = async (req, res) => {
//   try {
//     const FixedID = await generateNextFixedID();
//     const controlFamily = new ControlFamily({
//       fixed_id: FixedID,
//       variable_id: req.body.variable_id
//     });

//     await controlFamily.save();
//     res.status(201).json(controlFamily);
//   } catch (error) {
//     console.error('Error details:', error); // Log the error details for debugging
//     res.status(400).json({ message: 'Error creating control family', error: error.message });
//   }
// };

// export const updateControlFamily = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if the ControlFamily exists
//     const controlFamily = await ControlFamily.findById(id);
//     if (!controlFamily) {
//       return res.status(404).json({ message: 'Control family not found' });
//     }

//     // Check if control family is editable
//     if (controlFamily.isDPDPA) {
//       return res.status(403).json({ message: 'Cannot edit a control family with isDPDPA set to 1' });
//     }

//     // Update the control family
//     const updatedControlFamily = await ControlFamily.findByIdAndUpdate(id, req.body, { new: true });

//     // Update ControlFamily info
//     if (updatedControlFamily) {
//       await updateControlFamilyInfo(id);
//       res.json(updatedControlFamily);
//     } else {
//       res.status(404).json({ message: 'Control family not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating control family' });
//   }
// };

// export const deleteControlFamily = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if the ControlFamily exists
//     const controlFamily = await ControlFamily.findById(id);
//     if (!controlFamily) {
//       return res.status(404).json({ message: 'Control family not found' });
//     }

//     // Check if control family is deletable
//     if (controlFamily.isDPDPA) {
//       return res.status(403).json({ message: 'Cannot delete a control family with isDPDPA set to 1' });
//     }

//     // Delete related controls and actions
//     await Control.deleteMany({ control_Family_Id: id });
//     await Action.deleteMany({ control_Id: { $in: (await Control.find({ control_Family_Id: id })).map(c => c._id) } });

//     // Delete the ControlFamily
//     await ControlFamily.findByIdAndDelete(id);

//     res.json({ message: 'Control family and related controls and actions deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting control family' });
//   }
// };

// // // controllers/controlFamilyController.js
// // import ControlFamily from '../models/controlFamily.js';
// // import Control from '../models/control.js';
// // import Action from '../models/action.js';
// // import { getNextControlFamilyId } from '../utils/autoIncrementId.js';

// // // Helper function to update info field
// // const updateControlFamilyInfo = async (controlFamilyId) => {
// //   const controlFamily = await ControlFamily.findById(controlFamilyId);
// //   if (!controlFamily) return;

// //   const controls = await Control.find({ control_Family_Id: controlFamilyId });
// //   const actionsCount = await Action.countDocuments({ control_Id: { $in: controls.map(c => c._id) } });

// //   controlFamily.info.controlsCount = controls.length;
// //   controlFamily.info.actionsCount = actionsCount;

// //   await controlFamily.save();
// // };

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
// //       isDPDPA: req.body.isDPDPA || 0
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
// //     const controlFamily = await ControlFamily.findById(id);
// //     if (controlFamily.isDPDPA) {
// //       return res.status(403).json({ message: 'Cannot edit a control family with isDPDPA set to 1' });
// //     }
// //     const updatedControlFamily = await ControlFamily.findByIdAndUpdate(id, req.body, { new: true });
// //     if (!updatedControlFamily) {
// //       return res.status(404).json({ message: 'Control family not found' });
// //     }

// //     await updateControlFamilyInfo(id); // Update info field

// //     res.json(updatedControlFamily);
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error updating control family' });
// //   }
// // };

// // export const deleteControlFamily = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const controlFamily = await ControlFamily.findById(id);
// //     if (controlFamily.isDPDPA) {
// //       return res.status(403).json({ message: 'Cannot delete a control family with isDPDPA set to 1' });
// //     }
// //     const deletedControlFamily = await ControlFamily.findByIdAndDelete(id);
// //     if (!deletedControlFamily) {
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

// // // // controllers/controlFamilyController.js
// // // import ControlFamily from '../models/controlFamily.js';
// // // import Control from '../models/control.js';
// // // import Action from '../models/action.js';
// // // import { getNextControlFamilyId } from '../utils/autoIncrementId.js';
// // // // import { updateControlFamilyCounts } from '../utils/updateCounts.js';

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

// // // export const createControlFamily = async (req, res) => {
// // //   try {
// // //     const FixedID = await getNextControlFamilyId();
// // //     const controlFamily = new ControlFamily({
// // //       FixedID,
// // //       control_Family_Id: req.body.control_Family_Id,
// // //       name: req.body.name,
// // //       description: req.body.description,
// // //       isDPDPA: req.body.isDPDPA || 0, // Default to 0 if not provided
// // //     });

// // //     await controlFamily.save();
// // //     res.status(201).json(controlFamily);
// // //   } catch (error) {
// // //     res.status(400).json({ message: 'Error creating control family' });
// // //   }
// // // };

// // // export const updateControlFamily = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const controlFamily = await ControlFamily.findById(id);
// // //     if (controlFamily.isDPDPA) {
// // //       return res.status(403).json({ message: 'Cannot edit a control family with isDPDPA set to 1' });
// // //     }
// // //     const updatedControlFamily = await ControlFamily.findByIdAndUpdate(id, req.body, { new: true });
// // //     if (!updatedControlFamily) {
// // //       return res.status(404).json({ message: 'Control family not found' });
// // //     }
// // //     res.json(updatedControlFamily);
// // //   } catch (error) {
// // //     res.status(400).json({ message: 'Error updating control family' });
// // //   }
// // // };

// // // export const deleteControlFamily = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const controlFamily = await ControlFamily.findById(id);
// // //     if (controlFamily.isDPDPA) {
// // //       return res.status(403).json({ message: 'Cannot delete a control family with isDPDPA set to 1' });
// // //     }
// // //     const deletedControlFamily = await ControlFamily.findByIdAndDelete(id);
// // //     if (!deletedControlFamily) {
// // //       return res.status(404).json({ message: 'Control family not found' });
// // //     }

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

// // // /// Updated file

// // // // // controllers/controlFamilyController.js
// // // // import ControlFamily from '../models/controlFamily.js';
// // // // import Control from '../models/control.js';
// // // // import Action from '../models/action.js';
// // // // import { getNextControlFamilyId } from '../utils/autoIncrementId.js';

// // // // export const getControlFamilies = async (req, res) => {
// // // //   try {
// // // //     const controlFamilies = await ControlFamily.find();
// // // //     const result = [];

// // // //     for (const family of controlFamilies) {
// // // //       const controls = await Control.find({ control_Family_Id: family._id });
// // // //       const controlsWithActions = [];

// // // //       for (const control of controls) {
// // // //         const actions = await Action.find({ control_Id: control._id });
// // // //         controlsWithActions.push({ ...control._doc, actions });
// // // //       }

// // // //       result.push({ ...family._doc, controls: controlsWithActions });
// // // //     }

// // // //     res.json(result);
// // // //   } catch (error) {
// // // //     res.status(500).json({ message: 'Error fetching control families' });
// // // //   }
// // // // };

// // // // export const createControlFamily = async (req, res) => {
// // // //   try {
// // // //     const FixedID = await getNextControlFamilyId();
// // // //     const controlFamily = new ControlFamily({
// // // //       FixedID,
// // // //       control_Family_Id: req.body.control_Family_Id,
// // // //       name: req.body.name,
// // // //       description: req.body.description,
// // // //     });

// // // //     await controlFamily.save();
// // // //     res.status(201).json(controlFamily);
// // // //   } catch (error) {
// // // //     res.status(400).json({ message: 'Error creating control family' });
// // // //   }
// // // // };

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

// // // // export const deleteControlFamily = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params;
// // // //     const controlFamily = await ControlFamily.findByIdAndDelete(id);
// // // //     if (!controlFamily) {
// // // //       return res.status(404).json({ message: 'Control family not found' });
// // // //     }

// // // //     const controls = await Control.find({ control_Family_Id: id });
// // // //     for (const control of controls) {
// // // //       await Action.deleteMany({ control_Id: control._id });
// // // //     }
// // // //     await Control.deleteMany({ control_Family_Id: id });

// // // //     res.json({ message: 'Control family and related controls and actions deleted successfully' });
// // // //   } catch (error) {
// // // //     res.status(500).json({ message: 'Error deleting control family' });
// // // //   }
// // // // };

// // // // // import ControlFamily from '../models/controlFamily.js';
// // // // // import Control from '../models/control.js';
// // // // // import Action from '../models/action.js';
// // // // // import { getNextControlFamilyId } from '../utils/autoIncrementId.js';

// // // // // // Get control families along with their controls and actions
// // // // // export const getControlFamilies = async (req, res) => {
// // // // //   try {
// // // // //     const controlFamilies = await ControlFamily.find();
// // // // //     const result = [];

// // // // //     for (const family of controlFamilies) {
// // // // //       const controls = await Control.find({ control_Family_Id: family._id });
// // // // //       const controlsWithActions = [];

// // // // //       for (const control of controls) {
// // // // //         const actions = await Action.find({ control_Id: control._id });
// // // // //         controlsWithActions.push({ ...control._doc, actions });
// // // // //       }

// // // // //       result.push({ ...family._doc, controls: controlsWithActions });
// // // // //     }

// // // // //     res.json(result);
// // // // //   } catch (error) {
// // // // //     res.status(500).json({ message: 'Error fetching control families' });
// // // // //   }
// // // // // };

// // // // // // Create a new control family
// // // // // export const createControlFamily = async (req, res) => {
// // // // //   try {
// // // // //     const FixedID = await getNextControlFamilyId();
// // // // //     const controlFamily = new ControlFamily({
// // // // //       FixedID,
// // // // //       VariableID: req.body.VariableID || FixedID,
// // // // //       desc: req.body.desc,
// // // // //       // other fields from req.body
// // // // //     });

// // // // //     await controlFamily.save();
// // // // //     res.status(201).json(controlFamily);
// // // // //   } catch (error) {
// // // // //     res.status(400).json({ message: 'Error creating control family' });
// // // // //   }
// // // // // };
// // // // // // export const createControlFamily = async (req, res) => {
// // // // // //   try {
// // // // // //     const controlFamily = new ControlFamily(req.body);
// // // // // //     await controlFamily.save();
// // // // // //     res.status(201).json(controlFamily);
// // // // // //   } catch (error) {
// // // // // //     res.status(400).json({ message: 'Error creating control family' });
// // // // // //   }
// // // // // // };

// // // // // // Update a control family
// // // // // export const updateControlFamily = async (req, res) => {
// // // // //   try {
// // // // //     const { id } = req.params;
// // // // //     const controlFamily = await ControlFamily.findByIdAndUpdate(id, req.body, { new: true });
// // // // //     if (!controlFamily) {
// // // // //       return res.status(404).json({ message: 'Control family not found' });
// // // // //     }
// // // // //     res.json(controlFamily);
// // // // //   } catch (error) {
// // // // //     res.status(400).json({ message: 'Error updating control family' });
// // // // //   }
// // // // // };
// // // // // // export const updateControlFamily = async (req, res) => {
// // // // // //   try {
// // // // // //     const { id } = req.params;
// // // // // //     const controlFamily = await ControlFamily.findByIdAndUpdate(id, req.body, { new: true });
// // // // // //     if (!controlFamily) {
// // // // // //       return res.status(404).json({ message: 'Control family not found' });
// // // // // //     }
// // // // // //     res.json(controlFamily);
// // // // // //   } catch (error) {
// // // // // //     res.status(400).json({ message: 'Error updating control family' });
// // // // // //   }
// // // // // // };

// // // // // // Delete a control family and its associated controls and actions
// // // // // export const deleteControlFamily = async (req, res) => {
// // // // //   try {
// // // // //     const { id } = req.params;
// // // // //     const controlFamily = await ControlFamily.findByIdAndDelete(id);
// // // // //     if (!controlFamily) {
// // // // //       return res.status(404).json({ message: 'Control family not found' });
// // // // //     }

// // // // //     // Delete corresponding controls and their actions
// // // // //     const controls = await Control.find({ control_Family_Id: id });
// // // // //     for (const control of controls) {
// // // // //       await Action.deleteMany({ control_Id: control._id });
// // // // //     }
// // // // //     await Control.deleteMany({ control_Family_Id: id });

// // // // //     res.json({ message: 'Control family and related controls and actions deleted successfully' });
// // // // //   } catch (error) {
// // // // //     res.status(500).json({ message: 'Error deleting control family' });
// // // // //   }
// // // // // };
