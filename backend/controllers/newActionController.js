// controllers/newActionController.js
import NewAction from '../models/NewAction.js';

// Get action by variable_id
export const getNewActionByVariableId = async (req, res) => {
  try {
    const { variable_id } = req.params; // Get variable_id from route params

    // Fetch NewAction by variable_id without populating
    const action = await NewAction.findOne({ variable_id });

    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    return res.status(200).json(action);
  } catch (error) {
    console.error('Error fetching action by variable_id:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch action by variable_id' });
  }
};
// Get action by variable_id and software_id
export const getNewActionByVariableIdAndSoftwareId = async (req, res) => {
  try {
    const { variable_id, software_id } = req.params; // Get variable_id and software_id from route params

    // Fetch NewAction by variable_id and software_id without populating
    const action = await NewAction.findOne({
      variable_id,
      software_id, // Ensure the software_id is also matched
    });

    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    return res.status(200).json(action);
  } catch (error) {
    console.error(
      'Error fetching action by variable_id and software_id:',
      error
    );
    return res
      .status(500)
      .json({ error: 'Failed to fetch action by variable_id and software_id' });
  }
};

// // controllers/newActionController.js
// import NewAction from '../models/NewAction.js';

// // Get action by variable_id
// export const getNewActionByVariableId = async (req, res) => {
//   try {
//     const { variable_id } = req.params; // Get variable_id from route params

//     const action = await NewAction.findOne({ variable_id })
//       .populate('control_Id product_family_Id softwareId')
//       .exec();

//     if (!action) {
//       return res.status(404).json({ message: 'Action not found' });
//     }

//     return res.status(200).json(action);
//   } catch (error) {
//     console.error('Error fetching action by variable_id:', error);
//     return res
//       .status(500)
//       .json({ error: 'Failed to fetch action by variable_id' });
//   }
// };
