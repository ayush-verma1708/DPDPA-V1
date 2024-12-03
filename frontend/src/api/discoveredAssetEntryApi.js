import axios from 'axios';

const BASE_URL = 'http://localhost:8021/api/v1/discovered-assets';

export const createDiscoveredAsset = async (assetData) => {
  try {
    const response = await axios.post(BASE_URL, assetData);
    return response.data; // return the data you need from the response
  } catch (error) {
    console.error(
      'Error creating discovered asset:',
      error.response?.data || error.message
    );
    // Return a custom error message for UI consumption
    throw (
      error.response?.data || {
        message:
          'Something went wrong while creating the asset. Please try again.',
      }
    );
  }
};

export const fetchDiscoveredAssets = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching discovered assets:',
      error.response?.data || error.message
    );
    throw (
      error.response?.data || {
        message: 'Failed to fetch discovered assets. Please try again later.',
      }
    );
  }
};
