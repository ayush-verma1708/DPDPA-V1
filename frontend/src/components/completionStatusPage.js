import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  getStatus,
  delegateToIT,
  delegateToAuditor,
  delegateToExternalAuditor,
} from '../api/completionStatusApi';
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
import { fetchActions } from '../api/actionAPI'; // Adjust the path as needed

import {
  CheckCircle,
  Warning,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { getAssetDetails } from '../api/assetDetailsApi'; // Adjust the path as needed
import { fetchCurrentUser, getUsernameById } from '../api/userApi';
import { Button, Tooltip } from '@mui/material';
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
  checkAssetSelection,
}) => {
  const [fetchedStatuses, setFetchedStatuses] = useState([]);

  const [loading, setLoading] = useState(true);
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

  const handleFetchStatus = async () => {
    setLoading(true); // Start loading state

    try {
      const response = await getStatus(query);
      const fetchedStatuses = Array.isArray(response) ? response : [response];

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

  const onDelegateButtonClick = (statusId, assetId) => {
    if (!checkAssetSelection()) return;
    handleDelegateToIT(statusId, assetId);
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

  const handleDelegateToAuditor = async (statusId, currentUserId) => {
    // Log parameters to ensure they are being passed correctly
    if (!checkAssetSelection()) return;
    try {
      // Call the API to delegate the status to the auditor
      const response = await delegateToAuditor(statusId, currentUserId);

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
    if (!checkAssetSelection()) return;
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
        // return res.data.fileUrl;
        // Redirect to the file URL or a specific route
        const fullUrl = `http://localhost:8021${res.data.fileUrl}`;
        // window.location.href = fullUrl; // Redirect to the evidence URL

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
    if (!checkAssetSelection()) return;
    try {
      // Prompt for feedback

      // Mark the action as completed
      await markActionAsCompleted(actionId, controlId);

      // Update status in the list

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

  const toCamelCase = (str) => {
    return str
      .split(' ')
      .map((word, index) => {
        // Capitalize the first letter of each word and make the rest lowercase
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(''); // Join without spaces to form camel case
  };

  return (
    <div style={{ padding: '20px' }}>
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
              href='http://localhost:3000/Product-Family'
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
        ) : (
          // <div>
          //   <p>No data available.</p>
          //   <a
          //     href='http://localhost:3000/Product-Family'
          //     style={{ color: 'blue', textDecoration: 'underline' }}
          //   >
          //     Go to Product Family
          //   </a>
          // </div>
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
                  <TableCell>Control Type</TableCell>
                  <TableCell>Software Selected</TableCell>

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
                  .filter(
                    (status) => !showOnlyTasks || status.isTask === true // Filter based on toggle state
                  )
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
                              <TableCell>
                                {status.controlId?.section_desc || 'N/A'}
                              </TableCell>

                              {role !== 'IT Team' && (
                                <TableCell>
                                  {status.feedback || 'N/A'}
                                </TableCell>
                              )}
                              <TableCell>{status.status || 'N/A'}</TableCell>
                              <TableCell>
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
                                role === 'Auditor' ||
                                role === 'External Auditor') && (
                                <TableCell>
                                  <Tooltip title='View Evidence'>
                                    <Button
                                      variant='text'
                                      color='primary'
                                      onClick={() =>
                                        handleViewEvidence(
                                          status.actionId?._id,
                                          status.controlId?._id
                                        )
                                      }
                                      disabled={!status.isEvidenceUploaded}
                                    >
                                      View Evidence
                                    </Button>
                                  </Tooltip>
                                </TableCell>
                              )}

                              {/* Delegate to IT Button for Compliance Team or Admin */}
                              {(role === 'Compliance Team' ||
                                role === 'Admin') && (
                                <TableCell>
                                  <Tooltip title='Delegate to IT'>
                                    <Button
                                      variant='text'
                                      color='secondary'
                                      onClick={() =>
                                        onDelegateButtonClick(
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
                                      Delegate to IT
                                    </Button>
                                  </Tooltip>
                                </TableCell>
                              )}

                              {/* Delegate to Auditor Button for IT Team or Admin */}
                              {(role === 'IT Team' || role === 'Admin') && (
                                <TableCell>
                                  <Tooltip title='Delegate to Auditor'>
                                    <Button
                                      variant='text'
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
                                      }
                                    >
                                      Delegate to Auditor
                                    </Button>
                                  </Tooltip>
                                </TableCell>
                              )}

                              {/* Raise Query Button for Auditor */}
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
                                      disabled={
                                        status.status === 'Wrong Evidence' ||
                                        status.status ===
                                          'External Audit Delegated'
                                      }
                                    >
                                      Raise Query
                                    </Button>
                                  </Tooltip>
                                </TableCell>
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
                                      disabled={
                                        isCompleted ||
                                        status.status === 'Wrong Evidence'
                                      }
                                    >
                                      Raise Query
                                    </Button>
                                  </Tooltip>
                                </TableCell>
                              )}

                              {/* Delegate to External Auditor Button for Admin or Auditor */}
                              {(role === 'Admin' || role === 'Auditor') && (
                                <TableCell>
                                  <Tooltip title='Delegate to External Auditor'>
                                    <Button
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
                                          'External Audit Delegated'
                                      }
                                    >
                                      Delegate to External Auditor
                                    </Button>
                                  </Tooltip>
                                </TableCell>
                              )}

                              {/* Confirm Evidence Button for External Auditor */}
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
                                      disabled={
                                        isCompleted ||
                                        status.status === 'Wrong Evidence'
                                      }
                                    >
                                      Confirm Evidence
                                    </Button>
                                  </Tooltip>
                                </TableCell>
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
                                              {change.modifiedBy.username}
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
