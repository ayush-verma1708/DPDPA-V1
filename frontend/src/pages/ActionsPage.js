import React, { useEffect, useState } from 'react';
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
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../components/Loading'; // Import the Loading component
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import '../styles/ActionTable.css';

const ActionsPage = () => {
  const [actions, setActions] = useState([]);
  const [controls, setControls] = useState([]);
  const [newAction, setNewAction] = useState({
    variable_id: '',
    control_Id: '',
    isDPDPA: false,
  });
  const [editingAction, setEditingAction] = useState(null);
  const [editAction, setEditAction] = useState({
    variable_id: '',
    control_Id: '',
    isDPDPA: false,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // For dialog state

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
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddAction = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8021/api/v1/actions',
        newAction
      );
      setActions([...actions, response.data]);
      handleCloseDialog();
    } catch (error) {
      console.error(
        'Error adding action:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleEditAction = async () => {
    if (!editingAction) return;
    try {
      await axios.put(
        `http://localhost:8021/api/v1/actions/${editingAction._id}`,
        editAction
      );
      setActions(
        actions.map((action) =>
          action._id === editingAction._id
            ? { ...action, ...editAction }
            : action
        )
      );
      handleCloseDialog();
    } catch (error) {
      console.error(
        'Error updating action:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteAction = async (id) => {
    try {
      await axios.delete(`http://localhost:8021/api/v1/actions/${id}`);
      setActions(actions.filter((action) => action._id !== id));
    } catch (error) {
      console.error(
        'Error deleting action:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleOpenDialog = (action) => {
    if (action) {
      setEditingAction(action);
      setEditAction({
        variable_id: action.variable_id,
        control_Id: action.control_Id,
        isDPDPA: action.isDPDPA,
      });
    } else {
      setEditingAction(null);
      setNewAction({ variable_id: '', control_Id: '', isDPDPA: false });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingAction(null);
    setEditAction({ variable_id: '', control_Id: '', isDPDPA: false });
    setNewAction({ variable_id: '', control_Id: '', isDPDPA: false });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='p-4'>
      <Button
        variant='contained'
        color='primary'
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '10px' }}
      >
        Add Action
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fixed ID</TableCell>
              <TableCell>Variable ID</TableCell>
              <TableCell>Control Section</TableCell>
              <TableCell>Is DPDPA</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((action) => (
                <TableRow key={action._id}>
                  <TableCell>{action.fixed_id}</TableCell>
                  <TableCell>{action.variable_id}</TableCell>
                  <TableCell>
                    {action.control_Id ? action.control_Id.section : 'N/A'}
                  </TableCell>
                  <TableCell>{action.isDPDPA ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label='edit'
                      color='primary'
                      onClick={() => handleOpenDialog(action)}
                      disabled={action.isDPDPA}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label='delete'
                      color='error'
                      onClick={() => handleDeleteAction(action._id)}
                      style={{ marginLeft: '10px' }}
                      disabled={action.isDPDPA}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={actions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Modal for Add/Edit Action */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingAction ? 'Edit Action' : 'Add Action'}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '400px',
            }}
          >
            <TextField
              label='Variable ID'
              value={
                editingAction ? editAction.variable_id : newAction.variable_id
              }
              onChange={(e) => {
                const value = e.target.value;
                editingAction
                  ? setEditAction({ ...editAction, variable_id: value })
                  : setNewAction({ ...newAction, variable_id: value });
              }}
              required
              fullWidth
              margin='normal'
            />
            <FormControl fullWidth margin='normal'>
              <InputLabel>Control</InputLabel>
              <Select
                labelId='Controls-label'
                label='Controls'
                value={
                  editingAction ? editAction.control_Id : newAction.control_Id
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editingAction
                    ? setEditAction({ ...editAction, control_Id: value })
                    : setNewAction({ ...newAction, control_Id: value });
                }}
                required
              >
                <MenuItem value='' disabled>
                  Select Control
                </MenuItem>
                {controls.map((control) => (
                  <MenuItem key={control._id} value={control._id}>
                    {control.fixed_id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => {
              editingAction ? handleEditAction() : handleAddAction();
            }}
            variant='contained'
            color='primary'
          >
            {editingAction ? 'Update Action' : 'Add Action'}
          </Button>
        </DialogActions>
      </Dialog>
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
// import IconButton from '@mui/material/IconButton';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Loading from '../components/Loading'; // Import the Loading component
// import { Box } from '@mui/material';
// import '../styles/ActionTable.css';

// const ActionsPage = () => {
//   const [actions, setActions] = useState([]);
//   const [controls, setControls] = useState([]);
//   const [newAction, setNewAction] = useState({
//     variable_id: '',
//     control_Id: '',
//     isDPDPA: false,
//   });
//   const [editingAction, setEditingAction] = useState(null);
//   const [editAction, setEditAction] = useState({
//     variable_id: '',
//     control_Id: '',
//     isDPDPA: false,
//   });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [actionsResponse, controlsResponse] = await Promise.all([
//           axios.get('http://localhost:8021/api/v1/actions'),
//           axios.get('http://localhost:8021/api/v1/controls'),
//         ]);
//         setActions(actionsResponse.data);
//         setControls(controlsResponse.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleAddAction = async () => {
//     try {
//       const response = await axios.post(
//         'http://localhost:8021/api/v1/actions',
//         newAction
//       );
//       setActions([...actions, response.data]);
//       setNewAction({ variable_id: '', control_Id: '', isDPDPA: false });
//     } catch (error) {
//       console.error(
//         'Error adding action:',
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const handleEditAction = async () => {
//     if (!editingAction) return;
//     try {
//       await axios.put(
//         `http://localhost:8021/api/v1/actions/${editingAction._id}`,
//         editAction
//       );
//       setActions(
//         actions.map((action) =>
//           action._id === editingAction._id
//             ? { ...action, ...editAction }
//             : action
//         )
//       );
//       cancelEdit(); // Reset to default state
//     } catch (error) {
//       console.error(
//         'Error updating action:',
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const handleDeleteAction = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8021/api/v1/actions/${id}`);
//       setActions(actions.filter((action) => action._id !== id));
//     } catch (error) {
//       console.error(
//         'Error deleting action:',
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const cancelEdit = () => {
//     setEditingAction(null);
//     setEditAction({ variable_id: '', control_Id: '', isDPDPA: false });
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className='p-4'>
//       <div className='action-form'>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             editingAction ? handleEditAction() : handleAddAction();
//           }}
//         >
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-evenly',
//               gap: 2,
//               width: '100%',
//             }}
//           >
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <TextField
//                 label='Variable ID'
//                 value={
//                   editingAction ? editAction.variable_id : newAction.variable_id
//                 }
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   editingAction
//                     ? setEditAction({ ...editAction, variable_id: value })
//                     : setNewAction({ ...newAction, variable_id: value });
//                 }}
//                 required
//                 fullWidth
//                 margin='normal'
//               />
//               <FormControl fullWidth margin='normal'>
//                 <InputLabel>Control</InputLabel>
//                 <Select
//                   labelId='Controls-label'
//                   label='Controls'
//                   value={
//                     editingAction ? editAction.control_Id : newAction.control_Id
//                   }
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     editingAction
//                       ? setEditAction({ ...editAction, control_Id: value })
//                       : setNewAction({ ...newAction, control_Id: value });
//                   }}
//                   required
//                 >
//                   <MenuItem value='' disabled>
//                     Select Control
//                   </MenuItem>
//                   {controls.map((control) => (
//                     <MenuItem key={control._id} value={control._id}>
//                       {control.fixed_id}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <Button type='submit' variant='contained' color='primary'>
//                 {editingAction ? 'Update Action' : 'Add Action'}
//               </Button>
//               {editingAction && (
//                 <Button
//                   type='button'
//                   variant='outlined'
//                   color='secondary'
//                   onClick={cancelEdit}
//                 >
//                   Cancel
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         </form>
//       </div>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Fixed ID</TableCell>
//               <TableCell>Variable ID</TableCell>
//               <TableCell>Control Section</TableCell>
//               <TableCell>Is DPDPA</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {actions
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((action) => (
//                 <TableRow key={action._id}>
//                   <TableCell>{action.fixed_id}</TableCell>
//                   <TableCell>{action.variable_id}</TableCell>
//                   <TableCell>
//                     {action.control_Id ? action.control_Id.section : 'N/A'}
//                   </TableCell>
//                   <TableCell>{action.isDPDPA ? 'Yes' : 'No'}</TableCell>
//                   <TableCell>
//                     <IconButton
//                       aria-label='edit'
//                       color='primary'
//                       onClick={() => {
//                         setEditingAction(action);
//                         setEditAction({
//                           variable_id: action.variable_id,
//                           control_Id: action.control_Id,
//                           isDPDPA: action.isDPDPA,
//                         });
//                       }}
//                       disabled={action.isDPDPA}
//                     >
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       aria-label='delete'
//                       color='error'
//                       onClick={() => handleDeleteAction(action._id)}
//                       style={{ marginLeft: '10px' }}
//                       disabled={action.isDPDPA}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component='div'
//           count={actions.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </TableContainer>
//     </div>
//   );
// };

// export default ActionsPage;

// import React, { useEffect, useState } from 'react';
// import '../styles/ActionTable.css';
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
// import Loading from '../components/Loading'; // Import the Loading component
// import { Box } from '@mui/material';

// const ActionsPage = () => {
//   const [actions, setActions] = useState([]);
//   const [controls, setControls] = useState([]);
//   const [newAction, setNewAction] = useState({ variable_id: '', control_Id: '', isDPDPA: false });
//   const [editingAction, setEditingAction] = useState(null);
//   const [editAction, setEditAction] = useState({ variable_id: '', control_Id: '', isDPDPA: false });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [actionsResponse, controlsResponse] = await Promise.all([
//           axios.get('http://localhost:8021/api/v1/actions'),
//           axios.get('http://localhost:8021/api/v1/controls'),
//         ]);
//         setActions(actionsResponse.data);
//         setControls(controlsResponse.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleAddAction = async () => {
//     try {
//       const response = await axios.post('http://localhost:8021/api/v1/actions', newAction);
//       setActions([...actions, response.data]);
//       setNewAction({ variable_id: '', control_Id: '', isDPDPA: false });
//     } catch (error) {
//       console.error('Error adding action:', error.response ? error.response.data : error.message);
//     }
//   };

//   const handleEditAction = async () => {
//     if (!editingAction) return;
//     try {
//       await axios.put(`http://localhost:8021/api/v1/actions/${editingAction._id}`, editAction);
//       setActions(actions.map(action =>
//         action._id === editingAction._id ? { ...action, ...editAction } : action
//       ));
//       cancelEdit(); // Reset to default state
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

//   const cancelEdit = () => {
//     setEditingAction(null);
//     setEditAction({ variable_id: '', control_Id: '', isDPDPA: false });
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="p-4">
//       <div className="action-form">
//         <form onSubmit={(e) => {
//           e.preventDefault();
//           editingAction ? handleEditAction() : handleAddAction();
//         }}>
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-evenly',
//               gap: 2,
//               width: '100%',
//             }}
//           >
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <TextField
//                 label="Variable ID"
//                 value={editingAction ? editAction.variable_id : newAction.variable_id}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   editingAction
//                     ? setEditAction({ ...editAction, variable_id: value })
//                     : setNewAction({ ...newAction, variable_id: value });
//                 }}
//                 required
//                 fullWidth
//                 margin="normal"
//               />
//               <FormControl fullWidth margin="normal">
//                 <InputLabel>Control</InputLabel>
//                 <Select
//                   labelId='Controls-label'
//                   label='Controls'
//                   value={editingAction ? editAction.control_Id : newAction.control_Id}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     editingAction
//                       ? setEditAction({ ...editAction, control_Id: value })
//                       : setNewAction({ ...newAction, control_Id: value });
//                   }}
//                   required
//                 >
//                   <MenuItem value="" disabled>Select Control</MenuItem>
//                   {controls.map((control) => (
//                     <MenuItem key={control._id} value={control._id}>{control.fixed_id}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <Button type="submit" variant="contained" color="primary">
//                 {editingAction ? 'Update Action' : 'Add Action'}
//               </Button>
//               {editingAction && (
//                 <Button type="button" variant="outlined" color="secondary" onClick={cancelEdit}>
//                   Cancel
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         </form>
//       </div>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Fixed ID</TableCell>
//               <TableCell>Variable ID</TableCell>
//               <TableCell>Control Section</TableCell>
//               <TableCell>Is DPDPA</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {actions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((action) => (
//               <TableRow key={action._id}>
//                 <TableCell>{action.fixed_id}</TableCell>
//                 <TableCell>{action.variable_id}</TableCell>
//                 <TableCell>{action.control_Id ? action.control_Id.section : 'N/A'}</TableCell>
//                 <TableCell>{action.isDPDPA ? 'Yes' : 'No'}</TableCell>
//                 <TableCell>
//                   <Button onClick={() => {
//                     setEditingAction(action);
//                     setEditAction({
//                       variable_id: action.variable_id,
//                       control_Id: action.control_Id,
//                       isDPDPA: action.isDPDPA
//                     });
//                   }} disabled={action.isDPDPA}>Edit</Button>
//                   <Button onClick={() => handleDeleteAction(action._id)} color="error" disabled={action.isDPDPA}>Delete</Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={actions.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </TableContainer>
//     </div>
//   );
// };

// export default ActionsPage;
