import axios from 'axios';

const API_URL = 'http://localhost:8021/api/users';
const BASE = 'http://localhost:8021';

// Function to get users with optional pagination
export const getUsers = async (pageNumber = 1) => {
  try {
    const { data } = await axios.get(`${API_URL}?pageNumber=${pageNumber}`);
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Function to add or edit a user
export const saveUser = async (user, isEditing, userId = null) => {
  try {
    if (isEditing && userId) {
      const { data } = await axios.put(`${API_URL}/${userId}`, user);
      return data;
    } else {
      const { data } = await axios.post(API_URL, user);
      return data;
    }
  } catch (error) {
    console.error(`Error ${isEditing ? 'updating' : 'creating'} user:`, error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Function to delete a user by ID
export const deleteUser = async (userId) => {
  try {
    const { data } = await axios.delete(`${API_URL}/${userId}`);
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Function to fetch the current user based on JWT token
export const fetchCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Function to fetch user by ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${BASE}/api/users/${id}`);
    return response.data; // This will return the user data
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error; // Rethrow error to be handled by the caller
  }
};

// Function to fetch user by ID
export const getUsernameById = async (id) => {
  try {
    const response = await axios.get(`${BASE}/api/users/username/${id}`);
    return response.data.username; // This will return the user data
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error; // Rethrow error to be handled by the caller
  }
};

export const checkFormCompletion = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE}/api/users/${userId}/form-completion`
    );
    return response.data;
  } catch (error) {
    console.error('Error checking form completion:', error);
    throw new Error('Failed to check form completion status');
  }
};

export const updateFormCompletionStatus = async (userId) => {
  try {
    const response = await axios.patch(
      `${BASE}/api/users/${userId}/form-completion`,
      { hasCompletedCompanyForm: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating form completion status:', error);
    throw new Error('Failed to update form completion status');
  }
};
