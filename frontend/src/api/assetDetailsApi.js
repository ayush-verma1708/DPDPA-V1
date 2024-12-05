// api/assetDetailsApi.js

import axios from 'axios';

export const getAssetDetails = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8021/api/v1/assetDetails'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching asset details:', error);
    throw error;
  }
};
export const getScopedInAsset = async (assetId) => {
  const response = await axios.get(
    `http://localhost:8021/api/v1/assetDetails/scoped/${assetId}`
  );
  return response.data;
};

// Fetch asset details by asset ID
export const getAssetDetailsByAssetId = async (assetId) => {
  try {
    const response = await axios.get(
      `http://localhost:8021/api/v1/assetDetails/${assetId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching asset details by asset ID:', error);
    throw error;
  }
};

// Fetch asset details by assetDetails ID
export const getAssetDetailsById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8021/api/v1/assetDetails/assetDetails/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching asset details:', error);
    throw error; // Optionally handle or re-throw the error
  }
};

export const submitAssetDetails = async (details) => {
  try {
    const response = await axios.post(
      'http://localhost:8021/api/v1/assetDetails/add',
      details
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting asset details:', error);
    throw error;
  }
};
// import axios from 'axios';

// export const getAssetDetails = async () => {
//   const response = await axios.get('http://localhost:8021/api/v1/assetDetails');
//   return response.data;
// };

// export const getScopedInAsset = async (assetId) => {
//   const response = await axios.get(`http://localhost:8021/api/v1/assetDetails/scoped/${assetId}`);
//   return response.data;
// };

// // import axios from 'axios';

// // const API_URL_ASSET_IN_ASSETDETAILS = 'http://localhost:8021/api/v1/assetDetails/assets/';
// // const API_URL_SCOPED_IN_ASSETDETAILS = 'http://localhost:8021/api/v1/assetDetails/scoped/';

// // export const getAssetInAssetDetails = async () => {
// //   const response = await axios.get(`${API_URL_ASSET_IN_ASSETDETAILS}`);
// //   return response.data;
// // };

// // export const getScopedInAssetDetails = async (assetId) => {
// //     const response = await axios.get(`${API_URL_SCOPED_IN_ASSETDETAILS}${assetId}`);
// //     return response.data;
// //   };
// import axios from 'axios';

// const API_URL_ASSET_IN_ASSETDETAILS = 'http://localhost:8021/api/v1/assetDetails/assets/';
// const API_URL_SCOPED_IN_ASSETDETAILS = 'http://localhost:8021/api/v1/assetDetails/scoped/';

// export const getAssetInAssetDetails = async () => {
//   const response = await axios.get(API_URL_ASSET_IN_ASSETDETAILS);
//   return response.data;
// };

// export const getScopedInAssetDetails = async (assetId) => {
//   const response = await axios.get(`${API_URL_SCOPED_IN_ASSETDETAILS}${assetId}`);
//   return response.data;
// };
