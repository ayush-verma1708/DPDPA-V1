import Training from '../models/trainingModel.js'; // Import the Training model

// Create a new training program
export const createTraining = async (req, res) => {
  try {
    const { title, program, description, lectures } = req.body;
    const newTraining = new Training({
      title,
      program,
      description,
      lectures,
    });
    await newTraining.save();
    res.status(201).json({
      message: 'Training program created successfully',
      training: newTraining,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating training program',
      error: error.message,
    });
  }
};

// Get all training programs
export const getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find();
    res.status(200).json({ trainings });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving training programs',
      error: error.message,
    });
  }
};

// Get a single training program by ID
export const getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: 'Training program not found' });
    }
    res.status(200).json({ training });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving training program',
      error: error.message,
    });
  }
};

// Update a training program
export const updateTraining = async (req, res) => {
  try {
    const updatedTraining = await Training.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // To return the updated document
    );
    if (!updatedTraining) {
      return res.status(404).json({ message: 'Training program not found' });
    }
    res.status(200).json({
      message: 'Training program updated successfully',
      training: updatedTraining,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating training program',
      error: error.message,
    });
  }
};

// Delete a training program
export const deleteTraining = async (req, res) => {
  try {
    const deletedTraining = await Training.findByIdAndDelete(req.params.id);
    if (!deletedTraining) {
      return res.status(404).json({ message: 'Training program not found' });
    }
    res.status(200).json({ message: 'Training program deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting training program',
      error: error.message,
    });
  }
};
