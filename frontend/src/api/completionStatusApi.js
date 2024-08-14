import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = '/api/v1/completion-status';

// Function to create or update completion status
export const createOrUpdateCompletionStatus = async (statusData) => {
  try {
    // Sending a POST request to the completion status endpoint
    const response = await axios.post(API_BASE_URL, statusData);

    // Returning the response data
    return response.data;
  } catch (error) {
    // Throwing an error if the request fails
    throw new Error(error.response?.data?.error || 'Failed to update status');
  }
};

// Function to fetch completion status by criteria
export const fetchCompletionStatus = async (query) => {
  try {
    // Sending a GET request to the completion status endpoint with query parameters
    const response = await axios.get(API_BASE_URL, { params: query });

    // Returning the response data
    return response.data;
  } catch (error) {
    // Throwing an error if the request fails
    throw new Error(error.response?.data?.error || 'Failed to fetch status');
  }
};
