import axios from 'axios';

/**
 * Fetch company data using the provided access token.
 * @param {string} accessToken The access token to authenticate the request.
 * @returns {Promise<Object>} The company data returned from the backend.
 */
export const fetchCompanyData = async (accessToken) => {
  try {
    const response = await axios.post(
      'http://localhost:8021/api/fetchCompanyData', // Your backend endpoint
      { accessToken },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw error;
  }
};
