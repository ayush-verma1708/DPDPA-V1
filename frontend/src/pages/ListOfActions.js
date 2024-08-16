
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
import { uploadEvidence , fetchEvidenceById } from '../api/evidenceApi'; // Adjust the path based on your file structure

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
  

  const [selectedFiles, setSelectedFiles] = useState({}); // State to keep track of selected files
  const [evidenceFiles, setEvidenceFiles] = useState({}); // State to store evidence file URLs


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

  useEffect(() => {
    const fetchActionData = async () => {
      if (selectedControlId) {
        setLoading(true);
        try {
          const actionResponse = await fetchActions();
          if (Array.isArray(actionResponse)) {
            const filteredActions = await Promise.all(
              actionResponse
                .filter(action => action.control_Id._id === selectedControlId)
                .map(async (action) => {
                  // Fetch the control description
                  const controlDescription = controls.find(control => control._id === action.control_Id._id)?.section_desc;
    
                  // Fetch the completion status
                  const isCompleted = await checkCompletionStatus(
                    action._id,
                    selectedAssetId,
                    selectedScopeId,
                    selectedControlId,
                    expandedFamilyId
                  );
    
                  // Return the modified action object with completion status and evidence URL
                  return {
                    ...action,
                    controlDescription,
                    isCompleted,
                    evidenceUrl: action.evidenceUrl || null, // Add evidenceUrl if available
                  };
                })
            );
            setActions(filteredActions);
          } else {
            throw new Error('Actions data is not an array');
          }
        } catch (err) {
          setError('Failed to fetch actions. Please try again later.');
          console.error('Actions Fetch Error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setActions([]);
      }
    };
    fetchActionData();
  }, [selectedControlId, controls, selectedAssetId, selectedScopeId, expandedFamilyId]);
  


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

  // const viewEvidence = (evidenceUrl) => {
  //   if (evidenceUrl) {
  //     window.open(evidenceUrl, '_blank');
  //   } else {
  //     console.log('No evidence URL available for this action.');
  //   }
  // };
  
  // Handle file selection
const handleFileChange = (event, actionId) => {
  setSelectedFiles(prevState => ({
    ...prevState,
    [actionId]: event.target.files[0],
  }));
};

// const handleFileUpload = async (e, actionId) => {
//   const file = e.target.files[0];
//   if (file) {
//     try {
//       const additionalData = { actionId, controlId: selectedControlId, assetId: selectedAssetId, scopeId: selectedScopeId };
//       const response = await uploadEvidence(file, additionalData);
//       console.log('Evidence uploaded successfully:', response);
//       // Optionally, refresh the actions list or update the specific action with the new evidenceId
//     } catch (error) {
//       console.error('Error uploading evidence:', error);
//     }
//   }
// };

const handleFileUpload = async (e, actionId) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const additionalData = { actionId, controlId: selectedControlId, assetId: selectedAssetId, scopeId: selectedScopeId };
      const response = await uploadEvidence(file, additionalData);
      console.log('Evidence uploaded successfully:', response);

      // After successful upload, fetch and update the evidence URL
      const evidenceData = await fetchEvidenceById(response.evidenceId);
      setEvidenceFiles(prevState => ({
        ...prevState,
        [actionId]: evidenceData.fileUrl,
      }));
    } catch (error) {
      console.error('Error uploading evidence:', error);
    }
  }
};

const viewEvidence = (fileUrl) => {
  if (fileUrl) {
    window.open(fileUrl, '_blank');
  } else {
    console.log('No evidence file available for this action.');
  }
};


  const ActionCompletionCell = ({ action, expandedFamilyId, selectedControlId, selectedAssetId, selectedScopeId, handleMarkAsCompleted }) => {
    const [isCompleted, setIsCompleted] = useState(false);
  
    useEffect(() => {
      const fetchCompletionStatus = async () => {
        const status = await checkCompletionStatus(
          action._id,
          selectedAssetId,
          selectedScopeId,
          selectedControlId,
          expandedFamilyId
        );
        setIsCompleted(status);
      };
  
      fetchCompletionStatus();
    }, [action._id, selectedAssetId, selectedScopeId, selectedControlId, expandedFamilyId]);
  
    return (
      <TableCell>
        {
          isCompleted ? (
            <Button variant="contained" color="success" disabled>
              Evidence Confirm
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={() => handleMarkAsCompleted(action._id)}>
              Check Evidence
            </Button>
          )
        }
      </TableCell>
    );
  };
  

  const checkCompletionStatus = async (actionId, assetId, scopeId, controlId, familyId) => {
    try {
      // Construct the params object, conditionally including scopeId if it exists
      const params = {
        actionId,
        assetId,
        controlId,
        familyId,
        ...(scopeId && { scopeId }), // Only include scopeId if it is not null or undefined
      };
  
      // Make the API request with the constructed params
      const response = await axios.get('http://localhost:8021/api/v1/completion-status', { params });
  
      // Return true if the response data indicates completion, otherwise false
      return response.data?.isCompleted || false; // Expecting a boolean in the response
    } catch (error) {
      console.error('Error fetching completion status:', error);
      return false;
    }
  };
  
 
  const handleMarkAsCompleted = async (actionId) => {
    try {
      const completionEntry = {
        username: 'dummyUser', // Replace with actual username if needed
        familyId: expandedFamilyId,
        controlId: selectedControlId,
        assetId: selectedAssetId,
        ...(selectedScopeId && { scopeId: selectedScopeId }),
        actionId: actionId,
      };
    
      const response = await axios.post(`http://localhost:8021/api/v1/completion-status`, completionEntry);
    
      if (response.status === 200) {
        setNotification({ message: 'Action marked as completed!', severity: 'success' });
        const updatedActionsResponse = await fetchActions();
        const updatedActions = await Promise.all(
          updatedActionsResponse
            .filter(action => action.control_Id._id === selectedControlId)
            .map(async (action) => {
              const controlDescription = controls.find(control => control._id === action.control_Id._id)?.section_desc;
              const isCompleted = await checkCompletionStatus(
                action._id,
                selectedAssetId,
                selectedScopeId,
                selectedControlId,
                expandedFamilyId
              );
              return {
                ...action,
                controlDescription,
                isCompleted,
                evidenceUrl: action.evidenceUrl || null,
              };
            })
        );
        setActions(updatedActions);
      } else {
        throw new Error('Failed to mark action as completed.');
      }
    } catch (error) {
      setNotification({ message: 'Failed to mark action as completed. Please try again later.', severity: 'error' });
      console.error('Mark as Completed Error:', error);
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
                  <Tooltip key={control._id} title={control.section_main_desc} placement="right">
                    <div
                      className={`control ${selectedControlId === control._id ? 'selected-control' : ''}`}
                      onClick={() => handleControlClick(control._id)}
                    >
                      {control.section_main_desc} - {control.section}
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
        <TableCell>Control Description</TableCell> {/* New column for control description */}
        <TableCell>Status</TableCell> {/* New column for status */}
        <TableCell>Completion Status</TableCell>
        <TableCell>Upload File</TableCell>
        <TableCell>File</TableCell>
        <TableCell>View Evidence</TableCell> {/* New column for viewing evidence */}
      </TableRow>
    </TableHead>
    <TableBody>
      {actions.map(action => (
        <TableRow key={action._id}>
          <TableCell>{action.variable_id}</TableCell>
          <TableCell>{action.controlDescription}</TableCell> {/* Display control description */}
          <TableCell>{action.isCompleted ? "Completed" : "Pending"}</TableCell>
          <ActionCompletionCell
            action={action}
            expandedFamilyId={expandedFamilyId}
            selectedControlId={selectedControlId}
            selectedAssetId={selectedAssetId}
            selectedScopeId={selectedScopeId}
            handleMarkAsCompleted={handleMarkAsCompleted}
          />
          <TableCell>
            <input type="file" onChange={(e) => handleFileUpload(e, action._id)} />
          </TableCell>
          <TableCell>
  {action.evidenceUrl ? (
    <Button variant="contained" onClick={() => viewEvidence(action.evidenceUrl)}>
      View Evidence
    </Button>
  ) : (
    "No Evidence"
  )}
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

// import React, { useState, useEffect } from 'react';
// import { getControlFamilies } from '../api/controlFamilyAPI';
// import { fetchActions } from '../api/actionAPI';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert, Select, MenuItem, Tooltip
// } from '@mui/material';
// import Loading from '../components/Loading';
// import '../styles/ListOfActions.css';
// import axios from 'axios';

// import { getAssetDetails } from '../api/assetDetailsApi'; // Ensure this is correctly imported
// import { uploadEvidence } from '../api/evidenceApi'; // Adjust the path based on your file structure

// const ListOfActions = () => {
//   const [controlFamilies, setControlFamilies] = useState([]);
//   const [controls, setControls] = useState([]);
//   const [actions, setActions] = useState([]);
//   const [expandedFamilyId, setExpandedFamilyId] = useState('');
//   const [selectedControlId, setSelectedControlId] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);


// // Asset
//   const [assets, setAssets] = useState([]);
//   const [scopes, setScopes] = useState([]);
//   const [selectedAssetId, setSelectedAssetId] = useState('');
//   const [selectedScopeId, setSelectedScopeId] = useState('');
//   // const [loading, setLoading] = useState(true);
//   // const [error, setError] = useState('');
//   // Notification state
//   const [notification, setNotification] = useState({ message: '', severity: 'info' });
  

//   const [selectedFiles, setSelectedFiles] = useState({}); // State to keep track of selected files


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

//   useEffect(() => {
//     const fetchActionData = async () => {
//       if (selectedControlId) {
//         setLoading(true);
//         try {
//           const actionResponse = await fetchActions();
//           if (Array.isArray(actionResponse)) {
//             const filteredActions = await Promise.all(
//               actionResponse
//                 .filter(action => action.control_Id._id === selectedControlId)
//                 .map(async (action) => {
//                   // Fetch the control description
//                   const controlDescription = controls.find(control => control._id === action.control_Id._id)?.section_desc;
    
//                   // Fetch the completion status
//                   const isCompleted = await checkCompletionStatus(
//                     action._id,
//                     selectedAssetId,
//                     selectedScopeId,
//                     selectedControlId,
//                     expandedFamilyId
//                   );
    
//                   // Return the modified action object with completion status and evidence URL
//                   return {
//                     ...action,
//                     controlDescription,
//                     isCompleted,
//                     evidenceUrl: action.evidenceUrl || null, // Add evidenceUrl if available
//                   };
//                 })
//             );
//             setActions(filteredActions);
//           } else {
//             throw new Error('Actions data is not an array');
//           }
//         } catch (err) {
//           setError('Failed to fetch actions. Please try again later.');
//           console.error('Actions Fetch Error:', err);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setActions([]);
//       }
//     };
//     fetchActionData();
//   }, [selectedControlId, controls, selectedAssetId, selectedScopeId, expandedFamilyId]);
  


//   useEffect(() => {
//     const fetchAssetDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await getAssetDetails();
//         if (Array.isArray(response)) {
//           setAssets(response);
//         } else {
//           throw new Error('Failed to fetch asset details');
//         }
//       } catch (err) {
//         setError('Failed to fetch asset details. Please try again later.');
//         console.error('Asset Details Fetch Error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAssetDetails();
//   }, []);

//   // Update scopes based on selected asset
//   useEffect(() => {
//     if (selectedAssetId) {
//       const selectedAsset = assets.find(asset => asset._id === selectedAssetId);
//       if (selectedAsset && selectedAsset.asset.isScoped) {
//         setScopes([selectedAsset.scoped]);
//         setSelectedScopeId(selectedAsset.scoped._id);
//       } else {
//         setScopes([]);
//         setSelectedScopeId('');
//       }
//     } else {
//       setScopes([]);
//       setSelectedScopeId('');
//     }
//   }, [selectedAssetId, assets]);

//   const handleAssetChange = (event) => {
//     setSelectedAssetId(event.target.value);
//   };

//   const handleScopeChange = (event) => {
//     setSelectedScopeId(event.target.value);
//   };


//   const handleFamilyClick = (familyId) => {
//     setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
//   };

//   const handleControlClick = (controlId) => {
//     setSelectedControlId(controlId);
//   };

//   const viewEvidence = (evidenceUrl) => {
//     if (evidenceUrl) {
//       window.open(evidenceUrl, '_blank');
//     } else {
//       console.log('No evidence URL available for this action.');
//     }
//   };
  
//   // Handle file selection
// const handleFileChange = (event, actionId) => {
//   setSelectedFiles(prevState => ({
//     ...prevState,
//     [actionId]: event.target.files[0],
//   }));
// };

// // Handle file upload and mark as completed
// // const handleFileUpload = async (actionId) => {
// //   try {
// //     const file = selectedFiles[actionId];
// //     if (!file) {
// //       setNotification({ message: 'Please select a file before uploading.', severity: 'warning' });
// //       return;
// //     }

// //     // Prepare additional data for the upload
// //     const additionalData = {
// //       actionId,
// //       assetId: selectedAssetId,
// //       controlId: selectedControlId,
// //       familyId: expandedFamilyId,
// //       ...(selectedScopeId && { scopeId: selectedScopeId }),
// //     };

// //     // Upload the file
// //     const response = await uploadEvidence(file, additionalData);

// //     if (response) {
// //       setNotification({ message: 'File uploaded successfully and evidence created!', severity: 'success' });

// //       // Optionally, mark the action as completed after the upload
// //       await handleMarkAsCompleted(actionId);
// //     }
// //   } catch (error) {
// //     setNotification({ message: 'Failed to upload file. Please try again later.', severity: 'error' });
// //     console.error('File Upload Error:', error);
// //   }
// // };
// const handleFileUpload = async (e, actionId) => {
//   const file = e.target.files[0];
//   if (file) {
//     try {
//       const additionalData = { actionId, controlId: selectedControlId, assetId: selectedAssetId, scopeId: selectedScopeId };
//       const response = await uploadEvidence(file, additionalData);
//       console.log('Evidence uploaded successfully:', response);
//       // Optionally, refresh the actions list or update the specific action with the new evidenceId
//     } catch (error) {
//       console.error('Error uploading evidence:', error);
//     }
//   }
// };


//   const ActionCompletionCell = ({ action, expandedFamilyId, selectedControlId, selectedAssetId, selectedScopeId, handleMarkAsCompleted }) => {
//     const [isCompleted, setIsCompleted] = useState(false);
  
//     useEffect(() => {
//       const fetchCompletionStatus = async () => {
//         const status = await checkCompletionStatus(
//           action._id,
//           selectedAssetId,
//           selectedScopeId,
//           selectedControlId,
//           expandedFamilyId
//         );
//         setIsCompleted(status);
//       };
  
//       fetchCompletionStatus();
//     }, [action._id, selectedAssetId, selectedScopeId, selectedControlId, expandedFamilyId]);
  
//     return (
//       <TableCell>
//         {
//           isCompleted ? (
//             <Button variant="contained" color="success" disabled>
//               Evidence Confirm
//             </Button>
//           ) : (
//             <Button variant="contained" color="primary" onClick={() => handleMarkAsCompleted(action._id)}>
//               Check Evidence
//             </Button>
//           )
//         }
//       </TableCell>
//     );
//   };
  

//   const checkCompletionStatus = async (actionId, assetId, scopeId, controlId, familyId) => {
//     try {
//       // Construct the params object, conditionally including scopeId if it exists
//       const params = {
//         actionId,
//         assetId,
//         controlId,
//         familyId,
//         ...(scopeId && { scopeId }), // Only include scopeId if it is not null or undefined
//       };
  
//       // Make the API request with the constructed params
//       const response = await axios.get('http://localhost:8021/api/v1/completion-status', { params });
  
//       // Return true if the response data indicates completion, otherwise false
//       return response.data ? true : false;
//     } catch (error) {
//       console.error('Error fetching completion status:', error);
//       return false;
//     }
//   };
  
//   const handleMarkAsCompleted = async (actionId) => {
//     try {
//       // Find the action by its ID
//       const action = actions.find(a => a._id === actionId);
  
//       // Check if the action is already marked as completed
//       if (action && action.isCompleted) {
//         setNotification({ message: 'This action is already marked as completed.', severity: 'info' });
//         return; // Exit the function early if the action is already completed
//       }
  
//       // Prepare completion entry details
//       const completionEntry = {
//         username: 'dummyUser', // Replace with actual username if needed
//         familyId: expandedFamilyId,
//         controlId: selectedControlId,
//         assetId: selectedAssetId,
//         ...(selectedScopeId && { scopeId: selectedScopeId }),
//         actionId: actionId,
//       };
  
//       console.log('Completion Entry:', completionEntry);
  
//       // Check if the action has already been marked as completed in the database
//       const isAlreadyCompleted = await checkCompletionStatus(
//         actionId,
//         selectedAssetId,
//         selectedScopeId,
//         selectedControlId,
//         expandedFamilyId
//       );
  
//       if (isAlreadyCompleted) {
//         setNotification({ message: 'This action is already marked as completed.', severity: 'info' });
//         return; // Exit the function early if the action is already completed
//       }
  
//       // Mark the action as completed by making an API call
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
  

//   const handleSnackbarClose = () => {
//     setNotification({ message: '', severity: 'info' });
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="new-page">
//          <div className="page-container">
//       <div className="Asset-container">
//         {/* Dropdown for Assets */}
//         <Select
//           value={selectedAssetId}
//           onChange={handleAssetChange}
//           displayEmpty
//           renderValue={(value) => value ? `Asset: ${assets.find(asset => asset._id === value).asset.name}` : 'Select Asset'}
//         >
//           {assets.map(asset => (
//             <MenuItem key={asset._id} value={asset._id}>
//               {asset.asset.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </div>

//       <div className="Scope-container">
//         {/* Dropdown for Scopes */}
//         <Select
//           value={selectedScopeId}
//           onChange={handleScopeChange}
//           displayEmpty
//           renderValue={(value) => value ? `Scope: ${scopes.find(scope => scope._id === value)?.name}` : 'Select Scope'}
//           disabled={!selectedAssetId || scopes.length === 0}
//         >
//           {scopes.map(scope => (
//             <MenuItem key={scope._id} value={scope._id}>
//               {scope.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </div>

//       {error && (
//         <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
//           <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
//             {error}
//           </Alert>
//         </Snackbar>
//       )}

//       <Snackbar open={!!notification.message} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity={notification.severity} sx={{ width: '100%' }}>
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </div>
    
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
//                   <Tooltip key={control._id} title={control.section_main_desc} placement="right">
//                     <div
//                       className={`control ${selectedControlId === control._id ? 'selected-control' : ''}`}
//                       onClick={() => handleControlClick(control._id)}
//                     >
//                       {control.section_main_desc} - {control.section}
//                     </div>
//                   </Tooltip>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="content">
       
//       <TableContainer component={Paper}>
//   <Table>
//     <TableHead>
//       <TableRow>
//         <TableCell>Action</TableCell>
//         <TableCell>Control Description</TableCell> {/* New column for control description */}
//         <TableCell>Status</TableCell> {/* New column for status */}
//         <TableCell>Completion Status</TableCell>
//         <TableCell>Upload File</TableCell>
//         <TableCell>File</TableCell>
//         <TableCell>View Evidence</TableCell> {/* New column for viewing evidence */}
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {actions.map(action => (
//         <TableRow key={action._id}>
//           <TableCell>{action.variable_id}</TableCell>
//           <TableCell>{action.controlDescription}</TableCell> {/* Display control description */}
//           <TableCell>{action.isCompleted ? "Completed" : "Pending"}</TableCell>
//           <ActionCompletionCell
//             action={action}
//             expandedFamilyId={expandedFamilyId}
//             selectedControlId={selectedControlId}
//             selectedAssetId={selectedAssetId}
//             selectedScopeId={selectedScopeId}
//             handleMarkAsCompleted={handleMarkAsCompleted}
//           />
//           <TableCell>
//             <input type="file" onChange={(e) => handleFileUpload(e, action._id)} />
//           </TableCell>
//           <TableCell>
//   {action.evidenceUrl ? (
//     <Button variant="contained" onClick={() => viewEvidence(action.evidenceUrl)}>
//       View Evidence
//     </Button>
//   ) : (
//     "No Evidence"
//   )}
// </TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// </TableContainer>


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

   {/* <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Action</TableCell>
        <TableCell>Control Description</TableCell> 
       
        <TableCell>Status</TableCell> 
        <TableCell>Completion Status</TableCell>
        <TableCell>Upload File</TableCell>
        <TableCell>File</TableCell>
      </TableRow>
    </TableHead>
  
<TableBody>
  {actions.map(action => (
    <TableRow key={action._id}>
      <TableCell>{action.variable_id}</TableCell>
      <TableCell>{action.controlDescription}</TableCell>
      <TableCell>
        {action.isCompleted ? "Completed" : "Pending"}
      </TableCell>
      <ActionCompletionCell
        action={action}
        expandedFamilyId={expandedFamilyId}
        selectedControlId={selectedControlId}
        selectedAssetId={selectedAssetId}
        selectedScopeId={selectedScopeId}
        handleMarkAsCompleted={handleMarkAsCompleted}
      />
      <TableCell>
        <input 
          type="file" 
          onChange={(event) => handleFileChange(event, action._id)} 
        />
      </TableCell>
      <TableCell>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleFileUpload(action._id)}
          disabled={!selectedFiles[action._id]}
        >
          Upload File
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>



  </Table>
</TableContainer> */}
// import React, { useState, useEffect } from 'react';
// import { getControlFamilies } from '../api/controlFamilyAPI';
// import { fetchActions } from '../api/actionAPI';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert, Select, MenuItem, Tooltip
// } from '@mui/material';
// import Loading from '../components/Loading';
// import '../styles/ListOfActions.css';
// import axios from 'axios';

// import { getAssetDetails } from '../api/assetDetailsApi'; // Ensure this is correctly imported

// const ListOfActions = () => {
//   const [controlFamilies, setControlFamilies] = useState([]);
//   const [controls, setControls] = useState([]);
//   const [actions, setActions] = useState([]);
//   const [expandedFamilyId, setExpandedFamilyId] = useState('');
//   const [selectedControlId, setSelectedControlId] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);


// // Asset
//   const [assets, setAssets] = useState([]);
//   const [scopes, setScopes] = useState([]);
//   const [selectedAssetId, setSelectedAssetId] = useState('');
//   const [selectedScopeId, setSelectedScopeId] = useState('');
//   // const [loading, setLoading] = useState(true);
//   // const [error, setError] = useState('');
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
//   // useEffect(() => {
//   //   const fetchActionData = async () => {
//   //     if (selectedControlId) {
//   //       setLoading(true);
//   //       try {
//   //         const actionResponse = await fetchActions();
//   //         if (Array.isArray(actionResponse)) {
//   //           const filteredActions = actionResponse.filter(action => action.control_Id._id === selectedControlId);
//   //           setActions(filteredActions);
//   //         } else {
//   //           throw new Error('Actions data is not an array');
//   //         }
//   //       } catch (err) {
//   //         setError('Failed to fetch actions. Please try again later.');
//   //         console.error('Actions Fetch Error:', err); // Log error details
//   //       } finally {
//   //         setLoading(false);
//   //       }
//   //     } else {
//   //       setActions([]);
//   //     }
//   //   };
//   //   fetchActionData();
//   // }, [selectedControlId]);

//   useEffect(() => {
//     const fetchActionData = async () => {
//       if (selectedControlId) {
//         setLoading(true);
//         try {
//           const actionResponse = await fetchActions();
//           if (Array.isArray(actionResponse)) {
//             const filteredActions = await Promise.all(
//               actionResponse
//                 .filter(action => action.control_Id._id === selectedControlId)
//                 .map(async (action) => {
//                   // Fetch the control description
//                   const controlDescription = controls.find(control => control._id === action.control_Id._id)?.section_desc;
  
//                   // Fetch the completion status
//                   const isCompleted = await checkCompletionStatus(
//                     action._id,
//                     selectedAssetId,
//                     selectedScopeId,
//                     selectedControlId,
//                     expandedFamilyId
//                   );
  
//                   // Return the modified action object with completion status
//                   return {
//                     ...action,
//                     controlDescription,
//                     isCompleted, // Add completion status here
//                   };
//                 })
//             );
//             setActions(filteredActions);
//           } else {
//             throw new Error('Actions data is not an array');
//           }
//         } catch (err) {
//           setError('Failed to fetch actions. Please try again later.');
//           console.error('Actions Fetch Error:', err);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setActions([]);
//       }
//     };
//     fetchActionData();
//   }, [selectedControlId, controls, selectedAssetId, selectedScopeId, expandedFamilyId]);
  

//   // useEffect(() => {
//   //   const fetchActionData = async () => {
//   //     if (selectedControlId) {
//   //       setLoading(true);
//   //       try {
//   //         const actionResponse = await fetchActions();
//   //         if (Array.isArray(actionResponse)) {
//   //           const filteredActions = actionResponse
//   //             .filter(action => action.control_Id._id === selectedControlId)
//   //             .map(action => ({
//   //               ...action,
//   //               controlDescription: controls.find(control => control._id === action.control_Id._id)?.section_desc,
//   //             }));
//   //           setActions(filteredActions);
//   //         } else {
//   //           throw new Error('Actions data is not an array');
//   //         }
//   //       } catch (err) {
//   //         setError('Failed to fetch actions. Please try again later.');
//   //         console.error('Actions Fetch Error:', err);
//   //       } finally {
//   //         setLoading(false);
//   //       }
//   //     } else {
//   //       setActions([]);
//   //     }
//   //   };
//   //   fetchActionData();
//   // }, [selectedControlId, controls]);
  
//   // Fetch asset details
  
  
//   useEffect(() => {
//     const fetchAssetDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await getAssetDetails();
//         if (Array.isArray(response)) {
//           setAssets(response);
//         } else {
//           throw new Error('Failed to fetch asset details');
//         }
//       } catch (err) {
//         setError('Failed to fetch asset details. Please try again later.');
//         console.error('Asset Details Fetch Error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAssetDetails();
//   }, []);

//   // Update scopes based on selected asset
//   useEffect(() => {
//     if (selectedAssetId) {
//       const selectedAsset = assets.find(asset => asset._id === selectedAssetId);
//       if (selectedAsset && selectedAsset.asset.isScoped) {
//         setScopes([selectedAsset.scoped]);
//         setSelectedScopeId(selectedAsset.scoped._id);
//       } else {
//         setScopes([]);
//         setSelectedScopeId('');
//       }
//     } else {
//       setScopes([]);
//       setSelectedScopeId('');
//     }
//   }, [selectedAssetId, assets]);

//   const handleAssetChange = (event) => {
//     setSelectedAssetId(event.target.value);
//   };

//   const handleScopeChange = (event) => {
//     setSelectedScopeId(event.target.value);
//   };


//   const handleFamilyClick = (familyId) => {
//     setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
//   };

//   const handleControlClick = (controlId) => {
//     setSelectedControlId(controlId);
//   };
//   const ActionCompletionCell = ({ action, expandedFamilyId, selectedControlId, selectedAssetId, selectedScopeId, handleMarkAsCompleted }) => {
//     const [isCompleted, setIsCompleted] = useState(false);
  
//     useEffect(() => {
//       const fetchCompletionStatus = async () => {
//         const status = await checkCompletionStatus(
//           action._id,
//           selectedAssetId,
//           selectedScopeId,
//           selectedControlId,
//           expandedFamilyId
//         );
//         setIsCompleted(status);
//       };
  
//       fetchCompletionStatus();
//     }, [action._id, selectedAssetId, selectedScopeId, selectedControlId, expandedFamilyId]);
  
//     return (
//       <TableCell>
//         {
//           isCompleted ? (
//             <Button variant="contained" color="success" disabled>
//               Evidence Confirm
//             </Button>
//           ) : (
//             <Button variant="contained" color="primary" onClick={() => handleMarkAsCompleted(action._id)}>
//               Check Evidence
//             </Button>
//           )
//         }
//       </TableCell>
//     );
//   };
  

//   const checkCompletionStatus = async (actionId, assetId, scopeId, controlId, familyId) => {
//     try {
//       // Construct the params object, conditionally including scopeId if it exists
//       const params = {
//         actionId,
//         assetId,
//         controlId,
//         familyId,
//         ...(scopeId && { scopeId }), // Only include scopeId if it is not null or undefined
//       };
  
//       // Make the API request with the constructed params
//       const response = await axios.get('http://localhost:8021/api/v1/completion-status', { params });
  
//       // Return true if the response data indicates completion, otherwise false
//       return response.data ? true : false;
//     } catch (error) {
//       console.error('Error fetching completion status:', error);
//       return false;
//     }
//   };
  
//   const handleMarkAsCompleted = async (actionId) => {
//     try {
//       // Find the action by its ID
//       const action = actions.find(a => a._id === actionId);
  
//       // Check if the action is already marked as completed
//       if (action && action.isCompleted) {
//         setNotification({ message: 'This action is already marked as completed.', severity: 'info' });
//         return; // Exit the function early if the action is already completed
//       }
  
//       // Prepare completion entry details
//       const completionEntry = {
//         username: 'dummyUser', // Replace with actual username if needed
//         familyId: expandedFamilyId,
//         controlId: selectedControlId,
//         assetId: selectedAssetId,
//         ...(selectedScopeId && { scopeId: selectedScopeId }),
//         actionId: actionId,
//       };
  
//       console.log('Completion Entry:', completionEntry);
  
//       // Check if the action has already been marked as completed in the database
//       const isAlreadyCompleted = await checkCompletionStatus(
//         actionId,
//         selectedAssetId,
//         selectedScopeId,
//         selectedControlId,
//         expandedFamilyId
//       );
  
//       if (isAlreadyCompleted) {
//         setNotification({ message: 'This action is already marked as completed.', severity: 'info' });
//         return; // Exit the function early if the action is already completed
//       }
  
//       // Mark the action as completed by making an API call
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
  

//   const handleSnackbarClose = () => {
//     setNotification({ message: '', severity: 'info' });
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="new-page">
//          <div className="page-container">
//       <div className="Asset-container">
//         {/* Dropdown for Assets */}
//         <Select
//           value={selectedAssetId}
//           onChange={handleAssetChange}
//           displayEmpty
//           renderValue={(value) => value ? `Asset: ${assets.find(asset => asset._id === value).asset.name}` : 'Select Asset'}
//         >
//           {assets.map(asset => (
//             <MenuItem key={asset._id} value={asset._id}>
//               {asset.asset.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </div>

//       <div className="Scope-container">
//         {/* Dropdown for Scopes */}
//         <Select
//           value={selectedScopeId}
//           onChange={handleScopeChange}
//           displayEmpty
//           renderValue={(value) => value ? `Scope: ${scopes.find(scope => scope._id === value)?.name}` : 'Select Scope'}
//           disabled={!selectedAssetId || scopes.length === 0}
//         >
//           {scopes.map(scope => (
//             <MenuItem key={scope._id} value={scope._id}>
//               {scope.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </div>

//       {error && (
//         <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
//           <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
//             {error}
//           </Alert>
//         </Snackbar>
//       )}

//       <Snackbar open={!!notification.message} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity={notification.severity} sx={{ width: '100%' }}>
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </div>
    
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
//                   <Tooltip key={control._id} title={control.section_main_desc} placement="right">
//                     <div
//                       className={`control ${selectedControlId === control._id ? 'selected-control' : ''}`}
//                       onClick={() => handleControlClick(control._id)}
//                     >
//                       {control.section_main_desc} - {control.section}
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
//   <Table>
//     <TableHead>
//       <TableRow>
//         <TableCell>Action</TableCell>
//         <TableCell>Control Description</TableCell> {/* New column for control description */}
       
//         <TableCell>Status</TableCell> {/* New column for status */}
//         <TableCell>Completion Status</TableCell>
//         <TableCell>Upload File</TableCell>
//         <TableCell>File</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {actions.map(action => (
//         <TableRow key={action._id}>
//           <TableCell>{action.variable_id}</TableCell>
//           <TableCell>{action.controlDescription}</TableCell> {/* Display control description */}
//         <TableCell>
//         {/* New status column */}
//         {action.isCompleted ? "Completed" : "Pending"}
//       </TableCell>
//           <ActionCompletionCell
//             action={action}
//             expandedFamilyId={expandedFamilyId}
//             selectedControlId={selectedControlId}
//             selectedAssetId={selectedAssetId}
//             selectedScopeId={selectedScopeId}
//             handleMarkAsCompleted={handleMarkAsCompleted}
//           />
//           <TableCell>
//             <input type="file" />
//           </TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// </TableContainer>

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


{/* <TableContainer component={Paper}>
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
         
        </TableCell>
        <TableCell>
          {
            <Button variant="contained" color="primary" onClick={() => handleMarkAsCompleted(action._id)}>
              Mark as Completed
            </Button>
          }
        </TableCell>
   <ActionCompletionCell
action={action}
expandedFamilyId={expandedFamilyId}
selectedControlId={selectedControlId}
selectedAssetId={selectedAssetId}
selectedScopeId={selectedScopeId}
handleMarkAsCompleted={handleMarkAsCompleted}
/>
        <TableCell>
          <input
            type="file"
           
           
          />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
</TableContainer> */}
// code old

  // const handleMarkAsCompleted = async (actionId) => {
  //   try {
  //     // Find the action by its ID
  //     const action = actions.find(a => a._id === actionId);
  
  //     // Check if the action is already marked as completed
  //     if (action && action.isCompleted) {
  //       setNotification({ message: 'This action is already marked as completed.', severity: 'info' });
  //       return; // Exit the function early if the action is already completed
  //     }
  
  //     // Simulate a completion entry (replace with actual API call)
  //     const completionEntry = {
  //       username: 'dummyUser',
  //       familyId: expandedFamilyId,
  //       controlId: selectedControlId,
  //       assetId: selectedAssetId,
  //       // scopeId: selectedScopeId || null,
  //       ...(selectedScopeId && { scopeId: selectedScopeId }),
  //       actionId: actionId,
  //     };
  
  //     console.log('Completion Entry:', completionEntry);
  
  //     // Simulate marking the action as completed (replace with actual API call)
  //     const response = await axios.post(`http://localhost:8021/api/v1/completion-status`, completionEntry);
  
  //     if (response.status === 200) {
  //       setNotification({ message: 'Action marked as completed!', severity: 'success' });
  //       // Refetch actions for the selected control to update UI
  //       const updatedActionsResponse = await fetchActions();
  //       if (Array.isArray(updatedActionsResponse)) {
  //         setActions(updatedActionsResponse.filter(action => action.control_Id._id === selectedControlId));
  //       } else {
  //         throw new Error('Failed to refetch actions.');
  //       }
  //     } else {
  //       throw new Error('Failed to mark action as completed.');
  //     }
  //   } catch (error) {
  //     setNotification({ message: 'Failed to mark action as completed. Please try again later.', severity: 'error' });
  //     console.error('Mark as Completed Error:', error); // Log error details
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



// Table component

