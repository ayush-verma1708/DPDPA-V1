import axios from 'axios';

const API_URL = 'http://localhost:8021/api/evidence';  // Adjust the API URL as necessary

// Function to upload a file and create a new evidence record
export const uploadEvidence = async (file, additionalData) => {
  const formData = new FormData();
  formData.append('file', file);
  for (const key in additionalData) {
    formData.append(key, additionalData[key]);
  }

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading evidence:', error);
    throw error;
  }
};

// Function to get all evidence records
export const fetchAllEvidences = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching evidences:', error);
    throw error;
  }
};

// Function to get evidence by ID
export const fetchEvidenceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching evidence by ID:', error);
    throw error;
  }
};

// Function to update evidence by ID
export const updateEvidence = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating evidence:', error);
    throw error;
  }
};

// Function to delete evidence by ID
export const deleteEvidence = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting evidence:', error);
    throw error;
  }
};
