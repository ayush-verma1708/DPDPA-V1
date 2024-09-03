import axios from 'axios';

const API_BASE_URL = 'http://localhost:8021/api/v1'; // Update this URL based on your backend setup

// Create or Update Completion Status
export const createOrUpdateStatus = async (statusData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/completion-status`, statusData);
    return response.data;
  } catch (error) {
    console.error('Error in createOrUpdateStatus:', error);
    throw error;
  }
};

// Get Completion Status by Criteria
export const getStatus = async (queryParams) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/completion-status`, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Error in getStatus:', error);
    throw error;
  }
};

// Update Specific Completion Status by ID
export const updateStatus = async (completionStatusId, updateData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/completion-status/${completionStatusId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error in updateStatus:', error);
    throw error;
  }
};

// Delete Completion Status by ID
export const deleteStatus = async (completionStatusId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/completion-status/${completionStatusId}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteStatus:', error);
    throw error;
  }
};

// Delegate to IT Team
// export const delegateToIT = async (completionStatusId) => {
//   try {
//     const response = await axios.put(`${API_BASE_URL}/completion-status/${completionStatusId}/delegate-it`);
//     return response.data;
//   } catch (error) {
//     console.error('Error in delegateToIT:', error);
//     throw error;
//   }
// };

export const delegateToIT = async (completionStatusId, itOwnerUsername) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/completion-status/${completionStatusId}/delegate-it`, {
      itOwnerUsername
    });
    return response.data;
  } catch (error) {
    console.error('Error in delegateToIT:', error);
    throw error;
  }
};

// Delegate to Auditor
export const delegateToAuditor = async (completionStatusId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/completion-status/${completionStatusId}/delegate-auditor`);
    return response.data;
  } catch (error) {
    console.error('Error in delegateToAuditor:', error);
    throw error;
  }
};

// Confirm Evidence or Return Evidence
export const confirmEvidence = async (completionStatusId, feedback) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/completion-status/${completionStatusId}/confirm-evidence`, { feedback });
    return response.data;
  } catch (error) {
    console.error('Error in confirmEvidence:', error);
    throw error;
  }
};
