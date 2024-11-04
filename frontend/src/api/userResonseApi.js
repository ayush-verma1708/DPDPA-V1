// src/api/userResponseApi.js
import axios from 'axios';

// Define the base URL for your API (adjust the port if needed)
const API_BASE_URL = 'http://localhost:8021/api/user-responses';

// Function to add user responses
export const addUserResponses = async (companyId, responses) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-responses`, {
      companyId,
      responses,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding user responses:', error);
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// Function to get user responses by company ID
export const getUserResponsesByCompanyId = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user responses:', error);
    throw error.response ? error.response.data : new Error('Network Error');
  }
};
