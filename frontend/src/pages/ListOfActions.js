import React, { useState, useEffect, useMemo } from 'react';
import { getControlFamilies } from '../api/controlFamilyAPI';
import { fetchActions } from '../api/actionAPI';
import { Snackbar, Alert, Tooltip } from '@mui/material';
import Loading from '../components/Loading';
import '../styles/ListOfActions.css';
import { getAssetDetails } from '../api/assetDetailsApi';
import { getAllEvidences, uploadEvidence } from '../api/evidenceApi';
import AssetSelection from '../components/assetSelection';
import CompletionStatusPage from '../components/completionStatusPage';
import { fetchCurrentUser } from '../api/userApi';
import { getAssetNameById } from '../api/assetApi.js';
import { createOrUpdateStatus } from '../api/completionStatusApi';
import DataProtectionAct from '../components/DataProtectionAct'; // Import your component
import DataProtectionActChapter7 from '../components/DataProtectionActChapter7';
import DataProtectionActChapter8 from '../components/DataProtectionActChapter8';
import DataProtectionAppeals from '../components/DataProtectionAppeals.js';

const ListOfActions = () => {
  const [controlFamilies, setControlFamilies] = useState([]);
  const [controls, setControls] = useState([]);
  const [expandedFamilyId, setExpandedFamilyId] = useState('');
  const [selectedControlId, setSelectedControlId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [scopes, setScopes] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedScopeId, setSelectedScopeId] = useState('');

  const [actions, setActions] = useState([]);

  const [notification, setNotification] = useState({
    message: '',
    severity: 'info',
  });
  const [assetName, setAssetName] = useState('');

  const [selectedChapter, setSelectedChapter] = useState(null); // State to track which chapter to show

  // Functions to handle button clicks for each chapter
  const handleChapter1Click = () => {
    setSelectedChapter(1); // Set state to show Chapter 1 component
  };
  const handleChapter7Click = () => {
    setSelectedChapter(7); // Set state to show Chapter 6 component
  };
  const handleChapter8Click = () => {
    setSelectedChapter(8); // Set state to show Chapter 7 component
  };
  const handleChapter9Click = () => {
    setSelectedChapter(9); // Set state to show Chapter 7 component
  };

  // Function to handle closing the chapter view
  const handleChapterClose = () => {
    setSelectedChapter(null); // Reset state to hide the chapter component
  };

  useEffect(() => {
    const fetchName = async () => {
      let _assetName = await getAssetNameById(selectedAssetId);
      setAssetName(_assetName.name);
    };
    fetchName();
  }, [selectedAssetId]);

  // Add this helper function in your component
  const checkAssetSelection = () => {
    if (!selectedAssetId) {
      setNotification({
        message: 'Please select an asset before proceeding.',
        severity: 'error',
      });
      return false;
    }
    return true;
  };

  const UploadSelectedEvidence = async (
    actionId,
    NewcontrolId,
    selectedFile
  ) => {
    if (!checkAssetSelection()) return; // Check if asset is selected before proceeding

    if (!selectedFile) {
      setNotification({
        message: 'Please select a file first.',
        severity: 'warning',
      });
      return;
    }
    try {
      const token = window.localStorage.getItem('token'); // Replace with actual token
      const userData = await fetchCurrentUser(token); // Make sure fetchCurrentUser is defined elsewhere

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
      const requestData = {
        actionId: actionId,
        controlId: NewcontrolId,
        familyId: expandedFamilyId, // Assuming you have this available in scope
        assetId: selectedAssetId, // Assuming you have this available in scope
        status: 'Evidence Uploaded',
        isEvidenceUploaded: true,
        AssignedBy: userData.data._id,
      };
      // Conditionally include scopeId if it is defined
      if (selectedScopeId) {
        requestData.scopeId = selectedScopeId;
      }
      await createOrUpdateStatus(requestData);
    } catch (error) {
      setNotification({
        message: 'Failed to upload file. Please try again.',
        severity: 'error',
      });
      console.error('File Upload Error:', error);
    }
    // console.log('file', selectedFile);
  };

  const fetchAllEvidences = async () => {
    try {
      const evidenceList = await getAllEvidences();
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
    if (!selectedAssetId) {
      setNotification({
        message: 'Please select an asset to proceed.',
        severity: 'warning',
      });
    }
  }, [selectedAssetId]);

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

                  // Return the modified action object with completion status and evidence URL
                  return {
                    ...action,
                    controlDescription,

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

  useEffect(() => {
    if (selectedAssetId) {
      // Find all scopes related to the selected asset
      const selectedAssetScopes = assets
        .filter((asset) => asset.asset._id === selectedAssetId)
        .map((asset) => asset.scoped);

      if (selectedAssetScopes.length > 0) {
        setScopes(selectedAssetScopes); // Set all scopes for the selected asset
        setSelectedScopeId(selectedAssetScopes[0]._id); // Automatically select the first scope
      } else {
        setScopes([]); // Reset scopes if none are available
        setSelectedScopeId(''); // Clear selected scope if there are none
      }
    } else {
      setScopes([]); // Reset scopes if no asset is selected
      setSelectedScopeId(''); // Clear selected scope if no asset is selected
    }
  }, [selectedAssetId, assets]);

  const handleAssetChange = (event) => {
    setSelectedAssetId(event.target.value);
  };

  const handleScopeChange = (event) => {
    setSelectedScopeId(event.target.value);
  };

  useEffect(() => {
    if (controlFamilies.length > 0) {
      setExpandedFamilyId(controlFamilies[0]._id); // Set the first control family as expanded
    }
  }, [controlFamilies]); // Run this effect when controlFamilies changes

  const sortedFamilies = useMemo(
    () => controlFamilies.sort((a, b) => a.variable_id - b.variable_id),
    [controlFamilies]
  );

  const handleFamilyClick = (familyId) => {
    handleChapterClose();
    // Only change the expandedFamilyId if it's not already selected
    if (expandedFamilyId !== familyId) {
      setExpandedFamilyId(familyId);
    }
  };

  const handleSnackbarClose = () => {
    setNotification({ message: '', severity: 'info' });
  };

  const markActionAsCompleted = async (actionId, newControlId) => {
    if (!checkAssetSelection()) return; // Check if asset is selected before proceeding

    // Prepare the request data, including scopeId only if it's provided
    const token = window.localStorage.getItem('token'); // Replace with actual token
    const userData = await fetchCurrentUser(token); // Make sure fetchCurrentUser is defined elsewhere

    const requestData = {
      actionId: actionId,
      controlId: newControlId,
      familyId: expandedFamilyId, // Assuming you have this available in scope
      assetId: selectedAssetId, // Assuming you have this available in scope
      isCompleted: true, // Set isCompleted to true
      status: 'Completed',
      AssignedBy: userData.data._id,
    };

    // Conditionally include scopeId if it is defined
    if (selectedScopeId) {
      requestData.scopeId = selectedScopeId;
    }

    try {
      const response = await createOrUpdateStatus(requestData);

      console.log('Status updated successfully:', response);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const issueInEvidence = async (actionId, newControlId, feedback) => {
    if (!checkAssetSelection()) return; // Check if asset is selected before proceeding

    // Prepare the request data, including scopeId only if it's provided
    const token = window.localStorage.getItem('token'); // Replace with actual token
    const userData = await fetchCurrentUser(token); // Make sure fetchCurrentUser is defined elsewhere

    const requestData = {
      actionId: actionId,
      controlId: newControlId,
      familyId: expandedFamilyId, // Assuming you have this available in scope
      assetId: selectedAssetId, // Assuming you have this available in scope

      status: 'Wrong Evidence',
      AssignedBy: userData.data._id,
      AssignedTo: '66d6d051ef980699d3d64250', // Default Compliance Guy
      feedback,
    };

    // Conditionally include scopeId if it is defined
    if (selectedScopeId) {
      requestData.scopeId = selectedScopeId;
    }

    try {
      // Make API request to update the completion status
      const response = await createOrUpdateStatus(requestData);

      console.log('Status updated successfully:', response);
      // Optionally refetch statuses here if needed
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='new-page'>
      <div className='page-container'>
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
        <>
          {/* Include Font Awesome CDN */}
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
          />

          <div className='download-container'>
            <a
              href='https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf'
              target='_blank'
              rel='noopener noreferrer' // Security feature
              className='download-link'
            >
              <i className='fas fa-download'></i> {/* Add download icon */}
              Digital Personal Data Protection Act 2023
            </a>
          </div>
        </>

        <div>
          <div
            className='hover:bg-[white] bg-[#ffffff]'
            style={{ marginBottom: '10px' }}
          >
            <button
              onClick={handleChapter1Click} // Make it clickable
              className='control-family-header font-[400] bg-gray-200 text-black px-6 py-3 border border-gray-300 rounded-lg w-full cursor-pointer hover:bg-gray-300 transition duration-200 ease-in-out'
              data-disabled // Similar to how you had `data-disabled`
            >
              Chapter 1
            </button>
          </div>
        </div>

        {sortedFamilies.map((family) => (
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
                } ${expandedFamilyId === family._id ? 'selected-family' : ''}`}
                onClick={() => handleFamilyClick(family._id)}
              >
                Chapter {family.variable_id}
              </div>
            </Tooltip>
          </div>
        ))}
        <div>
          <div
            className='hover:bg-[white] bg-[#ffffff]'
            style={{ marginBottom: '10px' }}
          >
            <button
              onClick={handleChapter7Click} // Make it clickable
              className='control-family-header font-[400] bg-gray-200 text-black px-6 py-3 border border-gray-300 rounded-lg w-full cursor-pointer hover:bg-gray-300 transition duration-200 ease-in-out'
              data-disabled // Similar to how you had `data-disabled`
            >
              Chapter 7
            </button>
          </div>
        </div>
        <div>
          <div
            className='hover:bg-[white] bg-[#ffffff]'
            style={{ marginBottom: '10px' }}
          >
            <button
              onClick={handleChapter8Click} // Make it clickable
              className='control-family-header font-[400] bg-gray-200 text-black px-6 py-3 border border-gray-300 rounded-lg w-full cursor-pointer hover:bg-gray-300 transition duration-200 ease-in-out'
              data-disabled // Similar to how you had `data-disabled`
            >
              Chapter 8
            </button>
          </div>
        </div>
        <div>
          <div
            className='hover:bg-[white] bg-[#ffffff]'
            style={{ marginBottom: '10px' }}
          >
            <button
              onClick={handleChapter9Click} // Make it clickable
              className='control-family-header font-[400] bg-gray-200 text-black px-6 py-3 border border-gray-300 rounded-lg w-full cursor-pointer hover:bg-gray-300 transition duration-200 ease-in-out'
              data-disabled // Similar to how you had `data-disabled`
            >
              Penalties
            </button>
          </div>
        </div>
      </div>
      {/* Conditional rendering based on selectedChapter */}
      {selectedChapter === 1 && (
        <div>
          <DataProtectionAct />
          <button onClick={handleChapterClose}>Close Chapter</button>
        </div>
      )}
      {selectedChapter === 7 && (
        <div>
          <DataProtectionActChapter7 />
          <button onClick={handleChapterClose}>Close Chapter</button>
        </div>
      )}
      {selectedChapter === 8 && (
        <div>
          <DataProtectionActChapter8 />
          <button onClick={handleChapterClose}>Close Chapter</button>
        </div>
      )}
      {selectedChapter === 9 && (
        <div>
          <DataProtectionAppeals />
          <button onClick={handleChapterClose}>Close Chapter</button>
        </div>
      )}

      {/* Default content if no chapter is selected */}
      {selectedChapter === null && (
        <div className='content'>
          <AssetSelection
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

          <CompletionStatusPage
            expandedFamilyId={expandedFamilyId}
            selectedAssetId={selectedAssetId}
            selectedScopeId={selectedScopeId}
            actions={actions}
            UploadSelectedEvidence={UploadSelectedEvidence}
            markActionAsCompleted={markActionAsCompleted}
            issueInEvidence={issueInEvidence}
            checkAssetSelection={checkAssetSelection} // Pass the function here
          />
        </div>
      )}
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
