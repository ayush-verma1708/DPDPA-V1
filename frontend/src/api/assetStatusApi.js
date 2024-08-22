// src/api/assetStatusApi.js
import axios from 'axios';

// Fetch Control Family Status
export async function fetchControlFamilyStatus(assetId, scopeId) {
  try {
    const response = await axios.get('http://localhost:8021/api/v1/controlFamilyStatus', {
      params: { assetId, scopeId }
    });
    return response.data; // Ensure this returns the data expected by your component
  } catch (error) {
    console.error('Error fetching control family status:', error);
    throw error; // Re-throw the error for the component to handle
  }
}

// Fetch Control Status
export async function fetchControlStatus(assetId, scopeId) {
  try {
    const response = await axios.get('http://localhost:8021/api/v1/controlStatus', {
      params: { assetId, scopeId }
    });
    return response.data; // Ensure this returns the data expected by your component
  } catch (error) {
    console.error('Error fetching control status:', error);
    throw error; // Re-throw the error for the component to handle
  }
}

// import axios from 'axios';

// // Fetch Control Family Status
// async function fetchControlFamilyStatus(assetId, scopeId) {
//   try {
//     const response = await axios.get(`http://localhost:8021/api/v1/controlFamilyStatus`, {
//       params: { assetId, scopeId }
//     });
//     console.log('Control Family Status:', response.data);
//     // Handle the response data (e.g., update the state or display in the UI)
//   } catch (error) {
//     console.error('Error fetching control family status:', error);
//   }
// }

// // Fetch Control Status
// async function fetchControlStatus(assetId, scopeId) {
//   try {
//     const response = await axios.get(`http://localhost:8021/api/v1/controlStatus`, {
//       params: { assetId, scopeId }
//     });
//     console.log('Control Status:', response.data);
//     // Handle the response data (e.g., update the state or display in the UI)
//   } catch (error) {
//     console.error('Error fetching control status:', error);
//   }
// }
