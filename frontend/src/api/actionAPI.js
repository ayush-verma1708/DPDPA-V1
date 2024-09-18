import axios from 'axios';

const API_URL = 'http://localhost:8021/api/v1/actions';

// Fetch all actions (GET request)
export const fetchActions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching actions:', error);
    throw error;
  }
};

// Create a new action (POST request)
export const createAction = async (newAction) => {
  try {
    const response = await axios.post(API_URL, newAction);
    return response.data;
  } catch (error) {
    console.error('Error creating action:', error);
    throw error;
  }
};

// Update an existing action by ID (PUT request)
export const updateAction = async (id, updatedAction) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedAction);
    return response.data;
  } catch (error) {
    console.error('Error updating action:', error);
    throw error;
  }
};

// Delete an action by ID (DELETE request)
export const deleteAction = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting action:', error);
    throw error;
  }
};
