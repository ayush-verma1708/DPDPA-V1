import React, { useState, useEffect } from 'react';
import { getAllProductFamilies } from '../api/productFamilyApi';
import { addUserResponses } from '../api/userResonseApi';

const UserPreferencesForm = ({ companyId }) => {
  const [responses, setResponses] = useState([]);
  const [productFamilies, setProductFamilies] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track submission status

  // Fetch product families when the component mounts
  useEffect(() => {
    const fetchProductFamilies = async () => {
      try {
        const data = await getAllProductFamilies();
        setProductFamilies(data);

        // Set responses without default selections
        setResponses(
          data.map((family) => ({
            productFamilyId: family._id,
            selectedSoftware: '', // Set to empty string for no default selection
            otherSoftware: '',
          }))
        );
      } catch (err) {
        setError('Error fetching product families');
        console.error('Error:', err);
      }
    };
    fetchProductFamilies();
  }, []);

  // Handle change for response fields
  const handleResponseChange = (index, field, value) => {
    const updatedResponses = responses.map((response, i) =>
      i === index ? { ...response, [field]: value } : response
    );
    setResponses(updatedResponses);
  };

  // Handle form submission for adding responses
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map responses to ensure the structure matches expected API format
      const formattedResponses = responses.map((response) => ({
        productFamilyId: response.productFamilyId,
        selectedSoftware: response.selectedSoftware, // This is now an ObjectId
        otherSoftware: response.otherSoftware,
      }));

      await addUserResponses(companyId, formattedResponses);
      setError(null); // Clear any previous errors
      setIsSubmitted(true); // Set submission status to true
    } catch (err) {
      setError(err.message || 'Error adding responses');
      setIsSubmitted(false); // Reset submission status on error
    }
  };

  return (
    <div style={{ margin: '0 auto', padding: '20px' }}>
      {isSubmitted && (
        <div
          style={{ marginBottom: '20px', color: 'green', fontWeight: 'bold' }}
        >
          Congratulations! Your preferences have been saved successfully.
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          {Array.isArray(responses) && responses.length > 0 ? (
            responses.map((response, index) => {
              const productFamily = productFamilies.find(
                (family) => family._id === response.productFamilyId
              );

              return (
                <div
                  key={response.productFamilyId}
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
                    <select
                      value={response.selectedSoftware}
                      onChange={(e) =>
                        handleResponseChange(
                          index,
                          'selectedSoftware',
                          e.target.value
                        )
                      }
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        marginTop: '4px',
                      }}
                    >
                      <option value=''>Select Software</option>
                      {productFamily &&
                        Array.isArray(productFamily.software_list) &&
                        productFamily.software_list.map((software) => (
                          <option
                            key={software._id}
                            value={software._id} // Using ObjectId as value
                          >
                            {software.software_name}
                          </option>
                        ))}
                      <option value='None'>None of these</option>
                    </select>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No product families available.</p>
          )}
        </div>

        <button
          type='submit'
          style={{
            marginTop: '20px',
            padding: '12px 20px',
            fontSize: '16px',
            color: '#fff',
            backgroundColor: '#0073e6',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            alignSelf: 'center',
          }}
        >
          Save Preferences
        </button>
      </form>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default UserPreferencesForm;

// import React, { useState, useEffect } from 'react';
// import { getAllProductFamilies } from '../api/productFamilyApi';
// import { addUserResponses } from '../api/userResonseApi';

// const UserPreferencesForm = ({ companyId }) => {
//   const [responses, setResponses] = useState([]);
//   const [productFamilies, setProductFamilies] = useState([]);
//   const [error, setError] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false); // State to track submission status

//   // Fetch product families when the component mounts
//   useEffect(() => {
//     const fetchProductFamilies = async () => {
//       try {
//         const data = await getAllProductFamilies();
//         console.log('Fetched product families:', data); // Debug log
//         setProductFamilies(data);

//         // Set default selections
//         setResponses(
//           data.map((family) => {
//             const defaultSoftware =
//               family.software_list.length > 0
//                 ? family.software_list[0]._id // Set the first software as default
//                 : ''; // Or leave it empty if no software available

//             return {
//               productFamilyId: family._id,
//               selectedSoftware: defaultSoftware, // Default selection
//               otherSoftware: '',
//             };
//           })
//         );
//       } catch (err) {
//         setError('Error fetching product families');
//         console.error('Error:', err);
//       }
//     };
//     fetchProductFamilies();
//   }, []);

//   // Handle change for response fields
//   const handleResponseChange = (index, field, value) => {
//     const updatedResponses = responses.map((response, i) =>
//       i === index ? { ...response, [field]: value } : response
//     );
//     setResponses(updatedResponses);
//   };

//   // Handle form submission for adding responses
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Map responses to ensure the structure matches expected API format
//       const formattedResponses = responses.map((response) => ({
//         productFamilyId: response.productFamilyId,
//         selectedSoftware: response.selectedSoftware, // This is now an ObjectId
//         otherSoftware: response.otherSoftware,
//       }));

//       await addUserResponses(companyId, formattedResponses);
//       setError(null); // Clear any previous errors
//       setIsSubmitted(true); // Set submission status to true
//     } catch (err) {
//       setError(err.message || 'Error adding responses');
//       setIsSubmitted(false); // Reset submission status on error
//     }
//   };

//   return (
//     <div style={{ margin: '0 auto', padding: '20px' }}>
//       {isSubmitted && (
//         <div
//           style={{ marginBottom: '20px', color: 'green', fontWeight: 'bold' }}
//         >
//           Congratulations! Your preferences have been saved successfully.
//         </div>
//       )}
//       <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: '1fr 1fr',
//             gap: '20px',
//           }}
//         >
//           {Array.isArray(responses) && responses.length > 0 ? (
//             responses.map((response, index) => {
//               const productFamily = productFamilies.find(
//                 (family) => family._id === response.productFamilyId
//               );

//               return (
//                 <div
//                   key={response.productFamilyId}
//                   style={{
//                     border: '1px solid #e0e0e0',
//                     padding: '15px',
//                     borderRadius: '8px',
//                     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//                     backgroundColor: '#fff',
//                   }}
//                 >
//                   <p style={{ fontWeight: 'bold', color: '#0073e6' }}>
//                     {productFamily ? productFamily.family_name : ''}
//                   </p>
//                   <div>
//                     <label style={{ fontWeight: 'bold', color: '#333' }}>
//                       Selected Software:
//                     </label>
//                     <select
//                       value={response.selectedSoftware}
//                       onChange={(e) =>
//                         handleResponseChange(
//                           index,
//                           'selectedSoftware',
//                           e.target.value
//                         )
//                       }
//                       required
//                       style={{
//                         width: '100%',
//                         padding: '8px',
//                         borderRadius: '4px',
//                         border: '1px solid #ddd',
//                         marginTop: '4px',
//                       }}
//                     >
//                       <option value=''>Select Software</option>
//                       {productFamily &&
//                         Array.isArray(productFamily.software_list) &&
//                         productFamily.software_list.map((software) => (
//                           <option
//                             key={software._id}
//                             value={software._id} // Using ObjectId as value
//                           >
//                             {software.software_name}
//                           </option>
//                         ))}
//                       <option value='None'>None of these</option>
//                     </select>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p>No product families available.</p>
//           )}
//         </div>

//         <button
//           type='submit'
//           style={{
//             marginTop: '20px',
//             padding: '12px 20px',
//             fontSize: '16px',
//             color: '#fff',
//             backgroundColor: '#0073e6',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             alignSelf: 'center',
//           }}
//         >
//           Save Preferences
//         </button>
//       </form>

//       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
//     </div>
//   );
// };

// export default UserPreferencesForm;

// // import React, { useState, useEffect } from 'react';
// // import { getAllProductFamilies } from '../api/productFamilyApi';
// // // import { addUserResponses } from '../api/userResponseApi';
// // import { addUserResponses } from '../api/userResonseApi';

// // const UserPreferencesForm = ({ companyId }) => {
// //   const [responses, setResponses] = useState([]);
// //   const [productFamilies, setProductFamilies] = useState([]);
// //   const [error, setError] = useState(null);

// //   // Fetch product families when the component mounts
// //   useEffect(() => {
// //     const fetchProductFamilies = async () => {
// //       try {
// //         const data = await getAllProductFamilies();
// //         console.log('Fetched product families:', data); // Debug log
// //         setProductFamilies(data);

// //         // Set default selections
// //         setResponses(
// //           data.map((family) => {
// //             const defaultSoftware =
// //               family.software_list.length > 0
// //                 ? family.software_list[0]._id // Set the first software as default
// //                 : ''; // Or leave it empty if no software available

// //             return {
// //               productFamilyId: family._id,
// //               selectedSoftware: defaultSoftware, // Default selection
// //               otherSoftware: '',
// //             };
// //           })
// //         );
// //       } catch (err) {
// //         setError('Error fetching product families');
// //         console.error('Error:', err);
// //       }
// //     };
// //     fetchProductFamilies();
// //   }, []);

// //   // Handle change for response fields
// //   const handleResponseChange = (index, field, value) => {
// //     const updatedResponses = responses.map((response, i) =>
// //       i === index ? { ...response, [field]: value } : response
// //     );
// //     setResponses(updatedResponses);
// //   };

// //   // Handle form submission for adding responses
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       // Map responses to ensure the structure matches expected API format
// //       const formattedResponses = responses.map((response) => ({
// //         productFamilyId: response.productFamilyId,
// //         selectedSoftware: response.selectedSoftware, // This is now an ObjectId
// //         otherSoftware: response.otherSoftware,
// //       }));

// //       await addUserResponses(companyId, formattedResponses);
// //       setError(null); // Clear any previous errors
// //     } catch (err) {
// //       setError(err.message || 'Error adding responses');
// //     }
// //   };

// //   return (
// //     <div style={{ margin: '0 auto', padding: '20px' }}>
// //       <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
// //         <div
// //           style={{
// //             display: 'grid',
// //             gridTemplateColumns: '1fr 1fr',
// //             gap: '20px',
// //           }}
// //         >
// //           {Array.isArray(responses) && responses.length > 0 ? (
// //             responses.map((response, index) => {
// //               const productFamily = productFamilies.find(
// //                 (family) => family._id === response.productFamilyId
// //               );

// //               return (
// //                 <div
// //                   key={response.productFamilyId}
// //                   style={{
// //                     border: '1px solid #e0e0e0',
// //                     padding: '15px',
// //                     borderRadius: '8px',
// //                     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
// //                     backgroundColor: '#fff',
// //                   }}
// //                 >
// //                   <p style={{ fontWeight: 'bold', color: '#0073e6' }}>
// //                     {productFamily ? productFamily.family_name : ''}
// //                   </p>
// //                   <div>
// //                     <label style={{ fontWeight: 'bold', color: '#333' }}>
// //                       Selected Software:
// //                     </label>
// //                     <select
// //                       value={response.selectedSoftware}
// //                       onChange={(e) =>
// //                         handleResponseChange(
// //                           index,
// //                           'selectedSoftware',
// //                           e.target.value
// //                         )
// //                       }
// //                       required
// //                       style={{
// //                         width: '100%',
// //                         padding: '8px',
// //                         borderRadius: '4px',
// //                         border: '1px solid #ddd',
// //                         marginTop: '4px',
// //                       }}
// //                     >
// //                       <option value=''>Select Software</option>
// //                       {productFamily &&
// //                         Array.isArray(productFamily.software_list) &&
// //                         productFamily.software_list.map((software) => (
// //                           <option
// //                             key={software._id}
// //                             value={software._id} // Using ObjectId as value
// //                           >
// //                             {software.software_name}
// //                           </option>
// //                         ))}
// //                       <option value='None'>None of these</option>{' '}
// //                       {/* Added this line */}
// //                     </select>
// //                   </div>
// //                 </div>
// //               );
// //             })
// //           ) : (
// //             <p>No product families available.</p>
// //           )}
// //         </div>

// //         <button
// //           type='submit'
// //           style={{
// //             marginTop: '20px',
// //             padding: '12px 20px',
// //             fontSize: '16px',
// //             color: '#fff',
// //             backgroundColor: '#0073e6',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer',
// //             alignSelf: 'center',
// //           }}
// //         >
// //           Save Preferences
// //         </button>
// //       </form>

// //       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
// //     </div>
// //   );
// // };

// // export default UserPreferencesForm;

// // // import React, { useState, useEffect } from 'react';
// // // import { getAllProductFamilies } from '../api/productFamilyApi';
// // // // import { addUserResponses } from '../api/userResponseApi';
// // // import { addUserResponses } from '../api/userResonseApi';

// // // const UserPreferencesForm = ({ companyId }) => {
// // //   const [responses, setResponses] = useState([]);
// // //   const [productFamilies, setProductFamilies] = useState([]);
// // //   const [error, setError] = useState(null);

// // //   // Fetch product families when the component mounts
// // //   useEffect(() => {
// // //     const fetchProductFamilies = async () => {
// // //       try {
// // //         const data = await getAllProductFamilies();
// // //         console.log('Fetched product families:', data); // Debug log
// // //         setProductFamilies(data);
// // //         setResponses(
// // //           data.map((family) => ({
// // //             productFamilyId: family._id,
// // //             selectedSoftware: '', // This will hold the ObjectId now
// // //             otherSoftware: '',
// // //           }))
// // //         );
// // //       } catch (err) {
// // //         setError('Error fetching product families');
// // //         console.error('Error:', err);
// // //       }
// // //     };
// // //     fetchProductFamilies();
// // //   }, []);

// // //   // Handle change for response fields
// // //   const handleResponseChange = (index, field, value) => {
// // //     const updatedResponses = responses.map((response, i) =>
// // //       i === index ? { ...response, [field]: value } : response
// // //     );
// // //     setResponses(updatedResponses);
// // //   };

// // //   // Handle form submission for adding responses
// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     try {
// // //       // Map responses to ensure the structure matches expected API format
// // //       const formattedResponses = responses.map((response) => ({
// // //         productFamilyId: response.productFamilyId,
// // //         selectedSoftware: response.selectedSoftware, // This is now an ObjectId
// // //         otherSoftware: response.otherSoftware,
// // //       }));

// // //       await addUserResponses(companyId, formattedResponses);
// // //       setError(null); // Clear any previous errors
// // //     } catch (err) {
// // //       setError(err.message || 'Error adding responses');
// // //     }
// // //   };

// // //   return (
// // //     <div style={{ margin: '0 auto', padding: '20px' }}>
// // //       <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
// // //         <div
// // //           style={{
// // //             display: 'grid',
// // //             gridTemplateColumns: '1fr 1fr',
// // //             gap: '20px',
// // //           }}
// // //         >
// // //           {Array.isArray(responses) && responses.length > 0 ? (
// // //             responses.map((response, index) => {
// // //               const productFamily = productFamilies.find(
// // //                 (family) => family._id === response.productFamilyId
// // //               );

// // //               return (
// // //                 <div
// // //                   key={response.productFamilyId}
// // //                   style={{
// // //                     border: '1px solid #e0e0e0',
// // //                     padding: '15px',
// // //                     borderRadius: '8px',
// // //                     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
// // //                     backgroundColor: '#fff',
// // //                   }}
// // //                 >
// // //                   <p style={{ fontWeight: 'bold', color: '#0073e6' }}>
// // //                     {productFamily ? productFamily.family_name : ''}
// // //                   </p>
// // //                   <div>
// // //                     <label style={{ fontWeight: 'bold', color: '#333' }}>
// // //                       Selected Software:
// // //                     </label>
// // //                     <select
// // //                       value={response.selectedSoftware}
// // //                       onChange={(e) =>
// // //                         handleResponseChange(
// // //                           index,
// // //                           'selectedSoftware',
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       required
// // //                       style={{
// // //                         width: '100%',
// // //                         padding: '8px',
// // //                         borderRadius: '4px',
// // //                         border: '1px solid #ddd',
// // //                         marginTop: '4px',
// // //                       }}
// // //                     >
// // //                       <option value=''>Select Software</option>
// // //                       {productFamily &&
// // //                         Array.isArray(productFamily.software_list) &&
// // //                         productFamily.software_list.map((software) => (
// // //                           <option
// // //                             key={software._id}
// // //                             value={software._id} // Changed to use ObjectId
// // //                           >
// // //                             {software.software_name}
// // //                           </option>
// // //                         ))}
// // //                       <option value='Others'>Others</option>
// // //                     </select>
// // //                   </div>
// // //                   {response.selectedSoftware === 'Others' && (
// // //                     <div>
// // //                       <label style={{ fontWeight: 'bold', color: '#333' }}>
// // //                         Other Software:
// // //                       </label>
// // //                       <input
// // //                         type='text'
// // //                         value={response.otherSoftware}
// // //                         onChange={(e) =>
// // //                           handleResponseChange(
// // //                             index,
// // //                             'otherSoftware',
// // //                             e.target.value
// // //                           )
// // //                         }
// // //                         placeholder='Specify other software'
// // //                         style={{
// // //                           width: '100%',
// // //                           padding: '8px',
// // //                           borderRadius: '4px',
// // //                           border: '1px solid #ddd',
// // //                           marginTop: '4px',
// // //                         }}
// // //                       />
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               );
// // //             })
// // //           ) : (
// // //             <p>No product families available.</p>
// // //           )}
// // //         </div>

// // //         <button
// // //           type='submit'
// // //           style={{
// // //             marginTop: '20px',
// // //             padding: '12px 20px',
// // //             fontSize: '16px',
// // //             color: '#fff',
// // //             backgroundColor: '#0073e6',
// // //             border: 'none',
// // //             borderRadius: '5px',
// // //             cursor: 'pointer',
// // //             alignSelf: 'center',
// // //           }}
// // //         >
// // //           Save Preferences
// // //         </button>
// // //       </form>

// // //       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
// // //     </div>
// // //   );
// // // };

// // // export default UserPreferencesForm;

// // // // // src/components/UserPreferencesForm.js
// // // // import React, { useState, useEffect } from 'react';
// // // // import { getAllProductFamilies } from '../api/productFamilyApi';
// // // // // import { addUserResponses } from '../api/productFamilyApi';
// // // // import { addUserResponses } from '../api/userResonseApi';

// // // // const UserPreferencesForm = ({ companyId }) => {
// // // //   const [responses, setResponses] = useState([]);
// // // //   const [productFamilies, setProductFamilies] = useState([]);
// // // //   const [error, setError] = useState(null);

// // // //   // Fetch product families when the component mounts
// // // //   useEffect(() => {
// // // //     const fetchProductFamilies = async () => {
// // // //       try {
// // // //         const data = await getAllProductFamilies();
// // // //         console.log('Fetched product families:', data); // Debug log
// // // //         setProductFamilies(data);
// // // //         setResponses(
// // // //           data.map((family) => ({
// // // //             productFamilyId: family._id,
// // // //             selectedSoftware: '',
// // // //             otherSoftware: '',
// // // //           }))
// // // //         );
// // // //       } catch (err) {
// // // //         setError('Error fetching product families');
// // // //         console.error('Error:', err);
// // // //       }
// // // //     };
// // // //     fetchProductFamilies();
// // // //   }, []);

// // // //   // Handle change for response fields
// // // //   const handleResponseChange = (index, field, value) => {
// // // //     const updatedResponses = responses.map((response, i) =>
// // // //       i === index ? { ...response, [field]: value } : response
// // // //     );
// // // //     setResponses(updatedResponses);
// // // //   };

// // // //   // Handle form submission for adding responses
// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     try {
// // // //       await addUserResponses(companyId, responses);
// // // //       setError(null); // Clear any previous errors
// // // //     } catch (err) {
// // // //       setError(err.message || 'Error adding responses');
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div style={{ margin: '0 auto', padding: '20px' }}>
// // // //       <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
// // // //         <div
// // // //           style={{
// // // //             display: 'grid',
// // // //             gridTemplateColumns: '1fr 1fr',
// // // //             gap: '20px',
// // // //           }}
// // // //         >
// // // //           {Array.isArray(responses) && responses.length > 0 ? (
// // // //             responses.map((response, index) => {
// // // //               const productFamily = productFamilies.find(
// // // //                 (family) => family._id === response.productFamilyId
// // // //               );

// // // //               return (
// // // //                 <div
// // // //                   key={response.productFamilyId}
// // // //                   style={{
// // // //                     border: '1px solid #e0e0e0',
// // // //                     padding: '15px',
// // // //                     borderRadius: '8px',
// // // //                     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
// // // //                     backgroundColor: '#fff',
// // // //                   }}
// // // //                 >
// // // //                   <p style={{ fontWeight: 'bold', color: '#0073e6' }}>
// // // //                     {productFamily ? productFamily.family_name : ''}
// // // //                   </p>
// // // //                   <div>
// // // //                     <label style={{ fontWeight: 'bold', color: '#333' }}>
// // // //                       Selected Software:
// // // //                     </label>
// // // //                     <select
// // // //                       value={response.selectedSoftware}
// // // //                       onChange={(e) =>
// // // //                         handleResponseChange(
// // // //                           index,
// // // //                           'selectedSoftware',
// // // //                           e.target.value
// // // //                         )
// // // //                       }
// // // //                       required
// // // //                       style={{
// // // //                         width: '100%',
// // // //                         padding: '8px',
// // // //                         borderRadius: '4px',
// // // //                         border: '1px solid #ddd',
// // // //                         marginTop: '4px',
// // // //                       }}
// // // //                     >
// // // //                       <option value=''>Select Software</option>
// // // //                       {productFamily &&
// // // //                         Array.isArray(productFamily.software_list) &&
// // // //                         productFamily.software_list.map((software) => (
// // // //                           <option
// // // //                             key={software._id}
// // // //                             value={software.software_name}
// // // //                           >
// // // //                             {software.software_name}
// // // //                           </option>
// // // //                         ))}
// // // //                       <option value='Others'>Others</option>
// // // //                     </select>
// // // //                   </div>
// // // //                   {response.selectedSoftware === 'Others' && (
// // // //                     <div>
// // // //                       <label style={{ fontWeight: 'bold', color: '#333' }}>
// // // //                         Other Software:
// // // //                       </label>
// // // //                       <input
// // // //                         type='text'
// // // //                         value={response.otherSoftware}
// // // //                         onChange={(e) =>
// // // //                           handleResponseChange(
// // // //                             index,
// // // //                             'otherSoftware',
// // // //                             e.target.value
// // // //                           )
// // // //                         }
// // // //                         placeholder='Specify other software'
// // // //                         style={{
// // // //                           width: '100%',
// // // //                           padding: '8px',
// // // //                           borderRadius: '4px',
// // // //                           border: '1px solid #ddd',
// // // //                           marginTop: '4px',
// // // //                         }}
// // // //                       />
// // // //                     </div>
// // // //                   )}
// // // //                 </div>
// // // //               );
// // // //             })
// // // //           ) : (
// // // //             <p>No product families available.</p>
// // // //           )}
// // // //         </div>

// // // //         <button
// // // //           type='submit'
// // // //           style={{
// // // //             marginTop: '20px',
// // // //             padding: '12px 20px',
// // // //             fontSize: '16px',
// // // //             color: '#fff',
// // // //             backgroundColor: '#0073e6',
// // // //             border: 'none',
// // // //             borderRadius: '5px',
// // // //             cursor: 'pointer',
// // // //             alignSelf: 'center',
// // // //           }}
// // // //         >
// // // //           Save Preferences
// // // //         </button>
// // // //       </form>

// // // //       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default UserPreferencesForm;

// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { addUserResponses } from '../api/userResonseApi';
// // // // // import { getAllProductFamilies } from '../api/productFamilyApi';

// // // // // const UserPreferencesForm = ({ companyId }) => {
// // // // //   const [responses, setResponses] = useState([]);
// // // // //   const [productFamilies, setProductFamilies] = useState([]);
// // // // //   const [error, setError] = useState(null);
// // // // //   const [loading, setLoading] = useState(false);

// // // // //   // Fetch product families when the component mounts
// // // // //   useEffect(() => {
// // // // //     const fetchProductFamilies = async () => {
// // // // //       setLoading(true);
// // // // //       try {
// // // // //         const data = await getAllProductFamilies();
// // // // //         setProductFamilies(data);
// // // // //         setResponses(
// // // // //           data.map((family) => ({
// // // // //             productFamilyId: family._id,
// // // // //             selectedSoftware: '',
// // // // //             otherSoftware: '',
// // // // //           }))
// // // // //         );
// // // // //       } catch (err) {
// // // // //         setError('Error fetching product families. Please try again.');
// // // // //         console.error('Error:', err);
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     };
// // // // //     fetchProductFamilies();
// // // // //   }, []);

// // // // //   // Handle change for response fields
// // // // //   const handleResponseChange = (index, field, value) => {
// // // // //     setResponses((prevResponses) =>
// // // // //       prevResponses.map((response, i) =>
// // // // //         i === index ? { ...response, [field]: value } : response
// // // // //       )
// // // // //     );
// // // // //   };

// // // // //   // Handle form submission for adding responses
// // // // //   const handleSubmit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       console.log(companyId, responses);
// // // // //       await addUserResponses(companyId, responses);
// // // // //       setError(null); // Clear any previous errors
// // // // //     } catch (err) {
// // // // //       setError(err.message || 'Error adding responses. Please try again.');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div style={{ margin: '0 auto', padding: '20px' }}>
// // // // //       <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
// // // // //         <div
// // // // //           style={{
// // // // //             display: 'grid',
// // // // //             gridTemplateColumns: '1fr 1fr',
// // // // //             gap: '20px',
// // // // //           }}
// // // // //         >
// // // // //           {responses.map((response, index) => {
// // // // //             const productFamily = productFamilies.find(
// // // // //               (family) => family._id === response.productFamilyId
// // // // //             );

// // // // //             return (
// // // // //               <div
// // // // //                 key={response.productFamilyId} // Use a unique identifier for key
// // // // //                 style={{
// // // // //                   border: '1px solid #e0e0e0',
// // // // //                   padding: '15px',
// // // // //                   borderRadius: '8px',
// // // // //                   boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
// // // // //                   backgroundColor: '#fff',
// // // // //                 }}
// // // // //               >
// // // // //                 <p style={{ fontWeight: 'bold', color: '#0073e6' }}>
// // // // //                   {productFamily ? productFamily.family_name : ''}
// // // // //                 </p>
// // // // //                 <div>
// // // // //                   <label style={{ fontWeight: 'bold', color: '#333' }}>
// // // // //                     Selected Software:
// // // // //                   </label>
// // // // //                   <select
// // // // //                     value={response.selectedSoftware}
// // // // //                     onChange={(e) =>
// // // // //                       handleResponseChange(
// // // // //                         index,
// // // // //                         'selectedSoftware',
// // // // //                         e.target.value
// // // // //                       )
// // // // //                     }
// // // // //                     required
// // // // //                     style={{
// // // // //                       width: '100%',
// // // // //                       padding: '8px',
// // // // //                       borderRadius: '4px',
// // // // //                       border: '1px solid #ddd',
// // // // //                       marginTop: '4px',
// // // // //                     }}
// // // // //                   >
// // // // //                     <option value=''>Select Software</option>
// // // // //                     {productFamily &&
// // // // //                       productFamily.software_list.map((software) => (
// // // // //                         <option
// // // // //                           key={software._id}
// // // // //                           value={software.software_name}
// // // // //                         >
// // // // //                           {software.software_name}
// // // // //                         </option>
// // // // //                       ))}
// // // // //                     <option value='Others'>Others</option>
// // // // //                   </select>
// // // // //                 </div>
// // // // //                 {response.selectedSoftware === 'Others' && (
// // // // //                   <div>
// // // // //                     <label style={{ fontWeight: 'bold', color: '#333' }}>
// // // // //                       Other Software:
// // // // //                     </label>
// // // // //                     <input
// // // // //                       type='text'
// // // // //                       value={response.otherSoftware}
// // // // //                       onChange={(e) =>
// // // // //                         handleResponseChange(
// // // // //                           index,
// // // // //                           'otherSoftware',
// // // // //                           e.target.value
// // // // //                         )
// // // // //                       }
// // // // //                       placeholder='Specify other software'
// // // // //                       style={{
// // // // //                         width: '100%',
// // // // //                         padding: '8px',
// // // // //                         borderRadius: '4px',
// // // // //                         border: '1px solid #ddd',
// // // // //                         marginTop: '4px',
// // // // //                       }}
// // // // //                     />
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             );
// // // // //           })}
// // // // //         </div>

// // // // //         <button
// // // // //           type='submit'
// // // // //           style={{
// // // // //             marginTop: '20px',
// // // // //             padding: '12px 20px',
// // // // //             fontSize: '16px',
// // // // //             color: '#fff',
// // // // //             backgroundColor: '#0073e6',
// // // // //             border: 'none',
// // // // //             borderRadius: '5px',
// // // // //             cursor: 'pointer',
// // // // //             alignSelf: 'center',
// // // // //           }}
// // // // //           disabled={loading} // Disable the button while loading
// // // // //         >
// // // // //           {loading ? 'Saving...' : 'Save Preferences'}
// // // // //         </button>
// // // // //       </form>

// // // // //       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default UserPreferencesForm;

// // // // // // // src/components/UserPreferencesForm.js
// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import { addUserResponses } from '../api/userResonseApi';
// // // // // // import { getAllProductFamilies } from '../api/productFamilyApi';

// // // // // // const UserPreferencesForm = ({ companyId }) => {
// // // // // //   const [responses, setResponses] = useState([]);
// // // // // //   const [productFamilies, setProductFamilies] = useState([]);
// // // // // //   const [error, setError] = useState(null);

// // // // // //   // Fetch product families when the component mounts
// // // // // //   useEffect(() => {
// // // // // //     const fetchProductFamilies = async () => {
// // // // // //       try {
// // // // // //         const data = await getAllProductFamilies();
// // // // // //         setProductFamilies(data);
// // // // // //         setResponses(
// // // // // //           data.map((family) => ({
// // // // // //             productFamilyId: family._id,
// // // // // //             selectedSoftware: '',
// // // // // //             otherSoftware: '',
// // // // // //           }))
// // // // // //         );
// // // // // //       } catch (err) {
// // // // // //         setError('Error fetching product families');
// // // // // //         console.error('Error:', err);
// // // // // //       }
// // // // // //     };
// // // // // //     fetchProductFamilies();
// // // // // //   }, []);

// // // // // //   // Handle change for response fields
// // // // // //   const handleResponseChange = (index, field, value) => {
// // // // // //     const updatedResponses = responses.map((response, i) =>
// // // // // //       i === index ? { ...response, [field]: value } : response
// // // // // //     );
// // // // // //     setResponses(updatedResponses);
// // // // // //   };

// // // // // //   // Handle form submission for adding responses
// // // // // //   const handleSubmit = async (e) => {
// // // // // //     e.preventDefault();
// // // // // //     try {
// // // // // //       console.log(companyId, responses);
// // // // // //       await addUserResponses(companyId, responses);
// // // // // //       setError(null); // Clear any previous errors
// // // // // //     } catch (err) {
// // // // // //       setError(err.message || 'Error adding responses');
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div style={{ margin: '0 auto', padding: '20px' }}>
// // // // // //       <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
// // // // // //         <div
// // // // // //           style={{
// // // // // //             display: 'grid',
// // // // // //             gridTemplateColumns: '1fr 1fr',
// // // // // //             gap: '20px',
// // // // // //           }}
// // // // // //         >
// // // // // //           {responses.map((response, index) => {
// // // // // //             const productFamily = productFamilies.find(
// // // // // //               (family) => family._id === response.productFamilyId
// // // // // //             );

// // // // // //             return (
// // // // // //               <div
// // // // // //                 key={index}
// // // // // //                 style={{
// // // // // //                   border: '1px solid #e0e0e0',
// // // // // //                   padding: '15px',
// // // // // //                   borderRadius: '8px',
// // // // // //                   boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
// // // // // //                   backgroundColor: '#fff',
// // // // // //                 }}
// // // // // //               >
// // // // // //                 <div>
// // // // // //                   {/* <label style={{ fontWeight: 'bold', color: '#333' }}>
// // // // // //                     Product Family:
// // // // // //                   </label> */}
// // // // // //                   <p style={{ fontWeight: 'bold', color: '#0073e6' }}>
// // // // // //                     {productFamily ? productFamily.family_name : ''}
// // // // // //                   </p>
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                   <label style={{ fontWeight: 'bold', color: '#333' }}>
// // // // // //                     Selected Software:
// // // // // //                   </label>
// // // // // //                   <select
// // // // // //                     value={response.selectedSoftware}
// // // // // //                     onChange={(e) =>
// // // // // //                       handleResponseChange(
// // // // // //                         index,
// // // // // //                         'selectedSoftware',
// // // // // //                         e.target.value
// // // // // //                       )
// // // // // //                     }
// // // // // //                     required
// // // // // //                     style={{
// // // // // //                       width: '100%',
// // // // // //                       padding: '8px',
// // // // // //                       borderRadius: '4px',
// // // // // //                       border: '1px solid #ddd',
// // // // // //                       marginTop: '4px',
// // // // // //                     }}
// // // // // //                   >
// // // // // //                     <option value=''>Select Software</option>
// // // // // //                     {productFamily &&
// // // // // //                       productFamily.software_list.map((software) => (
// // // // // //                         <option
// // // // // //                           key={software._id}
// // // // // //                           value={software.software_name}
// // // // // //                         >
// // // // // //                           {software.software_name}
// // // // // //                         </option>
// // // // // //                       ))}
// // // // // //                     <option value='Others'>Others</option>
// // // // // //                   </select>
// // // // // //                 </div>
// // // // // //                 {response.selectedSoftware === 'Others' && (
// // // // // //                   <div>
// // // // // //                     <label style={{ fontWeight: 'bold', color: '#333' }}>
// // // // // //                       Other Software:
// // // // // //                     </label>
// // // // // //                     <input
// // // // // //                       type='text'
// // // // // //                       value={response.otherSoftware}
// // // // // //                       onChange={(e) =>
// // // // // //                         handleResponseChange(
// // // // // //                           index,
// // // // // //                           'otherSoftware',
// // // // // //                           e.target.value
// // // // // //                         )
// // // // // //                       }
// // // // // //                       placeholder='Specify other software'
// // // // // //                       style={{
// // // // // //                         width: '100%',
// // // // // //                         padding: '8px',
// // // // // //                         borderRadius: '4px',
// // // // // //                         border: '1px solid #ddd',
// // // // // //                         marginTop: '4px',
// // // // // //                       }}
// // // // // //                     />
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               </div>
// // // // // //             );
// // // // // //           })}
// // // // // //         </div>

// // // // // //         <button
// // // // // //           type='submit'
// // // // // //           style={{
// // // // // //             marginTop: '20px',
// // // // // //             padding: '12px 20px',
// // // // // //             fontSize: '16px',
// // // // // //             color: '#fff',
// // // // // //             backgroundColor: '#0073e6',
// // // // // //             border: 'none',
// // // // // //             borderRadius: '5px',
// // // // // //             cursor: 'pointer',
// // // // // //             alignSelf: 'center',
// // // // // //           }}
// // // // // //         >
// // // // // //           Save Preferences
// // // // // //         </button>
// // // // // //       </form>

// // // // // //       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default UserPreferencesForm;
