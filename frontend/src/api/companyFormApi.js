import axios from "axios";

const API_URL = "http://localhost:8021/api/company-form";

// Create a new company form entry
export const createCompanyForm = (data) =>
  axios.post(`http://localhost:8021/api/company-form/create`, data);

// Fetch a company form entry by ID
export const getCompanyFormById = (id) => axios.get(`${API_URL}/${id}`);

// Update a company form entry by ID
export const updateCompanyForm = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

// Delete a company form entry by ID
export const deleteCompanyForm = (id) => axios.delete(`${API_URL}/${id}`);

// List all company form entries
export const listCompanyForms = (params) => axios.get(API_URL, { params });
