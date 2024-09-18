// api/scopeAPI.js
import axios from 'axios';

const API_URL_SCOPE = 'http://localhost:8021/api/v1/scoped/';
const API_URL_SCOPE_IN_ASSET = 'http://localhost:8021/api/v1/scoped/assets/';
const API_URL_ADD_SCOPE = 'http://localhost:8021/api/v1/scoped/add-scoped/';
const API_URL_SCOPE_UPDATE = 'http://localhost:8021/api/v1/scope-update/';
const API_URL_SCOPE_DELETE = 'http://localhost:8021/api/v1/scope-delete/';

export const getScopes = async () => {
  const response = await axios.get(API_URL_SCOPE);
  return response.data;
};

export const getScopedInAsset = async (asset) => {
  try {
    const response = await axios.get(`${API_URL_SCOPE_IN_ASSET}${asset}`);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error('Expected an array of scoped');
    }
  } catch (error) {
    throw error;
  }
};

export const createScope = async (Scope) => {
  const response = await axios.post(API_URL_ADD_SCOPE, Scope);
  return response.data;
};

export const updateScope = async (id, Scope) => {
  const response = await axios.put(`${API_URL_SCOPE_UPDATE}${id}`, Scope);
  return response.data;
};

export const deleteScope = async (id) => {
  const response = await axios.delete(`${API_URL_SCOPE_DELETE}${id}`);
  return response.data;
};

// Function to get the scope name by ID
export const getScopeNameById = async (id) => {
  try {
    const response = await axios.get(`${API_URL_SCOPE}${id}`);
    if (response.data && response.data.name) {
      return response.data.name; // Assuming scope has a `name` field
    } else {
      throw new Error('Scope not found or invalid response structure');
    }
  } catch (error) {
    console.error(`Error fetching scope by ID: ${id}`, error);
    throw error;
  }
};
