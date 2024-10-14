// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8021/api'; // Adjust based on your backend URL

// Function to get user responses by companyId
export const getUserResponsesByCompanyId = async (companyId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user-responses/${companyId}`
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error fetching user responses:', error);
    throw error; // Rethrow error for further handling
  }
};

// Function to fetch all product families
export const getAllProductFamilies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product-families`);
    return response.data; // Return the array of product families
  } catch (error) {
    throw new Error('Error fetching product families: ' + error.message);
  }
};

// Function to add a user response
export const addUserResponse = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/user-responses`, data);
  return response.data; // Return the response data
};
