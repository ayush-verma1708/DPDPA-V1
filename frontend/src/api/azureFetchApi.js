import axios from 'axios';

export const fetchDataInventory = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8021/api/data-inventory'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data inventory:', error);
    throw error;
  }
};

export const fetchAccessLogs = async () => {
  try {
    const response = await axios.get('http://localhost:8021/api/access-logs');
    return response.data;
  } catch (error) {
    console.error('Error fetching access logs:', error);
    throw error;
  }
};

export const fetchDataGovernance = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8021/api/data-governance'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data governance:', error);
    throw error;
  }
};

export const fetchAuditLogs = async () => {
  try {
    const response = await axios.get('http://localhost:8021/api/audit-logs');
    return response.data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};
