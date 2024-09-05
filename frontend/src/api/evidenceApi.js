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
        'Content-Type': 'multipart/form-data'
      }
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


// import axios from 'axios';

// const API_URL = 'http://localhost:8021/api/evidence';  // Adjust the API URL as necessary

// // Function to upload a file and create a new evidence record
// // export const uploadEvidence = async (file, additionalData) => {
// //   const formData = new FormData();
// //   formData.append('file', file);
// //   for (const key in additionalData) {
// //     formData.append(key, additionalData[key]);
// //   }

// //   try {
// //     const response = await axios.post(`${API_URL}/upload`, formData, {
// //       headers: {
// //         'Content-Type': 'multipart/form-data',
// //       },
// //     });
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error uploading evidence:', error);
// //     throw error;
// //   }
// // };

// // export const uploadEvidence = async (file, additionalData) => {
// //   const formData = new FormData();
// //   formData.append('file', file);
  
// //   // Make sure these keys match what the backend expects (assetId, scopeId, etc.)
// //   if (additionalData) {
// //     formData.append('assetId', additionalData.assetId);
// //     formData.append('scopeId', additionalData.scopeId);
// //     formData.append('actionId', additionalData.actionId);
// //     formData.append('familyId', additionalData.familyId);
// //     formData.append('controlId', additionalData.controlId);
// //   }

// //   try {
// //     const response = await axios.post(`${API_URL}/upload`, formData, {
// //       headers: {
// //         'Content-Type': 'multipart/form-data',
// //       },
// //     });
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error uploading evidence:', error);
// //     throw error;
// //   }
// // };
// export const uploadEvidence = async (file, additionalData) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('actionId', additionalData.actionId);
//   formData.append('controlId', additionalData.controlId);
//   formData.append('assetId', additionalData.assetId);
//   formData.append('username', 'currentUsername'); // Include the username
//   if (additionalData.scopeId) {
//     formData.append('scopeId', additionalData.scopeId);
//   }
  
//   try {
//     const response = await axios.post('http://localhost:8021/api/v1/evidence/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data; // Assume response contains evidenceId
//   } catch (error) {
//     console.error('Error uploading evidence:', error);
//     throw error;
//   }
// };


// // Function to get all evidence records
// export const fetchAllEvidences = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching evidences:', error);
//     throw error;
//   }
// };

// // Function to get evidence by ID
// export const fetchEvidenceById = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching evidence by ID:', error);
//     throw error;
//   }
// };

// // Function to update evidence by ID
// export const updateEvidence = async (id, updatedData) => {
//   try {
//     const response = await axios.put(`${API_URL}/${id}`, updatedData);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating evidence:', error);
//     throw error;
//   }
// };

// // Function to delete evidence by ID
// export const deleteEvidence = async (id) => {
//   try {
//     await axios.delete(`${API_URL}/${id}`);
//   } catch (error) {
//     console.error('Error deleting evidence:', error);
//     throw error;
//   }
// };
