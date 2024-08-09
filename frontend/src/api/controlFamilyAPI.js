import axios from 'axios';

const API_URL = 'http://localhost:8021/api/v1/control-families';

export const fetchControlFamilies = async () => {
  return axios.get(API_URL);
};

export const addControlFamily = async (newFamily) => {
  return axios.post(API_URL, newFamily);
};

export const editControlFamily = async (id, updatedFamily) => {
  return axios.put(`${API_URL}/${id}`, updatedFamily);
};

export const deleteControlFamily = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
