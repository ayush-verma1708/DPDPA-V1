import axios from 'axios';

// Define the base URL for user-related API endpoints
const API_URL = 'http://localhost:8021/api/users';

// Function to get users with optional pagination
export const getUsers = async (pageNumber = 1) => {
  try {
    const { data } = await axios.get(`${API_URL}?pageNumber=${pageNumber}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Function to add a new user
export const addUser = async (user) => {
  try {
    const { data } = await axios.post(API_URL, user);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
