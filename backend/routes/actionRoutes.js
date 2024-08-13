import express from 'express';
import {
  getActions,
  createAction,
  updateAction,
  deleteAction,
} from '../controllers/actionController.js';

const router = express.Router();

// Route to get all actions
router.get('/', getActions);

// Route to create a new action
router.post('/', createAction);

// Route to update an existing action by ID
router.put('/:id', updateAction);

// Route to delete an action by ID
router.delete('/:id', deleteAction);


export default router;


// import express from 'express';
// import {
//   getActions,
//   addAction,
//   updateAction,
//   deleteAction,
//   markActionAsCompleted
// } from '../controllers/actionController.js';

// import { uploadFile, getFile } from '../controllers/upload.controller.js';


// const router = express.Router();

// router.get('/', getActions);
// router.post('/', addAction);
// router.put('/:id', updateAction);
// router.delete('/:id', deleteAction);
// // router.post('/upload', uploadActionFile);
// router.put('/mark-completed/:id', markActionAsCompleted);

// // Route for uploading files
// router.put('/:actionId/upload', uploadFile);

// // Route for retrieving files
// router.get('/files/:filename', getFile);


// export default router;
// import express from 'express';
// import { getActions, createAction, updateAction, deleteAction } from '../controllers/actionController.js';

// const router = express.Router();

// router.get('/', getActions);
// router.post('/', createAction);
// router.put('/:id', updateAction);
// router.delete('/:id', deleteAction);

// export default router;
