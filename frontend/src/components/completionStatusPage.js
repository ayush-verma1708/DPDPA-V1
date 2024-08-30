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
  

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

// New state to manage row expansion for history details
const [openRows, setOpenRows] = useState({});



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
        console.log('Fetched Actions:', actionsResponse);
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
    console.log('Fetched Action Options:', actionOptions);
  };
  const debugFetchActions = async () => {
    try {
      const actionsResponse = await fetchActions();
      console.log('Fetched Actions:', actionsResponse); // Log the fetched actions to the console
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


   {/* <section style={{ marginTop: '20px' }}>
        <h2>Status Table</h2>
        {loading ? <CircularProgress /> : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'username'}
                      direction={sortConfig.direction}
                      onClick={() => handleSort('username')}
                    >
                      Username
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === 'status'}
                      direction={sortConfig.direction}
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Asset</TableCell>
                  <TableCell>Scope</TableCell>
                  <TableCell>Control</TableCell>
                  <TableCell>Family</TableCell>
                  <TableCell>Feedback</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchedStatuses.map((status) => (
                  <TableRow key={status._id}>
                    <TableCell>{status.username}</TableCell>
                    <TableCell>{status.status}</TableCell>
                    <TableCell>{getDescriptionById(status.actionId}</TableCell>
                    <TableCell>{getDescriptionById(status.assetId, assets)}</TableCell>
                    <TableCell>{getDescriptionById(status.scopeId, scopes)}</TableCell>
                    <TableCell>{getDescriptionById(status.controlId, controls)}</TableCell>
                    <TableCell>{getDescriptionById(status.familyId, families)}</TableCell>
                    <TableCell>{status.feedback}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleDelegateToIT(status._id)}>Delegate to IT</Button>
                      <Button onClick={() => handleDelegateToAuditor(status._id)}>Delegate to Auditor</Button>
                      <Button onClick={() => handleConfirmEvidence(status._id)}>Confirm Evidence</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </section> */}
// import React, { useState, useEffect } from 'react';
// import {
//   createOrUpdateStatus,
//   getStatus,
//   delegateToIT,
//   delegateToAuditor,
//   confirmEvidence
// } from '../api/completionStatusApi';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, TableSortLabel, Button, TextField, Select, MenuItem, CircularProgress,
//   FormControl, InputLabel
// } from '@mui/material';

// const CompletionStatusPage = () => {
//   const [statusData, setStatusData] = useState({
//     actionId: '',
//     assetId: '',
//     scopeId: '',
//     controlId: '',
//     familyId: '',
//     isCompleted: false,
//     username: '',
//     status: 'Open',
//     action: '',
//     feedback: ''
//   });

//   const [query, setQuery] = useState({
//     actionId: '',
//     assetId: '',
//     scopeId: '',
//     controlId: '',
//     familyId: ''
//   });

//   const [fetchedStatuses, setFetchedStatuses] = useState([]);
//   const [actions, setActions] = useState([]);
//   const [assets, setAssets] = useState([]);
//   const [scopes, setScopes] = useState([]);
//   const [controls, setControls] = useState([]);
//   const [families, setFamilies] = useState([]);
//   const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
//   const [loading, setLoading] = useState(true);
//   const [actionOptions, setActionOptions] = useState([]);
//   const [assetOptions, setAssetOptions] = useState([]);
//   const [scopeOptions, setScopeOptions] = useState([]);
//   const [controlOptions, setControlOptions] = useState([]);
//   const [familyOptions, setFamilyOptions] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const [statusResponse, actionResponse, assetResponse, scopeResponse, controlResponse, familyResponse] = await Promise.all([
//           getStatus({}),
//           fetch('/api/v1/actions').then(res => res.json()),
//           fetch('/api/v1/assets').then(res => res.json()),
//           fetch('/api/v1/scopes').then(res => res.json()),
//           fetch('/api/v1/controls').then(res => res.json()),
//           fetch('/api/v1/families').then(res => res.json())
//         ]);

//         const statuses = Array.isArray(statusResponse) ? statusResponse : [statusResponse];
        
//         setFetchedStatuses(statuses);
//         setActions(actionResponse);
//         setAssets(assetResponse);
//         setScopes(scopeResponse);
//         setControls(controlResponse);
//         setFamilies(familyResponse);
        
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     handleFetchStatus();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setStatusData({ ...statusData, [name]: value });
//   };

//   const handleQueryChange = (e) => {
//     const { name, value } = e.target;
//     setQuery({ ...query, [name]: value });
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await createOrUpdateStatus(statusData);
//       console.log('Status created or updated:', response);
//     } catch (error) {
//       console.error('Error creating or updating status:', error);
//     }
//   };

//   const handleFetchStatus = async () => {
//     try {
//       setLoading(true);
//       const response = await getStatus(query);
//       setFetchedStatuses(Array.isArray(response) ? response : [response]);
//     } catch (error) {
//       console.error('Error fetching status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//     sortData(key, direction);
//   };

//   const sortData = (key, direction) => {
//     const sortedData = [...fetchedStatuses].sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === 'asc' ? -1 : 1;
//       }
//       if (a[key] > b[key]) {
//         return direction === 'asc' ? 1 : -1;
//       }
//       return 0;
//     });
//     setFetchedStatuses(sortedData);
//   };

//   const handleDelegateToIT = async (statusId) => {
//     try {
//       const response = await delegateToIT(statusId);
//       console.log('Delegated to IT Team:', response);
//       updateStatusInList(statusId, 'Delegated to IT Team', 'Delegate to IT');
//     } catch (error) {
//       console.error('Error delegating to IT Team:', error);
//     }
//   };

//   const handleDelegateToAuditor = async (statusId) => {
//     try {
//       const response = await delegateToAuditor(statusId);
//       console.log('Delegated to Auditor:', response);
//       updateStatusInList(statusId, 'Audit Delegated', 'Delegate to Auditor');
//     } catch (error) {
//       console.error('Error delegating to Auditor:', error);
//     }
//   };

//   const handleConfirmEvidence = async (statusId) => {
//     try {
//       const feedback = prompt('Enter feedback if the evidence is not confirmed (leave blank if confirmed):');
//       const response = await confirmEvidence(statusId, feedback);
//       console.log('Evidence status updated:', response);
//       updateStatusInList(statusId, feedback ? 'Audit Non-Confirm' : 'Audit Closed', feedback ? 'Return Evidence' : 'Confirm Evidence', feedback);
//     } catch (error) {
//       console.error('Error confirming evidence:', error);
//     }
//   };

//   const updateStatusInList = (statusId, newStatus, action, feedback = '') => {
//     setFetchedStatuses(fetchedStatuses.map(status => 
//       status._id === statusId ? { ...status, status: newStatus, action, feedback } : status
//     ));
//   };

//   const getDescriptionById = (id, list) => {
//     const item = list.find(el => el._id === id);
//     if (!item) return 'N/A';
    
//     if (item.name) return item.name;
//     if (item.variable_id) return item.variable_id;
//     if (item.desc) return item.desc;
//     if (item.fixed_id) return item.fixed_id;
//     if (item.section) return item.section;
//     if (item.section_main_desc) return item.section_main_desc;
//     if (item.section_desc) return item.section_desc;
    
//     return 'N/A';
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Task and Status Management</h1>
//       <div style={{ padding: '20px' }}>
//         <h1>Completion Status Management</h1>

//         <section>
//           <h2>Create or Update Status</h2>
//           <FormControl fullWidth style={{ marginBottom: '10px' }}>
//             <InputLabel>Action</InputLabel>
//             <Select
//               name="actionId"
//               value={statusData.actionId}
//               onChange={handleInputChange}
//               label="Action"
//             >
//               {actionOptions.map(action => (
//                 <MenuItem key={action._id} value={action._id}>{action.variable_id}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth style={{ marginBottom: '10px' }}>
//             <InputLabel>Asset</InputLabel>
//             <Select
//               name="assetId"
//               value={statusData.assetId}
//               onChange={handleInputChange}
//               label="Asset"
//             >
//               {assetOptions.map(asset => (
//                 <MenuItem key={asset._id} value={asset._id}>{asset.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth style={{ marginBottom: '10px' }}>
//             <InputLabel>Scope</InputLabel>
//             <Select
//               name="scopeId"
//               value={statusData.scopeId}
//               onChange={handleInputChange}
//               label="Scope"
//             >
//               {scopeOptions.map(scope => (
//                 <MenuItem key={scope._id} value={scope._id}>{scope.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth style={{ marginBottom: '10px' }}>
//             <InputLabel>Control</InputLabel>
//             <Select
//               name="controlId"
//               value={statusData.controlId}
//               onChange={handleInputChange}
//               label="Control"
//             >
//               {controlOptions.map(control => (
//                 <MenuItem key={control._id} value={control._id}>{control.variable_id}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth style={{ marginBottom: '10px' }}>
//             <InputLabel>Family</InputLabel>
//             <Select
//               name="familyId"
//               value={statusData.familyId}
//               onChange={handleInputChange}
//               label="Family"
//             >
//               {familyOptions.map(family => (
//                 <MenuItem key={family._id} value={family._id}>{family.section}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <TextField
//             name="username"
//             label="Username"
//             value={statusData.username}
//             onChange={handleInputChange}
//             fullWidth
//             style={{ marginBottom: '10px' }}
//           />
//           <TextField
//             name="status"
//             label="Status"
//             value={statusData.status}
//             onChange={handleInputChange}
//             fullWidth
//             style={{ marginBottom: '10px' }}
//           />
//           <TextField
//             name="action"
//             label="Action"
//             value={statusData.action}
//             onChange={handleInputChange}
//             fullWidth
//             style={{ marginBottom: '10px' }}
//           />
//           <TextField
//             name="feedback"
//             label="Feedback"
//             value={statusData.feedback}
//             onChange={handleInputChange}
//             fullWidth
//             style={{ marginBottom: '10px' }}
//           />
//           <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
//         </section>

//         <section style={{ marginTop: '20px' }}>
//           <h2>Search Status</h2>
//           <TextField
//             name="actionId"
//             label="Action ID"
//             value={query.actionId}
//             onChange={handleQueryChange}
//             style={{ marginRight: '10px' }}
//           />
//           <TextField
//             name="assetId"
//             label="Asset ID"
//             value={query.assetId}
//             onChange={handleQueryChange}
//             style={{ marginRight: '10px' }}
//           />
//           <TextField
//             name="scopeId"
//             label="Scope ID"
//             value={query.scopeId}
//             onChange={handleQueryChange}
//             style={{ marginRight: '10px' }}
//           />
//           <TextField
//             name="controlId"
//             label="Control ID"
//             value={query.controlId}
//             onChange={handleQueryChange}
//             style={{ marginRight: '10px' }}
//           />
//           <TextField
//             name="familyId"
//             label="Family ID"
//             value={query.familyId}
//             onChange={handleQueryChange}
//             style={{ marginRight: '10px' }}
//           />
//           <Button variant="contained" color="primary" onClick={handleFetchStatus}>Search</Button>
//         </section>

//         <section style={{ marginTop: '20px' }}>
//           <h2>Status Table</h2>
//           {loading ? <CircularProgress /> : (
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>
//                       <TableSortLabel
//                         active={sortConfig.key === 'username'}
//                         direction={sortConfig.direction}
//                         onClick={() => handleSort('username')}
//                       >
//                         Username
//                       </TableSortLabel>
//                     </TableCell>
//                     <TableCell>
//                       <TableSortLabel
//                         active={sortConfig.key === 'status'}
//                         direction={sortConfig.direction}
//                         onClick={() => handleSort('status')}
//                       >
//                         Status
//                       </TableSortLabel>
//                     </TableCell>
//                     <TableCell>Action</TableCell>
//                     <TableCell>Asset</TableCell>
//                     <TableCell>Scope</TableCell>
//                     <TableCell>Control</TableCell>
//                     <TableCell>Family</TableCell>
//                     <TableCell>Feedback</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {fetchedStatuses.map((status) => (
//                     <TableRow key={status._id}>
//                       <TableCell>{status.username}</TableCell>
//                       <TableCell>{status.status}</TableCell>
//                       <TableCell>{getDescriptionById(status.actionId, actions)}</TableCell>
//                       <TableCell>{getDescriptionById(status.assetId, assets)}</TableCell>
//                       <TableCell>{getDescriptionById(status.scopeId, scopes)}</TableCell>
//                       <TableCell>{getDescriptionById(status.controlId, controls)}</TableCell>
//                       <TableCell>{getDescriptionById(status.familyId, families)}</TableCell>
//                       <TableCell>{status.feedback}</TableCell>
//                       <TableCell>
//                         <Button onClick={() => handleDelegateToIT(status._id)}>Delegate to IT</Button>
//                         <Button onClick={() => handleDelegateToAuditor(status._id)}>Delegate to Auditor</Button>
//                         <Button onClick={() => handleConfirmEvidence(status._id)}>Confirm Evidence</Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default CompletionStatusPage;

// // import React, { useState, useEffect } from 'react';
// // import {
// //   createOrUpdateStatus,
// //   getStatus,
// //   delegateToIT,
// //   delegateToAuditor,
// //   confirmEvidence
// // } from '../api/completionStatusApi';
// // import {
// //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
// //   Paper, TableSortLabel, Button, TextField, Select, MenuItem, CircularProgress
// // } from '@mui/material';
// // import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// // const CompletionStatusPage = () => {
// //   const [statusData, setStatusData] = useState({
// //     actionId: '',
// //     assetId: '',
// //     scopeId: '',
// //     controlId: '',
// //     familyId: '',
// //     isCompleted: false,
// //     username: '',
// //     status: 'Open',
// //     action: '',
// //     feedback: ''
// //   });

// //   const [query, setQuery] = useState({
// //     actionId: '',
// //     assetId: '',
// //     scopeId: '',
// //     controlId: '',
// //     familyId: ''
// //   });

// //   const [fetchedStatuses, setFetchedStatuses] = useState([]);
// //   const [actions, setActions] = useState([]);
// //   const [assets, setAssets] = useState([]);
// //   const [scopes, setScopes] = useState([]);
// //   const [controls, setControls] = useState([]);
// //   const [families, setFamilies] = useState([]);
// //   const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
// //   const [loading, setLoading] = useState(true);
// //   const [actionOptions, setActionOptions] = useState([]);
// //   const [assetOptions, setAssetOptions] = useState([]);
// //   const [scopeOptions, setScopeOptions] = useState([]);
// //   const [controlOptions, setControlOptions] = useState([]);
// //   const [familyOptions, setFamilyOptions] = useState([]);
  

// //   // useEffect(() => {
// //   //   const fetchData = async () => {
// //   //     try {
// //   //       setLoading(true);
  
// //   //       const [statusResponse, actionResponse, assetResponse, scopeResponse, controlResponse, familyResponse] = await Promise.all([
// //   //         getCompletionStatuses(),
// //   //         getActions(),
// //   //         getAssets(),
// //   //         getScopes(),
// //   //         getControls(),
// //   //         getControlFamilies()
// //   //       ]);
  
// //   //       const statuses = Array.isArray(statusResponse) ? statusResponse : [statusResponse];
        
// //   //       setFetchedStatuses(statuses);
// //   //       setActionOptions(actionResponse);
// //   //       setAssetOptions(assetResponse);
// //   //       setScopeOptions(scopeResponse);
// //   //       setControlOptions(controlResponse);
// //   //       setFamilyOptions(familyResponse);
  
// //   //     } catch (error) {
// //   //       console.error('Error fetching data:', error);
// //   //     } finally {
// //   //       setLoading(false);
// //   //     }
// //   //   };
  
// //   //   fetchData();
// //   // }, []);
  


// //  useEffect(() => {
// //   const fetchData = async () => {
// //     try {
// //       setLoading(true);

// //       // Make concurrent API requests for all necessary data
// //       const [statusResponse, actionResponse, assetResponse, scopeResponse, controlResponse, familyResponse] = await Promise.all([
// //         getStatus({}),
// //         fetch('/api/v1/actions').then(res => res.json()),
// //         fetch('/api/v1/assets').then(res => res.json()),
// //         fetch('/api/v1/scopes').then(res => res.json()),
// //         fetch('/api/v1/controls').then(res => res.json()),
// //         fetch('/api/v1/families').then(res => res.json())
// //       ]);

// //       // Ensure statusResponse is an array
// //       const statuses = Array.isArray(statusResponse) ? statusResponse : [statusResponse];
      
// //       // Set fetched statuses and other data
// //       setFetchedStatuses(statuses);
// //       setActions(actionResponse);
// //       setAssets(assetResponse);
// //       setScopes(scopeResponse);
// //       setControls(controlResponse);
// //       setFamilies(familyResponse);
      
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   fetchData();
// // }, []);

  
// //   // useEffect(() => {
// //   //   const fetchData = async () => {
// //   //     try {
// //   //       setLoading(true);
        
// //   //       const [statusResponse, actionResponse, assetResponse, scopeResponse, controlResponse, familyResponse] = await Promise.all([
// //   //         getStatus({}),
// //   //         fetch('/api/v1/actions').then(res => res.json()),
// //   //         fetch('/api/v1/assets').then(res => res.json()),
// //   //         fetch('/api/v1/scopes').then(res => res.json()),
// //   //         fetch('/api/v1/controls').then(res => res.json()),
// //   //         fetch('/api/v1/families').then(res => res.json())
// //   //       ]);

// //   //       setFetchedStatuses(Array.isArray(statusResponse) ? statusResponse : [statusResponse]);
// //   //       setActions(actionResponse);
// //   //       setAssets(assetResponse);
// //   //       setScopes(scopeResponse);
// //   //       setControls(controlResponse);
// //   //       setFamilies(familyResponse);

// //   //     } catch (error) {
// //   //       console.error('Error fetching data:', error);
// //   //     } finally {
// //   //       setLoading(false);
// //   //     }
// //   //   };

// //   //   fetchData();
// //   // }, []);

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setStatusData({ ...statusData, [name]: value });
// //   };

// //   const handleQueryChange = (e) => {
// //     const { name, value } = e.target;
// //     setQuery({ ...query, [name]: value });
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       const response = await createOrUpdateStatus(statusData);
// //       console.log('Status created or updated:', response);
// //     } catch (error) {
// //       console.error('Error creating or updating status:', error);
// //     }
// //   };

// //   const handleFetchStatus = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await getStatus(query);
// //       setFetchedStatuses(Array.isArray(response) ? response : [response]);
// //     } catch (error) {
// //       console.error('Error fetching status:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSort = (key) => {
// //     let direction = 'asc';
// //     if (sortConfig.key === key && sortConfig.direction === 'asc') {
// //       direction = 'desc';
// //     }
// //     setSortConfig({ key, direction });
// //     sortData(key, direction);
// //   };

// //   const sortData = (key, direction) => {
// //     const sortedData = [...fetchedStatuses].sort((a, b) => {
// //       if (a[key] < b[key]) {
// //         return direction === 'asc' ? -1 : 1;
// //       }
// //       if (a[key] > b[key]) {
// //         return direction === 'asc' ? 1 : -1;
// //       }
// //       return 0;
// //     });
// //     setFetchedStatuses(sortedData);
// //   };

// //   const handleDelegateToIT = async (statusId) => {
// //     try {
// //       const response = await delegateToIT(statusId);
// //       console.log('Delegated to IT Team:', response);
// //       updateStatusInList(statusId, 'Delegated to IT Team', 'Delegate to IT');
// //     } catch (error) {
// //       console.error('Error delegating to IT Team:', error);
// //     }
// //   };

// //   const handleDelegateToAuditor = async (statusId) => {
// //     try {
// //       const response = await delegateToAuditor(statusId);
// //       console.log('Delegated to Auditor:', response);
// //       updateStatusInList(statusId, 'Audit Delegated', 'Delegate to Auditor');
// //     } catch (error) {
// //       console.error('Error delegating to Auditor:', error);
// //     }
// //   };

// //   const handleConfirmEvidence = async (statusId) => {
// //     try {
// //       const feedback = prompt('Enter feedback if the evidence is not confirmed (leave blank if confirmed):');
// //       const response = await confirmEvidence(statusId, feedback);
// //       console.log('Evidence status updated:', response);
// //       updateStatusInList(statusId, feedback ? 'Audit Non-Confirm' : 'Audit Closed', feedback ? 'Return Evidence' : 'Confirm Evidence', feedback);
// //     } catch (error) {
// //       console.error('Error confirming evidence:', error);
// //     }
// //   };

// //   const updateStatusInList = (statusId, newStatus, action, feedback = '') => {
// //     setFetchedStatuses(fetchedStatuses.map(status => 
// //       status._id === statusId ? { ...status, status: newStatus, action, feedback } : status
// //     ));
// //   };

// //   // Helper function to get descriptive data based on IDs
// //   const getDescriptionById = (id, list) => {
// //     const item = list.find(el => el._id === id);
// //     if (!item) return 'N/A';
    
// //     // Adjust this part to return the appropriate field based on your data structure
// //     if (item.name) return item.name;
// //     if (item.variable_id) return item.variable_id;
// //     if (item.desc) return item.desc;
// //     if (item.fixed_id) return item.fixed_id;
// //     if (item.section) return item.section;
// //     if (item.section_main_desc) return item.section_main_desc;
// //     if (item.section_desc) return item.section_desc;
    
// //     return 'N/A';
// //   };
  
// //   // const getDescriptionById = (id, list) => {
// //   //   const item = list.find(el => el._id === id);
// //   //   return item ? item.name || item.variable_id || item.desc || 'N/A' : 'N/A';
// //   // };

// //   return (
// //     <div style={{ padding: '20px' }}>
// //       <h1>Task and Status Management</h1>
// //       <div style={{ padding: '20px' }}>
// //     <h1>Completion Status Management</h1>

// //     <section>
// //       <h2>Create or Update Status</h2>
// //       <FormControl fullWidth style={{ marginBottom: '10px' }}>
// //         <InputLabel>Action</InputLabel>
// //         <Select
// //           name="actionId"
// //           value={statusData.actionId}
// //           onChange={handleInputChange}
// //           label="Action"
// //         >
// //           {actionOptions.map(action => (
// //             <MenuItem key={action._id} value={action._id}>{action.variable_id}</MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>
// //       <FormControl fullWidth style={{ marginBottom: '10px' }}>
// //         <InputLabel>Asset</InputLabel>
// //         <Select
// //           name="assetId"
// //           value={statusData.assetId}
// //           onChange={handleInputChange}
// //           label="Asset"
// //         >
// //           {assetOptions.map(asset => (
// //             <MenuItem key={asset._id} value={asset._id}>{asset.name}</MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>
// //       <FormControl fullWidth style={{ marginBottom: '10px' }}>
// //         <InputLabel>Scope</InputLabel>
// //         <Select
// //           name="scopeId"
// //           value={statusData.scopeId}
// //           onChange={handleInputChange}
// //           label="Scope"
// //         >
// //           {scopeOptions.map(scope => (
// //             <MenuItem key={scope._id} value={scope._id}>{scope.name}</MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>
// //       <FormControl fullWidth style={{ marginBottom: '10px' }}>
// //         <InputLabel>Control</InputLabel>
// //         <Select
// //           name="controlId"
// //           value={statusData.controlId}
// //           onChange={handleInputChange}
// //           label="Control"
// //         >
// //           {controlOptions.map(control => (
// //             <MenuItem key={control._id} value={control._id}>{control.section_desc}</MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>
// //       <FormControl fullWidth style={{ marginBottom: '10px' }}>
// //         <InputLabel>Family</InputLabel>
// //         <Select
// //           name="familyId"
// //           value={statusData.familyId}
// //           onChange={handleInputChange}
// //           label="Family"
// //         >
// //           {familyOptions.map(family => (
// //             <MenuItem key={family._id} value={family._id}>{family.variable_id}</MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>
// //       <TextField name="username" label="Username" value={statusData.username} onChange={handleInputChange} />
// //       <FormControl fullWidth style={{ marginBottom: '10px' }}>
// //         <InputLabel>Completed</InputLabel>
// //         <Select
// //           name="isCompleted"
// //           value={statusData.isCompleted}
// //           onChange={handleInputChange}
// //           label="Completed"
// //         >
// //           <MenuItem value={false}>Not Completed</MenuItem>
// //           <MenuItem value={true}>Completed</MenuItem>
// //         </Select>
// //       </FormControl>
// //       <Button onClick={handleSubmit} variant="contained" style={{ marginTop: '10px' }}>Submit</Button>
// //     </section>

// //     <section style={{ marginTop: '40px' }}>
// //       <h2>Fetch Completion Status</h2>
// //       <FormControl fullWidth style={{ marginBottom: '10px' }}>
// //         <InputLabel>Action</InputLabel>
// //         <Select
// //           name="actionId"
// //           value={query.actionId}
// //           onChange={handleQueryChange}
// //           label="Action"
// //         >
// //           {actionOptions.map(action => (
// //             <MenuItem key={action._id} value={action._id}>{action.variable_id}</MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>
// //       <FormControl fullWidth style={{ marginBottom: '10px' }}>
// //         <InputLabel>Asset</InputLabel>
// //         <Select
// //           name="assetId"
// //           value={query.assetId}
// //           onChange={handleQueryChange}
// //           label="Asset"
// //         >
// //           {assetOptions.map(asset => (
// //             <MenuItem key={asset._id} value={asset._id}>{asset.name}</MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>
// //       <FormControl fullWidth style={{ marginBottom: '10px' }}>
// //         <InputLabel>Scope</InputLabel>
// //         <Select
// //           name="scopeId"
// //           value={query.scopeId}
// //           onChange={handleQueryChange}
// //           label="Scope"
// //         >
// //           {scopeOptions.map(scope => (
// //             <MenuItem key={scope._id} value={scope._id}>{scope.name}</MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>
// //       <FormControl fullWidth style={{ marginBottom: '10px' }}>
// //         <InputLabel>Control</InputLabel>
// //         <Select
// //           name="controlId"
// //           value={query.controlId}
// //           onChange={handleQueryChange}
// //           label="Control"
// //         >
// //           {controlOptions.map(control => (
// //             <MenuItem key={control._id} value={control._id}>{control.section_desc}</MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>
// //       <FormControl fullWidth style={{ marginBottom: '10px' }}>
// //         <InputLabel>Family</InputLabel>
// //         <Select
// //           name="familyId"
// //           value={query.familyId}
// //           onChange={handleQueryChange}
// //           label="Family"
// //         >
// //           {familyOptions.map(family => (
// //             <MenuItem key={family._id} value={family._id}>{family.variable_id}</MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>
// //       <Button onClick={handleFetchStatus} variant="contained" style={{ marginTop: '10px' }}>Fetch Status</Button>

// //       {loading ? (
// //         <CircularProgress style={{ marginTop: '20px' }} />
// //       ) : (
// //         fetchedStatuses.length > 0 && (
// //           <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight: '400px', overflow: 'auto' }}>
// //             <Table stickyHeader>
// //               <TableHead>
// //                 <TableRow>
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={sortConfig.key === 'actionId'}
// //                       direction={sortConfig.direction}
// //                       onClick={() => handleSort('actionId')}
// //                     >
// //                       Action
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={sortConfig.key === 'assetId'}
// //                       direction={sortConfig.direction}
// //                       onClick={() => handleSort('assetId')}
// //                     >
// //                       Asset
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={sortConfig.key === 'scopeId'}
// //                       direction={sortConfig.direction}
// //                       onClick={() => handleSort('scopeId')}
// //                     >
// //                       Scope
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={sortConfig.key === 'controlId'}
// //                       direction={sortConfig.direction}
// //                       onClick={() => handleSort('controlId')}
// //                     >
// //                       Control
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>
// //                     <TableSortLabel
// //                       active={sortConfig.key === 'familyId'}
// //                       direction={sortConfig.direction}
// //                       onClick={() => handleSort('familyId')}
// //                     >
// //                       Family
// //                     </TableSortLabel>
// //                   </TableCell>
// //                   <TableCell>Status</TableCell>
// //                   <TableCell>Username</TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {fetchedStatuses.map(status => (
// //                   <TableRow key={status._id}>
// //                     <TableCell>{status.action}</TableCell>
// //                     <TableCell>{status.asset}</TableCell>
// //                     <TableCell>{status.scope}</TableCell>
// //                     <TableCell>{status.control}</TableCell>
// //                     <TableCell>{status.family}</TableCell>
// //                     <TableCell>{status.status}</TableCell>
// //                     <TableCell>{status.username}</TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </TableContainer>
// //         )
// //       )}
// //     </section>
// //   </div>

// //       {/* <section style={{ marginTop: '40px' }}>
// //         <h2>Fetch Completion Status</h2>
// //         <TextField name="actionId" label="Action ID" value={query.actionId} onChange={handleQueryChange} />
// //         <TextField name="assetId" label="Asset ID" value={query.assetId} onChange={handleQueryChange} />
// //         <TextField name="scopeId" label="Scope ID" value={query.scopeId} onChange={handleQueryChange} />
// //         <TextField name="controlId" label="Control ID" value={query.controlId} onChange={handleQueryChange} />
// //         <TextField name="familyId" label="Family ID" value={query.familyId} onChange={handleQueryChange} />
// //         <Button onClick={handleFetchStatus} variant="contained" style={{ marginTop: '10px' }}>Fetch Status</Button>

// //         {loading ? (
// //           <CircularProgress style={{ marginTop: '20px' }} />
// //         ) : (
// //           fetchedStatuses.length > 0 && (
// //             <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight: '400px', overflow: 'auto' }}>
// //               <Table stickyHeader>
// //                 <TableHead>
// //                   <TableRow>
// //                     <TableCell>
// //                       <TableSortLabel
// //                         active={sortConfig.key === 'actionId'}
// //                         direction={sortConfig.direction}
// //                         onClick={() => handleSort('actionId')}
// //                       >
// //                         Action
// //                       </TableSortLabel>
// //                     </TableCell>
// //                     <TableCell>
// //                       <TableSortLabel
// //                         active={sortConfig.key === 'assetId'}
// //                         direction={sortConfig.direction}
// //                         onClick={() => handleSort('assetId')}
// //                       >
// //                         Asset
// //                       </TableSortLabel>
// //                     </TableCell>
// //                     <TableCell>
// //                       <TableSortLabel
// //                         active={sortConfig.key === 'scopeId'}
// //                         direction={sortConfig.direction}
// //                         onClick={() => handleSort('scopeId')}
// //                       >
// //                         Scope
// //                       </TableSortLabel>
// //                     </TableCell>
// //                     <TableCell>
// //                       <TableSortLabel
// //                         active={sortConfig.key === 'controlId'}
// //                         direction={sortConfig.direction}
// //                         onClick={() => handleSort('controlId')}
// //                       >
// //                         Control
// //                       </TableSortLabel>
// //                     </TableCell>
// //                     <TableCell>
// //                       <TableSortLabel
// //                         active={sortConfig.key === 'familyId'}
// //                         direction={sortConfig.direction}
// //                         onClick={() => handleSort('familyId')}
// //                       >
// //                         Family
// //                       </TableSortLabel>
// //                     </TableCell>
// //                     <TableCell>Username</TableCell>
// //                     <TableCell>Status</TableCell>
// //                     <TableCell>Action</TableCell>
// //                     <TableCell>Feedback</TableCell>
// //                     <TableCell>Actions</TableCell>
// //                   </TableRow>
// //                 </TableHead>
// //                 <TableBody>
// //                   {fetchedStatuses.map((status) => (
// //                     <TableRow key={status._id}>

// //                       <TableCell>{getDescriptionById(status.actionId, actions)}</TableCell>
// //                       <TableCell>{getDescriptionById(status.assetId, assets)}</TableCell>
// //                       <TableCell>{getDescriptionById(status.scopeId, scopes)}</TableCell>
// //                       <TableCell>{getDescriptionById(status.controlId, controls)}</TableCell>
// //                       <TableCell>{getDescriptionById(status.familyId, families)}</TableCell>
// //                       <TableCell>{status.username}</TableCell>
// //                       <TableCell>{status.status}</TableCell>
// //                       <TableCell>{status.action}</TableCell>
// //                       <TableCell>{status.feedback}</TableCell>
// //                       <TableCell>
// //                         <Button variant="contained" onClick={() => handleDelegateToIT(status._id)}>Delegate to IT</Button>
// //                         <Button variant="contained" onClick={() => handleDelegateToAuditor(status._id)} style={{ marginLeft: '10px' }}>Delegate to Auditor</Button>
// //                         <Button variant="contained" onClick={() => handleConfirmEvidence(status._id)} style={{ marginLeft: '10px' }}>Confirm Evidence</Button>
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
// //                 </TableBody>
// //               </Table>
// //             </TableContainer>
// //           )
// //         )}
// //       </section> */}
// //     </div>
// //   );
// // };

// // export default CompletionStatusPage;

// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   createOrUpdateStatus,
// // //   getStatus,
// // //   delegateToIT,
// // //   delegateToAuditor,
// // //   confirmEvidence
// // // } from '../api/completionStatusApi';

// // // const CompletionStatusPage = () => {
// // //   const [statusData, setStatusData] = useState({
// // //     actionId: '',
// // //     assetId: '',
// // //     scopeId: '',
// // //     controlId: '',
// // //     familyId: '',
// // //     isCompleted: false,
// // //     username: '',
// // //     status: 'Open',
// // //     action: '',
// // //     feedback: ''
// // //   });

// // //   const [query, setQuery] = useState({
// // //     actionId: '',
// // //     assetId: '',
// // //     scopeId: '',
// // //     controlId: '',
// // //     familyId: ''
// // //   });

// // //   const [fetchedStatus, setFetchedStatus] = useState(null);

// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setStatusData({ ...statusData, [name]: value });
// // //   };

// // //   const handleQueryChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setQuery({ ...query, [name]: value });
// // //   };

// // //   const handleSubmit = async () => {
// // //     try {
// // //       const response = await createOrUpdateStatus(statusData);
// // //       console.log('Status created or updated:', response);
// // //     } catch (error) {
// // //       console.error('Error creating or updating status:', error);
// // //     }
// // //   };

// // //   const handleFetchStatus = async () => {
// // //     try {
// // //       const response = await getStatus(query);
// // //       setFetchedStatus(response);
// // //     } catch (error) {
// // //       console.error('Error fetching status:', error);
// // //     }
// // //   };

// // //   const handleDelegateToIT = async () => {
// // //     try {
// // //       const response = await delegateToIT(fetchedStatus._id);
// // //       console.log('Delegated to IT Team:', response);
// // //       setFetchedStatus({ ...fetchedStatus, status: 'Delegated to IT Team', action: 'Delegate to IT' });
// // //     } catch (error) {
// // //       console.error('Error delegating to IT Team:', error);
// // //     }
// // //   };

// // //   const handleDelegateToAuditor = async () => {
// // //     try {
// // //       const response = await delegateToAuditor(fetchedStatus._id);
// // //       console.log('Delegated to Auditor:', response);
// // //       setFetchedStatus({ ...fetchedStatus, status: 'Audit Delegated', action: 'Delegate to Auditor' });
// // //     } catch (error) {
// // //       console.error('Error delegating to Auditor:', error);
// // //     }
// // //   };

// // //   const handleConfirmEvidence = async () => {
// // //     try {
// // //       const feedback = prompt('Enter feedback if the evidence is not confirmed (leave blank if confirmed):');
// // //       const response = await confirmEvidence(fetchedStatus._id, feedback);
// // //       console.log('Evidence status updated:', response);
// // //       setFetchedStatus({
// // //         ...fetchedStatus,
// // //         status: feedback ? 'Audit Non-Confirm' : 'Audit Closed',
// // //         action: feedback ? 'Return Evidence' : 'Confirm Evidence',
// // //         feedback
// // //       });
// // //     } catch (error) {
// // //       console.error('Error confirming evidence:', error);
// // //     }
// // //   };

// // //   return (
// // //     <div style={{ padding: '20px' }}>
// // //       <h1>Completion Status Management</h1>

// // //       <section>
// // //         <h2>Create or Update Status</h2>
// // //         <input name="actionId" placeholder="Action ID" value={statusData.actionId} onChange={handleInputChange} />
// // //         <input name="assetId" placeholder="Asset ID" value={statusData.assetId} onChange={handleInputChange} />
// // //         <input name="scopeId" placeholder="Scope ID" value={statusData.scopeId} onChange={handleInputChange} />
// // //         <input name="controlId" placeholder="Control ID" value={statusData.controlId} onChange={handleInputChange} />
// // //         <input name="familyId" placeholder="Family ID" value={statusData.familyId} onChange={handleInputChange} />
// // //         <input name="username" placeholder="Username" value={statusData.username} onChange={handleInputChange} />
// // //         <select name="isCompleted" value={statusData.isCompleted} onChange={handleInputChange}>
// // //           <option value={false}>Not Completed</option>
// // //           <option value={true}>Completed</option>
// // //         </select>
// // //         <button onClick={handleSubmit}>Submit</button>
// // //       </section>

// // //       <section style={{ marginTop: '40px' }}>
// // //         <h2>Fetch Completion Status</h2>
// // //         <input name="actionId" placeholder="Action ID" value={query.actionId} onChange={handleQueryChange} />
// // //         <input name="assetId" placeholder="Asset ID" value={query.assetId} onChange={handleQueryChange} />
// // //         <input name="scopeId" placeholder="Scope ID" value={query.scopeId} onChange={handleQueryChange} />
// // //         <input name="controlId" placeholder="Control ID" value={query.controlId} onChange={handleQueryChange} />
// // //         <input name="familyId" placeholder="Family ID" value={query.familyId} onChange={handleQueryChange} />
// // //         <button onClick={handleFetchStatus}>Fetch Status</button>

// // //         {fetchedStatus && (
// // //           <div style={{ marginTop: '20px' }}>
// // //             <h3>Fetched Status:</h3>
// // //             <pre>{JSON.stringify(fetchedStatus, null, 2)}</pre>
// // //             <button onClick={handleDelegateToIT}>Delegate to IT</button>
// // //             <button onClick={handleDelegateToAuditor} style={{ marginLeft: '10px' }}>Delegate to Auditor</button>
// // //             <button onClick={handleConfirmEvidence} style={{ marginLeft: '10px' }}>Confirm Evidence</button>
// // //           </div>
// // //         )}
// // //       </section>
// // //     </div>
// // //   );
// // // };

// // // export default CompletionStatusPage;

// // // // import React, { useState, useEffect } from 'react';
// // // // import {
// // // //   createOrUpdateStatus,
// // // //   getStatus,
// // // //   delegateToIT,
// // // //   delegateToAuditor,
// // // //   confirmEvidence
// // // // } from '../api/completionStatusApi';
// // // // import {
// // // //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
// // // //   Paper, TableSortLabel, Button, TextField, Select, MenuItem, CircularProgress
// // // // } from '@mui/material';

// // // // const CompletionStatusPage = () => {
// // // //   const [statusData, setStatusData] = useState({
// // // //     actionId: '',
// // // //     assetId: '',
// // // //     scopeId: '',
// // // //     controlId: '',
// // // //     familyId: '',
// // // //     isCompleted: false,
// // // //     username: '',
// // // //     status: 'Open',
// // // //     action: '',
// // // //     feedback: ''
// // // //   });

// // // //   const [query, setQuery] = useState({
// // // //     actionId: '',
// // // //     assetId: '',
// // // //     scopeId: '',
// // // //     controlId: '',
// // // //     familyId: ''
// // // //   });

// // // //   const [fetchedStatuses, setFetchedStatuses] = useState([]);
// // // //   const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     const fetchStatuses = async () => {
// // // //       try {
// // // //         setLoading(true);
// // // //         const response = await getStatus({});
// // // //         setFetchedStatuses(Array.isArray(response) ? response : [response]);
// // // //       } catch (error) {
// // // //         console.error('Error fetching status:', error);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchStatuses();
// // // //   }, []);

// // // //   const handleInputChange = (e) => {
// // // //     const { name, value } = e.target;
// // // //     setStatusData({ ...statusData, [name]: value });
// // // //   };

// // // //   const handleQueryChange = (e) => {
// // // //     const { name, value } = e.target;
// // // //     setQuery({ ...query, [name]: value });
// // // //   };

// // // //   const handleSubmit = async () => {
// // // //     try {
// // // //       const response = await createOrUpdateStatus(statusData);
// // // //       console.log('Status created or updated:', response);
// // // //     } catch (error) {
// // // //       console.error('Error creating or updating status:', error);
// // // //     }
// // // //   };

// // // //   const handleFetchStatus = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       const response = await getStatus(query);
// // // //       setFetchedStatuses(Array.isArray(response) ? response : [response]);
// // // //     } catch (error) {
// // // //       console.error('Error fetching status:', error);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleSort = (key) => {
// // // //     let direction = 'asc';
// // // //     if (sortConfig.key === key && sortConfig.direction === 'asc') {
// // // //       direction = 'desc';
// // // //     }
// // // //     setSortConfig({ key, direction });
// // // //     sortData(key, direction);
// // // //   };

// // // //   const sortData = (key, direction) => {
// // // //     const sortedData = [...fetchedStatuses].sort((a, b) => {
// // // //       if (a[key] < b[key]) {
// // // //         return direction === 'asc' ? -1 : 1;
// // // //       }
// // // //       if (a[key] > b[key]) {
// // // //         return direction === 'asc' ? 1 : -1;
// // // //       }
// // // //       return 0;
// // // //     });
// // // //     setFetchedStatuses(sortedData);
// // // //   };

// // // //   const handleDelegateToIT = async (statusId) => {
// // // //     try {
// // // //       const response = await delegateToIT(statusId);
// // // //       console.log('Delegated to IT Team:', response);
// // // //       updateStatusInList(statusId, 'Delegated to IT Team', 'Delegate to IT');
// // // //     } catch (error) {
// // // //       console.error('Error delegating to IT Team:', error);
// // // //     }
// // // //   };

// // // //   const handleDelegateToAuditor = async (statusId) => {
// // // //     try {
// // // //       const response = await delegateToAuditor(statusId);
// // // //       console.log('Delegated to Auditor:', response);
// // // //       updateStatusInList(statusId, 'Audit Delegated', 'Delegate to Auditor');
// // // //     } catch (error) {
// // // //       console.error('Error delegating to Auditor:', error);
// // // //     }
// // // //   };

// // // //   const handleConfirmEvidence = async (statusId) => {
// // // //     try {
// // // //       const feedback = prompt('Enter feedback if the evidence is not confirmed (leave blank if confirmed):');
// // // //       const response = await confirmEvidence(statusId, feedback);
// // // //       console.log('Evidence status updated:', response);
// // // //       updateStatusInList(statusId, feedback ? 'Audit Non-Confirm' : 'Audit Closed', feedback ? 'Return Evidence' : 'Confirm Evidence', feedback);
// // // //     } catch (error) {
// // // //       console.error('Error confirming evidence:', error);
// // // //     }
// // // //   };

// // // //   const updateStatusInList = (statusId, newStatus, action, feedback = '') => {
// // // //     setFetchedStatuses(fetchedStatuses.map(status => 
// // // //       status._id === statusId ? { ...status, status: newStatus, action, feedback } : status
// // // //     ));
// // // //   };

// // // //   return (
// // // //     <div style={{ padding: '20px' }}>
// // // //       <h1>Completion Status Management</h1>

// // // //       <section>
// // // //         <h2>Create or Update Status</h2>
// // // //         <TextField name="actionId" label="Action ID" value={statusData.actionId} onChange={handleInputChange} />
// // // //         <TextField name="assetId" label="Asset ID" value={statusData.assetId} onChange={handleInputChange} />
// // // //         <TextField name="scopeId" label="Scope ID" value={statusData.scopeId} onChange={handleInputChange} />
// // // //         <TextField name="controlId" label="Control ID" value={statusData.controlId} onChange={handleInputChange} />
// // // //         <TextField name="familyId" label="Family ID" value={statusData.familyId} onChange={handleInputChange} />
// // // //         <TextField name="username" label="Username" value={statusData.username} onChange={handleInputChange} />
// // // //         <Select name="isCompleted" value={statusData.isCompleted} onChange={handleInputChange}>
// // // //           <MenuItem value={false}>Not Completed</MenuItem>
// // // //           <MenuItem value={true}>Completed</MenuItem>
// // // //         </Select>
// // // //         <Button onClick={handleSubmit} variant="contained" style={{ marginTop: '10px' }}>Submit</Button>
// // // //       </section>

// // // //       <section style={{ marginTop: '40px' }}>
// // // //         <h2>Fetch Completion Status</h2>
// // // //         <TextField name="actionId" label="Action ID" value={query.actionId} onChange={handleQueryChange} />
// // // //         <TextField name="assetId" label="Asset ID" value={query.assetId} onChange={handleQueryChange} />
// // // //         <TextField name="scopeId" label="Scope ID" value={query.scopeId} onChange={handleQueryChange} />
// // // //         <TextField name="controlId" label="Control ID" value={query.controlId} onChange={handleQueryChange} />
// // // //         <TextField name="familyId" label="Family ID" value={query.familyId} onChange={handleQueryChange} />
// // // //         <Button onClick={handleFetchStatus} variant="contained" style={{ marginTop: '10px' }}>Fetch Status</Button>

// // // //         {loading ? (
// // // //           <CircularProgress style={{ marginTop: '20px' }} />
// // // //         ) : (
// // // //           fetchedStatuses.length > 0 && (
// // // //             <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight: '400px', overflow: 'auto' }}>
// // // //               <Table stickyHeader>
// // // //                 <TableHead>
// // // //                   <TableRow>
// // // //                     <TableCell>
// // // //                       <TableSortLabel
// // // //                         active={sortConfig.key === 'actionId'}
// // // //                         direction={sortConfig.direction}
// // // //                         onClick={() => handleSort('actionId')}
// // // //                       >
// // // //                         Action ID
// // // //                       </TableSortLabel>
// // // //                     </TableCell>
// // // //                     <TableCell>
// // // //                       <TableSortLabel
// // // //                         active={sortConfig.key === 'assetId'}
// // // //                         direction={sortConfig.direction}
// // // //                         onClick={() => handleSort('assetId')}
// // // //                       >
// // // //                         Asset ID
// // // //                       </TableSortLabel>
// // // //                     </TableCell>
// // // //                     <TableCell>
// // // //                       <TableSortLabel
// // // //                         active={sortConfig.key === 'scopeId'}
// // // //                         direction={sortConfig.direction}
// // // //                         onClick={() => handleSort('scopeId')}
// // // //                       >
// // // //                         Scope ID
// // // //                       </TableSortLabel>
// // // //                     </TableCell>
// // // //                     <TableCell>
// // // //                       <TableSortLabel
// // // //                         active={sortConfig.key === 'controlId'}
// // // //                         direction={sortConfig.direction}
// // // //                         onClick={() => handleSort('controlId')}
// // // //                       >
// // // //                         Control ID
// // // //                       </TableSortLabel>
// // // //                     </TableCell>
// // // //                     <TableCell>
// // // //                       <TableSortLabel
// // // //                         active={sortConfig.key === 'familyId'}
// // // //                         direction={sortConfig.direction}
// // // //                         onClick={() => handleSort('familyId')}
// // // //                       >
// // // //                         Family ID
// // // //                       </TableSortLabel>
// // // //                     </TableCell>
// // // //                     <TableCell>Username</TableCell>
// // // //                     <TableCell>Status</TableCell>
// // // //                     <TableCell>Action</TableCell>
// // // //                     <TableCell>Feedback</TableCell>
// // // //                     <TableCell>Actions</TableCell>
// // // //                   </TableRow>
// // // //                 </TableHead>
// // // //                 <TableBody>
// // // //                   {fetchedStatuses.map((status) => (
// // // //                     <TableRow key={status._id}>
// // // //                       <TableCell>{status.actionId}</TableCell>
// // // //                       <TableCell>{status.assetId}</TableCell>
// // // //                       <TableCell>{status.scopeId}</TableCell>
// // // //                       <TableCell>{status.controlId}</TableCell>
// // // //                       <TableCell>{status.familyId}</TableCell>
// // // //                       <TableCell>{status.username}</TableCell>
// // // //                       <TableCell>{status.status}</TableCell>
// // // //                       <TableCell>{status.action}</TableCell>
// // // //                       <TableCell>{status.feedback}</TableCell>
// // // //                       <TableCell>
// // // //                         <Button variant="contained" onClick={() => handleDelegateToIT(status._id)}>Delegate to IT</Button>
// // // //                         <Button variant="contained" onClick={() => handleDelegateToAuditor(status._id)} style={{ marginLeft: '10px' }}>Delegate to Auditor</Button>
// // // //                         <Button variant="contained" onClick={() => handleConfirmEvidence(status._id)} style={{ marginLeft: '10px' }}>Confirm Evidence</Button>
// // // //                       </TableCell>
// // // //                     </TableRow>
// // // //                   ))}
// // // //                 </TableBody>
// // // //               </Table>
// // // //             </TableContainer>
// // // //           )
// // // //         )}
// // // //       </section>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CompletionStatusPage;

// // // // // import React, { useState } from 'react';
// // // // // import {
// // // // //   createOrUpdateStatus,
// // // // //   getStatus,
// // // // //   delegateToIT,
// // // // //   delegateToAuditor,
// // // // //   confirmEvidence
// // // // // } from '../api/completionStatusApi';
// // // // // import {
// // // // //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
// // // // //   Paper, TableSortLabel, Button, TextField, Select, MenuItem
// // // // // } from '@mui/material';

// // // // // const CompletionStatusPage = () => {
// // // // //   const [statusData, setStatusData] = useState({
// // // // //     actionId: '',
// // // // //     assetId: '',
// // // // //     scopeId: '',
// // // // //     controlId: '',
// // // // //     familyId: '',
// // // // //     isCompleted: false,
// // // // //     username: '',
// // // // //     status: 'Open',
// // // // //     action: '',
// // // // //     feedback: ''
// // // // //   });

// // // // //   const [query, setQuery] = useState({
// // // // //     actionId: '',
// // // // //     assetId: '',
// // // // //     scopeId: '',
// // // // //     controlId: '',
// // // // //     familyId: ''
// // // // //   });

// // // // //   const [fetchedStatuses, setFetchedStatuses] = useState([]);
// // // // //   const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

// // // // //   const handleInputChange = (e) => {
// // // // //     const { name, value } = e.target;
// // // // //     setStatusData({ ...statusData, [name]: value });
// // // // //   };

// // // // //   const handleQueryChange = (e) => {
// // // // //     const { name, value } = e.target;
// // // // //     setQuery({ ...query, [name]: value });
// // // // //   };

// // // // //   const handleSubmit = async () => {
// // // // //     try {
// // // // //       const response = await createOrUpdateStatus(statusData);
// // // // //       console.log('Status created or updated:', response);
// // // // //     } catch (error) {
// // // // //       console.error('Error creating or updating status:', error);
// // // // //     }
// // // // //   };

// // // // //   const handleFetchStatus = async () => {
// // // // //     try {
// // // // //       const response = await getStatus(query);
// // // // //       setFetchedStatuses(Array.isArray(response) ? response : [response]);
// // // // //     } catch (error) {
// // // // //       console.error('Error fetching status:', error);
// // // // //     }
// // // // //   };

// // // // //   const handleSort = (key) => {
// // // // //     let direction = 'asc';
// // // // //     if (sortConfig.key === key && sortConfig.direction === 'asc') {
// // // // //       direction = 'desc';
// // // // //     }
// // // // //     setSortConfig({ key, direction });
// // // // //     sortData(key, direction);
// // // // //   };

// // // // //   const sortData = (key, direction) => {
// // // // //     const sortedData = [...fetchedStatuses].sort((a, b) => {
// // // // //       if (a[key] < b[key]) {
// // // // //         return direction === 'asc' ? -1 : 1;
// // // // //       }
// // // // //       if (a[key] > b[key]) {
// // // // //         return direction === 'asc' ? 1 : -1;
// // // // //       }
// // // // //       return 0;
// // // // //     });
// // // // //     setFetchedStatuses(sortedData);
// // // // //   };

// // // // //   const handleDelegateToIT = async (statusId) => {
// // // // //     try {
// // // // //       const response = await delegateToIT(statusId);
// // // // //       console.log('Delegated to IT Team:', response);
// // // // //       updateStatusInList(statusId, 'Delegated to IT Team', 'Delegate to IT');
// // // // //     } catch (error) {
// // // // //       console.error('Error delegating to IT Team:', error);
// // // // //     }
// // // // //   };

// // // // //   const handleDelegateToAuditor = async (statusId) => {
// // // // //     try {
// // // // //       const response = await delegateToAuditor(statusId);
// // // // //       console.log('Delegated to Auditor:', response);
// // // // //       updateStatusInList(statusId, 'Audit Delegated', 'Delegate to Auditor');
// // // // //     } catch (error) {
// // // // //       console.error('Error delegating to Auditor:', error);
// // // // //     }
// // // // //   };

// // // // //   const handleConfirmEvidence = async (statusId) => {
// // // // //     try {
// // // // //       const feedback = prompt('Enter feedback if the evidence is not confirmed (leave blank if confirmed):');
// // // // //       const response = await confirmEvidence(statusId, feedback);
// // // // //       console.log('Evidence status updated:', response);
// // // // //       updateStatusInList(statusId, feedback ? 'Audit Non-Confirm' : 'Audit Closed', feedback ? 'Return Evidence' : 'Confirm Evidence', feedback);
// // // // //     } catch (error) {
// // // // //       console.error('Error confirming evidence:', error);
// // // // //     }
// // // // //   };

// // // // //   const updateStatusInList = (statusId, newStatus, action, feedback = '') => {
// // // // //     setFetchedStatuses(fetchedStatuses.map(status => 
// // // // //       status._id === statusId ? { ...status, status: newStatus, action, feedback } : status
// // // // //     ));
// // // // //   };

// // // // //   return (
// // // // //     <div style={{ padding: '20px' }}>
// // // // //       <h1>Completion Status Management</h1>

// // // // //       <section>
// // // // //         <h2>Create or Update Status</h2>
// // // // //         <TextField name="actionId" label="Action ID" value={statusData.actionId} onChange={handleInputChange} />
// // // // //         <TextField name="assetId" label="Asset ID" value={statusData.assetId} onChange={handleInputChange} />
// // // // //         <TextField name="scopeId" label="Scope ID" value={statusData.scopeId} onChange={handleInputChange} />
// // // // //         <TextField name="controlId" label="Control ID" value={statusData.controlId} onChange={handleInputChange} />
// // // // //         <TextField name="familyId" label="Family ID" value={statusData.familyId} onChange={handleInputChange} />
// // // // //         <TextField name="username" label="Username" value={statusData.username} onChange={handleInputChange} />
// // // // //         <Select name="isCompleted" value={statusData.isCompleted} onChange={handleInputChange}>
// // // // //           <MenuItem value={false}>Not Completed</MenuItem>
// // // // //           <MenuItem value={true}>Completed</MenuItem>
// // // // //         </Select>
// // // // //         <Button onClick={handleSubmit} variant="contained" style={{ marginTop: '10px' }}>Submit</Button>
// // // // //       </section>

// // // // //       <section style={{ marginTop: '40px' }}>
// // // // //         <h2>Fetch Completion Status</h2>
// // // // //         <TextField name="actionId" label="Action ID" value={query.actionId} onChange={handleQueryChange} />
// // // // //         <TextField name="assetId" label="Asset ID" value={query.assetId} onChange={handleQueryChange} />
// // // // //         <TextField name="scopeId" label="Scope ID" value={query.scopeId} onChange={handleQueryChange} />
// // // // //         <TextField name="controlId" label="Control ID" value={query.controlId} onChange={handleQueryChange} />
// // // // //         <TextField name="familyId" label="Family ID" value={query.familyId} onChange={handleQueryChange} />
// // // // //         <Button onClick={handleFetchStatus} variant="contained" style={{ marginTop: '10px' }}>Fetch Status</Button>

// // // // //         {fetchedStatuses.length > 0 && (
// // // // //           <TableContainer component={Paper} style={{ marginTop: '20px', maxHeight: '400px', overflow: 'auto' }}>
// // // // //             <Table stickyHeader>
// // // // //               <TableHead>
// // // // //                 <TableRow>
// // // // //                   <TableCell>
// // // // //                     <TableSortLabel
// // // // //                       active={sortConfig.key === 'actionId'}
// // // // //                       direction={sortConfig.direction}
// // // // //                       onClick={() => handleSort('actionId')}
// // // // //                     >
// // // // //                       Action ID
// // // // //                     </TableSortLabel>
// // // // //                   </TableCell>
// // // // //                   <TableCell>
// // // // //                     <TableSortLabel
// // // // //                       active={sortConfig.key === 'assetId'}
// // // // //                       direction={sortConfig.direction}
// // // // //                       onClick={() => handleSort('assetId')}
// // // // //                     >
// // // // //                       Asset ID
// // // // //                     </TableSortLabel>
// // // // //                   </TableCell>
// // // // //                   <TableCell>
// // // // //                     <TableSortLabel
// // // // //                       active={sortConfig.key === 'scopeId'}
// // // // //                       direction={sortConfig.direction}
// // // // //                       onClick={() => handleSort('scopeId')}
// // // // //                     >
// // // // //                       Scope ID
// // // // //                     </TableSortLabel>
// // // // //                   </TableCell>
// // // // //                   <TableCell>
// // // // //                     <TableSortLabel
// // // // //                       active={sortConfig.key === 'controlId'}
// // // // //                       direction={sortConfig.direction}
// // // // //                       onClick={() => handleSort('controlId')}
// // // // //                     >
// // // // //                       Control ID
// // // // //                     </TableSortLabel>
// // // // //                   </TableCell>
// // // // //                   <TableCell>
// // // // //                     <TableSortLabel
// // // // //                       active={sortConfig.key === 'familyId'}
// // // // //                       direction={sortConfig.direction}
// // // // //                       onClick={() => handleSort('familyId')}
// // // // //                     >
// // // // //                       Family ID
// // // // //                     </TableSortLabel>
// // // // //                   </TableCell>
// // // // //                   <TableCell>Username</TableCell>
// // // // //                   <TableCell>Status</TableCell>
// // // // //                   <TableCell>Action</TableCell>
// // // // //                   <TableCell>Feedback</TableCell>
// // // // //                   <TableCell>Actions</TableCell>
// // // // //                 </TableRow>
// // // // //               </TableHead>
// // // // //               <TableBody>
// // // // //                 {fetchedStatuses.map((status) => (
// // // // //                   <TableRow key={status._id}>
// // // // //                     <TableCell>{status.actionId}</TableCell>
// // // // //                     <TableCell>{status.assetId}</TableCell>
// // // // //                     <TableCell>{status.scopeId}</TableCell>
// // // // //                     <TableCell>{status.controlId}</TableCell>
// // // // //                     <TableCell>{status.familyId}</TableCell>
// // // // //                     <TableCell>{status.username}</TableCell>
// // // // //                     <TableCell>{status.status}</TableCell>
// // // // //                     <TableCell>{status.action}</TableCell>
// // // // //                     <TableCell>{status.feedback}</TableCell>
// // // // //                     <TableCell>
// // // // //                       <Button variant="contained" onClick={() => handleDelegateToIT(status._id)}>Delegate to IT</Button>
// // // // //                       <Button variant="contained" onClick={() => handleDelegateToAuditor(status._id)} style={{ marginLeft: '10px' }}>Delegate to Auditor</Button>
// // // // //                       <Button variant="contained" onClick={() => handleConfirmEvidence(status._id)} style={{ marginLeft: '10px' }}>Confirm Evidence</Button>
// // // // //                     </TableCell>
// // // // //                   </TableRow>
// // // // //                 ))}
// // // // //               </TableBody>
// // // // //             </Table>
// // // // //           </TableContainer>
// // // // //         )}
// // // // //       </section>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CompletionStatusPage;
