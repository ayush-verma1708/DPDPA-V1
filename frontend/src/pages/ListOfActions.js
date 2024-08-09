import React, { useState, useEffect } from 'react';
import { fetchControlFamilies } from '../api/controlFamilyAPI';
import { fetchControls } from '../api/ControlAPI';
import { fetchActions } from '../api/actionAPI';
import { getAssetDetails, getScopedInAsset } from '../api/assetDetailsApi';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert, Select, MenuItem, Grid, Tooltip
} from '@mui/material';
import Loading from '../components/Loading';
import '../styles/ListOfActions.css';
import axios from 'axios';

const ListOfActions = () => {
  const [controlFamilies, setControlFamilies] = useState([]);
  const [controls, setControls] = useState([]);
  const [actions, setActions] = useState([]);
  const [expandedFamilyId, setExpandedFamilyId] = useState('');
  const [selectedControlId, setSelectedControlId] = useState('');
 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Asset and scope states
  const [assets, setAssets] = useState([]);
  const [scopes, setScopes] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedScope, setSelectedScope] = useState('');

  // Upload feature 
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false); // New state for upload success notification


  const handleFileUpload = async (actionId) => {
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        // Show success notification
        setUploadSuccess(true);
  
        // Refetch actions for the selected control
        const updatedActionsResponse = await fetchActions();
        if (updatedActionsResponse.data) {
          setActions(updatedActionsResponse.data.filter(action => action.control_Id && action.control_Id._id === selectedControlId));
        } else {
          throw new Error('Failed to refetch actions.');
        }
      } else {
        throw new Error('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      setError('Failed to upload file.');
    }
    fetchControls(selectedControlId);
  };
  
  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    const fetchControlFamiliesData = async () => {
      setLoading(true);
      try {
        const familyResponse = await fetchControlFamilies();
        if (familyResponse.data) {
          setControlFamilies(familyResponse.data);
        } else {
          throw new Error('No data found for control families');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch control families.');
      } finally {
        setLoading(false);
      }
    };
    fetchControlFamiliesData();
  }, []);

  useEffect(() => {
    const fetchControlData = async () => {
      if (controlFamilies.length) {
        setLoading(true);
        try {
          const controlResponse = await fetchControls();
          if (controlResponse.data) {
            setControls(controlResponse.data);
          } else {
            throw new Error('No data found for controls');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch controls.');
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
          if (actionResponse.data) {
            if (Array.isArray(actionResponse.data)) {
              setActions(actionResponse.data.filter(action => action.control_Id && action.control_Id._id === selectedControlId));
            } else {
              throw new Error('Actions data is not an array');
            }
          } else {
            throw new Error('No data found for actions');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch actions.');
        } finally {
          setLoading(false);
        }
      } else {
        setActions([]);
      }
    };
    fetchActionData();
  }, [selectedControlId]);

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        const assetResponse = await getAssetDetails();
        if (Array.isArray(assetResponse)) {
          setAssets(assetResponse);
        } else {
          console.error('Unexpected data format for assets:', assetResponse);
          setError('Failed to fetch assets.');
        }
      } catch (err) {
        console.error('Error fetching asset data:', err);
        setError('Failed to fetch assets.');
      }
    };
    fetchAssetData();
  }, []);
  
  useEffect(() => {
    const fetchScopeData = async () => {
      if (selectedAsset) {
        try {
          const scopeResponse = await getScopedInAsset(selectedAsset);
          if (scopeResponse.data) {
            setScopes(scopeResponse.data);
          } else {
            throw new Error('No data found for scopes');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch scopes.');
        }
      } else {
        setScopes([]);
      }
    };
    fetchScopeData();
  }, [selectedAsset]);

  const handleFamilyClick = (familyId) => {
    setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
  };

  const handleControlClick = (controlId) => {
    setSelectedControlId(controlId);
  };

  const handleMarkAsCompleted = async (actionId) => {
    try {
      const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}`, { isCompleted: true });
      if (response.status === 200) {
        setActions(actions.map(action =>
          action._id === actionId ? { ...action, isCompleted: true } : action
        ));
      } else {
        throw new Error('Failed to mark action as completed.');
      }
    } catch (error) {
      console.error('Error marking action as completed:', error.response ? error.response.data : error.message);
      setError('Failed to mark action as completed.');
    }
  };

  const handleAssetChange = (event) => {
    const selectedId = event.target.value;
    setSelectedAsset(selectedId);
    const selectedAsset = assets.find(asset => asset._id === selectedId);
    if (selectedAsset) {
      console.log(selectedAsset.asset.name);
    }
  };

  const handleSnackbarClose = () => {
    setUploadSuccess(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="new-page">
      <div className="top-controls">
        <Select
          value={selectedAsset}
          onChange={handleAssetChange}
          displayEmpty
        >
          <MenuItem value="">Select Asset</MenuItem>
          {assets.map(asset => (
            <MenuItem key={asset._id} value={asset._id}>{asset.asset.name}</MenuItem>
          ))}
        </Select>
        {selectedAsset && (
          <Select
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Select Scope</MenuItem>
            {scopes.map(scoped => (
              <MenuItem key={scoped._id} value={scoped._id}>{scoped.name}</MenuItem>
            ))}
          </Select>
        )}
      </div>
      {/* <div className="sidebar">
        {controlFamilies.map(family => (
          
          <div key={family._id} className="control-family">
            <div className="control-family-header" onClick={() => handleFamilyClick(family._id)}>
              {family.name}
            </div>
            {expandedFamilyId === family._id && (
              <div className="controls">
                {controls
                  .filter(control => control.control_Family_Id._id === family._id)
                  .map(control => (
                    <div key={control._id} className="control" onClick={() => handleControlClick(control._id)}>
                      {control.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
       */}
         <div className="sidebar">
        {controlFamilies.map(family => (
          <Tooltip
            key={family._id}
            title={`Total Controls: ${family.info.controlsCount}, Completed Controls: ${family.info.completedControls}`}
            placement="right"
          >
            <div className="control-family">
              <div className="control-family-header" onClick={() => handleFamilyClick(family._id)}>
                {family.name}
              </div>
              {expandedFamilyId === family._id && (
                <div className="controls">
                  {controls
                    .filter(control => control.control_Family_Id._id === family._id)
                    .map(control => (
                      <Tooltip
                        key={control._id}
                        title={`Total Actions: ${control.info.actionsCount}, Completed Actions: ${control.info.completedActions}`}
                        placement="right"
                      >
                        <div className="control" onClick={() => handleControlClick(control._id)}>
                          {control.name}
                        </div>
                      </Tooltip>
                    ))}
                </div>
              )}
            </div>
          </Tooltip>
        ))}
      </div>
      <div className="content">
        {error && (
          <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
            <Alert onClose={() => setError('')} severity="error">{error}</Alert>
          </Snackbar>
        )}
        {uploadSuccess && (
          <Snackbar open={uploadSuccess} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="success">File uploaded successfully!</Alert>
          </Snackbar>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Action ID</TableCell>
                <TableCell>Action Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>File Upload</TableCell>
                <TableCell>Files</TableCell>
                <TableCell>Mark as Completed</TableCell>
              </TableRow>
            </TableHead>
            
             <TableBody>
            {actions.map(action => (
              <TableRow key={action._id}>
                <TableCell>{action._id}</TableCell>
                <TableCell>{action.name}</TableCell>
                <TableCell>{action.isCompleted ? 'Completed' : 'Pending'}</TableCell>
                <TableCell>
                  <input type="file" onChange={handleFileChange} />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleFileUpload(action._id)}
                  >
                    Upload
                  </Button>
                </TableCell>
                <TableCell>
                  {action.files && action.files.length > 0 ? (
                    <Grid container spacing={1}>
                      {action.files.map((file, index) => (
                        <Grid item key={index}>
                          <a href={`http://localhost:8021/api/v1/actions/files/${file.path.split('/').pop()}`} target="_blank" rel="noopener noreferrer">
                            {file.name}
                          </a>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <p>No files uploaded</p>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleMarkAsCompleted(action._id)}
                    disabled={action.isCompleted}
                  >
                    Mark as Completed
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ListOfActions;

// import React, { useState, useEffect } from 'react';
// import { fetchControlFamilies } from '../api/controlFamilyAPI';
// import { fetchControls } from '../api/ControlAPI';
// import { fetchActions } from '../api/actionAPI';
// import { getAssetDetails, getScopedInAsset } from '../api/assetDetailsApi';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert, Select, MenuItem
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


//   // upload feature 

//   const [selectedFile, setSelectedFile] = useState(null);
//   const handleFileUpload = async (actionId) => {
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}/upload`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (response.status === 200) {
//         // Update actions state with the new file path if necessary
//         console.log('File uploaded successfully:', response.data.filePath);
//       } else {
//         throw new Error('Failed to upload file.');
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error.response ? error.response.data : error.message);
//     }
//     fetchActions()
//   };

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   useEffect(() => {
//     const fetchControlFamiliesData = async () => {
//       setLoading(true);
//       try {
//         const familyResponse = await fetchControlFamilies();
//         if (familyResponse.data) {
//           setControlFamilies(familyResponse.data);
//         } else {
//           throw new Error('No data found for control families');
//         }
//       } catch (err) {
//         console.error(err);
//         setError('Failed to fetch control families.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchControlFamiliesData();
//   }, []);

//   useEffect(() => {
//     const fetchControlData = async () => {
//       if (controlFamilies.length) {
//         setLoading(true);
//         try {
//           const controlResponse = await fetchControls();
//           if (controlResponse.data) {
//             setControls(controlResponse.data);
//           } else {
//             throw new Error('No data found for controls');
//           }
//         } catch (err) {
//           console.error(err);
//           setError('Failed to fetch controls.');
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
//           if (actionResponse.data) {
//             if (Array.isArray(actionResponse.data)) {
//               setActions(actionResponse.data.filter(action => action.control_Id && action.control_Id._id === selectedControlId));
//             } else {
//               throw new Error('Actions data is not an array');
//             }
//           } else {
//             throw new Error('No data found for actions');
//           }
//         } catch (err) {
//           console.error(err);
//           setError('Failed to fetch actions.');
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
//           console.error('Unexpected data format for assets:', assetResponse);
//           setError('Failed to fetch assets.');
//         }
//       } catch (err) {
//         console.error('Error fetching asset data:', err);
//         setError('Failed to fetch assets.');
//       }
//     };
//     fetchAssetData();
//   }, []);
  
//   useEffect(() => {
//     const fetchScopeData = async () => {
//       if (selectedAsset) {
//         try {
//           const scopeResponse = await getScopedInAsset(selectedAsset);
//           if (scopeResponse.data) {
//             setScopes(scopeResponse.data);
//           } else {
//             throw new Error('No data found for scopes');
//           }
//         } catch (err) {
//           console.error(err);
//           setError('Failed to fetch scopes.');
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
//       console.error('Error marking action as completed:', error.response ? error.response.data : error.message);
//       setError('Failed to mark action as completed.');
//     }
//   };



//   const handleAssetChange = (event) => {
//     const selectedId = event.target.value;
//     setSelectedAsset(selectedId);
//     const selectedAsset = assets.find(asset => asset._id === selectedId);
//     if (selectedAsset) {
//       console.log(selectedAsset.asset.name);
//     }
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
//             <MenuItem key={asset._id} value={asset._id}>{asset.asset.name}</MenuItem>
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
//           <div key={family._id} className="control-family">
//             <div className="control-family-header" onClick={() => handleFamilyClick(family._id)}>
//               {family.name}
//             </div>
//             {expandedFamilyId === family._id && (
//               <div className="controls">
//                 {controls
//                   .filter(control => control.control_Family_Id._id === family._id)
//                   .map(control => (
//                     <div key={control._id} className="control" onClick={() => handleControlClick(control._id)}>
//                       {control.name}
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       <div className="content">
//         {error && (
//           <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
//             <Alert onClose={() => setError('')} severity="error">{error}</Alert>
//           </Snackbar>
//         )}
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Action ID</TableCell>
//                 <TableCell>Action Name</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>File Upload</TableCell>
//                 <TableCell>Files</TableCell>
//                 <TableCell>Mark as Completed</TableCell>
//               </TableRow>
//             </TableHead>
            
//              <TableBody>
//             {actions.map(action => (
//               <TableRow key={action._id}>
//                 <TableCell>{action._id}</TableCell>
//                 <TableCell>{action.name}</TableCell>
//                 <TableCell>{action.isCompleted ? 'Completed' : 'Pending'}</TableCell>
//                 <TableCell>
//                   <input type="file" onChange={handleFileChange} />
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleFileUpload(action._id)}
//                   >
//                     Upload
//                   </Button>
//                 </TableCell>
//                 <TableCell>
//                   {action.files && action.files.length > 0 ? (
//                     <ul>
//                       {action.files.map((file, index) => (
//                         <li key={index}>
//                           <a href={`http://localhost:8021/api/v1/actions/files/${file.path.split('/').pop()}`} target="_blank" rel="noopener noreferrer">
//                             {file.name}
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No files uploaded</p>
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleMarkAsCompleted(action._id)}
//                     disabled={action.isCompleted}
//                   >
//                     Mark as Completed
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//           </Table>
//         </TableContainer>
//       </div>
//     </div>
//   );
// };

// export default ListOfActions;


// // import React, { useState, useEffect } from 'react';
// // import { fetchControlFamilies } from '../api/controlFamilyAPI';
// // import { fetchControls } from '../api/ControlAPI';
// // import { fetchActions } from '../api/actionAPI';
// // import { getAssetDetails, getScopedInAsset } from '../api/assetDetailsApi';
// // import {
// //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert, Select, MenuItem
// // } from '@mui/material';
// // import Loading from '../components/Loading';
// // import '../styles/ListOfActions.css';
// // import axios from 'axios';

// // const ListOfActions = () => {
// //   const [controlFamilies, setControlFamilies] = useState([]);
// //   const [controls, setControls] = useState([]);
// //   const [actions, setActions] = useState([]);
// //   const [expandedFamilyId, setExpandedFamilyId] = useState('');
// //   const [selectedControlId, setSelectedControlId] = useState('');
 
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(true);

// //   // Asset and scope states
// //   const [assets, setAssets] = useState([]);
// //   const [scopes, setScopes] = useState([]);
// //   const [selectedAsset, setSelectedAsset] = useState('');
// //   const [selectedScope, setSelectedScope] = useState('');


// //   // upload feature 

// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const handleFileUpload = async (actionId) => {
// //     if (!selectedFile) return;

// //     const formData = new FormData();
// //     formData.append('file', selectedFile);

// //     try {
// //       const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}/upload`, formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data'
// //         }
// //       });

// //       if (response.status === 200) {
// //         // Update actions state with the new file path if necessary
// //         console.log('File uploaded successfully:', response.data.filePath);
// //       } else {
// //         throw new Error('Failed to upload file.');
// //       }
// //     } catch (error) {
// //       console.error('Error uploading file:', error.response ? error.response.data : error.message);
// //     }
// //     fetchActions()
// //   };

// //   const handleFileChange = (event) => {
// //     setSelectedFile(event.target.files[0]);
// //   };

// //   useEffect(() => {
// //     const fetchControlFamiliesData = async () => {
// //       setLoading(true);
// //       try {
// //         const familyResponse = await fetchControlFamilies();
// //         if (familyResponse.data) {
// //           setControlFamilies(familyResponse.data);
// //         } else {
// //           throw new Error('No data found for control families');
// //         }
// //       } catch (err) {
// //         console.error(err);
// //         setError('Failed to fetch control families.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchControlFamiliesData();
// //   }, []);

// //   useEffect(() => {
// //     const fetchControlData = async () => {
// //       if (controlFamilies.length) {
// //         setLoading(true);
// //         try {
// //           const controlResponse = await fetchControls();
// //           if (controlResponse.data) {
// //             setControls(controlResponse.data);
// //           } else {
// //             throw new Error('No data found for controls');
// //           }
// //         } catch (err) {
// //           console.error(err);
// //           setError('Failed to fetch controls.');
// //         } finally {
// //           setLoading(false);
// //         }
// //       }
// //     };
// //     fetchControlData();
// //   }, [controlFamilies]);

// //   useEffect(() => {
// //     const fetchActionData = async () => {
// //       if (selectedControlId) {
// //         setLoading(true);
// //         try {
// //           const actionResponse = await fetchActions();
// //           if (actionResponse.data) {
// //             if (Array.isArray(actionResponse.data)) {
// //               setActions(actionResponse.data.filter(action => action.control_Id && action.control_Id._id === selectedControlId));
// //             } else {
// //               throw new Error('Actions data is not an array');
// //             }
// //           } else {
// //             throw new Error('No data found for actions');
// //           }
// //         } catch (err) {
// //           console.error(err);
// //           setError('Failed to fetch actions.');
// //         } finally {
// //           setLoading(false);
// //         }
// //       } else {
// //         setActions([]);
// //       }
// //     };
// //     fetchActionData();
// //   }, [selectedControlId]);

// //   useEffect(() => {
// //     const fetchAssetData = async () => {
// //       try {
// //         const assetResponse = await getAssetDetails();
// //         if (Array.isArray(assetResponse)) {
// //           setAssets(assetResponse);
// //         } else {
// //           console.error('Unexpected data format for assets:', assetResponse);
// //           setError('Failed to fetch assets.');
// //         }
// //       } catch (err) {
// //         console.error('Error fetching asset data:', err);
// //         setError('Failed to fetch assets.');
// //       }
// //     };
// //     fetchAssetData();
// //   }, []);
  
// //   useEffect(() => {
// //     const fetchScopeData = async () => {
// //       if (selectedAsset) {
// //         try {
// //           const scopeResponse = await getScopedInAsset(selectedAsset);
// //           if (scopeResponse.data) {
// //             setScopes(scopeResponse.data);
// //           } else {
// //             throw new Error('No data found for scopes');
// //           }
// //         } catch (err) {
// //           console.error(err);
// //           setError('Failed to fetch scopes.');
// //         }
// //       } else {
// //         setScopes([]);
// //       }
// //     };
// //     fetchScopeData();
// //   }, [selectedAsset]);

// //   const handleFamilyClick = (familyId) => {
// //     setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
// //   };

// //   const handleControlClick = (controlId) => {
// //     setSelectedControlId(controlId);
// //   };


// //   const handleMarkAsCompleted = async (actionId) => {
// //     try {
// //       const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}`, { isCompleted: true });
// //       if (response.status === 200) {
// //         setActions(actions.map(action =>
// //           action._id === actionId ? { ...action, isCompleted: true } : action
// //         ));
// //       } else {
// //         throw new Error('Failed to mark action as completed.');
// //       }
// //     } catch (error) {
// //       console.error('Error marking action as completed:', error.response ? error.response.data : error.message);
// //       setError('Failed to mark action as completed.');
// //     }
// //   };



// //   const handleAssetChange = (event) => {
// //     const selectedId = event.target.value;
// //     setSelectedAsset(selectedId);
// //     const selectedAsset = assets.find(asset => asset._id === selectedId);
// //     if (selectedAsset) {
// //       console.log(selectedAsset.asset.name);
// //     }
// //   };


  
// //   if (loading) {
// //     return <Loading />;
// //   }

// //   return (
// //     <div className="new-page">
// //       <div className="top-controls">
// //         <Select
// //           value={selectedAsset}
// //           onChange={handleAssetChange}
// //           displayEmpty
// //         >
// //           <MenuItem value="">Select Asset</MenuItem>
// //           {assets.map(asset => (
// //             <MenuItem key={asset._id} value={asset._id}>{asset.asset.name}</MenuItem>
// //           ))}
// //         </Select>
// //         {selectedAsset && (
// //           <Select
// //             value={selectedScope}
// //             onChange={(e) => setSelectedScope(e.target.value)}
// //             displayEmpty
// //           >
// //             <MenuItem value="">Select Scope</MenuItem>
// //             {scopes.map(scoped => (
// //               <MenuItem key={scoped._id} value={scoped._id}>{scoped.name}</MenuItem>
// //             ))}
// //           </Select>
// //         )}
// //       </div>
// //       <div className="sidebar">
// //         {controlFamilies.map(family => (
// //           <div key={family._id} className="control-family">
// //             <div className="control-family-header" onClick={() => handleFamilyClick(family._id)}>
// //               {family.name}
// //             </div>
// //             {expandedFamilyId === family._id && (
// //               <div className="controls">
// //                 {controls
// //                   .filter(control => control.control_Family_Id._id === family._id)
// //                   .map(control => (
// //                     <div key={control._id} className="control" onClick={() => handleControlClick(control._id)}>
// //                       {control.name}
// //                     </div>
// //                   ))}
// //               </div>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //       <div className="content">
// //         {error && (
// //           <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
// //             <Alert onClose={() => setError('')} severity="error">{error}</Alert>
// //           </Snackbar>
// //         )}
// //         <TableContainer component={Paper}>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>Action ID</TableCell>
// //                 <TableCell>Action Name</TableCell>
// //                 {/* <TableCell>Due Date</TableCell> */}
// //                 <TableCell>Status</TableCell>
// //                 <TableCell>File Upload</TableCell>
// //                 <TableCell>Files</TableCell>
// //                 <TableCell>Mark as Completed</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             {/* <TableBody>
// //               {actions.map(action => (
// //                 <TableRow key={action._id}>
// //                   <TableCell>{action._id}</TableCell>
// //                   <TableCell>{action.name}</TableCell>
// //                   <TableCell>{new Date(action.dueDate).toLocaleDateString()}</TableCell>
// //                   <TableCell>{action.isCompleted ? 'Completed' : 'Pending'}</TableCell>
// //                   <TableCell>
// //                     <input
// //                       type="file"
// //                     />
// //                     <Button
// //                       variant="contained"
// //                       color="primary"
                      
// //                     >
// //                       Upload
// //                     </Button>
// //                   </TableCell>
// //                   <TableCell>
// //                     {action.files && action.files.length > 0 ? (
// //                       <ul>
// //                         {action.files.map((file, index) => (
// //                           <li key={index}>
// //                             <a href={file.path} target="_blank" rel="noopener noreferrer">View File</a>
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     ) : (
// //                       <p>No files uploaded</p>
// //                     )}
// //                   </TableCell>
// //                   <TableCell>
// //                     <Button
// //                       variant="contained"
// //                       color="primary"
// //                       onClick={() => handleMarkAsCompleted(action._id)}
// //                       disabled={action.isCompleted}
// //                     >
// //                       Mark as Completed
// //                     </Button>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //              */}
// //              <TableBody>
// //             {actions.map(action => (
// //               <TableRow key={action._id}>
// //                 <TableCell>{action._id}</TableCell>
// //                 <TableCell>{action.name}</TableCell>
// //                 <TableCell>{action.isCompleted ? 'Completed' : 'Pending'}</TableCell>
// //                 <TableCell>
// //                   <input type="file" onChange={handleFileChange} />
// //                   <Button
// //                     variant="contained"
// //                     color="primary"
// //                     onClick={() => handleFileUpload(action._id)}
// //                   >
// //                     Upload
// //                   </Button>
// //                 </TableCell>
// //                 <TableCell>
// //                   {action.files && action.files.length > 0 ? (
// //                     <ul>
// //                       {action.files.map((file, index) => (
// //                         <li key={index}>
// //                           <a href={`http://localhost:8021/api/v1/actions/files/${file.path.split('/').pop()}`} target="_blank" rel="noopener noreferrer">
// //                             {file.name}
// //                           </a>
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   ) : (
// //                     <p>No files uploaded</p>
// //                   )}
// //                 </TableCell>
// //                 <TableCell>
// //                   <Button
// //                     variant="contained"
// //                     color="primary"
// //                     onClick={() => handleMarkAsCompleted(action._id)}
// //                     disabled={action.isCompleted}
// //                   >
// //                     Mark as Completed
// //                   </Button>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ListOfActions;

// // import React, { useState, useEffect } from 'react';
// // import { fetchControlFamilies } from '../api/controlFamilyAPI';
// // import { fetchControls } from '../api/ControlAPI';
// // import { fetchActions } from '../api/actionAPI';
// // import { uploadActionFile } from '../api/uploadAPI';
// // import { getAssetDetails, getScopedInAsset } from '../api/assetDetailsApi'; // Import the new API functions
// // import {
// //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Snackbar, Alert, Select, MenuItem
// // } from '@mui/material';
// // import Loading from '../components/Loading'; // Import the Loading component
// // import '../styles/ListOfActions.css';
// // import axios from 'axios';

// // const ListOfActions = () => {
// //   const [controlFamilies, setControlFamilies] = useState([]);
// //   const [controls, setControls] = useState([]);
// //   const [actions, setActions] = useState([]);
// //   const [expandedFamilyId, setExpandedFamilyId] = useState('');
// //   const [selectedControlId, setSelectedControlId] = useState('');
// //   const [file, setFile] = useState(null);
// //   const [uploading, setUploading] = useState(false);
// //   const [submitted, setSubmitted] = useState(false);
// //   const [error, setError] = useState('');
// //   const [pdfUrl, setPdfUrl] = useState('');
// //   const [loading, setLoading] = useState(true); // Add loading state

// //   // Asset and scope states
// //   const [assets, setAssets] = useState([]);
// //   const [scopes, setScopes] = useState([]);
// //   const [selectedAsset, setSelectedAsset] = useState('');
// //   const [selectedScope, setSelectedScope] = useState('');

// //   useEffect(() => {
// //     const fetchControlFamiliesData = async () => {
// //       setLoading(true); // Set loading to true before fetching data
// //       try {
// //         const familyResponse = await fetchControlFamilies();
// //         if (familyResponse.data) {
// //           setControlFamilies(familyResponse.data);
// //         } else {
// //           throw new Error('No data found for control families');
// //         }
// //       } catch (err) {
// //         console.error(err);
// //         setError('Failed to fetch control families.');
// //       } finally {
// //         setLoading(false); // Set loading to false after fetching data
// //       }
// //     };
// //     fetchControlFamiliesData();
// //   }, []);

// //   useEffect(() => {
// //     const fetchControlData = async () => {
// //       if (controlFamilies.length) {
// //         setLoading(true); // Set loading to true before fetching data
// //         try {
// //           const controlResponse = await fetchControls();
// //           if (controlResponse.data) {
// //             setControls(controlResponse.data);
// //           } else {
// //             throw new Error('No data found for controls');
// //           }
// //         } catch (err) {
// //           console.error(err);
// //           setError('Failed to fetch controls.');
// //         } finally {
// //           setLoading(false); // Set loading to false after fetching data
// //         }
// //       }
// //     };
// //     fetchControlData();
// //   }, [controlFamilies]);

// //   useEffect(() => {
// //     const fetchActionData = async () => {
// //       if (selectedControlId) {
// //         setLoading(true); // Set loading to true before fetching data
// //         try {
// //           const actionResponse = await fetchActions();
// //           if (actionResponse.data) {
// //             if (Array.isArray(actionResponse.data)) {
// //               setActions(actionResponse.data.filter(action => action.control_Id && action.control_Id._id === selectedControlId));
// //             } else {
// //               throw new Error('Actions data is not an array');
// //             }
// //           } else {
// //             throw new Error('No data found for actions');
// //           }
// //         } catch (err) {
// //           console.error(err);
// //           setError('Failed to fetch actions.');
// //         } finally {
// //           setLoading(false); // Set loading to false after fetching data
// //         }
// //       } else {
// //         setActions([]);
// //       }
// //     };
// //     fetchActionData();
// //   }, [selectedControlId]);

// //   // useEffect(() => {
// //   //   const fetchAssetData = async () => {
// //   //     try {
// //   //       const assetResponse = await getAssetDetails();
// //   //       if (assetResponse.data) {
// //   //         setAssets(assetResponse.data);
// //   //       } else {
// //   //         throw new Error('No data found for assets');
// //   //       }
// //   //     } catch (err) {
// //   //       console.error(err);
// //   //       setError('Failed to fetch assets.');
// //   //     }
// //   //   };
// //   //   fetchAssetData();
// //   // }, []);


// //   useEffect(() => {
// //     const fetchAssetData = async () => {
// //       try {
// //         const assetResponse = await getAssetDetails();
// //         if (Array.isArray(assetResponse)) {
// //           setAssets(assetResponse);
// //         } else {
// //           console.error('Unexpected data format for assets:', assetResponse);
// //           setError('Failed to fetch assets.');
// //         }
// //       } catch (err) {
// //         console.error('Error fetching asset data:', err);
// //         setError('Failed to fetch assets.');
// //       }
// //     };
// //     fetchAssetData();
// //   }, []);
  
  
// //   useEffect(() => {
// //     const fetchScopeData = async () => {
// //       if (selectedAsset) {
// //         try {
// //           const scopeResponse = await getScopedInAsset(selectedAsset);
// //           if (scopeResponse.data) {
// //             setScopes(scopeResponse.data);
// //           } else {
// //             throw new Error('No data found for scopes');
// //           }
// //         } catch (err) {
// //           console.error(err);
// //           setError('Failed to fetch scopes.');
// //         }
// //       } else {
// //         setScopes([]);
// //       }
// //     };
// //     fetchScopeData();
// //   }, [selectedAsset]);

// //   const handleFamilyClick = (familyId) => {
// //     setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
// //   };

// //   const handleControlClick = (controlId) => {
// //     setSelectedControlId(controlId);
// //   };

// //   const handleFileChange = (event) => {
// //     setFile(event.target.files[0]);
// //     setSubmitted(false);
// //   };

// //   const handleFileUpload = async (actionId) => {
// //     if (file) {
// //       const formData = new FormData();
// //       formData.append('file', file);
// //       formData.append('actionId', actionId);

// //       setUploading(true);
// //       try {
// //         const response = await uploadActionFile(formData);
// //         if (response.file && response.file.path) {
// //           setPdfUrl(response.file.path);
// //           setSubmitted(true);
// //           setError(''); // Clear error if successful
// //         } else {
// //           throw new Error('File upload response does not contain the expected data');
// //         }
// //       } catch (err) {
// //         console.error(err);
// //         setError('Failed to upload file');
// //       } finally {
// //         setUploading(false);
// //       }
// //     } else {
// //       setError('No file selected');
// //     }
// //   };

// //   const handleMarkAsCompleted = async (actionId) => {
// //     try {
// //       const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}`, { isCompleted: true });
// //       if (response.status === 200) { // Check if the response status is OK
// //         setActions(actions.map(action =>
// //           action._id === actionId ? { ...action, isCompleted: true } : action
// //         ));
// //       } else {
// //         throw new Error('Failed to mark action as completed.');
// //       }
// //     } catch (error) {
// //       console.error('Error marking action as completed:', error.response ? error.response.data : error.message);
// //       setError('Failed to mark action as completed.');
// //     }
// //   };

// //   const handleAssetChange = (event) => {
// //     const selectedId = event.target.value;
// //     setSelectedAsset(selectedId);
// //     const selectedAsset = assets.find(asset => asset._id === selectedId);
// //     if (selectedAsset) {
// //       console.log(selectedAsset.asset.name);
// //     }
// //   };


// //   if (loading) {
// //     return <Loading />; // Show the loading animation while data is loading
// //   }

// //   return (
// //     <div className="new-page">
// //       <div className="top-controls">
        
// //         <Select
// //           value={selectedAsset}
// //           // onChange={(e) => setSelectedAsset(e.target.value)}
// //           onChange={handleAssetChange}
// //           displayEmpty
// //         >
// //           <MenuItem value="">Select Asset</MenuItem>
// //           {assets.map(asset => (
// //             <MenuItem key={asset._id} value={asset._id}  >{asset.asset.name}</MenuItem>
// //           ))}
// //         </Select>
// //         {selectedAsset && (
// //           <Select
// //             value={selectedScope}
// //             onChange={(e) => setSelectedScope(e.target.value)}
// //             displayEmpty
// //           >
// //             <MenuItem value="">Select Scope</MenuItem>
// //             {scopes.map(scoped => (
// //               <MenuItem key={scoped._id} value={scoped._id}>{scoped.name}</MenuItem>
// //             ))}
// //           </Select>
// //         )}
// //       </div>
// //       <div className="sidebar">
// //         {controlFamilies.map(family => (
// //           <div key={family._id} className="control-family">
// //             <div className="control-family-header" onClick={() => handleFamilyClick(family._id)}>
// //               {family.name}
// //             </div>
// //             {expandedFamilyId === family._id && (
// //               <div className="controls">
// //                 {controls
// //                   .filter(control => control.control_Family_Id._id === family._id)
// //                   .map(control => (
// //                     <div key={control._id} className="control" onClick={() => handleControlClick(control._id)}>
// //                       {control.name}
// //                     </div>
// //                   ))}
// //               </div>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //       <div className="content">
// //         {error && (
// //           <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
// //             <Alert onClose={() => setError('')} severity="error">{error}</Alert>
// //           </Snackbar>
// //         )}
// //         <TableContainer component={Paper}>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>Action ID</TableCell>
// //                 <TableCell>Action Name</TableCell>
// //                 <TableCell>Status</TableCell>
// //                 <TableCell>Upload</TableCell>
// //                 <TableCell>Submit</TableCell>
// //                 <TableCell>View PDF</TableCell>
// //                 <TableCell>Mark as Completed</TableCell> {/* New Column */}
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {actions.length > 0 ? (
// //                 actions.map(action => (
// //                   <TableRow key={action._id}>
// //                     <TableCell>{action.FixedID}</TableCell>
// //                     <TableCell>{action.name}</TableCell>
// //                     <TableCell>{action.isCompleted ? 'Completed' : 'Pending'}</TableCell>
// //                     <TableCell>
// //                       <TextField type="file" onChange={handleFileChange} />
// //                     </TableCell>
// //                     <TableCell>
// //                       <Button
// //                         variant="contained"
// //                         color="primary"
// //                         onClick={() => handleFileUpload(action._id)}
// //                         disabled={uploading}
// //                       >
// //                         {uploading ? 'Uploading...' : 'Submit'}
// //                       </Button>
// //                     </TableCell>
// //                     <TableCell>
// //                       {submitted && pdfUrl && (
// //                         <Button
// //                           variant="contained"
// //                           color="primary"
// //                           href={pdfUrl}
// //                           target="_blank"
// //                           rel="noopener noreferrer"
// //                         >
// //                           View PDF
// //                         </Button>
// //                       )}
// //                     </TableCell>
// //                     <TableCell> {/* New Column */}
// //                       <Button
// //                         variant="contained"
// //                         color="primary"
// //                         onClick={() => handleMarkAsCompleted(action._id)}
// //                         disabled={action.isCompleted}
// //                       >
// //                         Mark as Completed
// //                       </Button>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))
// //               ) : (
// //                 <TableRow>
// //                   <TableCell colSpan={7} align="center">
// //                     {selectedControlId ? 'No actions found for this control' : 'Please select a control to view actions'}
// //                   </TableCell>
// //                 </TableRow>
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ListOfActions;


// // import React, { useState, useEffect } from 'react';
// // import { fetchControlFamilies } from '../api/controlFamilyAPI';
// // import { fetchControls } from '../api/ControlAPI';
// // import { fetchActions } from '../api/actionAPI';
// // import { uploadActionFile } from '../api/uploadAPI';
// // import {
// //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Snackbar, Alert, Select, MenuItem
// // } from '@mui/material';
// // import Loading from '../components/Loading'; // Import the Loading component
// // import '../styles/ListOfActions.css';
// // import axios from 'axios';

// // const ListOfActions = () => {
// //   const [controlFamilies, setControlFamilies] = useState([]);
// //   const [controls, setControls] = useState([]);
// //   const [actions, setActions] = useState([]);
// //   const [expandedFamilyId, setExpandedFamilyId] = useState('');
// //   const [selectedControlId, setSelectedControlId] = useState('');
// //   const [file, setFile] = useState(null);
// //   const [uploading, setUploading] = useState(false);
// //   const [submitted, setSubmitted] = useState(false);
// //   const [error, setError] = useState('');
// //   const [pdfUrl, setPdfUrl] = useState('');
// //   const [loading, setLoading] = useState(true); // Add loading state

// //   useEffect(() => {
// //     const fetchControlFamiliesData = async () => {
// //       setLoading(true); // Set loading to true before fetching data
// //       try {
// //         const familyResponse = await fetchControlFamilies();
// //         if (familyResponse.data) {
// //           setControlFamilies(familyResponse.data);
// //         } else {
// //           throw new Error('No data found for control families');
// //         }
// //       } catch (err) {
// //         console.error(err);
// //         setError('Failed to fetch control families.');
// //       } finally {
// //         setLoading(false); // Set loading to false after fetching data
// //       }
// //     };
// //     fetchControlFamiliesData();
// //   }, []);

// //   useEffect(() => {
// //     const fetchControlData = async () => {
// //       if (controlFamilies.length) {
// //         setLoading(true); // Set loading to true before fetching data
// //         try {
// //           const controlResponse = await fetchControls();
// //           if (controlResponse.data) {
// //             setControls(controlResponse.data);
// //           } else {
// //             throw new Error('No data found for controls');
// //           }
// //         } catch (err) {
// //           console.error(err);
// //           setError('Failed to fetch controls.');
// //         } finally {
// //           setLoading(false); // Set loading to false after fetching data
// //         }
// //       }
// //     };
// //     fetchControlData();
// //   }, [controlFamilies]);

// //   useEffect(() => {
// //     const fetchActionData = async () => {
// //       if (selectedControlId) {
// //         setLoading(true); // Set loading to true before fetching data
// //         try {
// //           const actionResponse = await fetchActions();
// //           if (actionResponse.data) {
// //             if (Array.isArray(actionResponse.data)) {
// //               setActions(actionResponse.data.filter(action => action.control_Id && action.control_Id._id === selectedControlId));
// //             } else {
// //               throw new Error('Actions data is not an array');
// //             }
// //           } else {
// //             throw new Error('No data found for actions');
// //           }
// //         } catch (err) {
// //           console.error(err);
// //           setError('Failed to fetch actions.');
// //         } finally {
// //           setLoading(false); // Set loading to false after fetching data
// //         }
// //       } else {
// //         setActions([]);
// //       }
// //     };
// //     fetchActionData();
// //   }, [selectedControlId]);


// //   const handleFamilyClick = (familyId) => {
// //     setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
// //   };

// //   const handleControlClick = (controlId) => {
// //     setSelectedControlId(controlId);
// //   };

// //   const handleFileChange = (event) => {
// //     setFile(event.target.files[0]);
// //     setSubmitted(false);
// //   };

// //   const handleFileUpload = async (actionId) => {
// //     if (file) {
// //       const formData = new FormData();
// //       formData.append('file', file);
// //       formData.append('actionId', actionId);

// //       setUploading(true);
// //       try {
// //         const response = await uploadActionFile(formData);
// //         if (response.file && response.file.path) {
// //           setPdfUrl(response.file.path);
// //           setSubmitted(true);
// //           setError(''); // Clear error if successful
// //         } else {
// //           throw new Error('File upload response does not contain the expected data');
// //         }
// //       } catch (err) {
// //         console.error(err);
// //         setError('Failed to upload file');
// //       } finally {
// //         setUploading(false);
// //       }
// //     } else {
// //       setError('No file selected');
// //     }
// //   };

// //   const handleMarkAsCompleted = async (actionId) => {
// //     try {
// //       const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}`, { isCompleted: true });
// //       if (response.status === 200) { // Check if the response status is OK
// //         setActions(actions.map(action =>
// //           action._id === actionId ? { ...action, isCompleted: true } : action
// //         ));
// //       } else {
// //         throw new Error('Failed to mark action as completed.');
// //       }
// //     } catch (error) {
// //       console.error('Error marking action as completed:', error.response ? error.response.data : error.message);
// //       setError('Failed to mark action as completed.');
// //     }
// //   };


// //   if (loading) {
// //     return <Loading />; // Show the loading animation while data is loading
// //   }

// //   return (
// //     <div className="new-page">
// //       {/* <div className="top-controls">
// //         <Select value={selectedAsset} onChange={handleAssetChange}>
// //           <MenuItem value="">Select Asset</MenuItem>
// //           {assets.map(asset => (
// //             <MenuItem key={asset._id} value={asset._id}>{asset.name}</MenuItem>
// //           ))}
// //         </Select>
// //         {selectedAsset && (
// //           <Select value={selectedScope} onChange={handleScopeChange}>
// //             <MenuItem value="">Select Scope</MenuItem>
// //             {scopes.map(scope => (
// //               <MenuItem key={scope._id} value={scope._id}>{scope.name}</MenuItem>
// //             ))}
// //           </Select>
// //         )}
// //       </div> */}
// //       <div className="sidebar">
// //         {controlFamilies.map(family => (
// //           <div key={family._id} className="control-family">
// //             <div className="control-family-header" onClick={() => handleFamilyClick(family._id)}>
// //               {family.name}
// //             </div>
// //             {expandedFamilyId === family._id && (
// //               <div className="controls">
// //                 {controls
// //                   .filter(control => control.control_Family_Id._id === family._id)
// //                   .map(control => (
// //                     <div key={control._id} className="control" onClick={() => handleControlClick(control._id)}>
// //                       {control.name}
// //                     </div>
// //                   ))}
// //               </div>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //       <div className="content">
// //         {error && (
// //           <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
// //             <Alert onClose={() => setError('')} severity="error">{error}</Alert>
// //           </Snackbar>
// //         )}
// //         <TableContainer component={Paper}>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>Action ID</TableCell>
// //                 <TableCell>Action Name</TableCell>
// //                 <TableCell>Status</TableCell>
// //                 <TableCell>Upload</TableCell>
// //                 <TableCell>Submit</TableCell>
// //                 <TableCell>View PDF</TableCell>
// //                 <TableCell>Mark as Completed</TableCell> {/* New Column */}
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {actions.length > 0 ? (
// //                 actions.map(action => (
// //                   <TableRow key={action._id}>
// //                     <TableCell>{action.FixedID}</TableCell>
// //                     <TableCell>{action.name}</TableCell>
// //                     <TableCell>{action.isCompleted ? 'Completed' : 'Pending'}</TableCell>
// //                     <TableCell>
// //                       <TextField type="file" onChange={handleFileChange} />
// //                     </TableCell>
// //                     <TableCell>
// //                       <Button
// //                         variant="contained"
// //                         color="primary"
// //                         onClick={() => handleFileUpload(action._id)}
// //                         disabled={uploading}
// //                       >
// //                         {uploading ? 'Uploading...' : 'Submit'}
// //                       </Button>
// //                     </TableCell>
// //                     <TableCell>
// //                       {submitted && pdfUrl && (
// //                         <Button
// //                           variant="contained"
// //                           color="primary"
// //                           href={pdfUrl}
// //                           target="_blank"
// //                           rel="noopener noreferrer"
// //                         >
// //                           View PDF
// //                         </Button>
// //                       )}
// //                     </TableCell>
// //                     <TableCell> {/* New Column */}
// //                       <Button
// //                         variant="contained"
// //                         color="primary"
// //                         onClick={() => handleMarkAsCompleted(action._id)}
// //                         disabled={action.isCompleted}
// //                       >
// //                         Mark as Completed
// //                       </Button>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))
// //               ) : (
// //                 <TableRow>
// //                   <TableCell colSpan={7} align="center">
// //                     {selectedControlId ? 'No actions found for this control' : 'Please select a control to view actions'}
// //                   </TableCell>
// //                 </TableRow>
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ListOfActions;

// // // // import React, { useState, useEffect } from 'react';
// // // // import { fetchControlFamilies } from '../api/controlFamilyAPI';
// // // // import { fetchControls } from '../api/ControlAPI';
// // // // import { fetchActions } from '../api/actionAPI';
// // // // import { uploadActionFile } from '../api/uploadAPI';
// // // // import {
// // // //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Select, MenuItem, Button, TextField, Snackbar, Alert
// // // // } from '@mui/material';
// // // // import Loading from '../components/Loading'; // Import the Loading component
// // // // import '../styles/ListOfActions.css';
// // // // import axios from 'axios';

// // // // const ListOfActions = () => {
// // // //   const [controlFamilies, setControlFamilies] = useState([]);
// // // //   const [controls, setControls] = useState([]);
// // // //   const [actions, setActions] = useState([]);
// // // //   const [expandedFamilyId, setExpandedFamilyId] = useState('');
// // // //   const [selectedControlId, setSelectedControlId] = useState('');
// // // //   const [file, setFile] = useState(null);
// // // //   const [uploading, setUploading] = useState(false);
// // // //   const [submitted, setSubmitted] = useState(false);
// // // //   const [error, setError] = useState('');
// // // //   const [pdfUrl, setPdfUrl] = useState('');
// // // //   const [loading, setLoading] = useState(true); // Add loading state

// // // //   useEffect(() => {
// // // //     const fetchControlFamiliesData = async () => {
// // // //       setLoading(true); // Set loading to true before fetching data
// // // //       try {
// // // //         const familyResponse = await fetchControlFamilies();
// // // //         if (familyResponse.data) {
// // // //           setControlFamilies(familyResponse.data);
// // // //         } else {
// // // //           throw new Error('No data found for control families');
// // // //         }
// // // //       } catch (err) {
// // // //         console.error(err);
// // // //         setError('Failed to fetch control families.');
// // // //       } finally {
// // // //         setLoading(false); // Set loading to false after fetching data
// // // //       }
// // // //     };
// // // //     fetchControlFamiliesData();
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     const fetchControlData = async () => {
// // // //       if (controlFamilies.length) {
// // // //         setLoading(true); // Set loading to true before fetching data
// // // //         try {
// // // //           const controlResponse = await fetchControls();
// // // //           if (controlResponse.data) {
// // // //             setControls(controlResponse.data);
// // // //           } else {
// // // //             throw new Error('No data found for controls');
// // // //           }
// // // //         } catch (err) {
// // // //           console.error(err);
// // // //           setError('Failed to fetch controls.');
// // // //         } finally {
// // // //           setLoading(false); // Set loading to false after fetching data
// // // //         }
// // // //       }
// // // //     };
// // // //     fetchControlData();
// // // //   }, [controlFamilies]);

// // // //   useEffect(() => {
// // // //     const fetchActionData = async () => {
// // // //       if (selectedControlId) {
// // // //         setLoading(true); // Set loading to true before fetching data
// // // //         try {
// // // //           const actionResponse = await fetchActions();
// // // //           if (actionResponse.data) {
// // // //             if (Array.isArray(actionResponse.data)) {
// // // //               setActions(actionResponse.data.filter(action => action.control_Id && action.control_Id._id === selectedControlId));
// // // //             } else {
// // // //               throw new Error('Actions data is not an array');
// // // //             }
// // // //           } else {
// // // //             throw new Error('No data found for actions');
// // // //           }
// // // //         } catch (err) {
// // // //           console.error(err);
// // // //           setError('Failed to fetch actions.');
// // // //         } finally {
// // // //           setLoading(false); // Set loading to false after fetching data
// // // //         }
// // // //       } else {
// // // //         setActions([]);
// // // //       }
// // // //     };
// // // //     fetchActionData();
// // // //   }, [selectedControlId]);

// // // //   const handleFamilyClick = (familyId) => {
// // // //     setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
// // // //   };

// // // //   const handleControlClick = (controlId) => {
// // // //     setSelectedControlId(controlId);
// // // //   };

// // // //   const handleFileChange = (event) => {
// // // //     setFile(event.target.files[0]);
// // // //     setSubmitted(false);
// // // //   };

// // // //   const handleFileUpload = async (actionId) => {
// // // //     if (file) {
// // // //       const formData = new FormData();
// // // //       formData.append('file', file);
// // // //       formData.append('actionId', actionId);

// // // //       setUploading(true);
// // // //       try {
// // // //         const response = await uploadActionFile(formData);
// // // //         if (response.file && response.file.path) {
// // // //           setPdfUrl(response.file.path);
// // // //           setSubmitted(true);
// // // //           setError(''); // Clear error if successful
// // // //         } else {
// // // //           throw new Error('File upload response does not contain the expected data');
// // // //         }
// // // //       } catch (err) {
// // // //         console.error(err);
// // // //         setError('Failed to upload file');
// // // //       } finally {
// // // //         setUploading(false);
// // // //       }
// // // //     } else {
// // // //       setError('No file selected');
// // // //     }
// // // //   };

// // // //   // const handleMarkAsCompleted = async (actionId) => {
// // // //   //   try {
// // // //   //     await axios.put(`http://localhost:8021/api/v1/actions/${actionId}`, { isCompleted: true });
// // // //   //     setActions(actions.map(action =>
// // // //   //       action._id === actionId ? { ...action, isCompleted: true } : action
// // // //   //     ));
// // // //   //   } catch (error) {
// // // //   //     console.error('Error marking action as completed:', error.response ? error.response.data : error.message);
// // // //   //     setError('Failed to mark action as completed.');
// // // //   //   }
// // // //   // };
  
// // // //   const handleMarkAsCompleted = async (actionId) => {
// // // //     try {
// // // //       const response = await axios.put(`http://localhost:8021/api/v1/actions/${actionId}`, { isCompleted: true });
// // // //       if (response.status === 200) { // Check if the response status is OK
// // // //         setActions(actions.map(action =>
// // // //           action._id === actionId ? { ...action, isCompleted: true } : action
// // // //         ));
// // // //       } else {
// // // //         throw new Error('Failed to mark action as completed.');
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error marking action as completed:', error.response ? error.response.data : error.message);
// // // //       setError('Failed to mark action as completed.');
// // // //     }
// // // //   };
  
// // // //   const handleStatusChange = async (actionId, newStatus) => {
// // // //     try {
// // // //       await axios.put(`http://localhost:8021/api/v1/actions/${actionId}`, { status: newStatus });
// // // //       setActions(actions.map(action =>
// // // //         action._id === actionId ? { ...action, status: newStatus } : action
// // // //       ));
// // // //     } catch (error) {
// // // //       console.error('Error updating action status:', error.response ? error.response.data : error.message);
// // // //       setError('Failed to update action status.');
// // // //     }
// // // //   };

// // // //   if (loading) {
// // // //     return <Loading />; // Show the loading animation while data is loading
// // // //   }

// // // //   return (
// // // //     <div className="new-page">
// // // //       <div className="sidebar">
// // // //         {controlFamilies.map(family => (
// // // //           <div key={family._id} className="control-family">
// // // //             <div className="control-family-header" onClick={() => handleFamilyClick(family._id)}>
// // // //               {family.name}
// // // //             </div>
// // // //             {expandedFamilyId === family._id && (
// // // //               <div className="controls">
// // // //                 {controls
// // // //                   .filter(control => control.control_Family_Id._id === family._id)
// // // //                   .map(control => (
// // // //                     <div key={control._id} className="control" onClick={() => handleControlClick(control._id)}>
// // // //                       {control.name}
// // // //                     </div>
// // // //                   ))}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //       <div className="content">
// // // //         {error && (
// // // //           <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
// // // //             <Alert onClose={() => setError('')} severity="error">{error}</Alert>
// // // //           </Snackbar>
// // // //         )}
// // // //        <TableContainer component={Paper}>
// // // //   <Table>
// // // //     <TableHead>
// // // //       <TableRow>
// // // //         <TableCell>Action ID</TableCell>
// // // //         <TableCell>Action Name</TableCell>
// // // //         <TableCell>Status</TableCell>
// // // //         <TableCell>Upload</TableCell>
// // // //         <TableCell>Submit</TableCell>
// // // //         <TableCell>View PDF</TableCell>
// // // //         <TableCell>Mark as Completed</TableCell> {/* New Column */}
// // // //       </TableRow>
// // // //     </TableHead>
// // // //     <TableBody>
// // // //       {actions.length > 0 ? (
// // // //         actions.map(action => (
// // // //           <TableRow key={action._id}>
// // // //             <TableCell>{action.action_Id}</TableCell>
// // // //             <TableCell>{action.name}</TableCell>
// // // //             {/* <TableCell>
// // // //               <Select
// // // //                 defaultValue={action.isCompleted ? 'completed' : 'incomplete'}
// // // //                 onChange={(e) => handleStatusChange(action._id, e.target.value)}
// // // //               >
// // // //                 <MenuItem value="completed">Completed</MenuItem>
// // // //                 <MenuItem value="hold">Hold</MenuItem>
// // // //                 <MenuItem value="delegate">Delegate</MenuItem>
// // // //                 <MenuItem value="disable">Disable</MenuItem>
// // // //               </Select>
// // // //             </TableCell> */}
// // // //             <TableCell>
// // // //               <TextField type="file" inputProps={{ accept: 'application/pdf' }} onChange={handleFileChange} />
// // // //             </TableCell>
// // // //             <TableCell>
// // // //               <Button onClick={() => handleFileUpload(action._id)} disabled={uploading || !file}>
// // // //                 {uploading ? 'Uploading...' : 'Upload'}
// // // //               </Button>
// // // //             </TableCell>
// // // //             <TableCell>
// // // //               {submitted && pdfUrl && (
// // // //                 <a href={`/${pdfUrl}`} target="_blank" rel="noopener noreferrer">
// // // //                   View PDF
// // // //                 </a>
// // // //               )}
// // // //             </TableCell>
// // // //             <TableCell>
// // // //               <Button
// // // //                 variant="contained"
// // // //                 color="success"
// // // //                 onClick={() => handleMarkAsCompleted(action._id)}
// // // //                 disabled={action.isCompleted}
// // // //               >
// // // //                 {action.isCompleted ? 'Completed' : 'Mark as Completed'}
// // // //               </Button>
// // // //             </TableCell>
// // // //           </TableRow>
// // // //         ))
// // // //       ) : (
// // // //         <TableRow>
// // // //           <TableCell colSpan={7} align="center">No actions available</TableCell> {/* Adjust colspan */}
// // // //         </TableRow>
// // // //       )}
// // // //     </TableBody>
// // // //   </Table>
// // // // </TableContainer>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ListOfActions;


// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { fetchControlFamilies } from '../api/controlFamilyAPI';
// // // // // import { fetchControls } from '../api/ControlAPI';
// // // // // import { fetchActions } from '../api/actionAPI';
// // // // // import { uploadActionFile } from '../api/uploadAPI';
// // // // // import {
// // // // //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Select, MenuItem, Button, TextField, Snackbar, Alert
// // // // // } from '@mui/material';
// // // // // import Loading from '../components/Loading'; // Import the Loading component
// // // // // import './ListOfActions.css';

// // // // // const ListOfActions = () => {
// // // // //   const [controlFamilies, setControlFamilies] = useState([]);
// // // // //   const [controls, setControls] = useState([]);
// // // // //   const [actions, setActions] = useState([]);
// // // // //   const [expandedFamilyId, setExpandedFamilyId] = useState('');
// // // // //   const [selectedControlId, setSelectedControlId] = useState('');
// // // // //   const [file, setFile] = useState(null);
// // // // //   const [uploading, setUploading] = useState(false);
// // // // //   const [submitted, setSubmitted] = useState(false);
// // // // //   const [error, setError] = useState('');
// // // // //   const [pdfUrl, setPdfUrl] = useState('');
// // // // //   const [loading, setLoading] = useState(true); // Add loading state

// // // // //   useEffect(() => {
// // // // //     const fetchControlFamiliesData = async () => {
// // // // //       setLoading(true); // Set loading to true before fetching data
// // // // //       try {
// // // // //         const familyResponse = await fetchControlFamilies();
// // // // //         if (familyResponse.data) {
// // // // //           setControlFamilies(familyResponse.data);
// // // // //         } else {
// // // // //           throw new Error('No data found for control families');
// // // // //         }
// // // // //       } catch (err) {
// // // // //         console.error(err);
// // // // //         setError('Failed to fetch control families.');
// // // // //       } finally {
// // // // //         setLoading(false); // Set loading to false after fetching data
// // // // //       }
// // // // //     };
// // // // //     fetchControlFamiliesData();
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     const fetchControlData = async () => {
// // // // //       if (controlFamilies.length) {
// // // // //         setLoading(true); // Set loading to true before fetching data
// // // // //         try {
// // // // //           const controlResponse = await fetchControls();
// // // // //           if (controlResponse.data) {
// // // // //             setControls(controlResponse.data);
// // // // //           } else {
// // // // //             throw new Error('No data found for controls');
// // // // //           }
// // // // //         } catch (err) {
// // // // //           console.error(err);
// // // // //           setError('Failed to fetch controls.');
// // // // //         } finally {
// // // // //           setLoading(false); // Set loading to false after fetching data
// // // // //         }
// // // // //       }
// // // // //     };
// // // // //     fetchControlData();
// // // // //   }, [controlFamilies]);

// // // // //   useEffect(() => {
// // // // //     const fetchActionData = async () => {
// // // // //       if (selectedControlId) {
// // // // //         setLoading(true); // Set loading to true before fetching data
// // // // //         try {
// // // // //           const actionResponse = await fetchActions();
// // // // //           if (actionResponse.data) {
// // // // //             if (Array.isArray(actionResponse.data)) {
// // // // //               setActions(actionResponse.data.filter(action => action.control_Id && action.control_Id._id === selectedControlId));
// // // // //             } else {
// // // // //               throw new Error('Actions data is not an array');
// // // // //             }
// // // // //           } else {
// // // // //             throw new Error('No data found for actions');
// // // // //           }
// // // // //         } catch (err) {
// // // // //           console.error(err);
// // // // //           setError('Failed to fetch actions.');
// // // // //         } finally {
// // // // //           setLoading(false); // Set loading to false after fetching data
// // // // //         }
// // // // //       } else {
// // // // //         setActions([]);
// // // // //       }
// // // // //     };
// // // // //     fetchActionData();
// // // // //   }, [selectedControlId]);

// // // // //   const handleFamilyClick = (familyId) => {
// // // // //     setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
// // // // //   };

// // // // //   const handleControlClick = (controlId) => {
// // // // //     setSelectedControlId(controlId);
// // // // //   };

// // // // //   const handleFileChange = (event) => {
// // // // //     setFile(event.target.files[0]);
// // // // //     setSubmitted(false);
// // // // //   };

// // // // //   const handleFileUpload = async (actionId) => {
// // // // //     if (file) {
// // // // //       const formData = new FormData();
// // // // //       formData.append('file', file);
// // // // //       formData.append('actionId', actionId);

// // // // //       setUploading(true);
// // // // //       try {
// // // // //         const response = await uploadActionFile(formData);
// // // // //         if (response.file && response.file.path) {
// // // // //           setPdfUrl(response.file.path);
// // // // //           setSubmitted(true);
// // // // //           setError(''); // Clear error if successful
// // // // //         } else {
// // // // //           throw new Error('File upload response does not contain the expected data');
// // // // //         }
// // // // //       } catch (err) {
// // // // //         console.error(err);
// // // // //         setError('Failed to upload file');
// // // // //       } finally {
// // // // //         setUploading(false);
// // // // //       }
// // // // //     } else {
// // // // //       setError('No file selected');
// // // // //     }
// // // // //   };

// // // // //   if (loading) {
// // // // //     return <Loading />; // Show the loading animation while data is loading
// // // // //   }

// // // // //   return (
// // // // //     <div className="new-page">
// // // // //       <div className="sidebar">
// // // // //         {controlFamilies.map(family => (
// // // // //           <div key={family._id} className="control-family">
// // // // //             <div className="control-family-header" onClick={() => handleFamilyClick(family._id)}>
// // // // //               {family.name}
// // // // //             </div>
// // // // //             {expandedFamilyId === family._id && (
// // // // //               <div className="controls">
// // // // //                 {controls
// // // // //                   .filter(control => control.control_Family_Id._id === family._id)
// // // // //                   .map(control => (
// // // // //                     <div key={control._id} className="control" onClick={() => handleControlClick(control._id)}>
// // // // //                       {control.name}
// // // // //                     </div>
// // // // //                   ))}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         ))}
// // // // //       </div>
// // // // //       <div className="content">
// // // // //         {error && (
// // // // //           <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
// // // // //             <Alert onClose={() => setError('')} severity="error">{error}</Alert>
// // // // //           </Snackbar>
// // // // //         )}
// // // // //         <TableContainer component={Paper}>
// // // // //           <Table>
// // // // //             <TableHead>
// // // // //               <TableRow>
// // // // //                 <TableCell>Action ID</TableCell>
// // // // //                 <TableCell>Action Name</TableCell>
// // // // //                 <TableCell>Status</TableCell>
// // // // //                 <TableCell>Upload</TableCell>
// // // // //                 <TableCell>Submit</TableCell>
// // // // //                 <TableCell>View PDF</TableCell>
// // // // //               </TableRow>
// // // // //             </TableHead>
// // // // //             <TableBody>
// // // // //               {actions.length > 0 ? (
// // // // //                 actions.map(action => (
// // // // //                   <TableRow key={action._id}>
// // // // //                     <TableCell>{action.action_Id}</TableCell>
// // // // //                     <TableCell>{action.name}</TableCell>
// // // // //                     <TableCell>
// // // // //                       <Select defaultValue="completed">
// // // // //                         <MenuItem value="completed">Completed</MenuItem>
// // // // //                         <MenuItem value="hold">Hold</MenuItem>
// // // // //                         <MenuItem value="delegate">Delegate</MenuItem>
// // // // //                         <MenuItem value="disable">Disable</MenuItem>
// // // // //                       </Select>
// // // // //                     </TableCell>
// // // // //                     <TableCell>
// // // // //                       <TextField type="file" inputProps={{ accept: 'application/pdf' }} onChange={handleFileChange} />
// // // // //                     </TableCell>
// // // // //                     <TableCell>
// // // // //                       <Button onClick={() => handleFileUpload(action._id)} disabled={uploading || !file}>
// // // // //                         {uploading ? 'Uploading...' : 'Upload'}
// // // // //                       </Button>
// // // // //                     </TableCell>
// // // // //                     <TableCell>
// // // // //                       {submitted && pdfUrl && (
// // // // //                         <a href={`/${pdfUrl}`} target="_blank" rel="noopener noreferrer">
// // // // //                           View PDF
// // // // //                         </a>
// // // // //                       )}
// // // // //                     </TableCell>
// // // // //                   </TableRow>
// // // // //                 ))
// // // // //               ) : (
// // // // //                 <TableRow>
// // // // //                   <TableCell colSpan={6} align="center">No actions available</TableCell>
// // // // //                 </TableRow>
// // // // //               )}
// // // // //             </TableBody>
// // // // //           </Table>
// // // // //         </TableContainer>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default ListOfActions;

// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { fetchControlFamilies } from '../api/controlFamilyAPI';
// // // // // import { fetchControls } from '../api/ControlAPI';
// // // // // import { fetchActions } from '../api/actionAPI';
// // // // // import { uploadActionFile } from '../api/uploadAPI';
// // // // // import {
// // // // //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Select, MenuItem, Button, TextField, Snackbar, Alert
// // // // // } from '@mui/material';
// // // // // import './ListOfActions.css';

// // // // // const ListOfActions = () => {
// // // // //   const [controlFamilies, setControlFamilies] = useState([]);
// // // // //   const [controls, setControls] = useState([]);
// // // // //   const [actions, setActions] = useState([]);
// // // // //   const [expandedFamilyId, setExpandedFamilyId] = useState('');
// // // // //   const [selectedControlId, setSelectedControlId] = useState('');
// // // // //   const [file, setFile] = useState(null);
// // // // //   const [uploading, setUploading] = useState(false);
// // // // //   const [submitted, setSubmitted] = useState(false);
// // // // //   const [error, setError] = useState('');
// // // // //   const [pdfUrl, setPdfUrl] = useState('');

// // // // //   useEffect(() => {
// // // // //     const fetchControlFamiliesData = async () => {
// // // // //       try {
// // // // //         const familyResponse = await fetchControlFamilies();
// // // // //         if (familyResponse.data) {
// // // // //           setControlFamilies(familyResponse.data);
// // // // //         } else {
// // // // //           throw new Error('No data found for control families');
// // // // //         }
// // // // //       } catch (err) {
// // // // //         console.error(err);
// // // // //         setError('Failed to fetch control families.');
// // // // //       }
// // // // //     };
// // // // //     fetchControlFamiliesData();
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     const fetchControlData = async () => {
// // // // //       try {
// // // // //         const controlResponse = await fetchControls();
// // // // //         if (controlResponse.data) {
// // // // //           setControls(controlResponse.data);
// // // // //         } else {
// // // // //           throw new Error('No data found for controls');
// // // // //         }
// // // // //       } catch (err) {
// // // // //         console.error(err);
// // // // //         setError('Failed to fetch controls.');
// // // // //       }
// // // // //     };
// // // // //     fetchControlData();
// // // // //   }, [controlFamilies]);

// // // // //   useEffect(() => {
// // // // //     const fetchActionData = async () => {
// // // // //       if (selectedControlId) {
// // // // //         try {
// // // // //           const actionResponse = await fetchActions();
// // // // //           if (actionResponse.data) {
// // // // //             if (Array.isArray(actionResponse.data)) {
// // // // //               setActions(actionResponse.data.filter(action => action.control_Id && action.control_Id._id === selectedControlId));
// // // // //             } else {
// // // // //               throw new Error('Actions data is not an array');
// // // // //             }
// // // // //           } else {
// // // // //             throw new Error('No data found for actions');
// // // // //           }
// // // // //         } catch (err) {
// // // // //           console.error(err);
// // // // //           setError('Failed to fetch actions.');
// // // // //         }
// // // // //       } else {
// // // // //         setActions([]);
// // // // //       }
// // // // //     };
// // // // //     fetchActionData();
// // // // //   }, [selectedControlId]);

// // // // //   const handleFamilyClick = (familyId) => {
// // // // //     setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
// // // // //   };

// // // // //   const handleControlClick = (controlId) => {
// // // // //     setSelectedControlId(controlId);
// // // // //   };

// // // // //   const handleFileChange = (event) => {
// // // // //     setFile(event.target.files[0]);
// // // // //     setSubmitted(false);
// // // // //   };

// // // // //   const handleFileUpload = async (actionId) => {
// // // // //     if (file) {
// // // // //       const formData = new FormData();
// // // // //       formData.append('file', file);
// // // // //       formData.append('actionId', actionId);

// // // // //       setUploading(true);
// // // // //       try {
// // // // //         const response = await uploadActionFile(formData);
// // // // //         if (response.file && response.file.path) {
// // // // //           setPdfUrl(response.file.path);
// // // // //           setSubmitted(true);
// // // // //           setError(''); // Clear error if successful
// // // // //         } else {
// // // // //           throw new Error('File upload response does not contain the expected data');
// // // // //         }
// // // // //       } catch (err) {
// // // // //         console.error(err);
// // // // //         setError('Failed to upload file');
// // // // //       } finally {
// // // // //         setUploading(false);
// // // // //       }
// // // // //     } else {
// // // // //       setError('No file selected');
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="new-page">
// // // // //       <div className="sidebar">
// // // // //         {controlFamilies.map(family => (
// // // // //           <div key={family._id} className="control-family">
// // // // //             <div className="control-family-header" onClick={() => handleFamilyClick(family._id)}>
// // // // //               {family.name}
// // // // //             </div>
// // // // //             {expandedFamilyId === family._id && (
// // // // //               <div className="controls">
// // // // //                 {controls
// // // // //                   .filter(control => control.control_Family_Id._id === family._id)
// // // // //                   .map(control => (
// // // // //                     <div key={control._id} className="control" onClick={() => handleControlClick(control._id)}>
// // // // //                       {control.name}
// // // // //                     </div>
// // // // //                   ))}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         ))}
// // // // //       </div>
// // // // //       <div className="content">
// // // // //         {error && (
// // // // //           <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
// // // // //             <Alert onClose={() => setError('')} severity="error">{error}</Alert>
// // // // //           </Snackbar>
// // // // //         )}
// // // // //         <TableContainer component={Paper}>
// // // // //           <Table>
// // // // //             <TableHead>
// // // // //               <TableRow>
// // // // //                 <TableCell>Action ID</TableCell>
// // // // //                 <TableCell>Action Name</TableCell>
// // // // //                 <TableCell>Status</TableCell>
// // // // //                 <TableCell>Upload</TableCell>
// // // // //                 <TableCell>Submit</TableCell>
// // // // //                 <TableCell>View PDF</TableCell>
// // // // //               </TableRow>
// // // // //             </TableHead>
// // // // //             <TableBody>
// // // // //               {actions.length > 0 ? (
// // // // //                 actions.map(action => (
// // // // //                   <TableRow key={action._id}>
// // // // //                     <TableCell>{action.action_Id}</TableCell>
// // // // //                     <TableCell>{action.name}</TableCell>
// // // // //                     <TableCell>
// // // // //                       <Select defaultValue="completed">
// // // // //                         <MenuItem value="completed">Completed</MenuItem>
// // // // //                         <MenuItem value="hold">Hold</MenuItem>
// // // // //                         <MenuItem value="delegate">Delegate</MenuItem>
// // // // //                         <MenuItem value="disable">Disable</MenuItem>
// // // // //                       </Select>
// // // // //                     </TableCell>
// // // // //                     <TableCell>
// // // // //                       <TextField type="file" inputProps={{ accept: 'application/pdf' }} onChange={handleFileChange} />
// // // // //                     </TableCell>
// // // // //                     <TableCell>
// // // // //                       <Button onClick={() => handleFileUpload(action._id)} disabled={uploading || !file}>
// // // // //                         {uploading ? 'Uploading...' : 'Upload'}
// // // // //                       </Button>
// // // // //                     </TableCell>
// // // // //                     <TableCell>
// // // // //                       {submitted && pdfUrl && (
// // // // //                         <a href={`/${pdfUrl}`} target="_blank" rel="noopener noreferrer">
// // // // //                           View PDF
// // // // //                         </a>
// // // // //                       )}
// // // // //                     </TableCell>
// // // // //                   </TableRow>
// // // // //                 ))
// // // // //               ) : (
// // // // //                 <TableRow>
// // // // //                   <TableCell colSpan={6} align="center">No actions available</TableCell>
// // // // //                 </TableRow>
// // // // //               )}
// // // // //             </TableBody>
// // // // //           </Table>
// // // // //         </TableContainer>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default ListOfActions;

// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import { fetchControlFamilies } from '../api/controlFamilyAPI';
// // // // // // import { fetchControls } from '../api/ControlAPI';
// // // // // // import { fetchActions } from '../api/actionAPI';
// // // // // // import { uploadActionFile } from '../api/uploadAPI';
// // // // // // import {
// // // // // //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Select, MenuItem, Button, TextField, Snackbar, Alert
// // // // // // } from '@mui/material';
// // // // // // import './ListOfActions.css';

// // // // // // const ListOfActions = () => {
// // // // // //   const [controlFamilies, setControlFamilies] = useState([]);
// // // // // //   const [controls, setControls] = useState([]);
// // // // // //   const [actions, setActions] = useState([]);
// // // // // //   const [expandedFamilyId, setExpandedFamilyId] = useState('');
// // // // // //   const [selectedControlId, setSelectedControlId] = useState('');
// // // // // //   const [file, setFile] = useState(null);
// // // // // //   const [uploading, setUploading] = useState(false);
// // // // // //   const [submitted, setSubmitted] = useState(false);
// // // // // //   const [error, setError] = useState('');
// // // // // //   const [pdfUrl, setPdfUrl] = useState('');

// // // // // //   useEffect(() => {
// // // // // //     const fetchControlFamiliesData = async () => {
// // // // // //       try {
// // // // // //         const familyResponse = await fetchControlFamilies();
// // // // // //         if (familyResponse.data) {
// // // // // //           setControlFamilies(familyResponse.data);
// // // // // //         } else {
// // // // // //           throw new Error('No data found for control families');
// // // // // //         }
// // // // // //       } catch (err) {
// // // // // //         console.error(err);
// // // // // //         setError('Failed to fetch control families.');
// // // // // //       }
// // // // // //     };
// // // // // //     fetchControlFamiliesData();
// // // // // //   }, []);

// // // // // //   useEffect(() => {
// // // // // //     const fetchControlData = async () => {
// // // // // //       try {
// // // // // //         const controlResponse = await fetchControls();
// // // // // //         if (controlResponse.data) {
// // // // // //           setControls(controlResponse.data);
// // // // // //         } else {
// // // // // //           throw new Error('No data found for controls');
// // // // // //         }
// // // // // //       } catch (err) {
// // // // // //         console.error(err);
// // // // // //         setError('Failed to fetch controls.');
// // // // // //       }
// // // // // //     };
// // // // // //     fetchControlData();
// // // // // //   }, [controlFamilies]);

// // // // // //   useEffect(() => {
// // // // // //     const fetchActionData = async () => {
// // // // // //       if (selectedControlId) {
// // // // // //         try {
// // // // // //           const actionResponse = await fetchActions();
// // // // // //           if (actionResponse.data) {
// // // // // //             if (Array.isArray(actionResponse.data)) {
// // // // // //               setActions(actionResponse.data.filter(action => action.control_Id && action.control_Id._id === selectedControlId));
// // // // // //             } else {
// // // // // //               throw new Error('Actions data is not an array');
// // // // // //             }
// // // // // //           } else {
// // // // // //             throw new Error('No data found for actions');
// // // // // //           }
// // // // // //         } catch (err) {
// // // // // //           console.error(err);
// // // // // //           setError('Failed to fetch actions.');
// // // // // //         }
// // // // // //       } else {
// // // // // //         setActions([]);
// // // // // //       }
// // // // // //     };
// // // // // //     fetchActionData();
// // // // // //   }, [selectedControlId]);

// // // // // //   const handleFamilyClick = (familyId) => {
// // // // // //     setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
// // // // // //   };

// // // // // //   const handleControlClick = (controlId) => {
// // // // // //     setSelectedControlId(controlId);
// // // // // //   };

// // // // // //   const handleFileChange = (event) => {
// // // // // //     setFile(event.target.files[0]);
// // // // // //     setSubmitted(false);
// // // // // //   };

// // // // // //   const handleFileUpload = async (actionId) => {
// // // // // //     if (file) {
// // // // // //       const formData = new FormData();
// // // // // //       formData.append('file', file);
// // // // // //       formData.append('actionId', actionId);

// // // // // //       setUploading(true);
// // // // // //       try {
// // // // // //         const response = await uploadActionFile(formData);
// // // // // //         if (response.file && response.file.path) {
// // // // // //           setPdfUrl(response.file.path);
// // // // // //           setSubmitted(true);
// // // // // //           setError(''); // Clear error if successful
// // // // // //         } else {
// // // // // //           throw new Error('File upload response does not contain the expected data');
// // // // // //         }
// // // // // //       } catch (err) {
// // // // // //         console.error(err);
// // // // // //         setError('Failed to upload file');
// // // // // //       } finally {
// // // // // //         setUploading(false);
// // // // // //       }
// // // // // //     } else {
// // // // // //       setError('No file selected');
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="new-page">
// // // // // //       <div className="sidebar">
// // // // // //         {controlFamilies.map(family => (
// // // // // //           <div key={family._id} className="control-family">
// // // // // //             <div className="control-family-header" onClick={() => handleFamilyClick(family._id)}>
// // // // // //               {family.name}
// // // // // //             </div>
// // // // // //             {expandedFamilyId === family._id && (
// // // // // //               <div className="controls">
// // // // // //                 {controls
// // // // // //                   .filter(control => control.control_Family_Id._id === family._id)
// // // // // //                   .map(control => (
// // // // // //                     <div key={control._id} className="control" onClick={() => handleControlClick(control._id)}>
// // // // // //                       {control.name}
// // // // // //                     </div>
// // // // // //                   ))}
// // // // // //               </div>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         ))}
// // // // // //       </div>
// // // // // //       <div className="content">
// // // // // //         {error && (
// // // // // //           <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
// // // // // //             <Alert onClose={() => setError('')} severity="error">{error}</Alert>
// // // // // //           </Snackbar>
// // // // // //         )}
// // // // // //         {selectedControlId && (
// // // // // //           <TableContainer component={Paper}>
// // // // // //             <Table>
// // // // // //               <TableHead>
// // // // // //                 <TableRow>
// // // // // //                   <TableCell>Action ID</TableCell>
// // // // // //                   <TableCell>Action Name</TableCell>
// // // // // //                   <TableCell>Status</TableCell>
// // // // // //                   <TableCell>Upload</TableCell>
// // // // // //                   <TableCell>Submit</TableCell>
// // // // // //                   <TableCell>View PDF</TableCell>
// // // // // //                 </TableRow>
// // // // // //               </TableHead>
// // // // // //               <TableBody>
// // // // // //                 {actions.map(action => (
// // // // // //                   <TableRow key={action._id}>
// // // // // //                     <TableCell>{action.action_Id}</TableCell>
// // // // // //                     <TableCell>{action.name}</TableCell>
// // // // // //                     <TableCell>
// // // // // //                       <Select defaultValue="completed">
// // // // // //                         <MenuItem value="completed">Completed</MenuItem>
// // // // // //                         <MenuItem value="hold">Hold</MenuItem>
// // // // // //                         <MenuItem value="delegate">Delegate</MenuItem>
// // // // // //                         <MenuItem value="disable">Disable</MenuItem>
// // // // // //                       </Select>
// // // // // //                     </TableCell>
// // // // // //                     <TableCell>
// // // // // //                       <TextField type="file" inputProps={{ accept: 'application/pdf' }} onChange={handleFileChange} />
// // // // // //                     </TableCell>
// // // // // //                     <TableCell>
// // // // // //                       <Button onClick={() => handleFileUpload(action._id)} disabled={uploading || !file}>
// // // // // //                         {uploading ? 'Uploading...' : 'Upload'}
// // // // // //                       </Button>
// // // // // //                     </TableCell>
// // // // // //                     <TableCell>
// // // // // //                       {submitted && pdfUrl && (
// // // // // //                         <a href={`/${pdfUrl}`} target="_blank" rel="noopener noreferrer">
// // // // // //                           View PDF
// // // // // //                         </a>
// // // // // //                       )}
// // // // // //                     </TableCell>
// // // // // //                   </TableRow>
// // // // // //                 ))}
// // // // // //               </TableBody>
// // // // // //             </Table>
// // // // // //           </TableContainer>
// // // // // //         )}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default ListOfActions;

