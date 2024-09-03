import React, { useState, useEffect } from 'react';
import {
  createOrUpdateStatus,
  getStatus,
  delegateToIT,
  delegateToAuditor,
  confirmEvidence
} from '../api/completionStatusApi';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TableSortLabel, Button, TextField, Select, MenuItem, CircularProgress,
  FormControl, InputLabel, TablePagination ,Collapse, IconButton
} from '@mui/material';

import { fetchActions } from '../api/actionAPI'; // Adjust the path as needed
import { getAssets } from '../api/assetApi';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { getAssetDetails } from '../api/assetDetailsApi'; // Adjust the path as needed
import {getUserById} from '../api/userApi';


const CompletionStatusPage = () => {
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
    feedback: ''
  });

  const [query, setQuery] = useState({
    actionId: '',
    assetId: '',
    scopeId: '',
    controlId: '',
    familyId: ''
  });

  const [fetchedStatuses, setFetchedStatuses] = useState([]);
 
  const [assetOptions, setAssetOptions] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
 
  const [actions, setActions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [scopes, setScopes] = useState([]);
  const [controls, setControls] = useState([]);
  const [families, setFamilies] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [actionOptions, setActionOptions] = useState([]);
  const [scopeOptions, setScopeOptions] = useState([]);
  const [controlOptions, setControlOptions] = useState([]);
  const [familyOptions, setFamilyOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [assetId, setAssetId] = useState(null);
  const [usernames, setUsernames] = useState({});

  

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

// New state to manage row expansion for history details
const [openRows, setOpenRows] = useState({});



useEffect(() => {
  const fetchAllUsernames = async () => {
    const uniqueUserIds = [...new Set(fetchedStatuses.map(status => status.username))];
    const newUsernames = {};

    await Promise.all(uniqueUserIds.map(async userId => {
      if (userId !== 'yourUsername' && !usernames[userId]) {
        const username = await handleFetchUsername(userId);
        newUsernames[userId] = username;
      }
    }));

    setUsernames(prevUsernames => ({
      ...prevUsernames,
      ...newUsernames,
    }));
  };

  fetchAllUsernames();
}, [fetchedStatuses]);

useEffect(() => {
  const fetchAssets = async () => {
    try {
      setLoading(true);
      const assetsResponse = await getAssets();
      setAssetOptions(assetsResponse);
      setFilteredAssets(assetsResponse); // Set initial filtered options
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchAssets();
}, []);

useEffect(() => {
  const filtered = assetOptions.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredAssets(filtered);
}, [searchTerm, assetOptions]);

const getUsername = (userId) => {
  return usernames[userId] || 'N/A';
};

const handleFetchUsername = async (userId) => {
  // if (usernames[userId]) {
  //   return usernames[userId]; // Return cached username if it exists
  // }
  if (userId === 'yourUsername') {
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
  setOpenRows(prevOpenRows => ({
    ...prevOpenRows,
    [statusId]: !prevOpenRows[statusId]
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
  const paginatedData = fetchedStatuses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  useEffect(() => {
    handleFetchStatus(); // Fetch data on component mount
  }, [query]); // Also refetch data when query changes


  useEffect(() => {
    
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statusResponse, actionResponse, assetResponse, scopeResponse, controlResponse, familyResponse] = await Promise.all([
          getStatus({}),
          // fetchActions(),
          debugFetchActions(),
          // fetch('/api/v1/actions').then(res => res.json()),
          fetch('/api/v1/assets').then(res => res.json()),
          fetch('/api/v1/scoped').then(res => res.json()),
          fetch('/api/v1/controls').then(res => res.json()),
          fetch('/api/v1/control-families').then(res => res.json())
        ]);

        const statuses = Array.isArray(statusResponse) ? statusResponse : [statusResponse];
        
        setFetchedStatuses(statuses);
        // setActions(actionResponse);
        setAssets(assetResponse);
        setScopes(scopeResponse);
        setControls(controlResponse);
        setFamilies(familyResponse);

        // Set options for dropdowns
        setActionOptions(actionResponse);
        // setAssetOptions(assetResponse);
        setScopeOptions(scopeResponse);
        setControlOptions(controlResponse);
        setFamilyOptions(familyResponse);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    // logActionOptions();
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const actionsResponse = await fetchActions();
        // console.log('Fetched Actions:', actionsResponse);
        setActionOptions(actionsResponse);
        setFilteredOptions(actionsResponse); // Set initial filtered options
      } catch (error) {
        console.error('Error fetching actions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = actionOptions.filter(action =>
      action.variable_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, actionOptions]);

  const updateAssetId = (id) => {
    setAssetId(id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStatusData({ ...statusData, [name]: value });
  };

  const handleQueryChange = (e) => {
    const { name, value } = e.target;
    setQuery({ ...query, [name]: value });
  };


  const handleFetchStatus = async () => {
    try {
      setLoading(true);
      console.log('Fetching status with query:', query);
      
      const response = await getStatus(query);
      // console.log('Fetched status response:', response);
      
      setFetchedStatuses(Array.isArray(response) ? response : [response]);
      // console.log('Updated fetchedStatuses:', fetchedStatuses);
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
      // console.log('Loading complete.');
    }
  };
  

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    sortData(key, direction);
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
    console.log('Button clicked with statusId:', statusId);
    console.log('Button clicked with assetId:', assetId);
    handleDelegateToIT(statusId, assetId);
  };
  

 
  const handleDelegateToIT = async (statusId, assetId) => {
    try {
      // Fetch asset details
      const assetDetails = await getAssetDetails();
      console.log('Fetched Asset Details:', assetDetails);
  
      // Find the asset detail by assetId
      const assetDetail = assetDetails.find(detail => detail.asset._id === assetId);
      
      if (!assetDetail) {
        console.log('No asset detail found for assetId:', assetId);
        return;
      }
  
      // Get the IT owner username from the asset details
      const itOwnerUsername = assetDetail.itOwnerName; // Adjust field name if needed
      console.log('IT Owner Username:', itOwnerUsername);
  
      // Update the status with the IT owner username
      const response = await delegateToIT(statusId, itOwnerUsername);
      console.log('Delegated to IT Team:', response);
  
      // Update status in the list
      updateStatusInList(statusId, 'Delegated to IT Team', 'Delegate to IT', itOwnerUsername); // Pass IT owner's username
      await handleFetchStatus(); // Refetch data after action
  
    } catch (error) {
      console.error('Error delegating to IT Team:', error);
    }
  };
  
  

  const handleDelegateToAuditor = async (statusId) => {
    try {
      const response = await delegateToAuditor(statusId);
      console.log('Delegated to Auditor:', response);
      updateStatusInList(statusId, 'Audit Delegated', 'Delegate to Auditor');
      await handleFetchStatus(); // Refetch data after action
    } catch (error) {
      console.error('Error delegating to Auditor:', error);
    }
  };

  const handleConfirmEvidence = async (statusId) => {
    try {
      const feedback = prompt('Enter feedback if the evidence is not confirmed (leave blank if confirmed):');
      await handleFetchStatus(); // Refetch data after action
      const response = await confirmEvidence(statusId, feedback);
      console.log('Evidence status updated:', response);
      updateStatusInList(statusId, feedback ? 'Audit Non-Confirm' : 'Audit Closed', feedback ? 'Return Evidence' : 'Confirm Evidence', feedback);
    } catch (error) {
      console.error('Error confirming evidence:', error);
    }
  };

  const updateStatusInList = (statusId, newStatus, action, assignedTo, feedback = '') => {
    setFetchedStatuses(fetchedStatuses.map(status => 
      status._id === statusId ? { ...status, status: newStatus, action, assignedTo, feedback } : status
    ));
  };
  

  const getDescriptionById = (id, list) => {

    const item = list.find(el => el._id === id);
    if (!item) return 'N/A';
    
    if (item.name) return item.name;
    if (item.variable_id) return item.variable_id;
    if (item.desc) return item.desc;
    if (item.fixed_id) return item.fixed_id;
    if (item.section) return item.section;
    if (item.section_main_desc) return item.section_main_desc;
    if (item.section_desc) return item.section_desc;
    
    return 'N/A';
  };

  const debugFetchActions = async () => {
    try {
      const actionsResponse = await fetchActions();
      // console.log('Fetched Actions:', actionsResponse); // Log the fetched actions to the console
      setActions(actionsResponse);
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };
  

  

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task and Status Management</h1>

      <section>
        <h2>Search Status</h2>
      
       <FormControl fullWidth style={{ marginBottom: '10px' }}>
  <InputLabel>Action</InputLabel>
  <Select
            name="actionId"
            value={query.actionId}
            onChange={handleQueryChange}
            label="Action"
            disabled={loading} // Disable while loading
            fullWidth
          >
            {loading ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map(action => (
                <MenuItem key={action._id} value={action._id}>
                  {action.variable_id} {/* Use appropriate field */}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No actions available</MenuItem>
            )}
          </Select>
</FormControl>

<FormControl fullWidth style={{ marginBottom: '10px' }}>
          <InputLabel>Asset</InputLabel>
          <Select
            name="assetId"
            value={query.assetId}
            onChange={handleQueryChange}
            label="Asset"
            disabled={loading} // Disable while loading
            fullWidth
          >
            {loading ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : filteredAssets.length > 0 ? (
              filteredAssets.map(asset => (
                <MenuItem key={asset._id} value={asset._id}>
                  {asset.name} {/* Use appropriate field */}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No assets available</MenuItem>
            )}
          </Select>
        </FormControl>

    
        <Button variant="contained" color="primary" onClick={handleFetchStatus}>Search</Button>
      </section>

      <section style={{ marginTop: '20px' }}>
        <h2>Status Table</h2>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} style={{ maxHeight: 600, overflow: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Status ID</TableCell>
                  <TableCell>Assigned to</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Asset</TableCell>
                  <TableCell>Scope</TableCell>
                  <TableCell>Control</TableCell>
                  <TableCell>Family</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell>Feedback</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((status) => (
                  <React.Fragment key={status._id}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleRow(status._id)}
                        >
                          {openRows[status._id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{status._id}</TableCell>
                      <TableCell>{getUsername(status.username)}</TableCell>
                      
                      {/* <TableCell>{status.username}</TableCell> */}
                      <TableCell>{status.actionId?.fixed_id || 'N/A'}</TableCell>
                      <TableCell>{status.assetId?.name || 'N/A'}</TableCell>
                      <TableCell>{status.scopeId?.name || 'N/A'}</TableCell>
                      <TableCell>{status.controlId?.fixed_id || 'N/A'}</TableCell>
                      <TableCell>{status.familyId?.fixed_id || 'N/A'}</TableCell>
                      <TableCell>{status.createdAt}</TableCell>
                      <TableCell>{status.updatedAt}</TableCell>
                      <TableCell>{status.feedback || 'N/A'}</TableCell>
                      <TableCell>{status.status || 'N/A'}</TableCell>
                      <TableCell>
                        <Button onClick={() => onDelegateButtonClick(status._id, status.assetId._id)}>Delegate to IT</Button>
                        <Button onClick={() => handleDelegateToAuditor(status._id)}>Delegate to Auditor</Button>
                        <Button onClick={() => handleConfirmEvidence(status._id)}>Confirm Evidence</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
                        <Collapse in={openRows[status._id]} timeout="auto" unmountOnExit>
                          <div style={{ margin: '10px' }}>
                            <h3>History</h3>
                            {status.history && status.history.length > 0 ? (
                              <Table size="small" aria-label="history">
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
                                      <TableCell>{new Date(change.modifiedAt).toLocaleString()}</TableCell>
                                      <TableCell>{change.modifiedBy}</TableCell>
                                      <TableCell>
                                        <ul>
                                          {Object.entries(change.changes).map(([key, value]) => (
                                            <li key={key}>{`${key}: ${value}`}</li>
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
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
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
