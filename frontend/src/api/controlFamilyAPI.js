import axios from 'axios';

const API_URL = 'http://localhost:8021/api/v1/control-families';

// Fetch all control families
export const getControlFamilies = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching control families:', error);
    throw error;
  }
};

// Add a new control family
export const createControlFamily = async (newFamily) => {
  try {
    const response = await axios.post(API_URL, newFamily);
    return response.data;
  } catch (error) {
    console.error('Error adding control family:', error);
    throw error;
  }
};

// Edit an existing control family
export const updateControlFamily = async (id, updatedFamily) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedFamily);
    return response.data;
  } catch (error) {
    console.error('Error updating control family:', error);
    throw error;
  }
};

// Delete a control family
export const deleteControlFamily = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting control family:', error);
    throw error;
  }
};

// import axios from 'axios';

// const API_URL = 'http://localhost:8021/api/v1/control-families';

// export const fetchControlFamilies = async () => {
//   return axios.get(API_URL);
// };

// export const addControlFamily = async (newFamily) => {
//   return axios.post(API_URL, newFamily);
// };

// export const editControlFamily = async (id, updatedFamily) => {
//   return axios.put(`${API_URL}/${id}`, updatedFamily);
// };

// export const deleteControlFamily = async (id) => {
//   return axios.delete(`${API_URL}/${id}`);
// };
