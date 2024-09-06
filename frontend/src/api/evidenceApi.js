import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:8021/api/evidence'; // Adjust based on your backend setup

// Function to upload a file and create evidence
export const uploadEvidence = async (file, evidenceData) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assetId', evidenceData.assetId || '');
    formData.append('scopeId', evidenceData.scopeId || '');
    formData.append('actionId', evidenceData.actionId || '');
    formData.append('familyId', evidenceData.familyId || '');
    formData.append('controlId', evidenceData.controlId || '');

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

// Function to get all evidences
export const getAllEvidences = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching evidences:', error);
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
