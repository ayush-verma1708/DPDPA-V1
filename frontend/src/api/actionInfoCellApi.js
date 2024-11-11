import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:8021/api';

// Function to get action by variable_id
export const getActionByVariableId = async (variableId) => {
  try {
    const response = await axios.get(
      `${API_URL}/newaction/variable/${variableId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching action by variable_id:', error);
    throw error;
  }
};
