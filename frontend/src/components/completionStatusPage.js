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
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';


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
  const [actions, setActions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [scopes, setScopes] = useState([]);
  const [controls, setControls] = useState([]);
  const [families, setFamilies] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [actionOptions, setActionOptions] = useState([]);
  const [assetOptions, setAssetOptions] = useState([]);
  const [scopeOptions, setScopeOptions] = useState([]);
  const [controlOptions, setControlOptions] = useState([]);
  const [familyOptions, setFamilyOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);


  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

// New state to manage row expansion for history details
const [openRows, setOpenRows] = useState({});

const fetchUsers = async () => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      setUsers(data.users);
    } else {
      throw new Error('Received non-JSON response');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};



useEffect(() => {
  fetchUsers();
}, []);



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
      const response = await getStatus(query);
      setFetchedStatuses(Array.isArray(response) ? response : [response]);
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
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

  const handleDelegateToIT = async (statusId) => {
    try {
      const response = await delegateToIT(statusId);
      console.log('Delegated to IT Team:', response);
      updateStatusInList(statusId, 'Delegated to IT Team', 'Delegate to IT');
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

  const updateStatusInList = (statusId, newStatus, action, feedback = '') => {
    setFetchedStatuses(fetchedStatuses.map(status => 
      status._id === statusId ? { ...status, status: newStatus, action, feedback } : status
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

  const logActionOptions = () => {
    // console.log('Fetched Action Options:', actionOptions);
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

  const handleUserChange = async (statusId, userId) => {
    try {
      const updatedStatus = { ...statusData, assignedUser: userId };
      await createOrUpdateStatus(statusId, updatedStatus);
      updateStatusInList(statusId, updatedStatus.status, 'Update', updatedStatus.feedback);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task and Status Management</h1>

      <section>
        <h2>Search Status</h2>
        {/* <FormControl fullWidth style={{ marginBottom: '10px' }}>
          <InputLabel>Action</InputLabel>
          <Select
            name="actionId"
            value={query.actionId}
            onChange={handleQueryChange}
            label="Action"
          >
            {actionOptions.map(action => (
              <MenuItem key={action._id} value={action._id}>{action.variable_id}</MenuItem>
            ))}
          </Select>
        </FormControl> */}
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
          >
            {assetOptions.map(asset => (
              <MenuItem key={asset._id} value={asset._id}>{asset.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: '10px' }}>
          <InputLabel>Scope</InputLabel>
          <Select
            name="scopeId"
            value={query.scopeId}
            onChange={handleQueryChange}
            label="Scope"
          >
            {scopeOptions.map(scope => (
              <MenuItem key={scope._id} value={scope._id}>{scope.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: '10px' }}>
          <InputLabel>Control</InputLabel>
          <Select
            name="controlId"
            value={query.controlId}
            onChange={handleQueryChange}
            label="Control"
          >
            {controlOptions.map(control => (
              <MenuItem key={control._id} value={control._id}>{control.variable_id}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: '10px' }}>
          <InputLabel>Family</InputLabel>
          <Select
            name="familyId"
            value={query.familyId}
            onChange={handleQueryChange}
            label="Family"
          >
            {familyOptions.map(family => (
              <MenuItem key={family._id} value={family._id}>{family.section}</MenuItem>
            ))}
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
                  {/* <TableCell>Assigned to</TableCell> */}
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
          <FormControl fullWidth>
            <InputLabel>User</InputLabel>
            <Select
              value={status.assignedUser || ''}
              onChange={(e) => handleUserChange(status._id, e.target.value)}
              label="User"
            >
              {users.map(user => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>
          <Button onClick={() => handleDelegateToIT(status._id)}>Delegate to IT</Button>
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



              {/* <TableBody>
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
                      <TableCell>{status.username}</TableCell>
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
                        <Button onClick={() => handleDelegateToIT(status._id)}>Delegate to IT</Button>
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
              </TableBody> */}
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
