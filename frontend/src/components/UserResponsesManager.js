import React, { useState, useEffect } from 'react';
import {
  getUserResponsesByCompanyId,
  addUserResponse,
  getAllProductFamilies,
} from '../api/productFamilyApi';
import UserPreferencesForm from './UserPreferencesForm';
import './UserResponsesManager.css';

const UserResponsesManager = ({ companyId }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productFamilies, setProductFamilies] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const softwareOptions = [
    'Microsoft Tools',
    'Other Software',
    'None of these',
    'Others',
  ];

  // ** New state to track selected options for each product family **
  const [selectedSoftware, setSelectedSoftware] = useState({});
  const [otherSoftware, setOtherSoftware] = useState({});

  // Fetch user responses and product families
  const fetchData = async () => {
    try {
      const families = await getAllProductFamilies();
      setProductFamilies(families);

      const response = await getUserResponsesByCompanyId(companyId);
      setResponses(response.data);

      // Initialize selected options
      const initialSelectedSoftware = {};
      const initialOtherSoftware = {};
      response.data.forEach((res) => {
        initialSelectedSoftware[res.productFamily._id] = res.selectedSoftware;
        initialOtherSoftware[res.productFamily._id] = res.otherSoftware || '';
      });
      setSelectedSoftware(initialSelectedSoftware);
      setOtherSoftware(initialOtherSoftware);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setShowForm(true);
      } else {
        setError('Failed to fetch data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const handleRadioChange = async (familyId, selectedOption) => {
    try {
      const otherSoftwareInput =
        selectedOption === 'Others' ? otherSoftware[familyId] : '';
      await addUserResponse({
        companyId,
        productFamily: familyId,
        selectedSoftware: selectedOption,
        otherSoftware: otherSoftwareInput,
      });

      setSelectedSoftware((prev) => ({ ...prev, [familyId]: selectedOption }));
      if (selectedOption !== 'Others') {
        setOtherSoftware((prev) => ({ ...prev, [familyId]: '' })); // Reset 'Others' input if not selected
      }
    } catch (error) {
      console.error('Error updating response:', error);
    }
  };

  const handleOtherSoftwareChange = (familyId, value) => {
    setOtherSoftware((prev) => ({ ...prev, [familyId]: value }));
    handleRadioChange(familyId, 'Others'); // Ensure update is triggered when "Others" input changes
  };

  if (loading) return <div className='loading'>Loading...</div>;
  if (error) return <div className='error'>{error}</div>;

  return (
    <div className='responses-container'>
      {responses.length > 0 ? (
        <div className='responses-list'>
          {productFamilies.map((family) => (
            <div className='response-card' key={family._id}>
              <h3>{family.family_name}</h3>
              <div>
                {softwareOptions.map((option) => (
                  <label
                    key={option}
                    style={{ display: 'block', marginBottom: '5px' }}
                  >
                    <input
                      type='radio'
                      name={`software-${family._id}`}
                      value={option}
                      checked={selectedSoftware[family._id] === option}
                      onChange={() => handleRadioChange(family._id, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {selectedSoftware[family._id] === 'Others' && (
                <div>
                  <label>
                    <strong>Other Software:</strong>
                    <input
                      type='text'
                      value={otherSoftware[family._id] || ''}
                      onChange={(e) =>
                        handleOtherSoftwareChange(family._id, e.target.value)
                      }
                      placeholder='Specify other software'
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : showForm ? (
        <UserPreferencesForm
          className='user-form'
          companyId={companyId}
          onFormSubmit={() => {
            fetchData();
            setShowForm(false);
          }}
        />
      ) : (
        <div>No product families found.</div>
      )}
    </div>
  );
};

export default UserResponsesManager;

// import React, { useState, useEffect } from 'react';
// import {
//   getUserResponsesByCompanyId,
//   addUserResponse,
//   getAllProductFamilies,
// } from '../api/productFamilyApi';
// import UserPreferencesForm from './UserPreferencesForm';
// import './UserResponsesManager.css';

// const UserResponsesManager = ({ companyId }) => {
//   const [responses, setResponses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [productFamilies, setProductFamilies] = useState([]);
//   const [showForm, setShowForm] = useState(false);

//   const softwareOptions = [
//     'Microsoft',
//     'ABC Software',
//     'None of these',
//     'Others',
//   ];

//   useEffect(() => {
//     const fetchProductFamilies = async () => {
//       try {
//         const families = await getAllProductFamilies();
//         setProductFamilies(families);
//       } catch (err) {
//         setError('Failed to fetch product families.');
//       }
//     };

//     const fetchUserResponses = async () => {
//       try {
//         const response = await getUserResponsesByCompanyId(companyId);
//         setResponses(response.data);
//       } catch (err) {
//         if (err.response && err.response.status === 404) {
//           setShowForm(true);
//         } else {
//           setError('Failed to fetch user responses.');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductFamilies();
//     fetchUserResponses();
//   }, [companyId]);

//   const handleRadioChange = async (
//     familyId,
//     selectedSoftware,
//     otherSoftware = ''
//   ) => {
//     try {
//       await addUserResponse({
//         companyId,
//         productFamily: familyId,
//         selectedSoftware,
//         otherSoftware,
//       });
//       const updatedResponses = await getUserResponsesByCompanyId(companyId);
//       setResponses(updatedResponses.data);
//     } catch (error) {
//       console.error('Error updating response:', error);
//     }
//   };

//   const handleFormSubmit = () => {
//     fetchUserResponses();
//     setShowForm(false);
//   };

//   if (loading) return <div className='loading'>Loading...</div>;
//   if (error) return <div className='error'>{error}</div>;

//   return (
//     <div className='responses-container'>
//       {responses.length > 0 ? (
//         <div className='responses-list'>
//           {productFamilies.map((family) => {
//             const userResponse = responses.find(
//               (response) => response.productFamily?._id === family._id
//             );
//             const [selectedSoftware, setSelectedSoftware] = useState(
//               userResponse?.selectedSoftware || ''
//             );
//             const [otherSoftware, setOtherSoftware] = useState(
//               userResponse?.otherSoftware || ''
//             );

//             const handleSoftwareChange = (e) => {
//               const value = e.target.value;
//               setSelectedSoftware(value);
//               if (value !== 'Others') setOtherSoftware('');
//               handleRadioChange(
//                 family._id,
//                 value,
//                 value === 'Others' ? otherSoftware : ''
//               );
//             };

//             const handleOtherSoftwareChange = (e) => {
//               const value = e.target.value;
//               setOtherSoftware(value);
//               handleRadioChange(family._id, selectedSoftware, value);
//             };

//             return (
//               <div className='response-card' key={family._id}>
//                 <h3>{family.family_name}</h3>
//                 <div>
//                   {softwareOptions.map((option) => (
//                     <label
//                       key={option}
//                       style={{ display: 'block', marginBottom: '5px' }}
//                     >
//                       <input
//                         type='radio'
//                         name={`software-${family._id}`}
//                         value={option}
//                         checked={selectedSoftware === option}
//                         onChange={handleSoftwareChange}
//                       />
//                       {option}
//                     </label>
//                   ))}
//                 </div>
//                 {selectedSoftware === 'Others' && (
//                   <div>
//                     <label>
//                       <strong>Other Software:</strong>
//                       <input
//                         type='text'
//                         value={otherSoftware}
//                         onChange={handleOtherSoftwareChange}
//                         placeholder='Specify other software'
//                       />
//                     </label>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       ) : showForm ? (
//         <UserPreferencesForm
//           className='user-form'
//           companyId={companyId}
//           onFormSubmit={handleFormSubmit}
//         />
//       ) : (
//         <div>No product families found.</div>
//       )}
//     </div>
//   );
// };

// export default UserResponsesManager;

// // import React, { useState, useEffect } from 'react';
// // import {
// //   getUserResponsesByCompanyId,
// //   addUserResponse,
// // } from '../api/productFamilyApi';
// // import { getAllProductFamilies } from '../api/productFamilyApi';
// // import UserPreferencesForm from './UserPreferencesForm'; // Import the UserPreferencesForm component
// // import './UserResponsesManager.css';

// // const UserResponsesManager = ({ companyId }) => {
// //   const [responses, setResponses] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [productFamilies, setProductFamilies] = useState([]);
// //   const [showForm, setShowForm] = useState(false); // State to control form visibility

// //   const fetchUserResponses = async () => {
// //     try {
// //       const response = await getUserResponsesByCompanyId(companyId);
// //       setResponses(response.data);
// //     } catch (err) {
// //       // Check if the error is a 404 error
// //       if (err.response && err.response.status === 404) {
// //         setShowForm(true); // Show the form if no responses found
// //       } else {
// //         setError('Failed to fetch user responses.');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const fetchProductFamilies = async () => {
// //       try {
// //         const families = await getAllProductFamilies();
// //         setProductFamilies(families);
// //       } catch (err) {
// //         setError('Failed to fetch product families.');
// //       }
// //     };

// //     fetchProductFamilies();
// //     fetchUserResponses();
// //   }, [companyId]);

// //   const handleFormSubmit = () => {
// //     // Fetch user responses again after the form is submitted
// //     fetchUserResponses();
// //     setShowForm(false); // Hide the form after submission
// //   };

// //   if (loading) return <div className='loading'>Loading...</div>;
// //   if (error) return <div className='error'>{error}</div>;

// //   return (
// //     <div className='responses-container'>
// //       {responses.length > 0 ? (
// //         <div className='responses-list'>
// //           {productFamilies.map((family) => {
// //             // Find the corresponding user response for the current product family
// //             const userResponse = responses.find(
// //               (response) => response.productFamily?._id === family._id
// //             );

// //             return (
// //               <div className='response-card' key={family._id}>
// //                 <h3>{family.family_name}</h3>
// //                 {userResponse ? (
// //                   <>
// //                     <strong>Selected Software:</strong>{' '}
// //                     {userResponse.selectedSoftware} <br />
// //                     {userResponse.otherSoftware && (
// //                       <>
// //                         <strong>Other Software:</strong>{' '}
// //                         {userResponse.otherSoftware} <br />
// //                       </>
// //                     )}
// //                   </>
// //                 ) : (
// //                   <div>No user preferences for this family.</div>
// //                 )}
// //               </div>
// //             );
// //           })}
// //         </div>
// //       ) : showForm ? ( // Display the form if no responses and the form state is true
// //         <div>
// //           <UserPreferencesForm
// //             className='user-form'
// //             companyId={companyId}
// //             onFormSubmit={handleFormSubmit}
// //           />
// //         </div>
// //       ) : (
// //         <div>No product families found.</div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserResponsesManager;
