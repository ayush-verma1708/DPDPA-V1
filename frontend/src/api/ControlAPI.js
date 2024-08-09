import axios from 'axios';

const API_URL = 'http://localhost:8021/api/v1/controls';

export const fetchControls = async () => {
  return axios.get(API_URL);
};

export const addControl = async (newControl) => {
  return axios.post(API_URL, newControl);
};

export const editControl = async (id, updatedControl) => {
  return axios.put(`${API_URL}/${id}`, updatedControl);
};

export const deleteControl = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
