import axios from 'axios';

const API_URL = 'http://localhost:8021/api/users';

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

// import axios from 'axios';

// // Define the base URL for user-related API endpoints
// const API_URL = 'http://localhost:8021/api/users';

// // Function to get users with optional pagination
// export const getUsers = async (pageNumber = 1) => {
//   try {
//     const { data } = await axios.get(`${API_URL}?pageNumber=${pageNumber}`);
//     return data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || error.message);
//   }
// };

// // Function to add a new user
// export const addUser = async (user) => {
//   try {
//     const { data } = await axios.post(API_URL, user);
//     return data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || error.message);
//   }
// };
