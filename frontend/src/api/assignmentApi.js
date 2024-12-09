import axios from 'axios';

const API_URL = 'http://localhost:8021/api/';

// Create a new assignment
export const createAssignment = async (assignmentData) => {
  try {
    const response = await axios.post(`${API_URL}assignments`, assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating assignment:', error.response?.data || error);
    throw error;
  }
};

// Get assignments by user ID
export const getAssignmentsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}assignments/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching assignments for user:',
      error.response?.data || error
    );
    throw error;
  }
};

// Get all assignments (admin use case)
export const getAllAssignments = async () => {
  try {
    const response = await axios.get(`${API_URL}assignments`);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching all assignments:',
      error.response?.data || error
    );
    throw error;
  }
};

// Update an assignment
export const updateAssignment = async (id, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}assignments/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating assignment:', error.response?.data || error);
    throw error;
  }
};

// Delete an assignment
export const deleteAssignment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}assignments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting assignment:', error.response?.data || error);
    throw error;
  }
};

// Assign training/quiz to all users of a specific role
export const assignToRole = async (assignmentData) => {
  try {
    const response = await axios.post(
      `${API_URL}assignments/role`,
      assignmentData
    );
    return response.data;
  } catch (error) {
    console.error('Error assigning to role:', error.response?.data || error);
    throw error;
  }
};
