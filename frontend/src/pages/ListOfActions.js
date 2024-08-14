
import React, { useState, useEffect } from 'react';
import { getControlFamilies } from '../api/controlFamilyAPI';
import { fetchActions } from '../api/actionAPI';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert, Select, MenuItem, Tooltip
} from '@mui/material';
import Loading from '../components/Loading';
import '../styles/ListOfActions.css';
import axios from 'axios';

import { getAssetDetails } from '../api/assetDetailsApi'; // Ensure this is correctly imported


const ListOfActions = () => {
  const [controlFamilies, setControlFamilies] = useState([]);
  const [controls, setControls] = useState([]);
  const [actions, setActions] = useState([]);
  const [expandedFamilyId, setExpandedFamilyId] = useState('');
  const [selectedControlId, setSelectedControlId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);


// Asset
  const [assets, setAssets] = useState([]);
  const [scopes, setScopes] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedScopeId, setSelectedScopeId] = useState('');
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState('');
  // Notification state
  const [notification, setNotification] = useState({ message: '', severity: 'info' });
// Control Families
  useEffect(() => {
    const getControlFamiliesData = async () => {
      setLoading(true);
      try {
        const familyResponse = await getControlFamilies();
        if (Array.isArray(familyResponse)) {
          setControlFamilies(familyResponse);
        } else {
          throw new Error('No data found for control families');
        }
      } catch (err) {
        setError('Failed to fetch control families. Please try again later.');
        console.error('Control Families Fetch Error:', err); // Log error details
      } finally {
        setLoading(false);
      }
    };
    getControlFamiliesData();
  }, []);


  // Controls
  useEffect(() => {
    const fetchControlData = async () => {
      if (controlFamilies.length) {
        setLoading(true);
        try {
          const updatedControls = controlFamilies.flatMap(family => family.controls);
          setControls(updatedControls);
        } catch (err) {
          setError('Failed to fetch controls. Please try again later.');
          console.error('Controls Fetch Error:', err); // Log error details
        } finally {
          setLoading(false);
        }
      }
    };
    fetchControlData();
  }, [controlFamilies]);


  //Actions
  useEffect(() => {
    const fetchActionData = async () => {
      if (selectedControlId) {
        setLoading(true);
        try {
          const actionResponse = await fetchActions();
          if (Array.isArray(actionResponse)) {
            const filteredActions = actionResponse.filter(action => action.control_Id._id === selectedControlId);
            setActions(filteredActions);
          } else {
            throw new Error('Actions data is not an array');
          }
        } catch (err) {
          setError('Failed to fetch actions. Please try again later.');
          console.error('Actions Fetch Error:', err); // Log error details
        } finally {
          setLoading(false);
        }
      } else {
        setActions([]);
      }
    };
    fetchActionData();
  }, [selectedControlId]);



  // Fetch asset details
  useEffect(() => {
    const fetchAssetDetails = async () => {
      setLoading(true);
      try {
        const response = await getAssetDetails();
        if (Array.isArray(response)) {
          setAssets(response);
        } else {
          throw new Error('Failed to fetch asset details');
        }
      } catch (err) {
        setError('Failed to fetch asset details. Please try again later.');
        console.error('Asset Details Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssetDetails();
  }, []);

  // Update scopes based on selected asset
  useEffect(() => {
    if (selectedAssetId) {
      const selectedAsset = assets.find(asset => asset._id === selectedAssetId);
      if (selectedAsset && selectedAsset.asset.isScoped) {
        setScopes([selectedAsset.scoped]);
        setSelectedScopeId(selectedAsset.scoped._id);
      } else {
        setScopes([]);
        setSelectedScopeId('');
      }
    } else {
      setScopes([]);
      setSelectedScopeId('');
    }
  }, [selectedAssetId, assets]);

  const handleAssetChange = (event) => {
    setSelectedAssetId(event.target.value);
  };

  const handleScopeChange = (event) => {
    setSelectedScopeId(event.target.value);
  };


  const handleFamilyClick = (familyId) => {
    setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
  };

  const handleControlClick = (controlId) => {
    setSelectedControlId(controlId);
  };


  const handleMarkAsCompleted = async (actionId) => {
    try {
      // Find the action by its ID
      const action = actions.find(a => a._id === actionId);
  
      // Check if the action is already marked as completed
      if (action && action.isCompleted) {
        setNotification({ message: 'This action is already marked as completed.', severity: 'info' });
        return; // Exit the function early if the action is already completed
      }
  
      // Simulate a completion entry (replace with actual API call)
      const completionEntry = {
        username: 'dummyUser',
        familyId: expandedFamilyId,
        controlId: selectedControlId,
        assetId: selectedAssetId,
        // scopeId: selectedScopeId || null,
        ...(selectedScopeId && { scopeId: selectedScopeId }),
        actionId: actionId,
      };
  
      console.log('Completion Entry:', completionEntry);
  
      // Simulate marking the action as completed (replace with actual API call)
      const response = await axios.post(`http://localhost:8021/api/v1/completion-status`, completionEntry);
  
      if (response.status === 200) {
        setNotification({ message: 'Action marked as completed!', severity: 'success' });
        // Refetch actions for the selected control to update UI
        const updatedActionsResponse = await fetchActions();
        if (Array.isArray(updatedActionsResponse)) {
          setActions(updatedActionsResponse.filter(action => action.control_Id._id === selectedControlId));
        } else {
          throw new Error('Failed to refetch actions.');
        }
      } else {
        throw new Error('Failed to mark action as completed.');
      }
    } catch (error) {
      setNotification({ message: 'Failed to mark action as completed. Please try again later.', severity: 'error' });
      console.error('Mark as Completed Error:', error); // Log error details
    }
  };
  
  

const checkCompletionStatus = async (actionId, assetId, scopeId, controlId, familyId) => {
  try {
    const response = await axios.get('http://localhost:8021/api/v1/completion-status', {
      params: {
        actionId,
        assetId,
        scopeId,
        controlId,
        familyId,
      },
    });
    return response.data ? true : false;
  } catch (error) {
    console.error('Error fetching completion status:', error);
    return false;
  }
};

  const handleFileUpload = async (event, actionId) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setNotification({ message: 'File uploaded successfully!', severity: 'success' });
        // Refetch actions for the selected control
        const updatedActionsResponse = await fetchActions();
        if (Array.isArray(updatedActionsResponse)) {
          setActions(updatedActionsResponse.filter(action => action.control_Id._id === selectedControlId));
        } else {
          throw new Error('Failed to refetch actions.');
        }
      } else {
        throw new Error('Failed to upload file.');
      }
    } catch (error) {
      setNotification({ message: 'Failed to upload file. Please try again later.', severity: 'error' });
      console.error('File Upload Error:', error); // Log error details
    }
  };

  const handleSnackbarClose = () => {
    setNotification({ message: '', severity: 'info' });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="new-page">
         <div className="page-container">
      <div className="Asset-container">
        {/* Dropdown for Assets */}
        <Select
          value={selectedAssetId}
          onChange={handleAssetChange}
          displayEmpty
          renderValue={(value) => value ? `Asset: ${assets.find(asset => asset._id === value).asset.name}` : 'Select Asset'}
        >
          {assets.map(asset => (
            <MenuItem key={asset._id} value={asset._id}>
              {asset.asset.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="Scope-container">
        {/* Dropdown for Scopes */}
        <Select
          value={selectedScopeId}
          onChange={handleScopeChange}
          displayEmpty
          renderValue={(value) => value ? `Scope: ${scopes.find(scope => scope._id === value)?.name}` : 'Select Scope'}
          disabled={!selectedAssetId || scopes.length === 0}
        >
          {scopes.map(scope => (
            <MenuItem key={scope._id} value={scope._id}>
              {scope.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      <Snackbar open={!!notification.message} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
    
      <div className="sidebar">
        {controlFamilies.map(family => (
          <div key={family._id} className={`control-family ${expandedFamilyId === family._id ? 'expanded' : ''}`}>
            <Tooltip title={family.description} placement="right">
              <div
                className={`control-family-header ${expandedFamilyId === family._id ? 'expanded' : ''} ${expandedFamilyId === family._id ? 'selected-family' : ''}`}
                onClick={() => handleFamilyClick(family._id)}
              >
                Chapter {family.variable_id}
              </div>
            </Tooltip>
            {expandedFamilyId === family._id && (
              <div className="controls">
                {family.controls.map(control => (
                  <Tooltip key={control._id} title={control.section_desc} placement="right">
                    <div
                      className={`control ${selectedControlId === control._id ? 'selected-control' : ''}`}
                      onClick={() => handleControlClick(control._id)}
                    >
                      {control.section}
                    </div>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="content">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Completion Status</TableCell>
                <TableCell>Upload File</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {actions.map(action => (
                <TableRow key={action._id}>
                  <TableCell>{action.variable_id}</TableCell>
                  <TableCell>{action.description}</TableCell>
                  <TableCell>
                    {action.file && (
                      <a href={action.file.url} target="_blank" rel="noopener noreferrer">
                        {action.file.name}
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {action.isCompleted ? (
                      <Button variant="contained" color="success" disabled>
                        Completed
                      </Button>
                    ) : (
                      <Button variant="contained" color="primary" onClick={() => handleMarkAsCompleted(action._id)}>
                        Mark as Completed
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, action._id)}
                      disabled={action.isCompleted}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      
      {error && <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>}

      <Snackbar open={!!notification.message} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ListOfActions;

// const fetchCompletionStatus = async (actionId, assetId, scopeId, controlId, familyId) => {
  //   try {
  //     const response = await axios.get('http://localhost:8021/api/v1/completion-status', {
  //       params: {
  //         actionId,
  //         assetId,
  //         scopeId,
  //         controlId,
  //         familyId,
  //       },
  //     });
  
  //     if (response.status === 200 && response.data) {
  //       console.log('Completion Status:', response.data);
  //       return response.data;
  //     } else {
  //       console.log('No matching completion status found.');
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error('Error fetching completion status:', error);
  //     return null;
  //   }
  // };
  

  // const handleMarkAsCompleted = async (actionId) => {
     
  //     try {
  //       // Simulate a completion entry (replace with actual API call)
  //       const completionEntry = {
  //         username: 'dummyUser',
  //         familyId: expandedFamilyId,
  //         controlId: selectedControlId,
  //         assetId: selectedAssetId,
  //         scopeId: selectedScopeId,
  //         actionId: actionId,
  //       };
  
  //       console.log('Completion Entry:', completionEntry);
  
  //       // Simulate marking the action as completed (replace with actual API call)
  //       const response = await axios.post(`http://localhost:8021/api/v1/completion-status`, completionEntry);
  
  //       if (response.status === 200) {
  //         setNotification({ message: 'Action marked as completed!', severity: 'success' });
  //         // Refetch actions for the selected control to update UI
  //         const updatedActionsResponse = await fetchActions();
  //         if (Array.isArray(updatedActionsResponse)) {
  //           setActions(updatedActionsResponse.filter(action => action.control_Id._id === selectedControlId));
  //         } else {
  //           throw new Error('Failed to refetch actions.');
  //         }
  //       } else {
  //         throw new Error('Failed to mark action as completed.');
  //       }
  //     } catch (error) {
  //       setNotification({ message: 'Failed to mark action as completed. Please try again later.', severity: 'error' });
  //       console.error('Mark as Completed Error:', error); // Log error details
  //     }
  //   };


// import React, { useState, useEffect } from 'react';
// import { getControlFamilies } from '../api/controlFamilyAPI';
// import { fetchActions } from '../api/actionAPI';
// import { getAssetDetails, getScopedInAsset } from '../api/assetDetailsApi';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert, Select, MenuItem, Tooltip
// } from '@mui/material';
// import Loading from '../components/Loading';
// import '../styles/ListOfActions.css';
// import axios from 'axios';

// const ListOfActions = () => {
//   const [controlFamilies, setControlFamilies] = useState([]);
//   const [controls, setControls] = useState([]);
//   const [actions, setActions] = useState([]);
//   const [expandedFamilyId, setExpandedFamilyId] = useState('');
//   const [selectedControlId, setSelectedControlId] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   // Asset and scope states
//   const [assets, setAssets] = useState([]);
//   const [scopes, setScopes] = useState([]);
//   const [selectedAsset, setSelectedAsset] = useState('');
//   const [selectedScope, setSelectedScope] = useState('');

//   // Notification state
//   const [notification, setNotification] = useState({ message: '', severity: 'info' });

//   useEffect(() => {
//     const getControlFamiliesData = async () => {
//       setLoading(true);
//       try {
//         const familyResponse = await getControlFamilies();
//         if (Array.isArray(familyResponse)) {
//           setControlFamilies(familyResponse);
//         } else {
//           throw new Error('No data found for control families');
//         }
//       } catch (err) {
//         setError('Failed to fetch control families. Please try again later.');
//         console.error('Control Families Fetch Error:', err); // Log error details
//       } finally {
//         setLoading(false);
//       }
//     };
//     getControlFamiliesData();
//   }, []);

//   useEffect(() => {
//     const fetchControlData = async () => {
//       if (controlFamilies.length) {
//         setLoading(true);
//         try {
//           const updatedControls = controlFamilies.flatMap(family => family.controls);
//           setControls(updatedControls);
//         } catch (err) {
//           setError('Failed to fetch controls. Please try again later.');
//           console.error('Controls Fetch Error:', err); // Log error details
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchControlData();
//   }, [controlFamilies]);

//   useEffect(() => {
//     const fetchActionData = async () => {
//       if (selectedControlId) {
//         setLoading(true);
//         try {
//           const actionResponse = await fetchActions();
//           if (Array.isArray(actionResponse)) {
//             const filteredActions = actionResponse.filter(action => action.control_Id._id === selectedControlId);
//             setActions(filteredActions);
//           } else {
//             throw new Error('Actions data is not an array');
//           }
//         } catch (err) {
//           setError('Failed to fetch actions. Please try again later.');
//           console.error('Actions Fetch Error:', err); // Log error details
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setActions([]);
//       }
//     };
//     fetchActionData();
//   }, [selectedControlId]);

//   useEffect(() => {
//     const fetchAssetData = async () => {
//       try {
//         const assetResponse = await getAssetDetails();
//         if (Array.isArray(assetResponse)) {
//           setAssets(assetResponse);
//         } else {
//           throw new Error('No data found for assets');
//         }
//       } catch (err) {
//         setError('Failed to fetch assets. Please try again later.');
//         console.error('Assets Fetch Error:', err); // Log error details
//       }
//     };
//     fetchAssetData();
//   }, []);
  
//   // useEffect(() => {
//   //   const fetchScopeData = async () => {
//   //     if (selectedAsset) {
//   //       try {
//   //         const scopeResponse = await getScopedInAsset(selectedAsset);
//   //         if (Array.isArray(scopeResponse)) {
//   //           setScopes(scopeResponse);
//   //         } else {
//   //           throw new Error('No data found for scopes');
//   //         }
//   //       } catch (err) {
//   //         setError('Failed to fetch scopes. Please try again later.');
//   //         console.error('Scopes Fetch Error:', err); // Log error details
//   //       }
//   //     } else {
//   //       setScopes([]);
//   //     }
//   //   };
//   //   fetchScopeData();
//   // }, [selectedAsset]);


//   useEffect(() => {
//     const fetchScopeData = async () => {
//       if (selectedAsset) {
//         try {
//           console.log('Selected Asset:', selectedAsset); // Log selected asset information
//           const scopeResponse = await getScopedInAsset(selectedAsset);
          
//           if (Array.isArray(scopeResponse)) {
//             setScopes(scopeResponse.map(scope => scope.scoped)); // Extract the 'scoped' object from the response
//             console.log('Fetched Scopes:', scopeResponse.map(scope => scope.scoped)); // Log fetched scopes
//           } else {
//             throw new Error('No data found for scopes');
//           }
//         } catch (err) {
//           setError('Failed to fetch scopes. Please try again later.');
//           console.error('Scopes Fetch Error:', err); // Log error details
//         }
//       } else {
//         setScopes([]);
//       }
//     };
//     fetchScopeData();
//   }, [selectedAsset]);
  

//   const handleFamilyClick = (familyId) => {
//     setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
//   };

//   const handleControlClick = (controlId) => {
//     setSelectedControlId(controlId);
//   };

//   const handleMarkAsCompleted = async (actionId) => {
//     try {
//       const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}`, { isCompleted: true });
//       if (response.status === 200) {
//         setActions(actions.map(action =>
//           action._id === actionId ? { ...action, isCompleted: true } : action
//         ));
//       } else {
//         throw new Error('Failed to mark action as completed.');
//       }
//     } catch (error) {
//       setError('Failed to mark action as completed. Please try again later.');
//       console.error('Mark as Completed Error:', error); // Log error details
//     }
//   };

//   const handleAssetChange = (event) => {
//     const selectedId = event.target.value;
//     setSelectedAsset(selectedId);
//   };

//   const handleFileUpload = async (event, actionId) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}/upload`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.status === 200) {
//         setNotification({ message: 'File uploaded successfully!', severity: 'success' });
//         // Refetch actions for the selected control
//         const updatedActionsResponse = await fetchActions();
//         if (Array.isArray(updatedActionsResponse)) {
//           setActions(updatedActionsResponse.filter(action => action.control_Id._id === selectedControlId));
//         } else {
//           throw new Error('Failed to refetch actions.');
//         }
//       } else {
//         throw new Error('Failed to upload file.');
//       }
//     } catch (error) {
//       setNotification({ message: 'Failed to upload file. Please try again later.', severity: 'error' });
//       console.error('File Upload Error:', error); // Log error details
//     }
//   };

//   const handleSnackbarClose = () => {
//     setNotification({ message: '', severity: 'info' });
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="new-page">
//       <div className="top-controls">
//         <Select
//           value={selectedAsset}
//           onChange={handleAssetChange}
//           displayEmpty
//         >
//           <MenuItem value="">Select Asset</MenuItem>
//           {assets.map(asset => (
//             <MenuItem key={asset._id} value={asset._id}>
//               {asset.asset.name} - {asset.asset.isScoped ? " Scoped" : " Non-Scoped"}
//             </MenuItem>
//           ))}
//         </Select>
//         {selectedAsset && (
//           <Select
//             value={selectedScope}
//             onChange={(e) => setSelectedScope(e.target.value)}
//             displayEmpty
//           >
//             <MenuItem value="">Select Scope</MenuItem>
//             {scopes.map(scoped => (
//               <MenuItem key={scoped._id} value={scoped._id}>{scoped.name}</MenuItem>
//             ))}
//           </Select>
//         )}
//       </div>

//       <div className="sidebar">
//         {controlFamilies.map(family => (
//           <div key={family._id} className={`control-family ${expandedFamilyId === family._id ? 'expanded' : ''}`}>
//             <Tooltip title={family.description} placement="right">
//               <div
//                 className={`control-family-header ${expandedFamilyId === family._id ? 'expanded' : ''} ${expandedFamilyId === family._id ? 'selected-family' : ''}`}
//                 onClick={() => handleFamilyClick(family._id)}
//               >
//                 Chapter {family.variable_id}
//               </div>
//             </Tooltip>
//             {expandedFamilyId === family._id && (
//               <div className="controls">
//                 {family.controls.map(control => (
//                   <Tooltip key={control._id} title={control.section_desc} placement="right">
//                     <div
//                       className={`control ${selectedControlId === control._id ? 'selected-control' : ''}`}
//                       onClick={() => handleControlClick(control._id)}
//                     >
//                       {control.section}
//                     </div>
//                   </Tooltip>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="content">
//         {error && (
//           <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
//             <Alert onClose={() => setError('')} severity="error">
//               {error}
//             </Alert>
//           </Snackbar>
//         )}
//         {notification.message && (
//           <Snackbar open={Boolean(notification.message)} autoHideDuration={6000} onClose={handleSnackbarClose}>
//             <Alert onClose={handleSnackbarClose} severity={notification.severity}>
//               {notification.message}
//             </Alert>
//           </Snackbar>
//         )}

//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Fixed ID</TableCell>
//                 <TableCell>Variable ID</TableCell>
//                 <TableCell>Upload</TableCell>
//                 <TableCell>View</TableCell>
//                 <TableCell>Complete</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {actions.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">No actions available</TableCell>
//                 </TableRow>
//               ) : (
//                 actions.map(action => (
//                   <TableRow key={action._id}>
//                     <TableCell>{action.fixed_id}</TableCell>
//                     <TableCell>{action.variable_id}</TableCell>
//                     <TableCell>
//                       <input
//                         type="file"
//                         onChange={(e) => handleFileUpload(e, action._id)}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Button variant="contained" href={`http://localhost:8021/api/v1/actions/${action._id}/download`} target="_blank">View</Button>
//                     </TableCell>
//                     <TableCell>
//                       <Button variant="contained" color="primary" onClick={() => handleMarkAsCompleted(action._id)} disabled={action.isCompleted}>
//                         {action.isCompleted ? 'Completed' : 'Mark as Complete'}
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>
//     </div>
//   );
// };

// export default ListOfActions;


// import React, { useState, useEffect } from 'react';
// import { getControlFamilies } from '../api/controlFamilyAPI';
// import { fetchActions } from '../api/actionAPI';
// // import { getAssetDetails, getScopedInAsset } from '../api/assetDetailsApi';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert, Select, MenuItem, Tooltip
// } from '@mui/material';
// import Loading from '../components/Loading';
// import '../styles/ListOfActions.css';
// import axios from 'axios';

// const ListOfActions = () => {
//   const [controlFamilies, setControlFamilies] = useState([]);
//   const [controls, setControls] = useState([]);
//   const [actions, setActions] = useState([]);
//   const [expandedFamilyId, setExpandedFamilyId] = useState('');
//   const [selectedControlId, setSelectedControlId] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   // // Asset and scope states
//   // const [assets, setAssets] = useState([]);
//   // const [scopes, setScopes] = useState([]);
//   // const [selectedAsset, setSelectedAsset] = useState('');
//   // const [selectedScope, setSelectedScope] = useState('');

//   // Notification state
//   const [notification, setNotification] = useState({ message: '', severity: 'info' });
// // Control Families
//   useEffect(() => {
//     const getControlFamiliesData = async () => {
//       setLoading(true);
//       try {
//         const familyResponse = await getControlFamilies();
//         if (Array.isArray(familyResponse)) {
//           setControlFamilies(familyResponse);
//         } else {
//           throw new Error('No data found for control families');
//         }
//       } catch (err) {
//         setError('Failed to fetch control families. Please try again later.');
//         console.error('Control Families Fetch Error:', err); // Log error details
//       } finally {
//         setLoading(false);
//       }
//     };
//     getControlFamiliesData();
//   }, []);


//   // Controls
//   useEffect(() => {
//     const fetchControlData = async () => {
//       if (controlFamilies.length) {
//         setLoading(true);
//         try {
//           const updatedControls = controlFamilies.flatMap(family => family.controls);
//           setControls(updatedControls);
//         } catch (err) {
//           setError('Failed to fetch controls. Please try again later.');
//           console.error('Controls Fetch Error:', err); // Log error details
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchControlData();
//   }, [controlFamilies]);


//   //Actions
//   useEffect(() => {
//     const fetchActionData = async () => {
//       if (selectedControlId) {
//         setLoading(true);
//         try {
//           const actionResponse = await fetchActions();
//           if (Array.isArray(actionResponse)) {
//             const filteredActions = actionResponse.filter(action => action.control_Id._id === selectedControlId);
//             setActions(filteredActions);
//           } else {
//             throw new Error('Actions data is not an array');
//           }
//         } catch (err) {
//           setError('Failed to fetch actions. Please try again later.');
//           console.error('Actions Fetch Error:', err); // Log error details
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setActions([]);
//       }
//     };
//     fetchActionData();
//   }, [selectedControlId]);


//   //Asset
//   // useEffect(() => {
//   //   const fetchAssetData = async () => {
//   //     try {
//   //       const assetResponse = await getAssetDetails();
//   //       if (Array.isArray(assetResponse)) {
//   //         setAssets(assetResponse);
//   //       } else {
//   //         throw new Error('No data found for assets');
//   //       }
//   //     } catch (err) {
//   //       setError('Failed to fetch assets. Please try again later.');
//   //       console.error('Assets Fetch Error:', err); // Log error details
//   //     }
//   //   };
//   //   fetchAssetData();
//   // }, []);


//   //scope
//   // useEffect(() => {
//   //   const fetchScopeData = async () => {
//   //     if (selectedAsset) {
//   //       try {
//   //         console.log('Selected Asset:', selectedAsset); // Log selected asset information
//   //         // console.log('Selected Asset:', selectedAsset); // Log selected asset information
//   //         const scopeResponse = await getScopedInAsset(selectedAsset);
          
//   //         if (Array.isArray(scopeResponse)) {
//   //           setScopes(scopeResponse.map(scope => scope.scoped)); // Extract the 'scoped' object from the response
//   //           console.log('Fetched Scopes:', scopeResponse.map(scope => scope.scoped)); // Log fetched scopes
//   //         } else {
//   //           throw new Error('No data found for scopes');
//   //         }
//   //       } catch (err) {
//   //         setError('Failed to fetch scopes. Please try again later.');
//   //         console.error('Scopes Fetch Error:', err); // Log error details
//   //       }
//   //     } else {
//   //       setScopes([]);
//   //     }
//   //   };
//   //   fetchScopeData();
//   // }, [selectedAsset]);

//   const handleFamilyClick = (familyId) => {
//     setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
//   };

//   const handleControlClick = (controlId) => {
//     setSelectedControlId(controlId);
//   };

//   const handleMarkAsCompleted = async (actionId) => {
//     try {
//       const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}`, { isCompleted: true });
//       if (response.status === 200) {
//         setActions(actions.map(action =>
//           action._id === actionId ? { ...action, isCompleted: true } : action
//         ));
//       } else {
//         throw new Error('Failed to mark action as completed.');
//       }
//     } catch (error) {
//       setError('Failed to mark action as completed. Please try again later.');
//       console.error('Mark as Completed Error:', error); // Log error details
//     }
//   };

//   // const handleAssetChange = (event) => {
//   //   const selectedId = event.target.value;
//   //   setSelectedAsset(selectedId);
//   // };

//   const handleFileUpload = async (event, actionId) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}/upload`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.status === 200) {
//         setNotification({ message: 'File uploaded successfully!', severity: 'success' });
//         // Refetch actions for the selected control
//         const updatedActionsResponse = await fetchActions();
//         if (Array.isArray(updatedActionsResponse)) {
//           setActions(updatedActionsResponse.filter(action => action.control_Id._id === selectedControlId));
//         } else {
//           throw new Error('Failed to refetch actions.');
//         }
//       } else {
//         throw new Error('Failed to upload file.');
//       }
//     } catch (error) {
//       setNotification({ message: 'Failed to upload file. Please try again later.', severity: 'error' });
//       console.error('File Upload Error:', error); // Log error details
//     }
//   };

//   const handleSnackbarClose = () => {
//     setNotification({ message: '', severity: 'info' });
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="new-page">
//       {/* <div className="top-controls">
//         <Select
//           value={selectedAsset}
//           onChange={handleAssetChange}
//           displayEmpty
//         >
//           <MenuItem value="">Select Asset</MenuItem>
//           {assets.map(asset => (
//             <MenuItem key={asset._id} value={asset._id}>
//               {asset.asset.name} - {asset.asset.isScoped ? " Scoped" : " Non-Scoped"}
//             </MenuItem>
//           ))}
//         </Select>
//         {selectedAsset && scopes.length > 0 && (
//           <Select
//             value={selectedScope}
//             onChange={(e) => setSelectedScope(e.target.value)}
//             displayEmpty
//           >
//             <MenuItem value="">Select Scope</MenuItem>
//             {scopes.map(scoped => (
//               <MenuItem key={scoped._id} value={scoped._id}>{scoped.name}</MenuItem>
//             ))}
//           </Select>
//         )}
//       </div> */}

//       <div className="sidebar">
//         {controlFamilies.map(family => (
//           <div key={family._id} className={`control-family ${expandedFamilyId === family._id ? 'expanded' : ''}`}>
//             <Tooltip title={family.description} placement="right">
//               <div
//                 className={`control-family-header ${expandedFamilyId === family._id ? 'expanded' : ''} ${expandedFamilyId === family._id ? 'selected-family' : ''}`}
//                 onClick={() => handleFamilyClick(family._id)}
//               >
//                 Chapter {family.variable_id}
//               </div>
//             </Tooltip>
//             {expandedFamilyId === family._id && (
//               <div className="controls">
//                 {family.controls.map(control => (
//                   <Tooltip key={control._id} title={control.section_desc} placement="right">
//                     <div
//                       className={`control ${selectedControlId === control._id ? 'selected-control' : ''}`}
//                       onClick={() => handleControlClick(control._id)}
//                     >
//                       {control.section}
//                     </div>
//                   </Tooltip>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="content">
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Action</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>File</TableCell>
//                 <TableCell>Completion Status</TableCell>
//                 <TableCell>Upload File</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {actions.map(action => (
//                 <TableRow key={action._id}>
//                   <TableCell>{action.variable_id}</TableCell>
//                   <TableCell>{action.description}</TableCell>
//                   <TableCell>
//                     {action.file && (
//                       <a href={action.file.url} target="_blank" rel="noopener noreferrer">
//                         {action.file.name}
//                       </a>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {action.isCompleted ? (
//                       <Button variant="contained" color="success" disabled>
//                         Completed
//                       </Button>
//                     ) : (
//                       <Button variant="contained" color="primary" onClick={() => handleMarkAsCompleted(action._id)}>
//                         Mark as Completed
//                       </Button>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <input
//                       type="file"
//                       onChange={(e) => handleFileUpload(e, action._id)}
//                       disabled={action.isCompleted}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>
      
//       {error && <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
//         <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
//           {error}
//         </Alert>
//       </Snackbar>}

//       <Snackbar open={!!notification.message} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity={notification.severity} sx={{ width: '100%' }}>
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default ListOfActions;
