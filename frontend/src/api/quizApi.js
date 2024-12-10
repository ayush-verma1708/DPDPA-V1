import axios from 'axios';

const API_URL = 'http://localhost:8021/api';

// Quiz API calls
const createQuiz = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/quizzes`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

const getAllQuizzes = async () => {
  try {
    const response = await axios.get(`${API_URL}/quizzes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

const getQuizById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    throw error;
  }
};

const updateQuiz = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/quizzes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

const deleteQuiz = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/quizzes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};

const getQuizByTrainingid = async (trainingId) => {
  try {
    const response = await axios.get(
      `${API_URL}/quizzes/trainings/${trainingId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz by training ID:', error);
    throw error;
  }
};

export {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizByTrainingid,
};
