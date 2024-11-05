import React, { useState, useEffect } from 'react';
import UserPreferencesForm from './UserPreferencesForm';
import { getUserResponsesByCompanyId } from '../api/userResonseApi'; // Corrected import path
import { getAllProductFamilies } from '../api/productFamilyApi'; // Import for fetching product families
import './UserResponsesManager.css';

const UserResponsesManager = ({ companyId }) => {
  const [responses, setResponses] = useState([]);
  const [productFamilies, setProductFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch user responses
  const fetchUserResponses = async () => {
    try {
      const response = await getUserResponsesByCompanyId(companyId);
      const userResponses = response.data; // Access the data array from the response
      console.log('Fetched user responses:', userResponses); // Debug log
      setResponses(userResponses);
    } catch (err) {
      setError(err.message || 'Error fetching responses');
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  // Function to fetch product families
  const fetchProductFamilies = async () => {
    try {
      const data = await getAllProductFamilies();
      setProductFamilies(data);
    } catch (err) {
      setError('Error fetching product families');
      console.error('Error:', err);
    }
  };

  // Fetch user responses and product families on component mount
  useEffect(() => {
    fetchUserResponses(); // Fetch user responses
    fetchProductFamilies(); // Fetch product families
  }, [companyId]);

  return (
    <div className='responses-container'>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display user responses in a similar style to UserPreferencesForm */}
      {responses.length > 0 ? (
        <div>
          <h2>Your Responses</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            {responses.map((response) => {
              const productFamily = productFamilies.find(
                (family) => family._id === response.productFamilyId
              );

              return (
                <div
                  key={response._id}
                  style={{
                    border: '1px solid #e0e0e0',
                    padding: '15px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff',
                  }}
                >
                  <p style={{ fontWeight: 'bold', color: '#0073e6' }}>
                    {productFamily ? productFamily.family_name : ''}
                  </p>
                  <div>
                    <label style={{ fontWeight: 'bold', color: '#333' }}>
                      Selected Software:
                    </label>
                    <p>
                      {response.selectedSoftware
                        ? response.selectedSoftware.software_name
                        : 'None of these'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <h2>No Responses Found</h2>
        </div>
      )}

      {/* Show the UserPreferencesForm if there are no responses */}
      {responses.length === 0 && (
        <UserPreferencesForm
          className='user-form'
          companyId={companyId}
          onSubmitSuccess={fetchUserResponses} // Re-fetch user responses after submission
        />
      )}
    </div>
  );
};

export default UserResponsesManager;

// import React, { useState, useEffect } from 'react';
// import UserPreferencesForm from './UserPreferencesForm';
// import { getUserResponsesByCompanyId } from '../api/userResonseApi'; // Corrected import path
// import './UserResponsesManager.css';

// const UserResponsesManager = ({ companyId }) => {
//   const [responses, setResponses] = useState([]);
//   const [loading, setLoading] = useState(true); // Start as loading
//   const [error, setError] = useState(null);

//   // Function to fetch user responses
//   const fetchUserResponses = async () => {
//     try {
//       const response = await getUserResponsesByCompanyId(companyId);
//       const userResponses = response.data; // Access the data array from the response
//       console.log('Fetched user responses:', userResponses); // Debug log
//       setResponses(userResponses);
//     } catch (err) {
//       setError(err.message || 'Error fetching responses');
//     } finally {
//       setLoading(false); // Stop loading when done
//     }
//   };

//   // Fetch user responses on component mount
//   useEffect(() => {
//     fetchUserResponses(); // Call the fetch function
//   }, [companyId]);

//   // Call this function on form submission to check for existing responses
//   const handleSubmitSuccess = () => {
//     fetchUserResponses(); // Re-fetch user responses after submission
//   };

//   return (
//     <div className='responses-container'>
//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {responses.length > 0 ? (
//         <div>
//           <ul>
//             {responses.map((response) => (
//               <li key={response._id}>
//                 {/* Use _id as the key */}
//                 <strong>{response.productFamily.family_name}: </strong>
//                 {response.selectedSoftware
//                   ? response.selectedSoftware.software_name
//                   : 'None of these'}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <div>
//           <h2>No Responses Found</h2>
//         </div>
//       )}

//       {/* Show the form if there are no responses */}
//       {responses.length === 0 && (
//         <UserPreferencesForm
//           className='user-form'
//           companyId={companyId}
//           onSubmitSuccess={handleSubmitSuccess} // Pass success handler
//         />
//       )}
//     </div>
//   );
// };

// export default UserResponsesManager;
