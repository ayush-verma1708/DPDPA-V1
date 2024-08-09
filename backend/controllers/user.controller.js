import User from '../models/User.js'; // Adjust the path if necessary
import {AsyncHandler} from '../utils/asyncHandler.js'; // Ensure this utility exists
import { ApiError } from '../utils/ApiError.js'; // Ensure this utility exists
import { ApiResponse } from '../utils/ApiResponse.js'; // Ensure this utility exists

// Create a new user
const createUser = AsyncHandler(async (req, res) => {
  const { username, password, role, permissions } = req.body;
  if (!username || !password) {
    throw new ApiError(400, 'Username and password are required.');
  }

  try {
    const user = new User({ username, password, role, permissions });
    const createdUser = await user.save();
    res.status(201).json(new ApiResponse(200, createdUser, 'User created successfully.'));
  } catch (error) {
    throw new ApiError(500, 'Error creating user', error);
  }
});

// Get all users with pagination
const getUsers = AsyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  try {
    const count = await User.countDocuments({});
    const users = await User.find({})
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    throw new ApiError(500, 'Error fetching users', error);
  }
});

// Update an existing user
const updateUser = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, password, role, permissions } = req.body;

  try {
    const user = await User.findById(id);

    if (user) {
      user.username = username || user.username;
      user.password = password || user.password;
      user.role = role || user.role;
      user.permissions = permissions || user.permissions;

      const updatedUser = await user.save();
      res.status(200).json(new ApiResponse(200, updatedUser, 'User updated successfully.'));
    } else {
      throw new ApiError(404, 'User not found');
    }
  } catch (error) {
    throw new ApiError(500, 'Error updating user', error);
  }
});

// Delete a user by ID
const deleteUser = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Use deleteOne or delete() instead of remove
  await user.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'User deleted successfully.'));
});

export { createUser, getUsers, updateUser, deleteUser };

// import User from '../models/User.js'; // Adjust the path if necessary
// import AsyncHandler from '../utils/asyncHandler.js'; // Ensure this utility exists
// import { ApiError } from '../utils/ApiError.js'; // Ensure this utility exists
// import { ApiResponse } from '../utils/ApiResponse.js'; // Ensure this utility exists

// // Create a new user
// const createUser = AsyncHandler(async (req, res) => {
//   const { username, password, role } = req.body;
//   if (!username || !password) {
//     throw new ApiError(400, 'Username and password are required.');
//   }

//   try {
//     const user = new User({ username, password, role });
//     const createdUser = await user.save();
//     res.status(201).json(new ApiResponse(200, createdUser, 'User created successfully.'));
//   } catch (error) {
//     throw new ApiError(500, 'Error creating user', error);
//   }
// });

// // Get all users with pagination
// const getUsers = AsyncHandler(async (req, res) => {
//   const pageSize = 10;
//   const page = Number(req.query.pageNumber) || 1;

//   try {
//     const count = await User.countDocuments({});
//     const users = await User.find({})
//       .limit(pageSize)
//       .skip(pageSize * (page - 1));

//     res.json({
//       users,
//       page,
//       pages: Math.ceil(count / pageSize),
//     });
//   } catch (error) {
//     throw new ApiError(500, 'Error fetching users', error);
//   }
// });

// // Update an existing user
// const updateUser = AsyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { username, password, role } = req.body;

//   try {
//     const user = await User.findById(id);

//     if (user) {
//       user.username = username || user.username;
//       user.password = password || user.password;
//       user.role = role || user.role;

//       const updatedUser = await user.save();
//       res.status(200).json(new ApiResponse(200, updatedUser, 'User updated successfully.'));
//     } else {
//       throw new ApiError(404, 'User not found');
//     }
//   } catch (error) {
//     throw new ApiError(500, 'Error updating user', error);
//   }
// });

// // Delete a user by ID
// const deleteUser = AsyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findById(id);

//     if (!user) {
//         throw new ApiError(404, 'User not found');
//     }

//     // Use deleteOne or delete() instead of remove
//     await user.deleteOne(); 

//     res.status(200).json(
//         new ApiResponse(200, null, "User deleted successfully.")
//     );
// });

// export { createUser, getUsers, updateUser, deleteUser };

// import User from '../models/User.js'; // Adjust the path if necessary
// import { AsyncHandler } from '../utils/asyncHandler.js'; // Ensure this utility exists
// import { ApiError } from '../utils/ApiError.js'; // Ensure this utility exists
// import { ApiResponse } from '../utils/ApiResponse.js'; // Ensure this utility exists

// // Create a new user
// const createUser = AsyncHandler(async (req, res) => {
//   const { username, password, role } = req.body;
//   if (!username || !password) {
//     throw new ApiError(400, 'Username and password are required.');
//   }
  
//   try {
//     const user = new User({ username, password, role });
//     const createdUser = await user.save();
//     res.status(201).json(new ApiResponse(200, createdUser, 'User created successfully.'));
//   } catch (error) {
//     throw new ApiError(500, 'Error creating user', error);
//   }
// });

// // Get all users with pagination
// const getUsers = AsyncHandler(async (req, res) => {
//   const pageSize = 10;
//   const page = Number(req.query.pageNumber) || 1;
  
//   try {
//     const count = await User.countDocuments({});
//     const users = await User.find({})
//       .limit(pageSize)
//       .skip(pageSize * (page - 1));
    
//     res.json({
//       users,
//       page,
//       pages: Math.ceil(count / pageSize),
//     });
//   } catch (error) {
//     throw new ApiError(500, 'Error fetching users', error);
//   }
// });

// export { createUser, getUsers };
