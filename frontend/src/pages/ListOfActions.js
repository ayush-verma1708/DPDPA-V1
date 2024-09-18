import React, { useState, useEffect } from 'react';
import { getControlFamilies } from '../api/controlFamilyAPI';
import { fetchActions } from '../api/actionAPI';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import Loading from '../components/Loading';
import '../styles/ListOfActions.css';
import axios from 'axios';

import { getAssetDetails, getAssetDetailsById } from '../api/assetDetailsApi';
import { getAllEvidences, uploadEvidence } from '../api/evidenceApi';

import ControlStatus from '../components/ControlStatus'; // Adjust the path as needed
import ControlFamilyStatus from '../components/ControlFamilyStatus'; // Adjust the path as needed
import EvidenceTable from '../components/EvidenceTable'; // Import the new component
import StatusCheckTable from '../components/StatusCheckTable'; // Import the new component

import SelectorsAndNotifications from '../components/assetSelection';

import CompletionStatusPage from '../components/completionStatusPage';
import { fetchCurrentUser } from '../api/userApi';
import { getAssetNameById } from '../api/assetApi';

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

  const [notification, setNotification] = useState({
    message: '',
    severity: 'info',
  });
  const [visibleComponent, setVisibleComponent] = useState(''); // State to track which component is visible
  const [currentUsername, setCurrentUsername] = useState(null); // Store current username
  const [role, setRole] = useState(''); // To store the role from userData

  const statusOptions = [
    'Open',
    'Delegated to IT Team',
    'Evidence Ready',
    'Misconfigured',
    'Audit Delegated',
    'Audit Non-Confirm',
    'Audit Closed',
    'Closed',
    'Not Applicable',
    'Risk Accepted',
  ];

  const [assetName, setAssetName] = useState('');

  useEffect(() => {
    const fetchName = async () => {
      let _assetName = await getAssetNameById(selectedAssetId);
      setAssetName(_assetName.name);
    };
    fetchName();
  }, [selectedAssetId]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadEvidence = async (actionId, NewcontrolId) => {
    if (!selectedFile) {
      setNotification({
        message: 'Please select a file first.',
        severity: 'warning',
      });
      return;
    }

    try {
      const evidenceData = {
        assetId: selectedAssetId,
        scopeId: selectedScopeId,
        actionId: actionId,
        controlId: NewcontrolId,
        familyId: expandedFamilyId,
      };

      // Upload the file and get the response
      const response = await uploadEvidence(selectedFile, evidenceData);

      // Check if the URL is present in the response
      const evidenceUrl = response.fileUrl; // Optional chaining to prevent undefined errors
      if (!evidenceUrl) {
        throw new Error('No URL returned from the server.');
      }

      setNotification({
        message: 'File uploaded successfully!',
        severity: 'success',
      });

      // Update the action with the new evidence URL
      setActions((prevActions) =>
        prevActions.map((action) =>
          action._id === actionId ? { ...action, evidenceUrl } : action
        )
      );
    } catch (error) {
      setNotification({
        message: 'Failed to upload file. Please try again.',
        severity: 'error',
      });
      console.error('File Upload Error:', error);
    }
  };

  const fetchAllEvidences = async () => {
    try {
      const evidenceList = await getAllEvidences();
      setEvidences(evidenceList);
    } catch (error) {
      setNotification({
        message: 'Failed to fetch evidences. Please try again later.',
        severity: 'error',
      });
      console.error('Fetch Evidences Error:', error);
    }
  };

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        const token = window.localStorage.getItem('token'); // Replace with actual token
        const userData = await fetchCurrentUser(token); // Make sure fetchCurrentUser is defined elsewhere
        setCurrentUsername(userData.username); // Set current username
        setRole(userData.data.role); // Set role from user data
      } catch (error) {
        console.error('Error fetching current user data:', error);
      }
    };

    fetchCurrentUserData(); // Call the async function inside useEffect
  }, []); // Empty dependency array means it runs once after the component mounts

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
          const updatedControls = controlFamilies.flatMap(
            (family) => family.controls
          );
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
                .filter((action) => action.control_Id._id === selectedControlId)
                .map(async (action) => {
                  // Fetch the control description
                  const controlDescription = controls.find(
                    (control) => control._id === action.control_Id._id
                  )?.section_desc;

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
  }, [
    selectedControlId,
    controls,
    selectedAssetId,
    selectedScopeId,
    expandedFamilyId,
  ]);

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
      const selectedAsset = assets.find((asset) => {
        return asset.asset._id === selectedAssetId;
      });
      console.log(selectedAsset);
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
    console.log('asset info', event.target.value);
    setSelectedAssetId(event.target.value);
  };

  const handleScopeChange = (event) => {
    setSelectedScopeId(event.target.value);
  };

  const handleFamilyClick = (familyId) => {
    setExpandedFamilyId(expandedFamilyId === familyId ? '' : familyId);
  };

  const ActionCompletionCell = ({
    action,
    expandedFamilyId,
    selectedControlId,
    selectedAssetId,
    selectedScopeId,
    handleMarkAsCompleted,
  }) => {
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
    }, [
      action._id,
      selectedAssetId,
      selectedScopeId,
      selectedControlId,
      expandedFamilyId,
    ]);

    return (
      <TableCell>
        {isCompleted ? (
          <Button variant='contained' color='success' disabled>
            Evidence Confirm
          </Button>
        ) : (
          <Button
            variant='contained'
            color='primary'
            onClick={() => handleMarkAsCompleted(action._id)}
          >
            Confirm Evidence
          </Button>
        )}
      </TableCell>
    );
  };

  const handleStatusChange = async (actionId, newStatus) => {
    try {
      // Update status in the backend
      await axios.put(`/api/actions/${actionId}`, { status: newStatus });

      // Update status in local state
      setActions((prevActions) =>
        prevActions.map((action) =>
          action._id === actionId ? { ...action, status: newStatus } : action
        )
      );

      setNotification({
        message: 'Status updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      setNotification({
        message: 'Failed to update status. Please try again.',
        severity: 'error',
      });
      console.error('Status Update Error:', error);
    }
  };

  const checkCompletionStatus = async (
    actionId,
    assetId,
    scopeId,
    controlId,
    familyId
  ) => {
    console.log('call', actionId, assetId, scopeId, controlId, familyId);
  };

  const handleMarkAsCompleted = async (actionId, NewcontrolId) => {
    console.log(
      'tada',
      actionId,
      NewcontrolId,
      selectedAssetId,
      selectedScopeId,
      expandedFamilyId
    );
  };

  const handleSnackbarClose = () => {
    setNotification({ message: '', severity: 'info' });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='new-page'>
      <div className='page-container'>
        {/* <div className='Asset-container'>
          <Select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            displayEmpty
            renderValue={(value) =>
              value ? `Asset:${assetName}` : 'Select Asset'
            }
          >
            {assets.map((asset) => {
              return (
                <MenuItem key={asset.asset._id} value={asset.asset._id}>
                  {asset.asset.name}
                </MenuItem>
              );
            })}
          </Select>
        </div>

        <div className='Scope-container'> */}
        {/* <Select
          value={selectedScopeId}
          onChange={handleScopeChange}
          displayEmpty
          renderValue={(value) =>
            value
              ? `Scope: ${scopes.find((scope) => scope._id === value)?.name}`
              : 'Select Scope'
          }
          disabled={scopes.length === 0}
        >
          {scopes.map((scope) => (
            <MenuItem key={scope._id} value={scope._id}>
              {scope.name}
            </MenuItem>
          ))}
        </Select> */}
        {/* </div> */}

        <SelectorsAndNotifications
          selectedAssetId={selectedAssetId}
          assetName={assetName}
          assets={assets}
          selectedScopeId={selectedScopeId}
          scopes={scopes}
          handleScopeChange={handleScopeChange}
          handleAssetChange={handleAssetChange}
          error={error}
          notification={notification}
          handleSnackbarClose={handleSnackbarClose}
        />

        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError('')}
          >
            <Alert
              onClose={() => setError('')}
              severity='error'
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          </Snackbar>
        )}

        <Snackbar
          open={!!notification.message}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </div>

      <div className='sidebar'>
        <div
          className='hover:bg-[white] bg-[#ffffff]'
          style={{ marginBottom: '10px' }}
        >
          <div
            data-disabled
            className='control-family-header font-[400] bg-gray-200 text-gray-500 cursor-not-allowed px-4 py-2 border border-gray-300 rounded'
          >
            Chapter 1
          </div>
        </div>

        {controlFamilies
          .sort((a, b) => a.variable_id - b.variable_id) // Sort control families by variable_id
          .map((family) => (
            <div
              key={family._id}
              className={`control-family ${
                expandedFamilyId === family._id ? 'expanded' : ''
              }`}
            >
              <Tooltip title={family.description} placement='right'>
                <div
                  className={`control-family-header ${
                    expandedFamilyId === family._id ? 'expanded' : ''
                  } ${
                    expandedFamilyId === family._id ? 'selected-family' : ''
                  }`}
                  onClick={() => handleFamilyClick(family._id)}
                >
                  Chapter {family.variable_id}
                </div>
              </Tooltip>
            </div>
          ))}
      </div>

      <div className='content'>
        {visibleComponent === 'EvidenceTable' && (
          <EvidenceTable
            actions={actions}
            handleFileChange={handleFileChange}
            handleUploadEvidence={handleUploadEvidence}
            handleStatusChange={handleStatusChange}
            ActionCompletionCell={ActionCompletionCell}
            statusOptions={statusOptions}
            expandedFamilyId={expandedFamilyId}
            selectedControlId={selectedControlId}
            selectedAssetId={selectedAssetId}
            selectedScopeId={selectedScopeId}
            handleMarkAsCompleted={handleMarkAsCompleted}
          />
        )}
        {visibleComponent === 'StatusCheckTable' && (
          <StatusCheckTable
            actions={actions}
            handleFileChange={handleFileChange}
            handleUploadEvidence={handleUploadEvidence}
            handleStatusChange={handleStatusChange}
            ActionCompletionCell={ActionCompletionCell}
            statusOptions={statusOptions}
            expandedFamilyId={expandedFamilyId}
            selectedControlId={selectedControlId}
            selectedAssetId={selectedAssetId}
            selectedScopeId={selectedScopeId}
            handleMarkAsCompleted={handleMarkAsCompleted}
          />
        )}
        {visibleComponent === 'ControlStatus' && (
          <ControlStatus
            selectedAssetId={selectedAssetId}
            selectedScopeId={selectedScopeId}
          />
        )}

        <CompletionStatusPage
          expandedFamilyId={expandedFamilyId}
          selectedAssetId={selectedAssetId}
          selectedScopeId={selectedScopeId}
          actions={actions}
          handleFileChange={handleFileChange}
          handleUploadEvidence={handleUploadEvidence}
          handleStatusChange={handleStatusChange}
          ActionCompletionCell={ActionCompletionCell}
          statusOptions={statusOptions}
          handleMarkAsCompleted={handleMarkAsCompleted}
        />
      </div>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert
            onClose={() => setError('')}
            severity='error'
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}

      <Snackbar
        open={!!notification.message}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ListOfActions;
