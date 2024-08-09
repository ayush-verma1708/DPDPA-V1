import axios from 'axios';

const API_URL_COVERAGE = 'http://localhost:8021/api/v1/coverage/';
//const API_URL_COVERAGE_COUNT = 'http://localhost:8021/api/v1/coverage/add-count';
const API_URL_COVERAGE_IN_SCOPED = 'http://localhost:8021/api/v1/coverage/scopeds/';
const API_URL_ADD_COVERAGE = 'http://localhost:8021/api/v1/coverage/add-coverage';
const API_URL_COVERAGE_DETAILS = 'http://localhost:8021/api/v1/coverage-details/';
const API_URL_COVERAGE_UPDATE = 'http://localhost:8021/api/v1/coverage-update/';
const API_URL_COVERAGE_DELETE = 'http://localhost:8021/api/v1/coverage-delete/';

export const getCoverages = async () => {
  const response = await axios.get(API_URL_COVERAGE);
  return response.data;
};

export const getCoverageInScoped = async (scopedId) => {
  // const data = await axios.get(API_URL_COVERAGE_IN_SCOPED)
  // return data
  try {
    const response = await axios.get(`${API_URL_COVERAGE_IN_SCOPED}${scopedId}`);
    console.log(response.data);
    // Ensure response data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error('Expected an array of coverage');
    }
  } catch (error) {
    throw error;
  }
}

export const addCoverageCount = async (scopedCoverageCount) => {
  try {
    const response = await axios.post('http://localhost:8021/api/v1/coverage/add-count',{scopedCoverageCount});
    return response.data;    
  } catch (error) {
    throw new Error('Expected an array of coverage');    
  }
};

export const getCoverageById = async (id) => {
  const response = await axios.get(`${API_URL_COVERAGE_DETAILS}${id}`);
  return response.data;
};

export const createCoverage = async (coverage) => {
  const response = await axios.post(API_URL_ADD_COVERAGE, coverage);
  return response.data;
};

export const updateCoverage = async (id, coverage) => {
  const response = await axios.put(`${API_URL_COVERAGE_UPDATE}${id}`, coverage);
  return response.data;
};

export const deleteCoverage = async (id) => {
  const response = await axios.delete(`${API_URL_COVERAGE_DELETE}${id}`);
  return response.data;
};
