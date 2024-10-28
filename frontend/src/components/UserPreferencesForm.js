import React, { useState, useEffect } from 'react';
import {
  getAllProductFamilies,
  addUserResponse,
} from '../api/productFamilyApi';
import './UserPreferencesForm.css';

const UserPreferencesForm = ({ companyId, onFormSubmit }) => {
  const [productFamilies, setProductFamilies] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductFamilies = async () => {
      try {
        const families = await getAllProductFamilies();
        setProductFamilies(families);
      } catch (err) {
        setError('Failed to fetch product families.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductFamilies();
  }, []);

  const handleInputChange = (familyId, field, value) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [familyId]: {
        ...prevPreferences[familyId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      for (const familyId in preferences) {
        const userResponse = {
          companyId,
          productFamily: familyId,
          selectedSoftware: preferences[familyId]?.selectedSoftware,
          otherSoftware: preferences[familyId]?.otherSoftware,
          notAvailable: preferences[familyId]?.notAvailable || false,
        };
        await addUserResponse(userResponse);
      }
      onFormSubmit(); // Callback after successful submission
    } catch (err) {
      setError('Failed to submit preferences.');
    }
  };

  if (loading) return <div className='loading'>Loading...</div>;
  if (error) return <div className='error'>{error}</div>;

  // Define the dropdown options for each product family
  const dropdownOptions = {
    'Data Discovery and Classification Tools': [
      'Microsoft Purview',
      'Varonis',
      'BigID',
      'Spirion',
      'Digital Guardian',
      'IBM Guardium',
    ],
    'Data Protection and Encryption': [
      'Symantec',
      'McAfee (now Trellix)',
      'Thales',
      'Vormetric',
      'Microsoft Azure Information Protection',
      'IBM Guardium Data Encryption',
      'Kaspersky Endpoint Security',
    ],
    'Data Loss Prevention (DLP)': [
      'Forcepoint',
      'Digital Guardian',
      'Symantec DLP',
      'Microsoft Defender for Endpoint',
      'Trend Micro DLP',
      'McAfee Total Protection for Data Loss Prevention',
    ],
    'Consent Management and Privacy Preference Centers': [
      'OneTrust',
      'TrustArc',
      'Didomi',
      'CookiePro',
      'Crownpeak',
      'Usercentrics',
    ],
    'Vendor Risk Management': [
      'BitSight',
      'SecurityScorecard',
      'RiskRecon',
      'Prevalent',
      'Aravo',
      'ProcessUnity',
    ],
  };

  // Filter out the default family (modify "Default Family" to the actual name to exclude)
  const filteredFamilies = productFamilies.filter(
    (family) => family.family_name !== 'Default Family' // Replace 'Default Family' with the actual name to exclude
  );

  return (
    <form onSubmit={handleSubmit} className='preferences-form'>
      <div className='families-grid'>
        {filteredFamilies.map((family) => (
          <div key={family._id.$oid} className='family-tile'>
            <h3>{family.family_name}</h3>
            <div className='input-group'>
              <label className='dropdown-label'>
                <strong>Select Software:</strong>
                <select
                  value={preferences[family._id.$oid]?.selectedSoftware || ''}
                  onChange={(e) =>
                    handleInputChange(
                      family._id.$oid,
                      'selectedSoftware',
                      e.target.value
                    )
                  }
                >
                  <option value=''>--Select Software--</option>
                  {dropdownOptions[family.family_name]?.map((software) => (
                    <option key={software} value={software}>
                      {software}
                    </option>
                  ))}
                  <option value='Others'>Others</option>
                </select>
              </label>
            </div>
            {preferences[family._id.$oid]?.selectedSoftware === 'Others' && (
              <div className='input-group'>
                <label className='other-software'>
                  <strong>Specify Other Software:</strong>
                  <input
                    type='text'
                    placeholder='Enter other software'
                    value={preferences[family._id.$oid]?.otherSoftware || ''}
                    onChange={(e) =>
                      handleInputChange(
                        family._id.$oid,
                        'otherSoftware',
                        e.target.value
                      )
                    }
                  />
                </label>
              </div>
            )}
            <div className='input-group'>
              <label className='not-available'>
                <input
                  type='checkbox'
                  checked={preferences[family._id.$oid]?.notAvailable || false}
                  onChange={(e) =>
                    handleInputChange(
                      family._id.$oid,
                      'notAvailable',
                      e.target.checked
                    )
                  }
                />
                Not Available
              </label>
            </div>
          </div>
        ))}
      </div>
      <button type='submit' className='submit-button'>
        Submit Preferences
      </button>
    </form>
  );
};

export default UserPreferencesForm;

// import React, { useState, useEffect } from 'react';
// import {
//   getAllProductFamilies,
//   addUserResponse,
// } from '../api/productFamilyApi';
// import './UserPreferencesForm.css';

// const UserPreferencesForm = ({ companyId, onFormSubmit }) => {
//   const [productFamilies, setProductFamilies] = useState([]);
//   const [preferences, setPreferences] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProductFamilies = async () => {
//       try {
//         const families = await getAllProductFamilies();
//         setProductFamilies(families);
//       } catch (err) {
//         setError('Failed to fetch product families.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductFamilies();
//   }, []);

//   const handleInputChange = (familyId, field, value) => {
//     setPreferences((prevPreferences) => ({
//       ...prevPreferences,
//       [familyId]: {
//         ...prevPreferences[familyId],
//         [field]: value,
//       },
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       for (const familyId in preferences) {
//         const userResponse = {
//           companyId,
//           productFamily: familyId,
//           selectedSoftware: preferences[familyId]?.selectedSoftware,
//           otherSoftware: preferences[familyId]?.otherSoftware,
//           notAvailable: preferences[familyId]?.notAvailable || false,
//         };
//         await addUserResponse(userResponse);
//       }
//       onFormSubmit(); // Callback after successful submission
//     } catch (err) {
//       setError('Failed to submit preferences.');
//     }
//   };

//   if (loading) return <div className='loading'>Loading...</div>;
//   if (error) return <div className='error'>{error}</div>;

//   // Define the dropdown options for each product family
//   const dropdownOptions = {
//     'Data Discovery and Classification Tools': [
//       'Microsoft Purview',
//       'Varonis',
//       'BigID',
//       'Spirion',
//       'Digital Guardian',
//       'IBM Guardium',
//     ],
//     'Data Protection and Encryption': [
//       'Symantec',
//       'McAfee (now Trellix)',
//       'Thales',
//       'Vormetric',
//       'Microsoft Azure Information Protection',
//       'IBM Guardium Data Encryption',
//       'Kaspersky Endpoint Security',
//     ],
//     'Data Loss Prevention (DLP)': [
//       'Forcepoint',
//       'Digital Guardian',
//       'Symantec DLP',
//       'Microsoft Defender for Endpoint',
//       'Trend Micro DLP',
//       'McAfee Total Protection for Data Loss Prevention',
//     ],
//     'Consent Management and Privacy Preference Centers': [
//       'OneTrust',
//       'TrustArc',
//       'Didomi',
//       'CookiePro',
//       'Crownpeak',
//       'Usercentrics',
//     ],
//     'Vendor Risk Management': [
//       'BitSight',
//       'SecurityScorecard',
//       'RiskRecon',
//       'Prevalent',
//       'Aravo',
//       'ProcessUnity',
//     ],
//   };

//   // Filter out the default family (modify "Default Family" to the actual name to exclude)
//   const filteredFamilies = productFamilies.filter(
//     (family) => family.family_name !== 'Default Family' // Replace 'Default Family' with the actual name to exclude
//   );

//   return (
//     <form onSubmit={handleSubmit} className='preferences-form'>
//       <div className='families-grid'>
//         {filteredFamilies.map((family) => (
//           <div key={family._id.$oid} className='family-tile'>
//             <h3>{family.family_name}</h3>
//             <label className='dropdown-label'>
//               <strong>Select Software:</strong>
//               <select
//                 value={preferences[family._id.$oid]?.selectedSoftware || ''}
//                 onChange={(e) =>
//                   handleInputChange(
//                     family._id.$oid,
//                     'selectedSoftware',
//                     e.target.value
//                   )
//                 }
//               >
//                 <option value=''>--Select Software--</option>
//                 {dropdownOptions[family.family_name]?.map((software) => (
//                   <option key={software} value={software}>
//                     {software}
//                   </option>
//                 ))}
//                 <option value='Others'>Others</option>
//               </select>
//             </label>
//             {preferences[family._id.$oid]?.selectedSoftware === 'Others' && (
//               <label className='other-software'>
//                 <strong>Specify Other Software:</strong>
//                 <input
//                   type='text'
//                   placeholder='Enter other software'
//                   value={preferences[family._id.$oid]?.otherSoftware || ''}
//                   onChange={(e) =>
//                     handleInputChange(
//                       family._id.$oid,
//                       'otherSoftware',
//                       e.target.value
//                     )
//                   }
//                 />
//               </label>
//             )}
//             <label className='not-available'>
//               <input
//                 type='checkbox'
//                 checked={preferences[family._id.$oid]?.notAvailable || false}
//                 onChange={(e) =>
//                   handleInputChange(
//                     family._id.$oid,
//                     'notAvailable',
//                     e.target.checked
//                   )
//                 }
//               />
//               Not Available
//             </label>
//           </div>
//         ))}
//       </div>
//       <button type='submit'>Submit Preferences</button>
//     </form>
//   );
// };

// export default UserPreferencesForm;

// // import React, { useState, useEffect } from 'react';
// // import {
// //   getAllProductFamilies,
// //   addUserResponse,
// // } from '../api/productFamilyApi';
// // import './UserPreferencesForm.css';

// // const UserPreferencesForm = ({ companyId, onFormSubmit }) => {
// //   const [productFamilies, setProductFamilies] = useState([]);
// //   const [preferences, setPreferences] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchProductFamilies = async () => {
// //       try {
// //         const families = await getAllProductFamilies();
// //         setProductFamilies(families);
// //       } catch (err) {
// //         setError('Failed to fetch product families.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProductFamilies();
// //   }, []);

// //   const handleInputChange = (familyId, field, value) => {
// //     setPreferences((prevPreferences) => ({
// //       ...prevPreferences,
// //       [familyId]: {
// //         ...prevPreferences[familyId],
// //         [field]: value,
// //       },
// //     }));
// //   };

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();
// //     try {
// //       for (const familyId in preferences) {
// //         const userResponse = {
// //           companyId,
// //           productFamily: familyId,
// //           selectedSoftware: preferences[familyId]?.selectedSoftware,
// //           otherSoftware: preferences[familyId]?.otherSoftware,
// //           notAvailable: preferences[familyId]?.notAvailable || false,
// //         };
// //         await addUserResponse(userResponse);
// //       }
// //       onFormSubmit(); // Callback after successful submission
// //     } catch (err) {
// //       setError('Failed to submit preferences.');
// //     }
// //   };

// //   if (loading) return <div className='loading'>Loading...</div>;
// //   if (error) return <div className='error'>{error}</div>;

// //   // Define the dropdown options for each product family
// //   const dropdownOptions = {
// //     'Data Discovery and Classification Tools': [
// //       'Microsoft Purview',
// //       'Varonis',
// //       'BigID',
// //       'Spirion',
// //       'Digital Guardian',
// //       'IBM Guardium',
// //     ],
// //     'Data Protection and Encryption': [
// //       'Symantec',
// //       'McAfee (now Trellix)',
// //       'Thales',
// //       'Vormetric',
// //       'Microsoft Azure Information Protection',
// //       'IBM Guardium Data Encryption',
// //       'Kaspersky Endpoint Security',
// //     ],
// //     'Data Loss Prevention (DLP)': [
// //       'Forcepoint',
// //       'Digital Guardian',
// //       'Symantec DLP',
// //       'Microsoft Defender for Endpoint',
// //       'Trend Micro DLP',
// //       'McAfee Total Protection for Data Loss Prevention',
// //     ],
// //     'Consent Management and Privacy Preference Centers': [
// //       'OneTrust',
// //       'TrustArc',
// //       'Didomi',
// //       'CookiePro',
// //       'Crownpeak',
// //       'Usercentrics',
// //     ],
// //     'Vendor Risk Management': [
// //       'BitSight',
// //       'SecurityScorecard',
// //       'RiskRecon',
// //       'Prevalent',
// //       'Aravo',
// //       'ProcessUnity',
// //     ],
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className='preferences-form'>
// //       <div className='families-grid'>
// //         {productFamilies.map((family) => (
// //           <div key={family._id.$oid} className='family-tile'>
// //             <h3>{family.family_name}</h3>
// //             <label className='dropdown-label'>
// //               <strong>Select Software:</strong>
// //               <select
// //                 value={preferences[family._id.$oid]?.selectedSoftware || ''}
// //                 onChange={(e) =>
// //                   handleInputChange(
// //                     family._id.$oid,
// //                     'selectedSoftware',
// //                     e.target.value
// //                   )
// //                 }
// //               >
// //                 <option value=''>--Select Software--</option>
// //                 {dropdownOptions[family.family_name]?.map((software) => (
// //                   <option key={software} value={software}>
// //                     {software}
// //                   </option>
// //                 ))}
// //                 <option value='Others'>Others</option>
// //               </select>
// //             </label>
// //             {preferences[family._id.$oid]?.selectedSoftware === 'Others' && (
// //               <label className='other-software'>
// //                 <strong>Specify Other Software:</strong>
// //                 <input
// //                   type='text'
// //                   placeholder='Enter other software'
// //                   value={preferences[family._id.$oid]?.otherSoftware || ''}
// //                   onChange={(e) =>
// //                     handleInputChange(
// //                       family._id.$oid,
// //                       'otherSoftware',
// //                       e.target.value
// //                     )
// //                   }
// //                 />
// //               </label>
// //             )}
// //             <label className='not-available'>
// //               <input
// //                 type='checkbox'
// //                 checked={preferences[family._id.$oid]?.notAvailable || false}
// //                 onChange={(e) =>
// //                   handleInputChange(
// //                     family._id.$oid,
// //                     'notAvailable',
// //                     e.target.checked
// //                   )
// //                 }
// //               />
// //               Not Available
// //             </label>
// //           </div>
// //         ))}
// //       </div>
// //       <button type='submit'>Submit Preferences</button>
// //     </form>
// //   );
// // };

// // export default UserPreferencesForm;

// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   getAllProductFamilies,
// // //   addUserResponse,
// // // } from '../api/productFamilyApi';
// // // import './UserPreferencesForm.css';

// // // const UserPreferencesForm = ({ companyId, onFormSubmit }) => {
// // //   const [productFamilies, setProductFamilies] = useState([]);
// // //   const [preferences, setPreferences] = useState({});
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   useEffect(() => {
// // //     const fetchProductFamilies = async () => {
// // //       try {
// // //         const families = await getAllProductFamilies();
// // //         setProductFamilies(families);
// // //       } catch (err) {
// // //         setError('Failed to fetch product families.');
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchProductFamilies();
// // //   }, []);

// // //   const handleInputChange = (familyId, field, value) => {
// // //     setPreferences((prevPreferences) => ({
// // //       ...prevPreferences,
// // //       [familyId]: {
// // //         ...prevPreferences[familyId],
// // //         [field]: value,
// // //       },
// // //     }));
// // //   };

// // //   const handleSubmit = async (event) => {
// // //     event.preventDefault();
// // //     try {
// // //       for (const familyId in preferences) {
// // //         const userResponse = {
// // //           companyId,
// // //           productFamily: familyId,
// // //           selectedSoftware: preferences[familyId]?.selectedSoftware,
// // //           otherSoftware: preferences[familyId]?.otherSoftware,
// // //           notAvailable: preferences[familyId]?.notAvailable || false,
// // //         };
// // //         await addUserResponse(userResponse);
// // //       }
// // //       onFormSubmit(); // Callback after successful submission
// // //     } catch (err) {
// // //       setError('Failed to submit preferences.');
// // //     }
// // //   };

// // //   if (loading) return <div className='loading'>Loading...</div>;
// // //   if (error) return <div className='error'>{error}</div>;

// // //   return (
// // //     <form onSubmit={handleSubmit} className='preferences-form'>
// // //       <div className='families-grid'>
// // //         {productFamilies.map((family) => (
// // //           <div key={family._id.$oid} className='family-tile'>
// // //             <h3>{family.family_name}</h3>
// // //             <label className='dropdown-label'>
// // //               <strong>Select Software:</strong>
// // //               <select
// // //                 value={preferences[family._id.$oid]?.selectedSoftware || ''}
// // //                 onChange={(e) =>
// // //                   handleInputChange(
// // //                     family._id.$oid,
// // //                     'selectedSoftware',
// // //                     e.target.value
// // //                   )
// // //                 }
// // //               >
// // //                 <option value=''>--Select Software--</option>
// // //                 {family.software_list.map((software) => (
// // //                   <option
// // //                     key={software._id.$oid}
// // //                     value={software.software_name}
// // //                   >
// // //                     {software.software_name}
// // //                   </option>
// // //                 ))}
// // //                 <option value='Others'>Others</option>
// // //               </select>
// // //             </label>
// // //             {preferences[family._id.$oid]?.selectedSoftware === 'Others' && (
// // //               <label className='other-software'>
// // //                 <strong>Specify Other Software:</strong>
// // //                 <input
// // //                   type='text'
// // //                   placeholder='Enter other software'
// // //                   value={preferences[family._id.$oid]?.otherSoftware || ''}
// // //                   onChange={(e) =>
// // //                     handleInputChange(
// // //                       family._id.$oid,
// // //                       'otherSoftware',
// // //                       e.target.value
// // //                     )
// // //                   }
// // //                 />
// // //               </label>
// // //             )}
// // //             <label className='not-available'>
// // //               <input
// // //                 type='checkbox'
// // //                 checked={preferences[family._id.$oid]?.notAvailable || false}
// // //                 onChange={(e) =>
// // //                   handleInputChange(
// // //                     family._id.$oid,
// // //                     'notAvailable',
// // //                     e.target.checked
// // //                   )
// // //                 }
// // //               />
// // //               Not Available
// // //             </label>
// // //           </div>
// // //         ))}
// // //       </div>
// // //       <button type='submit'>Submit Preferences</button>
// // //     </form>
// // //   );
// // // };

// // // export default UserPreferencesForm;

// // // // import React, { useState, useEffect } from 'react';
// // // // import {
// // // //   getAllProductFamilies,
// // // //   addUserResponse,
// // // // } from '../api/productFamilyApi';
// // // // import './UserPreferencesForm.css';

// // // // const UserPreferencesForm = ({ companyId, onFormSubmit }) => {
// // // //   const [productFamilies, setProductFamilies] = useState([]);
// // // //   const [preferences, setPreferences] = useState({});
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState(null);

// // // //   useEffect(() => {
// // // //     const fetchProductFamilies = async () => {
// // // //       try {
// // // //         const families = await getAllProductFamilies();
// // // //         setProductFamilies(families);
// // // //       } catch (err) {
// // // //         setError('Failed to fetch product families.');
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchProductFamilies();
// // // //   }, []);

// // // //   const handleInputChange = (familyId, field, value) => {
// // // //     setPreferences((prevPreferences) => ({
// // // //       ...prevPreferences,
// // // //       [familyId]: {
// // // //         ...prevPreferences[familyId],
// // // //         [field]: value,
// // // //       },
// // // //     }));
// // // //   };

// // // //   const handleSubmit = async (event) => {
// // // //     event.preventDefault();
// // // //     try {
// // // //       for (const familyId in preferences) {
// // // //         const userResponse = {
// // // //           companyId,
// // // //           productFamily: familyId,
// // // //           selectedSoftware: preferences[familyId]?.selectedSoftware,
// // // //           otherSoftware: preferences[familyId]?.otherSoftware,
// // // //           notAvailable: preferences[familyId]?.notAvailable || false, // Add notAvailable field
// // // //         };
// // // //         await addUserResponse(userResponse);
// // // //       }
// // // //       onFormSubmit(); // Callback after successful submission
// // // //     } catch (err) {
// // // //       setError('Failed to submit preferences.');
// // // //     }
// // // //   };

// // // //   if (loading) return <div className='loading'>Loading...</div>;
// // // //   if (error) return <div className='error'>{error}</div>;

// // // //   return (
// // // //     <form onSubmit={handleSubmit} className='preferences-form'>
// // // //       <div className='families-grid'>
// // // //         {productFamilies.map((family) => (
// // // //           <div key={family._id} className='family-tile'>
// // // //             <h3>{family.family_name}</h3>
// // // //             <div className='options-grid'>
// // // //               <label className='dropdown-label'>
// // // //                 <strong>Select Software:</strong>
// // // //                 <select
// // // //                   value={preferences[family._id]?.selectedSoftware || ''}
// // // //                   onChange={(e) =>
// // // //                     handleInputChange(
// // // //                       family._id,
// // // //                       'selectedSoftware',
// // // //                       e.target.value
// // // //                     )
// // // //                   }
// // // //                 >
// // // //                   <option value=''>--Select Software--</option>
// // // //                   {family.softwareList.map(
// // // //                     (
// // // //                       software // Assuming softwareList is available in family object
// // // //                     ) => (
// // // //                       <option key={software} value={software}>
// // // //                         {software}
// // // //                       </option>
// // // //                     )
// // // //                   )}
// // // //                   <option value='Others'>Others</option>
// // // //                 </select>
// // // //               </label>
// // // //               {preferences[family._id]?.selectedSoftware === 'Others' && (
// // // //                 <label className='other-software'>
// // // //                   <strong>Specify Other Software:</strong>
// // // //                   <input
// // // //                     type='text'
// // // //                     placeholder='Enter other software'
// // // //                     value={preferences[family._id]?.otherSoftware || ''}
// // // //                     onChange={(e) =>
// // // //                       handleInputChange(
// // // //                         family._id,
// // // //                         'otherSoftware',
// // // //                         e.target.value
// // // //                       )
// // // //                     }
// // // //                   />
// // // //                 </label>
// // // //               )}
// // // //             </div>
// // // //             <label className='not-available'>
// // // //               <input
// // // //                 type='checkbox'
// // // //                 checked={preferences[family._id]?.notAvailable || false}
// // // //                 onChange={(e) =>
// // // //                   handleInputChange(
// // // //                     family._id,
// // // //                     'notAvailable',
// // // //                     e.target.checked
// // // //                   )
// // // //                 }
// // // //               />
// // // //               Not Available
// // // //             </label>
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //       <button type='submit'>Submit Preferences</button>
// // // //     </form>
// // // //   );
// // // // };

// // // // export default UserPreferencesForm;

// // // // // import React, { useState, useEffect } from 'react';
// // // // // import {
// // // // //   getAllProductFamilies,
// // // // //   addUserResponse,
// // // // // } from '../api/productFamilyApi';
// // // // // import './UserPreferencesForm.css';

// // // // // const UserPreferencesForm = ({ companyId, onFormSubmit }) => {
// // // // //   const [productFamilies, setProductFamilies] = useState([]);
// // // // //   const [preferences, setPreferences] = useState({});
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [error, setError] = useState(null);

// // // // //   // Options for selecting software
// // // // //   const softwareOptions = [
// // // // //     'Microsoft Tools',
// // // // //     'Other Software',
// // // // //     'None of these',
// // // // //     'Others',
// // // // //   ];

// // // // //   useEffect(() => {
// // // // //     const fetchProductFamilies = async () => {
// // // // //       try {
// // // // //         const families = await getAllProductFamilies();
// // // // //         setProductFamilies(families);
// // // // //       } catch (err) {
// // // // //         setError('Failed to fetch product families.');
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     };

// // // // //     fetchProductFamilies();
// // // // //   }, []);

// // // // //   const handleInputChange = (familyId, field, value) => {
// // // // //     setPreferences((prevPreferences) => ({
// // // // //       ...prevPreferences,
// // // // //       [familyId]: {
// // // // //         ...prevPreferences[familyId],
// // // // //         [field]: value,
// // // // //       },
// // // // //     }));
// // // // //   };

// // // // //   const handleSubmit = async (event) => {
// // // // //     event.preventDefault();
// // // // //     try {
// // // // //       for (const familyId in preferences) {
// // // // //         const userResponse = {
// // // // //           companyId,
// // // // //           productFamily: familyId,
// // // // //           selectedSoftware: preferences[familyId]?.selectedSoftware,
// // // // //           otherSoftware: preferences[familyId]?.otherSoftware,
// // // // //         };
// // // // //         await addUserResponse(userResponse);
// // // // //       }
// // // // //       onFormSubmit(); // Callback after successful submission
// // // // //     } catch (err) {
// // // // //       setError('Failed to submit preferences.');
// // // // //     }
// // // // //   };

// // // // //   if (loading) return <div className='loading'>Loading...</div>;
// // // // //   if (error) return <div className='error'>{error}</div>;

// // // // //   return (
// // // // //     <form onSubmit={handleSubmit} className='preferences-form'>
// // // // //       <div className='families-grid'>
// // // // //         {productFamilies.map((family) => (
// // // // //           <div key={family._id} className='family-tile'>
// // // // //             <h3>{family.family_name}</h3>
// // // // //             <div className='options-grid'>
// // // // //               {softwareOptions.map((option) => (
// // // // //                 <label key={option} className='checkbox-option'>
// // // // //                   <input
// // // // //                     type='radio'
// // // // //                     name={`software-${family._id}`}
// // // // //                     value={option}
// // // // //                     checked={
// // // // //                       preferences[family._id]?.selectedSoftware === option
// // // // //                     }
// // // // //                     onChange={() =>
// // // // //                       handleInputChange(family._id, 'selectedSoftware', option)
// // // // //                     }
// // // // //                   />
// // // // //                   {option}
// // // // //                 </label>
// // // // //               ))}
// // // // //             </div>
// // // // //             {preferences[family._id]?.selectedSoftware === 'Others' && (
// // // // //               <label className='other-software'>
// // // // //                 <strong>Specify Other Software:</strong>
// // // // //                 <input
// // // // //                   type='text'
// // // // //                   placeholder='Enter other software'
// // // // //                   value={preferences[family._id]?.otherSoftware || ''}
// // // // //                   onChange={(e) =>
// // // // //                     handleInputChange(
// // // // //                       family._id,
// // // // //                       'otherSoftware',
// // // // //                       e.target.value
// // // // //                     )
// // // // //                   }
// // // // //                 />
// // // // //               </label>
// // // // //             )}
// // // // //           </div>
// // // // //         ))}
// // // // //       </div>
// // // // //       <button type='submit'>Submit Preferences</button>
// // // // //     </form>
// // // // //   );
// // // // // };

// // // // // export default UserPreferencesForm;
