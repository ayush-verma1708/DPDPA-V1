import React, { useEffect, useState } from 'react';
import '../styles/ActionTable.css';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Loading from '../components/Loading'; // Import the Loading component
import { Box, Grid } from '@mui/material';
import { getAssets } from '../api/assetAPI';


const ActionsPage = () => {
  const [actions, setActions] = useState([]);
  const [controls, setControls] = useState([]);
  const [newAction, setNewAction] = useState({ action_Id: '', name: '', description: '', control_Id: '' });
  const [editingAction, setEditingAction] = useState(null);
  const [editAction, setEditAction] = useState({ action_Id: '', name: '', description: '', control_Id: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [scoped, setScoped] = useState([]);  
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedScoped, setSelectedScoped] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actionsResponse, controlsResponse] = await Promise.all([
          axios.get('http://localhost:8021/api/v1/actions'),
          axios.get('http://localhost:8021/api/v1/controls'),
        ]);
        setActions(actionsResponse.data);
        setControls(controlsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      const data = await getAssets();
      setAssets(data);
    };
    fetchAssets();
  }, []);

  const handleAssetChange = async (event) => {
    const assetId = event.target.value;
    setSelectedAsset(assetId);
    setSelectedScoped("");

    try {
      const assetobj = assets.find((a) => a._id === assetId);
      if (assetobj) {
        const { data } = await axios.get(
          `http://localhost:8021/api/v1/assets/${assetId}/scoped`
        );
        if (Array.isArray(data) && data.length > 0) {
          setScoped(data);
        }
      } else {
        setScoped([]); // Set to empty array if no data is returned
      }
    } catch (error) {
      console.error("Error fetching scoped data:", error);
      setScoped([]);
    }
  };
  
  const handleScopedChange = (event) => {
    setSelectedScoped(event.target.value);
  };

  const handleAddAction = async () => {
    try {
      const response = await axios.post('http://localhost:8021/api/v1/actions', newAction);
      setActions([...actions, response.data]);
      setNewAction({ action_Id: '', name: '', description: '', control_Id: '' });
    } catch (error) {
      console.error('Error adding action:', error.response ? error.response.data : error.message);
    }
  };

  const handleEditAction = async () => {
    try {
      await axios.put(`http://localhost:8021/api/v1/actions/${editingAction._id}`, editAction);
      setActions(actions.map(action =>
        action._id === editingAction._id ? { ...action, ...editAction } : action
      ));
      setEditingAction(null);
      setEditAction({ action_Id: '', name: '', description: '', control_Id: '' });
    } catch (error) {
      console.error('Error updating action:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteAction = async (id) => {
    try {
      await axios.delete(`http://localhost:8021/api/v1/actions/${id}`);
      setActions(actions.filter(action => action._id !== id));
    } catch (error) {
      console.error('Error deleting action:', error.response ? error.response.data : error.message);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <Loading />; // Show the loading animation while data is loading
  }

  return (
    <div className="p-4">
      {/* <h2>Actions</h2> */}
      <div className="action-form">
        {/* <h3>{editingAction ? 'Edit Action' : 'Add New Action'}</h3> */}
        <form onSubmit={(e) => {
          e.preventDefault();
          editingAction ? handleEditAction() : handleAddAction();
        }}>
               <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly', // Align elements to the left and right
                gap: 2,
                width: '100%', // Ensures the container takes full width
            }}
        >
            {/* Left-aligned text fields and dropdowns */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
            label="Action ID"
            value={editingAction ? editAction.action_Id : newAction.action_Id}
            onChange={(e) => editingAction ? setEditAction({ ...editAction, action_Id: e.target.value }) : setNewAction({ ...newAction, action_Id: e.target.value })}
            required
            fullWidth
            margin="normal"
          />
            <TextField
            label="Name"
            value={editingAction ? editAction.name : newAction.name}
            onChange={(e) => editingAction ? setEditAction({ ...editAction, name: e.target.value }) : setNewAction({ ...newAction, name: e.target.value })}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={editingAction ? editAction.description : newAction.description}
            onChange={(e) => editingAction ? setEditAction({ ...editAction, description: e.target.value }) : setNewAction({ ...newAction, description: e.target.value })}
            fullWidth
            margin="normal"
          />
       
          <FormControl fullWidth margin="normal">
            <InputLabel>Control</InputLabel>
            <Select
            labelId='Controls-label'
            label='Controls'
              value={editingAction ? editAction.control_Id : newAction.control_Id}
              onChange={(e) => editingAction ? setEditAction({ ...editAction, control_Id: e.target.value }) : setNewAction({ ...newAction, control_Id: e.target.value })}
              required
            >
              <MenuItem value="" disabled>Select Control</MenuItem>
              {controls.map((control) => (
                <MenuItem key={control._id} value={control._id}>{control.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
              {/* <FormControl fullWidth margin="normal">
                <InputLabel id="asset-label">Asset</InputLabel>
                <Select
                  labelId="asset-label"
                  value={selectedAsset}
                  onChange={handleAssetChange}
                  label="Asset"
                >
                  {assets.map((asset) => (
                    <MenuItem key={asset._id} value={asset._id}>
                      {asset.name} - {asset.type} (
                      {asset.isScoped ? "Scoped" : "Non-Scoped"})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
            {selectedAsset &&
              assets.find((a) => a._id === selectedAsset)?.isScoped && (
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Scoped</InputLabel>
                    <Select
                      value={selectedScoped}
                      onChange={handleScopedChange}
                      label="Scoped"
                    >
                      {scoped.map((scope) => (
                        <MenuItem key={scope._id} value={scope._id}>
                          {scope.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
              )}
          <Button type="submit" variant="contained" color="primary" sx={{
                    height: '50px',
                    minWidth: '100px',
                    padding: '0 16px', 
                    marginTop: '10px'
                }}>
            {editingAction ? 'Save' : 'Add'}
          </Button>
          {editingAction && <Button type="button" variant="outlined" color="secondary" onClick={() => { setEditingAction(null); setEditAction({ action_Id: '', name: '', description: '', control_Id: '' }); }}>Cancel</Button>}
            </Box>
            </Box>
           
          
         
          
          
          
          
        </form>
      </div>
      <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Action ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Control</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((action) => (
              <TableRow key={action._id}>
                <TableCell>{action.action_Id}</TableCell>
                <TableCell>{action.name}</TableCell>
                <TableCell>{action.description}</TableCell>
                {/* <TableCell>{action.control_Id.name}</TableCell> */}
                <TableCell>{action.control_Id ? controls.find(control => control._id === action.control_Id)?.name : 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { setEditingAction(action); setEditAction(action); }}
                    disabled={action.isDPDPA}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteAction(action._id)}
                    disabled={action.isDPDPA}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={actions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ActionsPage;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import TablePagination from '@mui/material/TablePagination';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';

// const ActionsPage = () => {
//   const [actions, setActions] = useState([]);
//   const [controls, setControls] = useState([]);
//   const [newAction, setNewAction] = useState({ action_Id: '', name: '', description: '', control_Id: '' });
//   const [editingAction, setEditingAction] = useState(null);
//   const [editAction, setEditAction] = useState({ action_Id: '', name: '', description: '', control_Id: '' });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     const fetchActions = async () => {
//       try {
//         const response = await axios.get('http://localhost:8021/api/v1/actions');
//         setActions(response.data);
//       } catch (error) {
//         console.error('Error fetching actions:', error);
//       }
//     };

//     const fetchControls = async () => {
//       try {
//         const response = await axios.get('http://localhost:8021/api/v1/controls');
//         setControls(response.data);
//       } catch (error) {
//         console.error('Error fetching controls:', error);
//       }
//     };

//     fetchActions();
//     fetchControls();
//   }, []);

//   const handleAddAction = async () => {
//     try {
//       const response = await axios.post('http://localhost:8021/api/v1/actions', newAction);
//       setActions([...actions, response.data]);
//       setNewAction({ action_Id: '', name: '', description: '', control_Id: '' });
//     } catch (error) {
//       console.error('Error adding action:', error.response ? error.response.data : error.message);
//     }
//   };

//   const handleEditAction = async () => {
//     try {
//       await axios.put(`http://localhost:8021/api/v1/actions/${editingAction._id}`, editAction);
//       setActions(actions.map(action =>
//         action._id === editingAction._id ? { ...action, ...editAction } : action
//       ));
//       setEditingAction(null);
//       setEditAction({ action_Id: '', name: '', description: '', control_Id: '' });
//     } catch (error) {
//       console.error('Error updating action:', error.response ? error.response.data : error.message);
//     }
//   };

//   const handleDeleteAction = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8021/api/v1/actions/${id}`);
//       setActions(actions.filter(action => action._id !== id));
//     } catch (error) {
//       console.error('Error deleting action:', error.response ? error.response.data : error.message);
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <div className="p-4">
//       <h2>Actions</h2>
//       <div className="action-form">
//         <h3>{editingAction ? 'Edit Action' : 'Add New Action'}</h3>
//         <form onSubmit={(e) => {
//           e.preventDefault();
//           editingAction ? handleEditAction() : handleAddAction();
//         }}>
//           <TextField
//             label="Action ID"
//             value={editingAction ? editAction.action_Id : newAction.action_Id}
//             onChange={(e) => editingAction ? setEditAction({ ...editAction, action_Id: e.target.value }) : setNewAction({ ...newAction, action_Id: e.target.value })}
//             required
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Name"
//             value={editingAction ? editAction.name : newAction.name}
//             onChange={(e) => editingAction ? setEditAction({ ...editAction, name: e.target.value }) : setNewAction({ ...newAction, name: e.target.value })}
//             required
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Description"
//             value={editingAction ? editAction.description : newAction.description}
//             onChange={(e) => editingAction ? setEditAction({ ...editAction, description: e.target.value }) : setNewAction({ ...newAction, description: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Control</InputLabel>
//             <Select
//               value={editingAction ? editAction.control_Id : newAction.control_Id}
//               onChange={(e) => editingAction ? setEditAction({ ...editAction, control_Id: e.target.value }) : setNewAction({ ...newAction, control_Id: e.target.value })}
//               required
//             >
//               <MenuItem value="" disabled>Select Control</MenuItem>
//               {controls.map((control) => (
//                 <MenuItem key={control._id} value={control._id}>{control.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '10px' }}>
//             {editingAction ? 'Save' : 'Add'}
//           </Button>
//           {editingAction && <Button type="button" variant="outlined" color="secondary" fullWidth style={{ marginTop: '10px' }} onClick={() => { setEditingAction(null); setEditAction({ action_Id: '', name: '', description: '', control_Id: '' }); }}>Cancel</Button>}
//         </form>
//       </div>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Action ID</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Control</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {actions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((action) => (
//               <TableRow key={action._id}>
//                 <TableCell>{action.action_Id}</TableCell>
//                 <TableCell>{action.name}</TableCell>
//                 <TableCell>{action.description}</TableCell>
//                 <TableCell>{action.control_Id.name}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => { setEditingAction(action); setEditAction(action); }}
//                     disabled={action.isDPDPA}
//                     style={{ marginRight: '10px' }}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={() => handleDeleteAction(action._id)}
//                     disabled={action.isDPDPA}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 15]}
//         component="div"
//         count={actions.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </div>
//   );
// };

// export default ActionsPage;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './ActionsPage.css';

// const ActionsPage = () => {
//   const [actions, setActions] = useState([]);
//   const [controls, setControls] = useState([]);
//   const [newAction, setNewAction] = useState({ action_Id: '', name: '', description: '', control_Id: '' });
//   const [editingAction, setEditingAction] = useState(null);
//   const [editAction, setEditAction] = useState({ action_Id: '', name: '', description: '', control_Id: '' });

//   useEffect(() => {
//     const fetchActions = async () => {
//       try {
//         const response = await axios.get('http://localhost:8021/api/v1/actions');
//         setActions(response.data);
//       } catch (error) {
//         console.error('Error fetching actions:', error);
//       }
//     };

//     const fetchControls = async () => {
//       try {
//         const response = await axios.get('http://localhost:8021/api/v1/controls');
//         setControls(response.data);
//       } catch (error) {
//         console.error('Error fetching controls:', error);
//       }
//     };

//     fetchActions();
//     fetchControls();
//   }, []);

//   const handleAddAction = async () => {
//     try {
//       const response = await axios.post('http://localhost:8021/api/v1/actions', newAction);
//       setActions([...actions, response.data]);
//       setNewAction({ action_Id: '', name: '', description: '', control_Id: '' });
//     } catch (error) {
//       console.error('Error adding action:', error.response ? error.response.data : error.message);
//     }
//   };

//   const handleEditAction = async () => {
//     try {
//       await axios.put(`http://localhost:8021/api/v1/actions/${editingAction._id}`, editAction);
//       setActions(actions.map(action =>
//         action._id === editingAction._id ? { ...action, ...editAction } : action
//       ));
//       setEditingAction(null);
//       setEditAction({ action_Id: '', name: '', description: '', control_Id: '' });
//     } catch (error) {
//       console.error('Error updating action:', error.response ? error.response.data : error.message);
//     }
//   };

//   const handleDeleteAction = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8021/api/v1/actions/${id}`);
//       setActions(actions.filter(action => action._id !== id));
//     } catch (error) {
//       console.error('Error deleting action:', error.response ? error.response.data : error.message);
//     }
//   };

//   return (
//     <div className="actions-container">
//       <h2>Actions</h2>

//       <div className="action-form">
//         <h3>{editingAction ? 'Edit Action' : 'Add New Action'}</h3>
//         <form onSubmit={(e) => {
//           e.preventDefault();
//           editingAction ? handleEditAction() : handleAddAction();
//         }}>
//           <input
//             type="text"
//             value={editingAction ? editAction.action_Id : newAction.action_Id}
//             onChange={(e) => editingAction ? setEditAction({ ...editAction, action_Id: e.target.value }) : setNewAction({ ...newAction, action_Id: e.target.value })}
//             placeholder="Action ID"
//             required
//           />
//           <input
//             type="text"
//             value={editingAction ? editAction.name : newAction.name}
//             onChange={(e) => editingAction ? setEditAction({ ...editAction, name: e.target.value }) : setNewAction({ ...newAction, name: e.target.value })}
//             placeholder="Name"
//             required
//           />
//           <input
//             type="text"
//             value={editingAction ? editAction.description : newAction.description}
//             onChange={(e) => editingAction ? setEditAction({ ...editAction, description: e.target.value }) : setNewAction({ ...newAction, description: e.target.value })}
//             placeholder="Description"
//           />
//           <select
//             value={editingAction ? editAction.control_Id : newAction.control_Id}
//             onChange={(e) => editingAction ? setEditAction({ ...editAction, control_Id: e.target.value }) : setNewAction({ ...newAction, control_Id: e.target.value })}
//             required
//           >
//             <option value="" disabled>Select Control</option>
//             {controls.map((control) => (
//               <option key={control._id} value={control._id}>{control.name}</option>
//             ))}
//           </select>
//           <button type="submit" className="submit-button">{editingAction ? 'Save' : 'Add'}</button>
//           {editingAction && <button type="button" className="cancel-button" onClick={() => { setEditingAction(null); setEditAction({ action_Id: '', name: '', description: '', control_Id: '' }); }}>Cancel</button>}
//         </form>
//       </div>

//       <table className="actions-table">
//         <thead>
//           <tr>
//             <th>Action ID</th>
//             <th>Name</th>
//             <th>Description</th>
//             <th>Control</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {actions.map((action) => (
//             <tr key={action._id}>
//               <td>{action.action_Id}</td>
//               <td>{action.name}</td>
//               <td>{action.description}</td>
//               <td>{action.control_Id.name}</td>
//               <td>
//                 <button
//                   className="edit-button"
//                   onClick={() => { setEditingAction(action); setEditAction(action); }}
//                   disabled={action.isDPDPA}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="delete-button"
//                   onClick={() => handleDeleteAction(action._id)}
//                   disabled={action.isDPDPA}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ActionsPage;

// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import './ActionsPage.css';

// // const ActionsPage = () => {
// //   const [actions, setActions] = useState([]);
// //   const [controls, setControls] = useState([]);
// //   const [newAction, setNewAction] = useState({ action_Id: '', name: '', description: '', control_Id: '' });
// //   const [editingAction, setEditingAction] = useState(null);
// //   const [editAction, setEditAction] = useState({ action_Id: '', name: '', description: '', control_Id: '' });

// //   useEffect(() => {
// //     const fetchActions = async () => {
// //       try {
// //         const response = await axios.get('http://localhost:8021/api/v1/actions');
// //         setActions(response.data);
// //       } catch (error) {
// //         console.error('Error fetching actions:', error);
// //       }
// //     };

// //     const fetchControls = async () => {
// //       try {
// //         const response = await axios.get('http://localhost:8021/api/v1/controls');
// //         setControls(response.data);
// //       } catch (error) {
// //         console.error('Error fetching controls:', error);
// //       }
// //     };

// //     fetchActions();
// //     fetchControls();
// //   }, []);

// //   const handleAddAction = async () => {
// //     try {
// //       const response = await axios.post('http://localhost:8021/api/v1/actions', newAction);
// //       setActions([...actions, response.data]);
// //       setNewAction({ action_Id: '', name: '', description: '', control_Id: '' });
// //     } catch (error) {
// //       console.error('Error adding action:', error.response ? error.response.data : error.message);
// //     }
// //   };

// //   const handleEditAction = async () => {
// //     try {
// //       await axios.put(`http://localhost:8021/api/v1/actions/${editingAction._id}`, editAction);
// //       setActions(actions.map(action =>
// //         action._id === editingAction._id ? { ...action, ...editAction } : action
// //       ));
// //       setEditingAction(null);
// //       setEditAction({ action_Id: '', name: '', description: '', control_Id: '' });
// //     } catch (error) {
// //       console.error('Error updating action:', error.response ? error.response.data : error.message);
// //     }
// //   };

// //   const handleDeleteAction = async (id) => {
// //     try {
// //       await axios.delete(`http://localhost:8021/api/v1/actions/${id}`);
// //       setActions(actions.filter(action => action._id !== id));
// //     } catch (error) {
// //       console.error('Error deleting action:', error.response ? error.response.data : error.message);
// //     }
// //   };

// //   return (
// //     <div className="actions-container">
// //       <h2>Actions</h2>
      
// //       <div className="action-form">
// //         <h3>{editingAction ? 'Edit Action' : 'Add New Action'}</h3>
// //         <form onSubmit={(e) => {
// //           e.preventDefault();
// //           editingAction ? handleEditAction() : handleAddAction();
// //         }}>
// //           <input
// //             type="text"
// //             value={editingAction ? editAction.action_Id : newAction.action_Id}
// //             onChange={(e) => editingAction ? setEditAction({ ...editAction, action_Id: e.target.value }) : setNewAction({ ...newAction, action_Id: e.target.value })}
// //             placeholder="Action ID"
// //             required
// //           />
// //           <input
// //             type="text"
// //             value={editingAction ? editAction.name : newAction.name}
// //             onChange={(e) => editingAction ? setEditAction({ ...editAction, name: e.target.value }) : setNewAction({ ...newAction, name: e.target.value })}
// //             placeholder="Name"
// //             required
// //           />
// //           <input
// //             type="text"
// //             value={editingAction ? editAction.description : newAction.description}
// //             onChange={(e) => editingAction ? setEditAction({ ...editAction, description: e.target.value }) : setNewAction({ ...newAction, description: e.target.value })}
// //             placeholder="Description"
// //           />
// //           <select
// //             value={editingAction ? editAction.control_Id : newAction.control_Id}
// //             onChange={(e) => editingAction ? setEditAction({ ...editAction, control_Id: e.target.value }) : setNewAction({ ...newAction, control_Id: e.target.value })}
// //             required
// //           >
// //             <option value="" disabled>Select Control</option>
// //             {controls.map((control) => (
// //               <option key={control._id} value={control._id}>{control.name}</option>
// //             ))}
// //           </select>
// //           <button type="submit" className="submit-button">{editingAction ? 'Save' : 'Add'}</button>
// //           {editingAction && <button type="button" className="cancel-button" onClick={() => { setEditingAction(null); setEditAction({ action_Id: '', name: '', description: '', control_Id: '' }); }}>Cancel</button>}
// //         </form>
// //       </div>
// //       <table className="actions-table">
// //         <thead>
// //           <tr>
// //             <th>Action ID</th>
// //             <th>Name</th>
// //             <th>Description</th>
// //             <th>Control</th>
// //             <th>Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {actions.map((action) => (
// //             <tr key={action._id}>
// //               <td>{action.action_Id}</td>
// //               <td>{action.name}</td>
// //               <td>{action.description}</td>
// //               <td>{action.control_Id.name}</td>
// //               <td>
// //                 <button className="edit-button" onClick={() => { setEditingAction(action); setEditAction(action); }}>Edit</button>
// //                 <button className="delete-button" onClick={() => handleDeleteAction(action._id)}>Delete</button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default ActionsPage;

// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';
// // // import './ActionsPage.css';

// // // const ActionsPage = () => {
// // //   const [actions, setActions] = useState([]);
// // //   const [controls, setControls] = useState([]);
// // //   const [newAction, setNewAction] = useState({ action_Id: '', name: '', description: '', control_Id: '' });
// // //   const [editingAction, setEditingAction] = useState(null);
// // //   const [editAction, setEditAction] = useState({ action_Id: '', name: '', description: '', control_Id: '' });

// // //   useEffect(() => {
// // //     const fetchActions = async () => {
// // //       try {
// // //         const response = await axios.get('http://localhost:8021/api/v1/actions');
// // //         setActions(response.data);
// // //       } catch (error) {
// // //         console.error('Error fetching actions:', error);
// // //       }
// // //     };

// // //     const fetchControls = async () => {
// // //       try {
// // //         const response = await axios.get('http://localhost:8021/api/v1/controls');
// // //         setControls(response.data);
// // //       } catch (error) {
// // //         console.error('Error fetching controls:', error);
// // //       }
// // //     };

// // //     fetchActions();
// // //     fetchControls();
// // //   }, []);

// // //   const handleAddAction = async () => {
// // //     try {
// // //       const response = await axios.post('http://localhost:8021/api/v1/actions', newAction);
// // //       setActions([...actions, response.data]);
// // //       setNewAction({ action_Id: '', name: '', description: '', control_Id: '' });
// // //     } catch (error) {
// // //       console.error('Error adding action:', error.response ? error.response.data : error.message);
// // //     }
// // //   };

// // //   const handleEditAction = async () => {
// // //     try {
// // //       await axios.put(`http://localhost:8021/api/v1/actions/${editingAction._id}`, editAction);
// // //       setActions(actions.map(action =>
// // //         action._id === editingAction._id ? { ...action, ...editAction } : action
// // //       ));
// // //       setEditingAction(null);
// // //       setEditAction({ action_Id: '', name: '', description: '', control_Id: '' });
// // //     } catch (error) {
// // //       console.error('Error updating action:', error.response ? error.response.data : error.message);
// // //     }
// // //   };

// // //   // const handleDeleteAction = async (id) => {
// // //   //   try {
// // //   //     await axios.delete(`http://localhost:8021/api/v1/actions/${id}`);
// // //   //     setActions(actions.filter(action => action._id !== id));
// // //   //   } catch (error) {
// // //   //     console.error('Error deleting action:', error.response ? error.response.data : error.message);
// // //   //   }
// // //   // };

// // //   return (
// // //     <div className="actions-container">
// // //       <h2>Actions</h2>
      
// // //       <div className="action-form">
// // //         <h3>{editingAction ? 'Edit Action' : 'Add New Action'}</h3>
// // //         <form onSubmit={(e) => {
// // //           e.preventDefault();
// // //           editingAction ? handleEditAction() : handleAddAction();
// // //         }}>
// // //           <input
// // //             type="text"
// // //             value={editingAction ? editAction.action_Id : newAction.action_Id}
// // //             onChange={(e) => editingAction ? setEditAction({ ...editAction, action_Id: e.target.value }) : setNewAction({ ...newAction, action_Id: e.target.value })}
// // //             placeholder="Action ID"
// // //             required
// // //           />
// // //           <input
// // //             type="text"
// // //             value={editingAction ? editAction.name : newAction.name}
// // //             onChange={(e) => editingAction ? setEditAction({ ...editAction, name: e.target.value }) : setNewAction({ ...newAction, name: e.target.value })}
// // //             placeholder="Name"
// // //             required
// // //           />
// // //           <input
// // //             type="text"
// // //             value={editingAction ? editAction.description : newAction.description}
// // //             onChange={(e) => editingAction ? setEditAction({ ...editAction, description: e.target.value }) : setNewAction({ ...newAction, description: e.target.value })}
// // //             placeholder="Description"
// // //           />
// // //           <select
// // //             value={editingAction ? editAction.control_Id : newAction.control_Id}
// // //             onChange={(e) => editingAction ? setEditAction({ ...editAction, control_Id: e.target.value }) : setNewAction({ ...newAction, control_Id: e.target.value })}
// // //             required
// // //           >
// // //             <option value="" disabled>Select Control</option>
// // //             {controls.map((control) => (
// // //               <option key={control._id} value={control._id}>{control.name}</option>
// // //             ))}
// // //           </select>
// // //           <button type="submit" className="submit-button">{editingAction ? 'Save' : 'Add'}</button>
// // //           {editingAction && <button type="button" className="cancel-button" onClick={() => { setEditingAction(null); setEditAction({ action_Id: '', name: '', description: '', control_Id: '' }); }}>Cancel</button>}
// // //         </form>
// // //       </div>
// // //       <table className="actions-table">
// // //         <thead>
// // //           <tr>
// // //             <th>Action ID</th>
// // //             <th>Name</th>
// // //             <th>Description</th>
// // //             <th>Control</th>
// // //             <th>Actions</th>
// // //           </tr>
// // //         </thead>
// // //         <tbody>
// // //           {actions.map((action) => (
// // //             <tr key={action._id}>
// // //               <td>{action.action_Id}</td>
// // //               <td>{action.name}</td>
// // //               <td>{action.description}</td>
// // //               <td>{action.control_Id.name}</td>
// // //               <td>
// // //                 <button className="edit-button" onClick={() => { setEditingAction(action); setEditAction(action); }}>Edit</button>
// // //                 {/* <button className="delete-button" onClick={() => handleDeleteAction(action._id)}>Delete</button> */}
// // //               </td>
// // //             </tr>
// // //           ))}
// // //         </tbody>
// // //       </table>
// // //     </div>
// // //   );
// // // };

// // // export default ActionsPage;
