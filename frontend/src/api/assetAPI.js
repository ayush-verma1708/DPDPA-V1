import axios from 'axios';

const API_URL_ASSET = 'http://localhost:8021/api/v1/assets/';
const API_URL_ASSETLIST = 'http://localhost:8021/api/v1/assets/assetListdata';
const API_URL_ADD_ASSET = 'http://localhost:8021/api/v1/assets/add-asset';
const API_URL_ASSET_DETAILS = 'http://localhost:8021/api/v1/asset-details/';
const API_URL_ASSET_UPDATE = 'http://localhost:8021/api/v1/assets-update/';
const API_URL_ASSET_DELETE = 'http://localhost:8021/api/v1/assets-delete/';

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
  return response.data;
};

export const addAssetList = async (assetList) => {
  const {data} = await axios.post(API_URL_ASSETLIST, assetList);
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
