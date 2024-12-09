import Assignment from '../models/AssignmentModel.js'; // Import the Assignment model
import User from '../models/User.js';
import Training from '../models/trainingModel.js';
import Quiz from '../models/quizModel.js';

export const createAssignment = async (req, res) => {
  const { user, item, itemType, dueDate } = req.body;

  try {
    const assignment = new Assignment({
      user,
      item,
      itemType,
      dueDate,
    });

    await assignment.save();
    res
      .status(201)
      .json({ message: 'Assignment created successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating assignment', error });
  }
};

export const getAssignmentsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const assignments = await Assignment.find({ user: userId })
      .populate('user', 'username email role') // Populate user details
      .populate('item') // Populate item details (Training or Quiz)
      .exec();

    if (!assignments.length)
      return res
        .status(404)
        .json({ message: 'No assignments found for this user' });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error });
  }
};

export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('user', 'username email role')
      .populate('item')
      .exec();

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error });
  }
};

export const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { user, item, itemType, dueDate, status } = req.body;

  try {
    const assignment = await Assignment.findByIdAndUpdate(
      id,
      { user, item, itemType, dueDate, status },
      { new: true } // Return the updated document
    );

    if (!assignment)
      return res.status(404).json({ message: 'Assignment not found' });

    res
      .status(200)
      .json({ message: 'Assignment updated successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating assignment', error });
  }
};

export const deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment)
      return res.status(404).json({ message: 'Assignment not found' });

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error });
  }
};

// export const assignToRole = async (req, res) => {
//   const { role, item, itemType, dueDate } = req.body;

//   try {
//     const users = await User.find({ role });

//     if (!users.length)
//       return res
//         .status(404)
//         .json({ message: 'No users found for the specified role' });

//     const assignments = [];

//     for (const user of users) {
//       const assignment = new Assignment({
//         user: user._id,
//         item,
//         itemType,
//         dueDate,
//       });
//       await assignment.save();
//       assignments.push(assignment);
//     }

//     res.status(201).json({
//       message: `Assigned ${itemType} to ${users.length} users with role ${role}`,
//       assignments,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error assigning items to role', error });
//   }
// };
export const assignToRole = async (req, res) => {
  const { role, item, itemType, dueDate } = req.body;

  try {
    const users = await User.find({ role });

    if (!users.length)
      return res
        .status(404)
        .json({ message: 'No users found for the specified role' });

    const assignments = await Promise.all(
      users.map((user) =>
        new Assignment({
          user: user._id,
          item,
          itemType,
          dueDate,
        }).save()
      )
    );

    res.status(201).json({
      message: `Assigned ${itemType} to ${users.length} users with role ${role}`,
      assignments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning items to role', error });
  }
};

export default {
  createAssignment,
  getAssignmentsByUser,
  getAllAssignments,
  updateAssignment,
  deleteAssignment,
  assignToRole,
};
