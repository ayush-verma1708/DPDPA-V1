import React, { useState, useEffect } from 'react';

import axios from 'axios';
import {
  createOrUpdateStatus,
  getStatus,
  delegateToIT,
  delegateToAuditor,
  confirmEvidence,
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
  Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  TablePagination,
  Collapse,
  IconButton,
} from '@mui/material';

import { fetchActions } from '../api/actionAPI'; // Adjust the path as needed
import { getAssets } from '../api/assetApi';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { getAssetDetails } from '../api/assetDetailsApi'; // Adjust the path as needed
import { getUserById } from '../api/userApi';
import { fetchCurrentUser } from '../api/userApi';

const CompletionStatusPage = ({
  expandedFamilyId,
  selectedAssetId,
  selectedScopeId,
  handleFileChange,
  handleUploadEvidence,
  handleStatusChange,
  statusOptions,
  ActionCompletionCell,
  handleMarkAsCompleted,
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

  const query = {
    scopeId: selectedScopeId,
    assetId: selectedAssetId,
    familyId: expandedFamilyId,
  };

  const [fetchedStatuses, setFetchedStatuses] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [usernames, setUsernames] = useState({});
  const [currentUsername, setCurrentUsername] = useState(null); // Store current username
  const [role, setRole] = useState(''); // To store the role from userData

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // New state to manage row expansion for history details
  const [openRows, setOpenRows] = useState({});

  const [evidenceUrls, setevidenceUrls] = useState([]);

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        const token = window.localStorage.getItem('token'); // Replace with actual token
        const userData = await fetchCurrentUser(token);
        setCurrentUsername(userData.username); // Set current username
      } catch (error) {
        console.error('Error fetching current user data:', error);
      }
    };

    fetchCurrentUserData();
  }, []);

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

  useEffect(() => {
    const fetchAllUsernames = async () => {
      const uniqueUserIds = [
        ...new Set(fetchedStatuses.map((status) => status.username)),
      ];
      const newUsernames = {};

      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          if (userId !== 'yourUsername' && !usernames[userId]) {
            const username = await handleFetchUsername(userId);
            newUsernames[userId] = username;
          }
        })
      );

      setUsernames((prevUsernames) => ({
        ...prevUsernames,
        ...newUsernames,
      }));
    };

    fetchAllUsernames();
  }, [fetchedStatuses]);

  const getUsername = (userId) => {
    return usernames[userId] || 'N/A';
  };

  const handleFetchUsername = async (userId) => {
    // if (usernames[userId]) {
    //   return usernames[userId]; // Return cached username if it exists
    // }
    if (userId === window.localStorage.getItem('username')) {
      return 'N/A'; // Return a default value if userId is 'yourusername'
    }

    try {
      const userData = await getUserById(userId);
      const username = userData.username;

      // // Cache the username to avoid redundant API calls
      // setUsernames((prevUsernames) => ({
      //   ...prevUsernames,
      //   [userId]: username,
      // }));

      return username;
    } catch (error) {
      console.error('Error fetching username:', error);
      return 'N/A';
    }
  };

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
    handleFetchStatus(); // Fetch data on component mount
  }, [query]); // Also refetch data when query changes

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

  const handleFetchStatus = async () => {
    try {
      const response = await getStatus(query);

      setFetchedStatuses(Array.isArray(response) ? response : [response]);
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await delegateToIT(statusId, itOwnerUsername);

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

  const handleDelegateToAuditor = async (statusId) => {
    try {
      const response = await delegateToAuditor(statusId);
      updateStatusInList(statusId, 'Audit Delegated', 'Delegate to Auditor');
      await handleFetchStatus(); // Refetch data after action
    } catch (error) {
      console.error('Error delegating to Auditor:', error);
    }
  };

  const handleConfirmEvidence = async (statusId) => {
    try {
      const feedback = prompt(
        'Enter feedback if the evidence is not confirmed (leave blank if confirmed):'
      );
      await handleFetchStatus(); // Refetch data after action
      const response = await confirmEvidence(statusId, feedback);
      updateStatusInList(
        statusId,
        feedback ? 'Audit Non-Confirm' : 'Audit Closed',
        feedback ? 'Return Evidence' : 'Confirm Evidence',
        feedback
      );
    } catch (error) {
      console.error('Error confirming evidence:', error);
    }
  };

  const updateStatusInList = (
    statusId,
    newStatus,
    action,
    assignedTo,
    feedback = ''
  ) => {
    setFetchedStatuses(
      fetchedStatuses.map((status) =>
        status._id === statusId
          ? { ...status, status: newStatus, action, assignedTo, feedback }
          : status
      )
    );
  };

  const handleViewEvidence = async (actionId, controlId) => {
    try {
      const res = await axios.post(`http://localhost:8021/api/evidence`, {
        // assetId: selectedAssetId,
        // scopeId: selectedScopeId,
        // actionId,
        // familyId: expandedFamilyId,
        // controlId: controlId,
        assetId: selectedAssetId,
        scopeId: selectedScopeId,
        actionId,
        familyId: expandedFamilyId,
        controlId: controlId,
      });

      console.log('handleViewEvidence', res.data);
    } catch (error) {
      console.error('Error fetching evidence:', error);
      return null; // Return null if there's an error or no evidence
    }
  };

  // useEffect(() => {
  //   if (actions.length > 0) {
  //     fetchEvidenceUrls(); // Fetch URLs whenever actions prop changes
  //   }
  // }, [actions]);

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
                  <TableCell>Assigned to</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Control</TableCell>
                  {/* <TableCell>Created At</TableCell> */}
                  {/* <TableCell>Updated At</TableCell> */}
                  <TableCell>Feedback</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Upload Evidence</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((status) => {
                  return (
                    <React.Fragment key={status._id}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            size='small'
                            onClick={() => handleToggleRow(status._id)}
                          >
                            {openRows[status._id] ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{getUsername(status.username)}</TableCell>

                        {/* <TableCell>{status.username}</TableCell> */}
                        <TableCell>
                          {status.actionId?.fixed_id || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {status.controlId?.section_desc || 'N/A'}
                        </TableCell>
                        {/* <TableCell>{status.createdAt}</TableCell> */}
                        {/* <TableCell>{status.updatedAt}</TableCell> */}
                        <TableCell>{status.feedback || 'N/A'}</TableCell>
                        <TableCell>{status.status || 'N/A'}</TableCell>
                        <TableCell>
                          <input type='file' onChange={handleFileChange} />
                          <Button
                            variant='contained'
                            color='primary'
                            onClick={() =>
                              handleUploadEvidence(
                                status.actionId?._id,
                                status.controlId?._id
                              )
                            }
                          >
                            Upload Evidence
                          </Button>
                        </TableCell>

                        <TableCell>
                          {/* Display link if evidence exists, otherwise show "No evidence uploaded" */}
                          <Button
                            onClick={() =>
                              handleViewEvidence(
                                status.actionId?._id,
                                status.controlId?._id
                              )
                            }
                          >
                            View Evidence
                          </Button>
                        </TableCell>

                        <TableCell>
                          {role === 'Compliance Team' ||
                            ('Admin' && (
                              <Button
                                onClick={() =>
                                  onDelegateButtonClick(
                                    status._id,
                                    status.assetId._id
                                  )
                                }
                              >
                                Delegate to IT
                              </Button>
                            ))}

                          {role === 'IT Team' ||
                            ('Admin' && (
                              <Button
                                onClick={() =>
                                  handleDelegateToAuditor(status._id)
                                }
                              >
                                Delegate to Auditor
                              </Button>
                            ))}
                          {role === 'Auditor' ||
                            ('Admin' && (
                              <Button
                                onClick={() =>
                                  handleConfirmEvidence(status._id)
                                }
                              >
                                Confirm Evidence
                              </Button>
                            ))}
                        </TableCell>
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
                                    {status.history.map((change, index) => (
                                      <TableRow key={index}>
                                        <TableCell>
                                          {new Date(
                                            change.modifiedAt
                                          ).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                          {change.modifiedBy}
                                        </TableCell>
                                        <TableCell>
                                          <ul>
                                            {Object.entries(change.changes).map(
                                              ([key, value]) => (
                                                <li
                                                  key={key}
                                                >{`${key}: ${value}`}</li>
                                              )
                                            )}
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
