import express from 'express';
import TaskManager from '../models/taskManager.js'; // Adjust the path as needed
import User from '../models/User.js'; // Adjust the path as needed

const router = express.Router();

// Middleware to check permissions
const checkPermissions = (requiredPermissions) => (req, res, next) => {
  const { user } = req; // Assuming user is populated in the request via authentication middleware

  const hasPermission = requiredPermissions.every(permission => user.permissions[permission]);

  if (!hasPermission) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  next();
};

// Create a new task (Compliance Team only)
router.post('/task', checkPermissions(['add']), async (req, res) => {
  const { userId, assetId, controlFamilyId, dueDate, notes } = req.body;

  try {
    const newTask = new TaskManager({
      user: userId,
      asset: assetId,
      controlFamily: controlFamilyId,
      dueDate,
      notes
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task status (IT Team, Auditor)
router.patch('/task/:id/status', async (req, res) => {
  const { status } = req.body;
  const taskId = req.params.id;

  try {
    const task = await TaskManager.findById(taskId);
    const { user } = req; // Assuming user is populated in the request

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const statusPermissionMap = {
      'Delegated to IT Team': 'delegate',
      'Evidence Ready': 'uploadEvidence',
      'Audit delegated': 'delegate',
      'Audit non confirm': 'confirmEvidence',
      'Audit Closed': 'confirmEvidence',
      'Closed': 'confirmEvidence'
    };

    const requiredPermission = statusPermissionMap[status];

    if (requiredPermission && !user.permissions[requiredPermission]) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    task.status = status;

    if (status === 'Closed') {
      task.completionDate = new Date();
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

// Get all tasks (all roles)
router.get('/tasks', checkPermissions(['view']), async (req, res) => {
  try {
    const tasks = await TaskManager.find().populate('user asset controlFamily');
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get a single task by ID (all roles)
router.get('/task/:id', checkPermissions(['view']), async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await TaskManager.findById(taskId).populate('user asset controlFamily');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Delete a task (Admin only, assuming only Admins can delete tasks)
router.delete('/task/:id', checkPermissions(['delete']), async (req, res) => {
  const taskId = req.params.id;

  try {
    const deletedTask = await TaskManager.findByIdAndDelete(taskId);
    
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
