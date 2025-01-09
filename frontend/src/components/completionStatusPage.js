import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  getStatus,
  delegateToIT,
  delegateToAuditor,
  delegateToExternalAuditor,
  setNotApplicableStatus,
  confirmNotApplicableStatus,
} from '../api/completionStatusApi';
import Toolbar from '@mui/material/Toolbar'; // For MUI v5
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Example icon

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Collapse,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Assignment, Block, Visibility } from '@mui/icons-material'; // Replace with any desired icon
import Checkbox from '@mui/material/Checkbox';

import { fetchActions } from '../api/actionAPI'; // Adjust the path as needed

import {
  CheckCircle,
  Warning,
  KeyboardArrowDown,
  KeyboardArrowUp,
  AssignmentInd,
  Cancel,
  HelpOutline,
  SupervisorAccount,
} from '@mui/icons-material';
import { getAssetDetails } from '../api/assetDetailsApi'; // Adjust the path as needed
import { fetchCurrentUser } from '../api/userApi';
import { Button, Tooltip } from '@mui/material';
import EvidenceUpload from './EvidenceUpload';
import QueryModal from './EvidenceFeedbackModal';

const CompletionStatusPage = ({
  expandedFamilyId,
  selectedAssetId,
  selectedScopeId,
  UploadSelectedEvidence,
  markActionAsCompleted,
  issueInEvidence,
  checkAssetSelection,
}) => {
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const [fetchedStatuses, setFetchedStatuses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState(null); // Store current username
  const [currentUserId, setCurrentUserId] = useState(null); // Store current username
  const [role, setRole] = useState(''); // To store the role from userData
  const [isQueryModalOpen, setQueryModalOpen] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [selectedControlId, setSelectedControlId] = useState(null);
  //  no tasks
  const [noTasks, setNoTasks] = useState(false); // State to manage if there are no tasks

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // New state to manage row expansion for history details
  const [openRows, setOpenRows] = useState({});

  const [showOnlyTasks, setShowOnlyTasks] = useState(false);

  // Toggle function
  const handleToggleTaskView = () => {
    setShowOnlyTasks(!showOnlyTasks);
  };

  // Memoize query object to prevent unnecessary re-renders
  const query = useMemo(
    () => ({
      scopeId: selectedScopeId,
      assetId: selectedAssetId,
      familyId: expandedFamilyId,
      currentUserId, // You only need currentUserId
      role, // And role
    }),
    [selectedScopeId, selectedAssetId, expandedFamilyId, currentUserId]
  );

  const handleFetchStatus = async () => {
    setLoading(true); // Start loading state
    setNoTasks(false); // Reset the state to false initially

    try {
      const response = await getStatus(query);
      console.log('asset', selectedAssetId);
      console.log(response);

      // Check if the response contains data
      const fetchedStatuses = Array.isArray(response) ? response : [response];

      if (fetchedStatuses.length === 0) {
        setNoTasks(true); // Set noTasks to true if there are no fetched statuses
        setFetchedStatuses([]); // Clear the statuses if there are no tasks
        console.log('old', fetchedStatuses);
        console.log('No data available for this asset or scope.');
      } else {
        // Apply sorting logic
        const sortedStatuses = fetchedStatuses.sort((a, b) => {
          const controlFamilyComparison = (
            a.controlId?.controlFamily?.fixed_id || ''
          ).localeCompare(b.controlId?.controlFamily?.fixed_id || '');
          if (controlFamilyComparison !== 0) return controlFamilyComparison;

          const controlComparison = (a.controlId?.fixed_id || '').localeCompare(
            b.controlId?.fixed_id || ''
          );
          if (controlComparison !== 0) return controlComparison;

          return (a.actionId?.fixed_id || '').localeCompare(
            b.actionId?.fixed_id || ''
          );
        });

        setFetchedStatuses(sortedStatuses); // Update state with sorted statuses
        console.log('new', fetchedStatuses);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No data available for this response (404 error).');
      } else {
        console.error('Error fetching status:', error);
      }
    } finally {
      setLoading(false); // End loading state
    }
  };

  const handleToggleToolbar = () => {
    setIsToolbarOpen((prev) => !prev);
  };

  useEffect(() => {
    handleFetchStatus(); // Fetch data on component mount and when query changes
  }, [query]);

  const handleToggleRow = (statusId) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [statusId]: !prevOpenRows[statusId],
    }));
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Slice the data to show on the current page
  const paginatedData = fetchedStatuses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        const token = window.localStorage.getItem('token'); // Replace with actual token
        const userData = await fetchCurrentUser(token); // Make sure fetchCurrentUser is defined elsewhere
        setCurrentUsername(userData.data.username); // Set current username
        setCurrentUserId(userData.data._id); // Set current username
        setRole(userData.data.role); // Set role from user data
      } catch (error) {
        console.error('Error fetching current user data:', error);
      }
    };

    fetchCurrentUserData(); // Call the async function inside useEffect
  }, []); // Empty dependency array means it runs once after the component mounts

  const handleQuery = async (actionId, controlId) => {
    // Open the query modal when the button is clicked
    if (!checkAssetSelection()) return;
    handleEvidence(actionId, controlId);
    setSelectedActionId(actionId);
    setSelectedControlId(controlId);
    setQueryModalOpen(true);
  };

  const handleQuerySubmit = async (query, actionId, controlId) => {
    if (!checkAssetSelection()) return;
    try {
      // Issue the evidence and pass the query
      await issueInEvidence(actionId, controlId, query);

      // Update the status in the list with the new query and status
      const newStatus = 'Query Submitted'; // Example of a new status
      updateStatusInList(actionId, newStatus, 'Submit Query', null, query);

      // Optionally refetch statuses after updating
      await handleFetchStatus();
    } catch (error) {
      console.error('Error submitting query:', error);
    }
  };

  const handleBulkDelegateToIT = (selectedRows) => {
    if (selectedRows.length === 0) return;

    selectedRows.forEach(({ statusId, assetId }) => {
      handleDelegateToIT(statusId, assetId);
      // console.log(statusId, ' ');
    });

    // Clear selection after action
    setSelectedRows([]);
  };

  const handleDelegateToIT = async (statusId, assetId) => {
    if (!checkAssetSelection()) return;
    try {
      // Fetch asset details
      const assetDetails = await getAssetDetails();

      // Find the asset detail by assetId
      const assetDetail = assetDetails.find(
        (detail) => detail.asset._id === assetId
      );

      if (!assetDetail) {
        return;
      }

      // Get the IT owner username from the asset details
      const itOwnerUsername = assetDetail.itOwnerName; // Adjust field name if needed

      // Update the status with the IT owner username
      const response = await delegateToIT(
        statusId,
        itOwnerUsername,
        currentUserId
      );

      // Update status in the list
      updateStatusInList(
        statusId,
        'Delegated to IT Team',
        'Delegate to IT',
        itOwnerUsername
      ); // Pass IT owner's username
      await handleFetchStatus(); // Refetch data after action
    } catch (error) {
      console.error('Error delegating to IT Team:', error);
    }
  };

  const handleDelegateToAuditor = async (statusId, assetId) => {
    if (!checkAssetSelection()) return;
    try {
      // Fetch asset details
      const assetDetails = await getAssetDetails();

      // Find the asset detail by assetId
      const assetDetail = assetDetails.find(
        (detail) => detail.asset._id === assetId
      );

      if (!assetDetail) {
        return;
      }

      // Get the IT owner username from the asset details
      const auditorName = assetDetail.auditorName; // Adjust field name if needed

      // Update the status with the IT owner username
      await delegateToAuditor(statusId, currentUserId, auditorName);

      // Update status in the list
      updateStatusInList(
        statusId,
        'Audit Delegated',
        'Delegate to Auditor',
        auditorName
      ); // Pass Auditor username
      await handleFetchStatus(); // Refetch data after action
    } catch (error) {
      console.error('Error delegating to IT Team:', error);
    }
  };

  const handleDelegateToExternalAuditor = async (statusId, currentUserId) => {
    if (!checkAssetSelection()) return;
    try {
      await delegateToExternalAuditor(statusId, currentUserId);

      await handleFetchStatus(); // Refetch data after action
    } catch (error) {
      console.error('Error delegating to Auditor:', error);
    }
  };

  const updateStatusInList = (
    statusId,
    newStatus,
    action,
    assignedTo = null,
    feedback = ''
  ) => {
    // Update the fetchedStatuses list and update the matching status by ID
    setFetchedStatuses(
      fetchedStatuses.map((status) =>
        status._id === statusId
          ? { ...status, status: newStatus, action, assignedTo, feedback }
          : status
      )
    );
  };

  const handleViewEvidence = async (actionId, controlId) => {
    if (!checkAssetSelection()) return;
    try {
      const res = await axios.post(
        `http://localhost:8021/api/evidence/params`,
        {
          assetId: selectedAssetId,
          scopeId: selectedScopeId,
          actionId,
          familyId: expandedFamilyId,
          controlId,
        }
      );

      // Check if the response contains a valid file URL
      if (res.data && res.data.fileUrl) {
        const fullUrl = `http://localhost:8021${res.data.fileUrl}`;

        setEvidenceUrl(fullUrl);
        window.open(fullUrl, '_blank'); // Opens the URL in a new window/tab
      } else {
        return null; // No evidence found
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
      return null; // Return null if there's an error or no evidence
    }
  };

  const handleEvidence = async (actionId, controlId) => {
    if (!checkAssetSelection()) return;
    try {
      const res = await axios.post(
        `http://localhost:8021/api/evidence/params`,
        {
          assetId: selectedAssetId,
          scopeId: selectedScopeId,
          actionId,
          familyId: expandedFamilyId,
          controlId,
        }
      );

      if (res.data && res.data.fileUrl) {
        const fullUrl = `http://localhost:8021${res.data.fileUrl}`;
        setEvidenceUrl(fullUrl);
      } else {
        return null; // No evidence found
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
      return null; // Return null if there's an error or no evidence
    }
  };

  const handleMarkAsCompleted = async (actionId, controlId) => {
    if (!checkAssetSelection()) return;
    try {
      await markActionAsCompleted(actionId, controlId);

      await handleFetchStatus();
    } catch (error) {
      console.error('Error marking action as completed:', error);
    }
  };

  const handleUploadEvidence = async (actionId, controlId, selectedFile) => {
    // // Mark the action as completed
    if (!checkAssetSelection()) return;
    await UploadSelectedEvidence(actionId, controlId, selectedFile);

    await handleFetchStatus();
    {
      console.error('Error Uploading');
    }
  };

  const toCamelCase = (str) => {
    return str
      .split(' ')
      .map((word, index) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(''); // Join without spaces to form camel case
  };

  const handleSetNotApplicable = async (statusId) => {
    try {
      await setNotApplicableStatus(statusId, currentUserId);
      await handleFetchStatus();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleConfirmNotApplicable = async (statusId) => {
    try {
      await confirmNotApplicableStatus(statusId, currentUserId);
      await handleFetchStatus();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button
        variant='contained'
        color='primary'
        onClick={() => handleBulkDelegateToIT(selectedRows)} // Trigger the bulk action
        disabled={selectedRows.length === 0} // Disable if no rows are selected
      >
        Delegate Selected to IT
      </Button>
      <section style={{ marginTop: '20px' }}>
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyTasks}
              onChange={handleToggleTaskView}
              color='primary'
            />
          }
          label='Show only rows with task'
        />
        {loading ? (
          <CircularProgress />
        ) : fetchedStatuses.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              backgroundColor: '#f9f9f9',
              color: '#333',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            <p
              style={{
                fontSize: '1.2em',
                color: '#888',
                marginBottom: '15px',
              }}
            >
              No data available.
            </p>
            <a
              href='/Product-Family'
              style={{
                color: '#007bff',
                textDecoration: 'none',
                fontSize: '1.1em',
                border: '1px solid #007bff',
                padding: '10px 20px',
                borderRadius: '5px',
                transition: 'all 0.3s ease',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#007bff';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#007bff';
              }}
            >
              Submit Product Family
            </a>
          </div>
        ) : noTasks ? (
          <div>
            <p>You've encountered a bug</p>{' '}
            {/* Show message when no tasks are available */}
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>{' '}
            {/* Button to reload the page */}
          </div>
        ) : (
          <TableContainer
            component={Paper}
            style={{ maxHeight: 900, overflow: 'auto' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {role !== 'Compliance Team' && <TableCell>Select</TableCell>}
                  <TableCell />
                  {role !== 'IT Team' && <TableCell>Assigned to</TableCell>}
                  <TableCell>Action</TableCell>
                  <TableCell>Control</TableCell>
                  {role !== 'IT Team' && <TableCell>Feedback</TableCell>}
                  <TableCell>Status</TableCell>
                  <TableCell>Asset & Control Type</TableCell>
                  <TableCell>Software Selected</TableCell>

                  {role === 'IT Team' && <TableCell>Upload Evidence</TableCell>}

                  <TableCell>View Evidence </TableCell>

                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData
                  .filter((status) => {
                    // Allow Admin and Compliance Team to view all statuses
                    if (role === 'Admin' || role === 'Compliance Team') {
                      return true; // No filtering for these roles, return all data
                    }
                    // For other users, only show statuses where assigned to the current user
                    return (
                      currentUserId === status.AssignedTo?._id ||
                      currentUserId === status.AssignedBy?._id
                    );
                  })
                  .filter(
                    (status) => !showOnlyTasks || status.isTask === true // Filter based on toggle state
                  )
                  .map((status) => {
                    const isCompleted = status.status === 'Completed';

                    return (
                      <React.Fragment key={status._id}>
                        <TableRow>
                          <TableCell>
                            <Checkbox
                              color='primary'
                              checked={selectedRows.some(
                                (item) => item.statusId === status._id
                              )}
                              onChange={() => {
                                setSelectedRows((prev) => {
                                  const isSelected = prev.some(
                                    (item) => item.statusId === status._id
                                  );
                                  if (isSelected) {
                                    // Remove the item from selectedRows
                                    return prev.filter(
                                      (item) => item.statusId !== status._id
                                    );
                                  } else {
                                    // Add the new item with both statusId and assetId
                                    return [
                                      ...prev,
                                      {
                                        statusId: status._id,
                                        assetId: status.assetId._id,
                                      },
                                    ];
                                  }
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size='small'
                              onClick={() => handleToggleRow(status._id)}
                              color='primary'
                            >
                              {openRows[status._id] ? (
                                <KeyboardArrowUp />
                              ) : (
                                <KeyboardArrowDown />
                              )}
                            </IconButton>
                          </TableCell>

                          {status.isTask ? (
                            <>
                              {role !== 'IT Team' && (
                                <TableCell>
                                  {status.AssignedTo?.username}
                                </TableCell>
                              )}
                              <TableCell>
                                {status.actionId?.fixed_id || 'N/A'}
                              </TableCell>
                              <TableCell
                                sx={{
                                  width: '250px',
                                  maxWidth: '250px',
                                }}
                              >
                                {status.controlId?.section_desc || 'N/A'}
                              </TableCell>

                              {role !== 'IT Team' && (
                                <TableCell>
                                  {status.feedback || 'N/A'}
                                </TableCell>
                              )}
                              <TableCell>{status.status || 'N/A'}</TableCell>
                              <TableCell>
                                {status.assetId.name}-
                                {status.controlId.control_type}
                              </TableCell>

                              <TableCell>
                                {status?.selectedSoftware?.software_name ||
                                  'N/A'}
                              </TableCell>

                              {/* Evidence upload button for IT Team */}
                              {role === 'IT Team' && !isCompleted && (
                                <EvidenceUpload
                                  status={status}
                                  isCompleted={isCompleted}
                                  handleUploadEvidence={handleUploadEvidence}
                                  actionId={status.actionId?._id}
                                  controlId={status.controlId?._id}
                                  checkAssetSelection={checkAssetSelection}
                                />
                              )}

                              {/* View Evidence Button for IT Team, Auditor, or External Auditor */}
                              {(role === 'IT Team' ||
                                role === 'Compliance Team' ||
                                role === 'Auditor' ||
                                role === 'External Auditor') && (
                                <TableCell>
                                  <Tooltip title='View Evidence'>
                                    <IconButton
                                      color='primary' // Primary color for the icon
                                      onClick={() =>
                                        handleViewEvidence(
                                          status.actionId?._id,
                                          status.controlId?._id
                                        )
                                      }
                                      disabled={!status.isEvidenceUploaded} // Disabled if no evidence is uploaded
                                    >
                                      <Visibility />{' '}
                                      {/* You can replace this with another icon if needed */}
                                    </IconButton>
                                  </Tooltip>{' '}
                                </TableCell>
                              )}
                              {(role === 'Compliance Team' ||
                                role === 'Admin') && (
                                <Tooltip title='Delegate to IT'>
                                  <IconButton
                                    color='secondary'
                                    onClick={() =>
                                      handleDelegateToIT(
                                        status._id,
                                        status.assetId._id
                                      )
                                    }
                                    disabled={
                                      isCompleted ||
                                      (status.status !== 'Open' &&
                                        status.status !== 'Wrong Evidence')
                                    }
                                  >
                                    <Assignment />{' '}
                                    {/* Replace with any icon you prefer */}
                                  </IconButton>
                                </Tooltip>
                              )}

                              {(role === 'IT Team' ||
                                role === 'Compliance Team') && (
                                <Tooltip title='Set As Not Applicable'>
                                  <IconButton
                                    color='error' // This makes the icon red
                                    onClick={() =>
                                      handleSetNotApplicable(status._id)
                                    }
                                    disabled={
                                      isCompleted ||
                                      (status.status !== 'Open' &&
                                        status.status !== 'Wrong Evidence' &&
                                        status.status !==
                                          'Delegated to IT Team')
                                    }
                                  >
                                    <Block />{' '}
                                    {/* You can replace this icon with any other desired icon */}
                                  </IconButton>
                                </Tooltip>
                              )}

                              {/*  */}
                              {role === 'Auditor' && (
                                <Tooltip title='Confirm Not Applicable'>
                                  <IconButton
                                    variant='text'
                                    color='secondary'
                                    onClick={() =>
                                      handleConfirmNotApplicable(status._id)
                                    }
                                    disabled={
                                      status.status !==
                                      'Not Applicable (Pending Auditor Confirmation)'
                                    }
                                  >
                                    <Cancel />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {(role === 'IT Team' || role === 'Admin') && (
                                <Tooltip title='Delegate to Auditor'>
                                  <IconButton
                                    variant='text'
                                    color='secondary'
                                    onClick={() =>
                                      handleDelegateToAuditor(
                                        status._id,
                                        status.assetId._id
                                      )
                                    }
                                    disabled={
                                      isCompleted ||
                                      status.status !== 'Evidence Uploaded'
                                    }
                                  >
                                    <AssignmentInd />{' '}
                                  </IconButton>
                                </Tooltip>
                              )}

                              {/* Raise Query Button for Auditor */}
                              {role === 'Auditor' && (
                                <Tooltip title='Raise Query'>
                                  <IconButton
                                    color='error'
                                    startIcon={<Warning />}
                                    onClick={() =>
                                      handleQuery(
                                        status.actionId?._id,
                                        status.controlId?._id
                                      )
                                    }
                                    disabled={
                                      status.status === 'Wrong Evidence' ||
                                      status.status ===
                                        'External Audit Delegated' ||
                                      status.status ===
                                        'Not Applicable (Pending Auditor Confirmation)'
                                    }
                                  >
                                    <HelpOutline />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {/* Query Modal */}
                              <QueryModal
                                open={isQueryModalOpen}
                                onClose={() => setQueryModalOpen(false)}
                                handleQuerySubmit={handleQuerySubmit}
                                evidenceUrl={evidenceUrl}
                                actionId={selectedActionId}
                                controlId={selectedControlId}
                              />

                              {/* Raise Query Button for External Auditor */}
                              {role === 'External Auditor' && (
                                <Tooltip title='Raise Query'>
                                  <IconButton
                                    color='error'
                                    onClick={() =>
                                      handleQuery(
                                        status.actionId?._id,
                                        status.controlId?._id
                                      )
                                    }
                                    disabled={
                                      isCompleted ||
                                      status.status === 'Wrong Evidence'
                                    }
                                  >
                                    <Warning />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {/* Delegate to External Auditor Button for Admin or Auditor */}
                              {(role === 'Admin' || role === 'Auditor') && (
                                <Tooltip title='Delegate to External Auditor'>
                                  <IconButton
                                    variant='text'
                                    color='secondary'
                                    onClick={() =>
                                      handleDelegateToExternalAuditor(
                                        status._id,
                                        currentUserId
                                      )
                                    }
                                    disabled={
                                      isCompleted ||
                                      status.status === 'Wrong Evidence' ||
                                      status.status ===
                                        'External Audit Delegated' ||
                                      status.status ===
                                        'Not Applicable (Pending Auditor Confirmation)'
                                    }
                                  >
                                    <SupervisorAccount />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {/* Confirm Evidence Button for External Auditor */}
                              {role === 'External Auditor' && (
                                <Tooltip title='Confirm Evidence'>
                                  <IconButton
                                    color='primary'
                                    onClick={() =>
                                      handleMarkAsCompleted(
                                        status.actionId?._id,
                                        status.controlId?._id
                                      )
                                    }
                                    disabled={
                                      isCompleted ||
                                      status.status === 'Wrong Evidence'
                                    }
                                  >
                                    <CheckCircle />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </>
                          ) : (
                            // Render only the control description if isTask is false
                            <TableCell colSpan={13}>
                              {status.controlId?.section_desc ||
                                'Control description not available'}
                            </TableCell>
                          )}
                        </TableRow>

                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={13}
                          >
                            <Collapse
                              in={openRows[status._id]}
                              timeout='auto'
                              unmountOnExit
                            >
                              <div style={{ margin: '10px' }}>
                                <h3>History</h3>
                                {status.history && status.history.length > 0 ? (
                                  <Table size='small' aria-label='history'>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Modified At</TableCell>
                                        <TableCell>Modified By</TableCell>
                                        <TableCell>Changes</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {status.history
                                        .slice()
                                        .reverse() // Reverse the array to show the latest history first
                                        .map((change, index) => (
                                          <TableRow key={index}>
                                            <TableCell>
                                              {new Date(
                                                change.modifiedAt
                                              ).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                              })}
                                            </TableCell>
                                            <TableCell>
                                              {change.modifiedBy?.username}
                                            </TableCell>
                                            <TableCell>
                                              <ul>
                                                {Object.entries(
                                                  change.changes
                                                ).map(([key, value]) => (
                                                  <li key={key}>
                                                    <strong>
                                                      {toCamelCase(key)}:
                                                    </strong>{' '}
                                                    {value}
                                                  </li>
                                                ))}
                                              </ul>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <p>No history available.</p>
                                )}
                              </div>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                    // Add a Bulk Action Button
                    <Toolbar>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => handleBulkDelegateToIT(selectedRows)}
                        disabled={selectedRows.length === 0}
                      >
                        Delegate Selected to IT
                      </Button>
                    </Toolbar>;
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={fetchedStatuses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}
      </section>
    </div>
  );
};

export default CompletionStatusPage;
