// controllers/stepTaskController.js
import StepTask from '../models/StepTask.js';

// Create a new step
export const createStep = async (req, res) => {
  const { title, userId, order } = req.body;

  try {
    const step = new StepTask({
      title,
      userId, // Assign the userId from the request body
      stepType: 'step',
      order,
    });
    await step.save();
    res.status(201).json(step);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task under a specific step
export const createTask = async (req, res) => {
  const { title, description, userId, parentStep, order } = req.body;

  try {
    const task = new StepTask({
      title,
      description,
      userId, // Assign the userId from the request body
      stepType: 'task',
      parentStep, // The ID of the parent step
      order,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all steps with their tasks
export const getAllStepsWithTasks = async (req, res) => {
  try {
    const steps = await StepTask.find({ stepType: 'step' })
      .populate('parentStep') // Populate the tasks under each step
      .sort('order');

    res.status(200).json(steps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update completion status of a step or task
export const updateCompletionStatus = async (req, res) => {
  const { id } = req.params; // The ID of the step or task to update
  const { completed } = req.body; // True/false to mark as completed or not

  try {
    const updatedStepTask = await StepTask.findByIdAndUpdate(
      id,
      {
        completed,
        completedAt: completed ? new Date() : null, // Set completedAt only if marking as complete
      },
      { new: true } // Return the updated document
    );

    if (!updatedStepTask) {
      return res.status(404).json({ message: 'Step/Task not found' });
    }

    res.status(200).json(updatedStepTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a step or task
export const deleteStepTask = async (req, res) => {
  const { id } = req.params; // The ID of the step or task to delete

  try {
    const deletedStepTask = await StepTask.findByIdAndDelete(id);

    if (!deletedStepTask) {
      return res.status(404).json({ message: 'Step/Task not found' });
    }

    res.status(204).json(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
