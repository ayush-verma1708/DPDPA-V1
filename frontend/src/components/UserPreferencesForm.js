// src/components/UserPreferencesForm.js
import React, { useState, useEffect } from 'react';
import { addUserResponses } from '../api/userResonseApi';
import { getAllProductFamilies } from '../api/productFamilyApi';

const UserPreferencesForm = ({ companyId, onFormSubmit }) => {
  const [responses, setResponses] = useState([
    { productFamilyId: '', selectedSoftware: '', otherSoftware: '' },
  ]);
  const [productFamilies, setProductFamilies] = useState([]);
  const [error, setError] = useState(null);

  // Fetch product families when the component mounts
  useEffect(() => {
    const fetchProductFamilies = async () => {
      try {
        const data = await getAllProductFamilies();
        setProductFamilies(data);
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

  // Handle adding a new response section
  const addResponseField = () => {
    setResponses([
      ...responses,
      { productFamilyId: '', selectedSoftware: '', otherSoftware: '' },
    ]);
  };

  // Handle removing a response section
  const removeResponseField = (index) => {
    const updatedResponses = responses.filter((_, i) => i !== index);
    setResponses(updatedResponses);
  };

  // Handle form submission for adding responses
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUserResponses(companyId, responses);
      setError(null); // Clear any previous errors
      onFormSubmit(); // Callback function to update parent state
    } catch (err) {
      setError(err.message || 'Error adding responses');
    }
  };

  return (
    <div>
      <h2>Add User Preferences</h2>
      <form onSubmit={handleSubmit}>
        <h3>Responses</h3>
        {responses.map((response, index) => {
          // Find the selected product family
          const selectedFamily = productFamilies.find(
            (family) => family._id === response.productFamilyId
          );

          return (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
              }}
            >
              <div>
                <label>Product Family:</label>
                <select
                  value={response.productFamilyId}
                  onChange={(e) =>
                    handleResponseChange(
                      index,
                      'productFamilyId',
                      e.target.value
                    )
                  }
                  required
                >
                  <option value=''>Select Product Family</option>
                  {productFamilies.map((family) => (
                    <option key={family._id} value={family._id}>
                      {family.family_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Selected Software:</label>
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
                >
                  <option value=''>Select Software</option>
                  {selectedFamily &&
                    selectedFamily.software_list.map((software) => (
                      <option key={software._id} value={software.software_name}>
                        {software.software_name}
                      </option>
                    ))}
                  <option value='Others'>Others</option>
                </select>
              </div>
              {response.selectedSoftware === 'Others' && (
                <div>
                  <label>Other Software:</label>
                  <input
                    type='text'
                    value={response.otherSoftware}
                    onChange={(e) =>
                      handleResponseChange(
                        index,
                        'otherSoftware',
                        e.target.value
                      )
                    }
                  />
                </div>
              )}
              <button type='button' onClick={() => removeResponseField(index)}>
                Remove
              </button>
            </div>
          );
        })}

        <button type='button' onClick={addResponseField}>
          Add Another Response
        </button>
        <button type='submit'>Add Preferences</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UserPreferencesForm;

// // src/components/UserPreferencesForm.js
// import React, { useState, useEffect } from 'react';
// import { addUserResponses } from '../api/userResonseApi';
// import { getAllProductFamilies } from '../api/productFamilyApi';

// const UserPreferencesForm = ({ companyId, onFormSubmit }) => {
//   const [responses, setResponses] = useState([
//     { productFamilyId: '', selectedSoftware: '', otherSoftware: '' },
//   ]);
//   const [productFamilies, setProductFamilies] = useState([]); // To store product family options
//   const [error, setError] = useState(null);

//   // Fetch product families when the component mounts
//   useEffect(() => {
//     const fetchProductFamilies = async () => {
//       try {
//         const data = await getAllProductFamilies();
//         setProductFamilies(data);
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

//   // Handle adding a new response section
//   const addResponseField = () => {
//     setResponses([
//       ...responses,
//       { productFamilyId: '', selectedSoftware: '', otherSoftware: '' },
//     ]);
//   };

//   // Handle removing a response section
//   const removeResponseField = (index) => {
//     const updatedResponses = responses.filter((_, i) => i !== index);
//     setResponses(updatedResponses);
//   };

//   // Handle form submission for adding responses
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addUserResponses(companyId, responses);
//       setError(null); // Clear any previous errors
//       onFormSubmit(); // Callback function to update parent state
//     } catch (err) {
//       setError(err.message || 'Error adding responses');
//     }
//   };

//   return (
//     <div>
//       <h2>Add User Preferences</h2>
//       <form onSubmit={handleSubmit}>
//         <h3>Responses</h3>
//         {responses.map((response, index) => (
//           <div
//             key={index}
//             style={{
//               border: '1px solid #ccc',
//               padding: '10px',
//               marginBottom: '10px',
//             }}
//           >
//             <div>
//               <label>Product Family:</label>
//               <select
//                 value={response.productFamilyId}
//                 onChange={(e) =>
//                   handleResponseChange(index, 'productFamilyId', e.target.value)
//                 }
//                 required
//               >
//                 <option value=''>Select Product Family</option>
//                 {productFamilies.map((family) => (
//                   <option key={family._id} value={family._id}>
//                     {family.family_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Selected Software:</label>
//               <select
//                 value={response.selectedSoftware}
//                 onChange={(e) =>
//                   handleResponseChange(
//                     index,
//                     'selectedSoftware',
//                     e.target.value
//                   )
//                 }
//                 required
//               >
//                 <option value=''>Select Software</option>
//                 <option value='Microsoft'>Microsoft</option>
//                 <option value='ABC Software'>ABC Software</option>
//                 <option value='None of these'>None of these</option>
//                 <option value='Others'>Others</option>
//               </select>
//             </div>
//             {response.selectedSoftware === 'Others' && (
//               <div>
//                 <label>Other Software:</label>
//                 <input
//                   type='text'
//                   value={response.otherSoftware}
//                   onChange={(e) =>
//                     handleResponseChange(index, 'otherSoftware', e.target.value)
//                   }
//                 />
//               </div>
//             )}
//             <button type='button' onClick={() => removeResponseField(index)}>
//               Remove
//             </button>
//           </div>
//         ))}

//         <button type='button' onClick={addResponseField}>
//           Add Another Response
//         </button>
//         <button type='submit'>Add Preferences</button>
//       </form>

//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };

// export default UserPreferencesForm;
