import axios from 'axios';

const API_BASE_URL = 'http://localhost:8021/api/v1/discovered-assets';

// Function to get discovered assets
export const getDiscoveredAssets = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching discovered assets:', error);
    throw new Error('Failed to fetch discovered assets');
  }
};

// Function to process an asset and scope, adding them to the main models
export const processAssetScope = async (assetId, scopeId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/process`, {
      assetId,
      scopeId,
    });
    return response.data;
  } catch (error) {
    console.error('Error processing asset and scope:', error);
    throw new Error('Failed to process asset and scope');
  }
};

export const createDiscoveredAsset = async (assetData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, assetData);
    return response.data;
  } catch (error) {
    console.error('Error creating discovered asset:', error);
    throw error; // Optionally, throw the error for the component to handle
  }
};
