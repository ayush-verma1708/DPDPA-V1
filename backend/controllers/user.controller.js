// backend/controllers/userController.js
import User from '../models/User.js';
import { AsyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Check if user has completed the company form
export const checkFormCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res
      .status(200)
      .json({ hasCompletedCompanyForm: user.hasCompletedCompanyForm });
  } catch (error) {
    console.error('Error checking form completion:', error);
    res.status(500).json({ message: 'Error checking form completion', error });
  }
};

export const updateFormCompletionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.hasCompletedCompanyForm = true;
    await user.save();

    res.status(200).json({ message: 'Form completion status updated' });
  } catch (error) {
    console.error('Error updating form completion status:', error);
    res
      .status(500)
      .json({ message: 'Error updating form completion status', error });
  }
};
// Create a new user
// const createUser = AsyncHandler(async (req, res) => {
//   const { username, password, role, permissions } = req.body;

//   if (!username || !password) {
//     throw new ApiError(400, 'Username and password are required.');
//   }

//   const validRoles = ['Admin', 'Executive', 'Compliance Team', 'IT Team', 'Auditor', 'user'];
//   if (role && !validRoles.includes(role)) {
//     throw new ApiError(400, 'Invalid role.');
//   }

//   const user = new User({ username, password, role, permissions });
//   const createdUser = await user.save();
//   res.status(201).json(new ApiResponse(201, createdUser, 'User created successfully.'));
// });
const createUser = AsyncHandler(async (req, res) => {
  const { username, email, password, role, permissions, company } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, 'Username, email, and password are required.');
  }

  // Validate email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, 'Invalid email format.');
  }

  const validRoles = [
    'Admin',
    'Executive',
    'Compliance Team',
    'IT Team',
    'Auditor',
    'user',
    'External Auditor', // Add this new role
  ];
  if (role && !validRoles.includes(role)) {
    throw new ApiError(400, 'Invalid role.');
  }

  const user = new User({
    username,
    email,
    password,
    role,
    permissions,
    company,
  });
  const createdUser = await user.save();
  res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User created successfully.'));
});

// Update an existing user
// const updateUser = AsyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { username, password, role, permissions } = req.body;

//   const validRoles = ['Admin', 'Executive', 'Compliance Team', 'IT Team', 'Auditor', 'user'];
//   if (role && !validRoles.includes(role)) {
//     throw new ApiError(400, 'Invalid role.');
//   }

//   const user = await User.findById(id);
//   if (!user) {
//     throw new ApiError(404, 'User not found');
//   }

//   if (username) user.username = username;
//   if (password) user.password = password; // Handle password hashing in the model
//   if (role) user.role = role;
//   if (permissions) user.permissions = permissions;

//   const updatedUser = await user.save();
//   res.status(200).json(new ApiResponse(200, updatedUser, 'User updated successfully.'));
// });
const updateUser = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, permissions, company } = req.body;

  const validRoles = [
    'Admin',
    'Executive',
    'Compliance Team',
    'IT Team',
    'Auditor',
    'External Auditor', // Add this new role
    'user',
  ];
  if (role && !validRoles.includes(role)) {
    throw new ApiError(400, 'Invalid role.');
  }

  // Validate email format if provided
  const emailRegex = /\S+@\S+\.\S+/;
  if (email && !emailRegex.test(email)) {
    throw new ApiError(400, 'Invalid email format.');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (username) user.username = username;
  if (email) user.email = email;
  if (password) user.password = password; // Handle password hashing in the model
  if (role) user.role = role;
  if (permissions) user.permissions = permissions;

  const updatedUser = await user.save();
  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'User updated successfully.'));
});

// Get all users with pagination
const getUsers = AsyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await User.countDocuments({});
  const users = await User.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    users,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// Delete a user by ID
const deleteUser = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await user.deleteOne();
  res
    .status(200)
    .json(new ApiResponse(200, null, 'User deleted successfully.'));
});

const getCurrentUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .populate('company');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  res.status(200).json({
    success: true,
    data: user,
    message: 'User information retrieved successfully',
  });
});

// Controller to get all user info by ID
const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id); // Fetch the entire user document
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get only the username by ID
const getUsernameById = async (req, res) => {
  const id = req.params.id;

  try {
    // Fetch only the username field using the select method
    const user = await User.findById(id).select('username'); // Only fetches the 'username'

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ username: user.username }); // Return only the username
  } catch (error) {
    console.error('Error fetching username:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
  getUserById,
  getUsernameById,
};
