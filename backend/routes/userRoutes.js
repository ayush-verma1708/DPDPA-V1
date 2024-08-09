import { Router } from 'express';
import {AsyncHandler} from '../utils/asyncHandler.js'; // Default import
import { createUser, getUsers, updateUser, deleteUser } from '../controllers/user.controller.js';

const userRoutes = Router();

// Handle GET requests for users
userRoutes.route('/').get(AsyncHandler(async (req, res) => {
    await getUsers(req, res);
}));

// Handle POST requests for creating users
userRoutes.route('/').post(AsyncHandler(async (req, res) => {
    await createUser(req, res);
}));

// Handle PUT requests for updating users
userRoutes.route('/:id').put(AsyncHandler(async (req, res) => {
    await updateUser(req, res);
}));

// Handle DELETE requests for deleting users
userRoutes.route('/:id').delete(AsyncHandler(async (req, res) => {
    await deleteUser(req, res);
}));

export default userRoutes;


// import { Router } from 'express';
// import AsyncHandler from '../utils/asyncHandler.js'; // Default import
// import { createUser, getUsers, updateUser, deleteUser } from '../controllers/user.controller.js';

// const userRoutes = Router();

// // Handle GET requests for users
// userRoutes.route('/').get(asyncHandler(async (req, res) => {
//     await getUsers(req, res);
// }));

// // Handle POST requests for creating users
// userRoutes.route('/').post(asyncHandler(async (req, res) => {
//     await createUser(req, res);
// }));

// // Handle PUT requests for updating users
// userRoutes.route('/:id').put(asyncHandler(async (req, res) => {
//     await updateUser(req, res);
// }));

// // Handle DELETE requests for deleting users
// userRoutes.route('/:id').delete(asyncHandler(async (req, res) => {
//     await deleteUser(req, res);
// }));

// export default userRoutes;

// // import { Router } from 'express';
// // import asyncHandler from '../utils/asyncHandler.js';
// // import { createUser, getUsers, updateUser, deleteUser } from '../controllers/user.controller.js';

// // const userRoutes = Router();

// // // Handle GET requests for users
// // userRoutes.route('/').get(async (req, res) => {
// //   try {
// //     await asyncHandler(getUsers(req, res));
// //   } catch (error) {
// //     res.status(error.statusCode || 500).json({ message: error.message });
// //   }
// // });

// // // Handle POST requests for creating users
// // userRoutes.route('/').post(async (req, res) => {
// //   try {
// //     await  asyncHandler(createUser(req, res));
// //   } catch (error) {
// //     res.status(error.statusCode || 500).json({ message: error.message });
// //   }
// // });

// // // Handle PUT requests for updating users
// // userRoutes.route('/:id').put(async (req, res) => {
// //   try {
// //     await  asyncHandler(updateUser(req, res));
// //   } catch (error) {
// //     res.status(error.statusCode || 500).json({ message: error.message });
// //   }
// // });

// // // Handle DELETE requests for deleting users
// // userRoutes.route('/:id').delete(async (req, res) => {
// //   try {
// //     await  asyncHandler(deleteUser(req, res));
// //   } catch (error) {
// //     res.status(error.statusCode || 500).json({ message: error.message });
// //   }
// // });

// // export default userRoutes;

// // // import { Router } from 'express';
// // // import { createUser, getUsers } from '../controllers/user.controller.js';


// // // const userRoutes = Router();

// // // // Handle GET requests for users
// // // userRoutes.route('/').get(async (req, res) => {
// // //   try {
// // //     await getUsers(req, res);
// // //   } catch (error) {
// // //     res.status(error.statusCode || 500).json({ message: error.message });
// // //   }
// // // });

// // // // Handle POST requests for creating users
// // // userRoutes.route('/').post(async (req, res) => {
// // //   try {
// // //     await createUser(req, res);
// // //   } catch (error) {
// // //     res.status(error.statusCode || 500).json({ message: error.message });
// // //   }
// // // });

// // // export default userRoutes;
