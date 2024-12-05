import axios from 'axios';

const API_URL = 'http://localhost:8021/api';

// Training API calls
const createTraining = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/trainings`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating training:', error);
    throw error;
  }
};

const getAllTrainings = async () => {
  try {
    const response = await axios.get(`${API_URL}/trainings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trainings:', error);
    throw error;
  }
};

const getTrainingById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/trainings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching training by ID:', error);
    throw error;
  }
};

const updateTraining = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/trainings/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating training:', error);
    throw error;
  }
};

const deleteTraining = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/trainings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting training:', error);
    throw error;
  }
};

export {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining,
};
