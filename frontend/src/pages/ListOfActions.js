import React, { useState, useEffect } from 'react';
import { getControlFamilies } from '../api/controlFamilyAPI';
import { fetchActions } from '../api/actionAPI';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert, Select, MenuItem, Tooltip } from '@mui/material';
import Loading from '../components/Loading';
import '../styles/ListOfActions.css';
import axios from 'axios';

import { getAssetDetails } from '../api/assetDetailsApi'; 
import { getAllEvidences , uploadEvidence }  from '../api/evidenceApi'; 

import ControlStatus from '../components/ControlStatus'; // Adjust the path as needed
import ControlFamilyStatus from '../components/ControlFamilyStatus'; // Adjust the path as needed
import EvidenceTable from '../components/EvidenceTable'; // Import the new component
import StatusCheckTable from '../components/StatusCheckTable'; // Import the new component


const ListOfActions = () => {
  const [controlFamilies, setControlFamilies] = useState([]);
  const [controls, setControls] = useState([]);
  // const [actions, setActions] = useState([]);
  const [expandedFamilyId, setExpandedFamilyId] = useState('');
  const [selectedControlId, setSelectedControlId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [scopes, setScopes] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedScopeId, setSelectedScopeId] = useState('');
  // const [notification, setNotification] = useState({ message: '', severity: 'info' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [evidences, setEvidences] = useState([]);  
  
  const [actions, setActions] = useState([]);

  const [notification, setNotification] = useState({ message: '', severity: 'info' });
  
  const [isControlStatusVisible, setIsControlStatusVisible] = useState(true); // Added state for ControlStatus visibility
  const [isControlFamilyStatusVisible, setIsControlFamilyStatusVisible] = useState(true); // Added state for ControlStatus visibility

  const [isStatusCheckTableVisible, setIsStatusCheckTableVisible] = useState(true); // Added state for StatusCheckTable visibility

  const [isTableVisible, setIsTableVisible] = useState(true);



  const [visibleComponent, setVisibleComponent] = useState(''); // State to track which component is visible


  const statusOptions = [
    'Open', 'Delegated to IT Team', 'Evidence Ready', 
    'Misconfigured', 'Audit Delegated', 'Audit Non-Confirm', 
    'Audit Closed', 'Closed', 'Not Applicable', 'Risk Accepted'
  ];

  const toggleTableVisibility = () => {
    setIsTableVisible(prevState => !prevState);
  };

  const toggleControlStatusVisibility = () => {
    setIsControlStatusVisible(prevState => !prevState);
  };

  const toggleControlFamilyStatusVisibility = () => {
    setIsControlFamilyStatusVisible(prevState => !prevState);
  };


  const toggleStatusCheckTableVisibility = () => {
    setIsStatusCheckTableVisible(prevState => !prevState);
  };
  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
  const showComponent = (component) => {
    setVisibleComponent(component);
  };
  
  const handleUploadEvidence = async (actionId) => {
    if (!selectedFile) {
      setNotification({ message: 'Please select a file first.', severity: 'warning' });
      return;
    }
  
    try {
      const evidenceData = {
        assetId: selectedAssetId,
        scopeId: selectedScopeId,
        actionId: actionId,
        controlId: selectedControlId,
        familyId: expandedFamilyId,
      };
      
      // Upload the file and get the response
      const response = await uploadEvidence(selectedFile, evidenceData);
      console.log("API Response:", response); // Log the response to check its structure
      
      // Check if the URL is present in the response
      const evidenceUrl = response.fileUrl; // Optional chaining to prevent undefined errors
      if (!evidenceUrl) {
        throw new Error("No URL returned from the server.");
      }
  
      setNotification({ message: 'File uploaded successfully!', severity: 'success' });
  
      // Update the action with the new evidence URL
      setActions(prevActions =>
        prevActions.map(action =>
          action._id === actionId ? { ...action, evidenceUrl } : action
        )
      );
      
      console.log("Evidence uploaded");
    } catch (error) {
      setNotification({ message: 'Failed to upload file. Please try again.', severity: 'error' });
      console.error('File Upload Error:', error);
    }
  };
  

  const fetchAllEvidences = async () => {
    try {
      const evidenceList = await getAllEvidences();
      setEvidences(evidenceList);
    } catch (error) {
      setNotification({ message: 'Failed to fetch evidences. Please try again later.', severity: 'error' });
      console.error('Fetch Evidences Error:', error);
    }
  };
  
  // Fetch evidences when the component mounts
  useEffect(() => {
    fetchAllEvidences();
  }, []);
  
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

  const handleStatusChange = async (actionId, newStatus) => {
    try {
      // Update status in the backend
      await axios.put(`/api/actions/${actionId}`, { status: newStatus });
  
      // Update status in local state
      setActions(prevActions =>
        prevActions.map(action =>
          action._id === actionId ? { ...action, status: newStatus } : action
        )
      );
      
      setNotification({ message: 'Status updated successfully!', severity: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to update status. Please try again.', severity: 'error' });
      console.error('Status Update Error:', error);
    }
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
      isCompleted: true // Ensure the status is set to true for completion
    };

    // Mark the action as completed
    const response = await axios.put(`http://localhost:8021/api/v1/completion-status`, completionEntry);

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

  // const handleStatusChange = async (actionId, newStatus) => {
  //   try {
  //     // Update status in the backend
  //     await axios.put(`/api/actions/${actionId}`, { status: newStatus });
  
  //     // Update status in local state
  //     setActions(prevActions =>
  //       prevActions.map(action =>
  //         action._id === actionId ? { ...action, status: newStatus } : action
  //       )
  //     );
      
  //     setNotification({ message: 'Status updated successfully!', severity: 'success' });
  //   } catch (error) {
  //     setNotification({ message: 'Failed to update status. Please try again.', severity: 'error' });
  //     console.error('Status Update Error:', error);
  //   }
  // };
  

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

      <Button onClick={() => showComponent('EvidenceTable')}>Show Evidence Table</Button>
      <Button onClick={() => showComponent('StatusCheckTable')}>Show Status Check Table</Button>
      <Button onClick={() => showComponent('ControlStatus')}>Show Control Status</Button>
      <Button onClick={() => showComponent('ControlFamilyStatus')}>Show Control Family Status</Button>
      

      {/* <Button variant="contained" color="primary" onClick={toggleTableVisibility}>
          {isTableVisible ? 'Hide Evidence Table' : 'Show Evidence Table'}
        </Button>

        <Button variant="contained" color="primary" onClick={toggleControlStatusVisibility}>
          {isControlStatusVisible ? 'Hide Control Status Info' : 'Show Control Status Info'}
        </Button>
        <Button variant="contained" color="primary" onClick={toggleControlFamilyStatusVisibility}>
          {isControlFamilyStatusVisible ? 'Hide Control Family Status Info' : 'Show Control Family Status Info'}
        </Button>
        <Button variant="contained" color="primary"  onClick={toggleStatusCheckTableVisibility}>
        {isStatusCheckTableVisible ? 'Hide Status Check Table' : 'Show Status Check Table'}
      </Button> */}
    
    {visibleComponent === 'EvidenceTable' && (
      <EvidenceTable
            actions={actions}
            handleFileChange={handleFileChange}
            handleUploadEvidence={handleUploadEvidence}
            handleStatusChange={handleStatusChange}
            ActionCompletionCell={ActionCompletionCell}
            statusOptions={statusOptions}
          />
      )}
      
      {visibleComponent === 'ControlStatus' && (
        <ControlStatus  selectedAssetId={selectedAssetId} selectedScopeId={selectedScopeId}  />
      )}

      {visibleComponent === 'ControlFamilyStatus' && (
        <ControlFamilyStatus selectedAssetId={selectedAssetId} selectedScopeId={selectedScopeId}  />
      )}

      {visibleComponent === 'StatusCheckTable' && (
        <StatusCheckTable 
        
          controlFamilies={controlFamilies}
          expandedFamilyId={expandedFamilyId}
          selectedControlId={selectedControlId}
          actions={actions}
          onFamilyClick={handleFamilyClick}
          onControlClick={handleControlClick}
          handleMarkAsCompleted={handleMarkAsCompleted}
          // actions={actions}
 handleFileChange={handleFileChange}
 handleUploadEvidence={handleUploadEvidence}
//  handleStatusChange={handleStatusChange}
 ActionCompletionCell={ActionCompletionCell}
 statusOptions={statusOptions}       
        />
      )}
  {/* {isControlStatusVisible && (
  <ControlStatus selectedAssetId={selectedAssetId} selectedScopeId={selectedScopeId} />
)}

{isControlFamilyStatusVisible && (
  <ControlFamilyStatus selectedAssetId={selectedAssetId} selectedScopeId={selectedScopeId} />
)}

{isStatusCheckTableVisible && (
        <StatusCheckTable actions={actions}
        handleFileChange={handleFileChange}
        handleUploadEvidence={handleUploadEvidence}
        handleStatusChange={handleStatusChange}
        ActionCompletionCell={ActionCompletionCell}
        statusOptions={statusOptions} /> // Render the StatusCheckTable component
      )} */}

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
