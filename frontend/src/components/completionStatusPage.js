import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  createOrUpdateStatus,
  getStatus,
  delegateToIT,
  delegateToAuditor,
  delegateToExternalAuditor,
  confirmEvidence,
  returnEvidence,
} from '../api/completionStatusApi';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  // Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  TablePagination,
  Collapse,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { fetchActions } from '../api/actionAPI'; // Adjust the path as needed
import { getAssets } from '../api/assetApi';
import {
  Upload,
  Visibility,
  CheckCircle,
  Warning,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { getAssetDetails } from '../api/assetDetailsApi'; // Adjust the path as needed
import { getUserById } from '../api/userApi';
import { fetchCurrentUser, getUsernameById } from '../api/userApi';
import EvidenceTableCell from './EvidenceTableCell';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button, Tooltip } from '@mui/material';
import { uploadEvidence } from '../api/evidenceApi';
import EvidenceUpload from './EvidenceUpload';
// import EvidenceFeedbackModal from './EvidenceFeedbackModal'; // Adjust the import path as needed
import QueryModal from './EvidenceFeedbackModal';

const CompletionStatusPage = ({
  expandedFamilyId,
  selectedAssetId,
  selectedScopeId,
  UploadSelectedEvidence,
  markActionAsCompleted,
  issueInEvidence,
  returnEvidence,
}) => {
  const [statusData, setStatusData] = useState({
    actionId: '',
    assetId: '',
    scopeId: '',
    controlId: '',
    familyId: '',
    isCompleted: false,
    username: '',
    status: 'Open',
    action: '',
    feedback: '',
  });

  const [fetchedStatuses, setFetchedStatuses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [usernames, setUsernames] = useState({});
  const [currentUsername, setCurrentUsername] = useState(null); // Store current username
  const [currentUserId, setCurrentUserId] = useState(null); // Store current username
  const [role, setRole] = useState(''); // To store the role from userData
  const [isQueryModalOpen, setQueryModalOpen] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [selectedControlId, setSelectedControlId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // New state to manage row expansion for history details
  const [openRows, setOpenRows] = useState({});

  // Memoize query object to prevent unnecessary re-renders
  const query = useMemo(
    () => ({
      scopeId: selectedScopeId,
      assetId: selectedAssetId,
      familyId: expandedFamilyId,
      // currentUserId, // You only need currentUserId
      // role, // And role
    }),
    [selectedScopeId, selectedAssetId, expandedFamilyId]
  );

  const handleQuery = async (actionId, controlId) => {
    // Open the query modal when the button is clicked
    handleEvidence(actionId, controlId);
    setSelectedActionId(actionId);
    setSelectedControlId(controlId);
    setQueryModalOpen(true);
  };

  const handleQuerySubmit = async (query, actionId, controlId) => {
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

  // const handleQuerySubmit = async (query, actionId, controlId) => {
  //   try {
  //     // Handle the query submission logic here
  //     // console.log('Query submitted:', query);
  //     // For example, call your API to submit the query
  //     // await submitQuery(query, actionId, controlId);
  //     await issueInEvidence(actionId, controlId, query);

  //     // Update status in the list
  //     updateStatusInList(actionId, query);
  //     await handleFetchStatus();
  //   } catch (error) {
  //     console.error('Error submitting query:', error);
  //   }
  // };

  const handleFetchStatus = async () => {
    setLoading(true); // Start loading state

    try {
      const response = await getStatus(query);
      const fetchedStatuses = Array.isArray(response) ? response : [response];
      console.log('Query:', query);

      // Apply sorting logic
      const sortedStatuses = fetchedStatuses.sort((a, b) => {
        const controlFamilyComparison = (
          a.controlId?.controlFamily?.fixed_id || ''
        ).localeCompare(b.controlId?.controlFamily?.fixed_id || '');
        if (controlFamilyComparison !== 0) {
          return controlFamilyComparison;
        }

        const controlComparison = (a.controlId?.fixed_id || '').localeCompare(
          b.controlId?.fixed_id || ''
        );
        if (controlComparison !== 0) {
          return controlComparison;
        }

        return (a.actionId?.fixed_id || '').localeCompare(
          b.actionId?.fixed_id || ''
        );
      });

      setFetchedStatuses(sortedStatuses); // Update state with sorted statuses
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false); // End loading state
    }
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const actionsResponse = await fetchActions();
      } catch (error) {
        console.error('Error fetching actions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sortData = (key, direction) => {
    const sortedData = [...fetchedStatuses].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setFetchedStatuses(sortedData);
  };

  const onDelegateButtonClick = (statusId, assetId) => {
    handleDelegateToIT(statusId, assetId);
  };

  const handleDelegateToIT = async (statusId, assetId) => {
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

  const handleDelegateToAuditor = async (statusId, currentUserId) => {
    // Log parameters to ensure they are being passed correctly
    console.log('Delegating to auditor with:', { statusId, currentUserId });

    try {
      // Call the API to delegate the status to the auditor
      const response = await delegateToAuditor(statusId, currentUserId);

      // Log the response for debugging
      console.log('Delegated to Auditor successfully:', response);

      // Refetch data after action
      await handleFetchStatus();
    } catch (error) {
      // Enhanced error logging
      console.error('Error delegating to Auditor:', error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleDelegateToExternalAuditor = async (statusId, currentUserId) => {
    try {
      const response = await delegateToExternalAuditor(statusId, currentUserId);
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

  // const updateStatusInList = (
  //   statusId,
  //   newStatus,
  //   action,
  //   assignedTo,
  //   feedback = ''
  // ) => {
  //   setFetchedStatuses(
  //     fetchedStatuses.map((status) =>
  //       status._id === statusId
  //         ? { ...status, status: newStatus, action, assignedTo, feedback }
  //         : status
  //     )
  //   );
  // };

  const handleViewEvidence = async (actionId, controlId) => {
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
        console.log(res);
        console.log(res.data.fileUrl);
        // return res.data.fileUrl;
        // Redirect to the file URL or a specific route
        const fullUrl = `http://localhost:8021${res.data.fileUrl}`;
        // window.location.href = fullUrl; // Redirect to the evidence URL
        console.log(fullUrl);
        setEvidenceUrl(fullUrl);
        window.open(fullUrl, '_blank'); // Opens the URL in a new window/tab
      } else {
        console.log('null');
        return null; // No evidence found
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
      return null; // Return null if there's an error or no evidence
    }
  };

  const handleEvidence = async (actionId, controlId) => {
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
        // return res.data.fileUrl;
        // Redirect to the file URL or a specific route
        const fullUrl = `http://localhost:8021${res.data.fileUrl}`;
        // window.location.href = fullUrl; // Redirect to the evidence URL
        setEvidenceUrl(fullUrl);
        // window.open(fullUrl, '_blank'); // Opens the URL in a new window/tab
      } else {
        return null; // No evidence found
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
      return null; // Return null if there's an error or no evidence
    }
  };

  const handleMarkAsCompleted = async (actionId, controlId) => {
    try {
      // Prompt for feedback
      const feedback = prompt(
        'Enter feedback if the evidence is not confirmed (leave blank if confirmed):'
      );
      // Mark the action as completed
      await markActionAsCompleted(actionId, controlId, feedback);

      // Update status in the list
      updateStatusInList(
        actionId,
        feedback ? 'Audit Non-Confirm' : 'Audit Closed',
        feedback ? 'Return Evidence' : 'Confirm Evidence',
        feedback
      );
      await handleFetchStatus();
    } catch (error) {
      console.error('Error marking action as completed:', error);
    }
  };

  // const handleQuery = async (actionId, controlId) => {
  //   try {
  //     // Prompt for feedback
  //     const feedback = prompt(
  //       'Enter feedback if the evidence is not confirmed (leave blank if confirmed):'
  //     );
  //     // Mark the action as completed
  //     // await issueInEvidence(actionId, controlId, feedback);

  //     // Update status in the list
  //     // updateStatusInList(actionId, feedback);
  //     // await handleFetchStatus();
  //   } catch (error) {
  //     console.error('Error marking action as completed:', error);
  //   }
  // };

  const handleUploadEvidence = async (actionId, controlId, selectedFile) => {
    // // Mark the action as completed
    await UploadSelectedEvidence(actionId, controlId, selectedFile);

    await handleFetchStatus();
    {
      console.error('Error Uploading');
    }
  };

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

  return (
    <div style={{ padding: '20px' }}>
      <section style={{ marginTop: '20px' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer
            component={Paper}
            style={{ maxHeight: 900, overflow: 'auto' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  {role !== 'IT Team' && <TableCell>Assigned to</TableCell>}
                  <TableCell>Action</TableCell>
                  <TableCell>Control</TableCell>
                  {role !== 'IT Team' && <TableCell>Feedback</TableCell>}
                  <TableCell>Status</TableCell>

                  {/* Conditional rendering for Upload Evidence based on role */}
                  {role === 'IT Team' && <TableCell>Upload Evidence</TableCell>}

                  <TableCell>View</TableCell>

                  {/* Actions for different roles */}
                  {role === 'IT Team' && <TableCell>Actions</TableCell>}
                  {role === 'Auditor' && (
                    <>
                      <TableCell>Actions</TableCell>
                      <TableCell>Confirm</TableCell>
                    </>
                  )}
                  {role === 'External Auditor' && (
                    <>
                      <TableCell>Actions</TableCell>
                      <TableCell>Mark as done</TableCell>
                    </>
                  )}
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
                  .map((status) => {
                    const isCompleted = status.status === 'Completed';

                    return (
                      <React.Fragment key={status._id}>
                        <TableRow>
                          <TableCell>
                            <IconButton
                              size='small'
                              onClick={() => handleToggleRow(status._id)}
                              color='primary'
                              // disabled={isCompleted} // Disable toggle button if completed
                            >
                              {openRows[status._id] ? (
                                <KeyboardArrowUp />
                              ) : (
                                <KeyboardArrowDown />
                              )}
                            </IconButton>
                          </TableCell>
                          {role !== 'IT Team' && (
                            <TableCell>{status.AssignedTo?.username}</TableCell>
                          )}
                          {/* <TableCell>{status.AssignedBy?.username}</TableCell> */}
                          <TableCell>
                            {status.actionId?.fixed_id || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {status.controlId?.section_desc || 'N/A'}
                          </TableCell>
                          {/* <TableCell>{status.feedback || 'N/A'}</TableCell> */}
                          {role !== 'IT Team' && (
                            <TableCell>{status.feedback || 'N/A'}</TableCell>
                          )}
                          <TableCell>{status.status || 'N/A'}</TableCell>
                          {role === 'IT Team' && !isCompleted && (
                            <EvidenceUpload
                              status={status}
                              isCompleted={isCompleted}
                              handleUploadEvidence={handleUploadEvidence}
                              actionId={status.actionId?._id}
                              controlId={status.controlId?._id}
                            />
                          )}
                          {(role === 'IT Team' ||
                            role === 'Auditor' ||
                            role === 'External Auditor') && (
                            <TableCell>
                              <Tooltip title='View Evidence'>
                                <Button
                                  variant='text' // Change to 'text' to remove contained styling
                                  color='primary'
                                  onClick={() =>
                                    handleViewEvidence(
                                      status.actionId?._id,
                                      status.controlId?._id
                                    )
                                  }
                                  disabled={!status.isEvidenceUploaded} // Disable button if evidence is not uploaded
                                >
                                  View Evidence
                                </Button>
                              </Tooltip>
                            </TableCell>
                          )}
                          {(role === 'Compliance Team' || role === 'Admin') && (
                            <TableCell>
                              <Tooltip title='Delegate to IT'>
                                <Button
                                  variant='text' // Change to 'text' to remove the outlined styling
                                  color='secondary'
                                  onClick={() =>
                                    onDelegateButtonClick(
                                      status._id,
                                      status.assetId._id
                                    )
                                  }
                                  disabled={
                                    isCompleted || status.status !== 'Open'
                                  } // Disable button if completed
                                >
                                  Delegate to IT
                                </Button>
                              </Tooltip>
                            </TableCell>
                          )}
                          {(role === 'IT Team' || role === 'Admin') && (
                            <TableCell>
                              <Tooltip title='Delegate to Auditor'>
                                <Button
                                  variant='text' // Change to 'text' to remove outlined styling
                                  color='secondary'
                                  onClick={() =>
                                    handleDelegateToAuditor(
                                      status._id,
                                      currentUserId
                                    )
                                  }
                                  disabled={
                                    isCompleted ||
                                    status.status !== 'Evidence Uploaded'
                                  } // Disable button if completed
                                >
                                  Delegate to Auditor
                                </Button>
                              </Tooltip>
                            </TableCell>
                          )}

                          {role === 'Auditor' && (
                            <TableCell>
                              <Tooltip title='Raise Query'>
                                <Button
                                  color='error'
                                  startIcon={<Warning />}
                                  onClick={() =>
                                    handleQuery(
                                      status.actionId?._id,
                                      status.controlId?._id
                                    )
                                  }

                                  // disabled={!isCompleted} // Disable button if completed
                                >
                                  Raise Query
                                </Button>
                              </Tooltip>
                            </TableCell>
                          )}
                          <QueryModal
                            open={isQueryModalOpen}
                            onClose={() => setQueryModalOpen(false)}
                            handleQuerySubmit={handleQuerySubmit}
                            evidenceUrl={evidenceUrl} // Pass the evidence URL to the modal
                            actionId={selectedActionId} // Use the state value here
                            controlId={selectedControlId} // Use the state value here
                          />
                          {role === 'External Auditor' && (
                            <TableCell>
                              <Tooltip title='Raise Query'>
                                <Button
                                  color='error'
                                  startIcon={<Warning />}
                                  onClick={() =>
                                    handleQuery(
                                      status.actionId?._id,
                                      status.controlId?._id
                                    )
                                  }
                                  disabled={!isCompleted} // Disable button if completed
                                >
                                  Raise Query
                                </Button>
                              </Tooltip>
                            </TableCell>
                          )}
                          {(role === 'Admin' || role == 'Auditor') && (
                            <TableCell>
                              <Tooltip title='Delegate to External Auditor'>
                                <Button
                                  variant='text' // Change to 'text' to remove outlined styling
                                  color='secondary'
                                  onClick={() =>
                                    handleDelegateToExternalAuditor(
                                      status._id,
                                      currentUserId
                                    )
                                  }
                                  disabled={isCompleted}
                                >
                                  Delegate to External Auditor
                                </Button>
                              </Tooltip>
                            </TableCell>
                          )}
                          {role === 'External Auditor' && (
                            <TableCell>
                              <Tooltip title='Confirm Evidence'>
                                <Button
                                  color='primary'
                                  startIcon={<CheckCircle />}
                                  onClick={() =>
                                    handleMarkAsCompleted(
                                      status.actionId?._id,
                                      status.controlId?._id
                                    )
                                  }
                                  disabled={isCompleted} // Disable button if completed
                                >
                                  Confirm Evidence
                                </Button>
                              </Tooltip>
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
                                        .slice() // Create a shallow copy to avoid mutating the original array
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
                                              {change.modifiedBy.username}
                                            </TableCell>
                                            <TableCell>
                                              <ul>
                                                {Object.entries(
                                                  change.changes
                                                ).map(([key, value]) => (
                                                  <li
                                                    key={key}
                                                  >{`${key}: ${value}`}</li>
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
