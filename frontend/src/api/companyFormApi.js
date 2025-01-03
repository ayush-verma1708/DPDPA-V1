import axios from 'axios';

const BASE = 'http://localhost:8021';
const API_URL = 'http://localhost:8021/api/company-form';

// Create a new company form entry
// export const createCompanyForm = async (data, userId) => {
//   try {
//     // Log the data being sent for debugging purposes
//     console.log('User data:', data);

//     // First, create the company form
//     const createResponse = await axios.post(
//       'http://localhost:8021/api/company-form/create',
//       data
//     );

//     // Check if the form was created successfully
//     if (createResponse.status === 201) {
//       console.log('Company form created successfully:', createResponse.data);

//       // If form submission was successful, update form completion status for the user
//       const updateResponse = await axios.patch(
//         `${BASE}/api/users/${userId}/form-completion`,
//         { hasCompletedCompanyForm: true }
//       );

//       // If status update was successful
//       if (updateResponse.status === 200) {
//         console.log('Form completion status updated successfully');
//         return {
//           success: true,
//           formData: createResponse.data,
//           userData: updateResponse.data,
//         };
//       } else {
//         throw new Error('Failed to update form completion status');
//       }
//     } else {
//       throw new Error('Failed to create company form');
//     }
//   } catch (error) {
//     console.error(
//       'Error in creating company form and updating status:',
//       error.message
//     );
//     throw error; // Rethrow the error to be handled by the calling function
//   }
// };
export const createCompanyForm = async (data) => {
  try {
    // Log the data being sent for debugging purposes
    console.log('User data:', data);

    // First, create the company form
    const createResponse = await axios.post(
      'http://localhost:8021/api/company-form/create',
      data
    );

    // Check if the form was created successfully
    if (createResponse.status === 201) {
      console.log('Company form created successfully:', createResponse.data);

      // If form submission was successful, update form completion status for the user
      const updateResponse = await axios.patch(
        `${BASE}/api/users/${data.userId}/form-completion`, // Access userId from the data object
        { hasCompletedCompanyForm: true }
      );

      // If status update was successful
      if (updateResponse.status === 200) {
        console.log('Form completion status updated successfully');
        return {
          success: true,
          formData: createResponse.data,
          userData: updateResponse.data,
        };
      } else {
        throw new Error('Failed to update form completion status');
      }
    } else {
      throw new Error('Failed to create company form');
    }
  } catch (error) {
    console.error(
      'Error in creating company form and updating status:',
      error.message
    );
    throw error; // Rethrow the error to be handled by the calling function
  }
};

// Fetch a company form entry by ID
export const getCompanyFormById = (id) => axios.get(`${API_URL}/${id}`);

// Update a company form entry by ID
export const updateCompanyForm = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

// Delete a company form entry by ID
export const deleteCompanyForm = (id) => axios.delete(`${API_URL}/${id}`);

// List all company form entries
export const listCompanyForms = (params) => axios.get(API_URL, { params });
