import axios from 'axios';

const API_URL_ASSET = 'http://localhost:8021/api/v1/assets/';
const API_URL_ASSETLIST = 'http://localhost:8021/api/v1/assets/assetListdata';
const API_URL_ADD_ASSET = 'http://localhost:8021/api/v1/assets/add-asset';
const API_URL_ASSET_DETAILS = 'http://localhost:8021/api/v1/asset-details/';
const API_URL_ASSET_Name = 'http://localhost:8021/api/v1/assets/asset-details/';
const API_URL_ASSET_UPDATE = 'http://localhost:8021/api/v1/assets-update/';
const API_URL_ASSET_DELETE = 'http://localhost:8021/api/v1/assets-delete/';
const API_BASE_URL = 'http://localhost:8021/api/v1'; // Your base URL

export const getAssets = async () => {
  try {
    const response = await axios.get(`${API_URL_ASSET}`);
    // Ensure response data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error('Expected an array of assets');
    }
  } catch (error) {
    throw error;
  }
};

export const getAssetById = async (id) => {
  const response = await axios.get(`${API_URL_ASSET_DETAILS}${id}`);
  console.log('response', response);
  return response.data;
};

export const getAssetNameById = async (id) => {
  if (id == '') {
    return {};
  }
  const response = await axios.get(`${API_URL_ASSET_Name}${id}`);
  return response.data;
};

export const addAssetList = async (assetList) => {
  const { data } = await axios.post(API_URL_ASSETLIST, assetList);
  return data;
};

export const createAsset = async (asset) => {
  const { data } = await axios.post(API_URL_ADD_ASSET, asset);
  return data;
};

export const updateAsset = async (id, asset) => {
  const response = await axios.put(`${API_URL_ASSET_UPDATE}${id}`, asset);
  return response.data;
};

export const deleteAsset = async (id) => {
  const response = await axios.delete(`${API_URL_ASSET_DELETE}${id}`);
  return response.data;
};

// Function to get scope name by ID
export const getScopeNameById = async (scopeId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/assetDetails/scope/${scopeId}`
    );
    return response.data; // Assuming the API returns an object with id and name
  } catch (error) {
    console.error('Error fetching scope name:', error);
    throw error; // Rethrow the error for the calling function to handle
  }
};
