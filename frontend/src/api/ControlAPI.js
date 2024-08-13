import axios from 'axios';

const API_URL = 'http://localhost:8021/api/v1/controls';

// Fetch all controls with their associated actions
export const getControls = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching controls:', error);
    throw error;
  }
};

// Add a new control
export const createControl = async (newControl) => {
  try {
    const response = await axios.post(API_URL, newControl);
    return response.data;
  } catch (error) {
    console.error('Error creating control:', error);
    throw error;
  }
};

// Update an existing control by ID
export const updateControl = async (id, updatedControl) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedControl);
    return response.data;
  } catch (error) {
    console.error('Error updating control:', error);
    throw error;
  }
};

// Delete a control by ID
export const deleteControl = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting control:', error);
    throw error;
  }
};

// import axios from 'axios';

// const API_URL = 'http://localhost:8021/api/v1/controls';

// export const fetchControls = async () => {
//   return axios.get(API_URL);
// };

// export const addControl = async (newControl) => {
//   return axios.post(API_URL, newControl);
// };

// export const editControl = async (id, updatedControl) => {
//   return axios.put(`${API_URL}/${id}`, updatedControl);
// };

// export const deleteControl = async (id) => {
//   return axios.delete(`${API_URL}/${id}`);
// };
