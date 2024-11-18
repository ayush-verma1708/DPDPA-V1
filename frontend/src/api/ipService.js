import axios from 'axios';

// Function to fetch the IP address from the backend API
export const getIpAddress = async () => {
  try {
    const response = await axios.get('http://localhost:8021/api/get-ip');
    return response.data.ip; // Return the IP address from the response
  } catch (error) {
    throw new Error('Error fetching IP address: ' + error.message);
  }
};
