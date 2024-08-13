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
import Snackbar from '@mui/material/Snackbar';
import Loading from '../components/Loading';

const ControlsPage = () => {
  const [controls, setControls] = useState([]);
  const [controlFamilies, setControlFamilies] = useState([]);
  const [newControl, setNewControl] = useState({
    fixed_id: '',
    section: '',
    section_main_desc: '',
    section_desc: '',
    control_type: '',
    control_Family_Id: ''
  });
  const [editingControl, setEditingControl] = useState(null);
  const [editControl, setEditControl] = useState({
    fixed_id: '',
    section: '',
    section_main_desc: '',
    section_desc: '',
    control_type: '',
    control_Family_Id: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchControls = async () => {
    try {
      const response = await axios.get('http://localhost:8021/api/v1/controls');
      const sortedControls = response.data.sort((a, b) => {
        const numA = parseInt(a.fixed_id.replace(/\D/g, ''), 10);
        const numB = parseInt(b.fixed_id.replace(/\D/g, ''), 10);
        return numA - numB;
      });
      setControls(sortedControls);
    } catch (error) {
      console.error('Error fetching controls:', error);
    }
  };

  const fetchControlFamilies = async () => {
    try {
      const response = await axios.get('http://localhost:8021/api/v1/control-families');
      setControlFamilies(response.data);
    } catch (error) {
      console.error('Error fetching control families:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchControls(), fetchControlFamilies()]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (editingControl) {
      setEditControl({ ...editControl, control_Family_Id: value });
    } else {
      setNewControl({ ...newControl, control_Family_Id: value });
    }
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    if (editingControl) {
      setEditControl({ ...editControl, [name]: value });
    } else {
      setNewControl({ ...newControl, [name]: value });
    }
  };

  const handleAddControl = async () => {
    const isValidControlFamily = controlFamilies.some(cf => cf._id === newControl.control_Family_Id);

    if (!isValidControlFamily) {
      setSnackbarMessage('Control family does not exist');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
      setControls([...controls, response.data]);
      setNewControl({
        fixed_id: '',
        section: '',
        section_main_desc: '',
        section_desc: '',
        control_type: '',
        control_Family_Id: ''
      });
      setSnackbarMessage('Control added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding control:', error.response?.data);
      setSnackbarMessage(error.response?.data?.message || 'Error adding control');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEditControl = async () => {
    try {
      await axios.put(`http://localhost:8021/api/v1/controls/${editingControl._id}`, editControl);
      setControls(controls.map(control =>
        control._id === editingControl._id ? { ...control, ...editControl } : control
      ));
      setEditingControl(null);
      setEditControl({
        fixed_id: '',
        section: '',
        section_main_desc: '',
        section_desc: '',
        control_type: '',
        control_Family_Id: ''
      });
      setSnackbarMessage('Control updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating control:', error.response?.data || error.message);
      setSnackbarMessage(error.response?.data?.message || 'Error updating control');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteControl = async (id) => {
    try {
      await axios.delete(`http://localhost:8021/api/v1/controls/${id}`);
      setControls(controls.filter(control => control._id !== id));
      setSnackbarMessage('Control deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting control:', error.response?.data || error.message);
      setSnackbarMessage(error.response?.data?.message || 'Error deleting control');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
    return <Loading />;
  }

  return (
    <div className="p-4">
      <div className="control-form">
        <form onSubmit={(e) => {
          e.preventDefault();
          editingControl ? handleEditControl() : handleAddControl();
        }}>
          <TextField
            label="Section"
            name="section"
            value={editingControl ? editControl.section : newControl.section}
            onChange={handleTextChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Section Main Description"
            name="section_main_desc"
            value={editingControl ? editControl.section_main_desc : newControl.section_main_desc}
            onChange={handleTextChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Section Description"
            name="section_desc"
            value={editingControl ? editControl.section_desc : newControl.section_desc}
            onChange={handleTextChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Control Type"
            name="control_type"
            value={editingControl ? editControl.control_type : newControl.control_type}
            onChange={handleTextChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Control Family</InputLabel>
            <Select
              value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
              onChange={handleSelectChange}
              required
            >
              <MenuItem value="" disabled>Select Control Family</MenuItem>
              {controlFamilies.map((cf) => (
                <MenuItem key={cf._id} value={cf._id}>{cf.variable_id}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            {editingControl ? 'Update Control' : 'Add Control'}
          </Button>
        </form>
      </div>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fixed ID</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Section Main Description</TableCell>
              <TableCell>Section Description</TableCell>
              <TableCell>Control Type</TableCell>
              <TableCell>Control Family</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {controls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((control) => (
              <TableRow key={control._id}>
                <TableCell>{control.fixed_id}</TableCell>
                <TableCell>{control.section}</TableCell>
                <TableCell>{control.section_main_desc}</TableCell>
                <TableCell>{control.section_desc}</TableCell>
                <TableCell>{control.control_type}</TableCell>
                <TableCell>{controlFamilies.find(cf => cf._id === control.control_Family_Id)?.variable_id}</TableCell>
                <TableCell>
                  <Button onClick={() => {
                    setEditingControl(control);
                    setEditControl({ ...control });
                  }}
                  disabled={control.isDPDPA}  // Disable the Edit button if isDPDPA is true
                  >Edit</Button>
                  <Button onClick={() => handleDeleteControl(control._id)}  disabled={control.isDPDPA} 
                    >Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={controls.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default ControlsPage;

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
// import Snackbar from '@mui/material/Snackbar';
// import Loading from '../components/Loading';

// const ControlsPage = () => {
//   const [controls, setControls] = useState([]);
//   const [controlFamilies, setControlFamilies] = useState([]);
//   const [newControl, setNewControl] = useState({
//     fixed_id: '',
//     section: '',
//     section_main_desc: '',
//     section_desc: '',
//     control_type: '', // Added
//     control_Family_Id: ''
//   });
//   const [editingControl, setEditingControl] = useState(null);
//   const [editControl, setEditControl] = useState({
//     fixed_id: '',
//     section: '',
//     section_main_desc: '',
//     section_desc: '',
//     control_type: '', // Added
//     control_Family_Id: ''
//   });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [loading, setLoading] = useState(true);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success');

//   // Fetch controls from the API
//   const fetchControls = async () => {
//     try {
//       const response = await axios.get('http://localhost:8021/api/v1/controls');
//       const sortedControls = response.data.sort((a, b) => {
//         const numA = parseInt(a.fixed_id.replace(/\D/g, ''), 10);
//         const numB = parseInt(b.fixed_id.replace(/\D/g, ''), 10);
//         return numA - numB;
//       });
//       setControls(sortedControls);
//     } catch (error) {
//       console.error('Error fetching controls:', error);
//     }
//   };

//   // Fetch control families from the API
//   const fetchControlFamilies = async () => {
//     try {
//       const response = await axios.get('http://localhost:8021/api/v1/control-families');
//       setControlFamilies(response.data);
//     } catch (error) {
//       console.error('Error fetching control families:', error);
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         await Promise.all([fetchControls(), fetchControlFamilies()]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle select change for control family
//   const handleSelectChange = (event) => {
//     const value = event.target.value;
//     if (editingControl) {
//       setEditControl({ ...editControl, control_Family_Id: value });
//     } else {
//       setNewControl({ ...newControl, control_Family_Id: value });
//     }
//   };

//   // Handle text change for control type
//   const handleTextChange = (event) => {
//     const { name, value } = event.target;
//     if (editingControl) {
//       setEditControl({ ...editControl, [name]: value });
//     } else {
//       setNewControl({ ...newControl, [name]: value });
//     }
//   };

//   const handleAddControl = async () => {
//     const isValidControlFamily = controlFamilies.some(cf => cf._id === newControl.control_Family_Id);

//     if (!isValidControlFamily) {
//       setSnackbarMessage('Control family does not exist');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
//       setControls([...controls, response.data]);
//       setNewControl({
//         fixed_id: '',
//         section: '',
//         section_main_desc: '',
//         section_desc: '',
//         control_type: '', // Reset field
//         control_Family_Id: ''
//       });
//       setSnackbarMessage('Control added successfully');
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
//     } catch (error) {
//       console.error('Error adding control:', error.response?.data);
//       setSnackbarMessage(error.response?.data?.message || 'Error adding control');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   };

//   // Handle editing an existing control
//   const handleEditControl = async () => {
//     try {
//       await axios.put(`http://localhost:8021/api/v1/controls/${editingControl._id}`, editControl);
//       setControls(controls.map(control =>
//         control._id === editingControl._id ? { ...control, ...editControl } : control
//       ));
//       setEditingControl(null);
//       setEditControl({
//         fixed_id: '',
//         section: '',
//         section_main_desc: '',
//         section_desc: '',
//         control_type: '', // Reset field
//         control_Family_Id: ''
//       });
//       setSnackbarMessage('Control updated successfully');
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
//     } catch (error) {
//       console.error('Error updating control:', error.response ? error.response.data : error.message);
//       setSnackbarMessage(error.response ? error.response.data.message : 'Error updating control');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   };

//   // Handle deleting a control
//   const handleDeleteControl = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8021/api/v1/controls/${id}`);
//       setControls(controls.filter(control => control._id !== id));
//       setSnackbarMessage('Control deleted successfully');
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
//     } catch (error) {
//       console.error('Error deleting control:', error.response ? error.response.data : error.message);
//       setSnackbarMessage(error.response ? error.response.data.message : 'Error deleting control');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   };

//   // Handle pagination page change
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   // Handle rows per page change
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Display loading component if data is being fetched
//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="p-4">
//       <div className="control-form">
//         <form onSubmit={(e) => {
//           e.preventDefault();
//           editingControl ? handleEditControl() : handleAddControl();
//         }}>
//           <TextField
//             label="Section"
//             name="section"
//             value={editingControl ? editControl.section : newControl.section}
//             onChange={handleTextChange}
//             required
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Section Main Description"
//             name="section_main_desc"
//             value={editingControl ? editControl.section_main_desc : newControl.section_main_desc}
//             onChange={handleTextChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Section Description"
//             name="section_desc"
//             value={editingControl ? editControl.section_desc : newControl.section_desc}
//             onChange={handleTextChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Control Type"
//             name="control_type"
//             value={editingControl ? editControl.control_type : newControl.control_type}
//             onChange={handleTextChange}
//             fullWidth
//             margin="normal"
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Control Family</InputLabel>
//             <Select
//               value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
//               onChange={handleSelectChange}
//               required
//             >
//               <MenuItem value="" disabled>Select Control Family</MenuItem>
//               {controlFamilies.map((cf) => (
//                 <MenuItem key={cf._id} value={cf._id}>{cf.variable_id}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <Button type="submit" variant="contained" color="primary">
//             {editingControl ? 'Update Control' : 'Add Control'}
//           </Button>
//         </form>
//       </div>

//       <TableContainer component={Paper} className="mt-4">
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Fixed ID</TableCell>
//               <TableCell>Section</TableCell>
//               <TableCell>Section Main Description</TableCell>
//               <TableCell>Section Description</TableCell>
//               <TableCell>Control Type</TableCell>
//               <TableCell>Control Family</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {controls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((control) => (
//               <TableRow key={control._id}>
//                 <TableCell>{control.fixed_id}</TableCell>
//                 <TableCell>{control.section}</TableCell>
//                 <TableCell>{control.section_main_desc}</TableCell>
//                 <TableCell>{control.section_desc}</TableCell>
//                 <TableCell>{control.control_type}</TableCell>
//                 <TableCell>{controlFamilies.find(cf => cf._id === control.control_Family_Id)?.variable_id}</TableCell>
//                 <TableCell>
//                   <Button onClick={() => setEditingControl(control)}>Edit</Button>
//                   <Button onClick={() => handleDeleteControl(control._id)}>Delete</Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={controls.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </TableContainer>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={() => setSnackbarOpen(false)}
//         message={snackbarMessage}
//         severity={snackbarSeverity}
//       />
//     </div>
//   );
// };

// export default ControlsPage;

// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import Table from '@mui/material/Table';
// // import TableBody from '@mui/material/TableBody';
// // import TableCell from '@mui/material/TableCell';
// // import TableContainer from '@mui/material/TableContainer';
// // import TableHead from '@mui/material/TableHead';
// // import TableRow from '@mui/material/TableRow';
// // import Paper from '@mui/material/Paper';
// // import TablePagination from '@mui/material/TablePagination';
// // import Button from '@mui/material/Button';
// // import TextField from '@mui/material/TextField';
// // import Select from '@mui/material/Select';
// // import MenuItem from '@mui/material/MenuItem';
// // import FormControl from '@mui/material/FormControl';
// // import InputLabel from '@mui/material/InputLabel';
// // import Snackbar from '@mui/material/Snackbar';
// // import Loading from '../components/Loading';

// // const ControlsPage = () => {
// //   const [controls, setControls] = useState([]);
// //   const [controlFamilies, setControlFamilies] = useState([]);
// //   const [newControl, setNewControl] = useState({
// //     fixed_id: '',
// //     section: '',
// //     section_main_desc: '',
// //     section_desc: '',
// //     control_type: '',
// //     control_Family_Id: ''
// //   });
// //   const [editingControl, setEditingControl] = useState(null);
// //   const [editControl, setEditControl] = useState({
// //     fixed_id: '',
// //     section: '',
// //     section_main_desc: '',
// //     section_desc: '',
// //     control_type: '',
// //     control_Family_Id: ''
// //   });
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(5);
// //   const [loading, setLoading] = useState(true);
// //   const [snackbarOpen, setSnackbarOpen] = useState(false);
// //   const [snackbarMessage, setSnackbarMessage] = useState('');
// //   const [snackbarSeverity, setSnackbarSeverity] = useState('success');

// //   // Fetch controls from the API
// //   const fetchControls = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:8021/api/v1/controls');
// //       const sortedControls = response.data.sort((a, b) => {
// //         const numA = parseInt(a.fixed_id.replace(/\D/g, ''), 10);
// //         const numB = parseInt(b.fixed_id.replace(/\D/g, ''), 10);
// //         return numA - numB;
// //       });
// //       setControls(sortedControls);
// //       // setControls(response.data);
// //     } catch (error) {
// //       console.error('Error fetching controls:', error);
// //     }
// //   };

// //   // Fetch control families from the API
// //   const fetchControlFamilies = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:8021/api/v1/control-families');
// //       setControlFamilies(response.data);
// //     } catch (error) {
// //       console.error('Error fetching control families:', error);
// //     }
// //   };

// //   // Initial data fetch
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         await Promise.all([fetchControls(), fetchControlFamilies()]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   // Handle select change for control family
// //   const handleSelectChange = (event) => {
// //     const value = event.target.value;
// //     if (editingControl) {
// //       setEditControl({ ...editControl, control_Family_Id: value });
// //     } else {
// //       setNewControl({ ...newControl, control_Family_Id: value });
// //     }
    
// //   };

// //   // const handleAddControl = async () => {
// //   //   const isValidControlFamily = controlFamilies.some(cf => cf._id === newControl.control_Family_Id);
  
// //   //   if (!isValidControlFamily) {
// //   //     console.error('Invalid control family ID:', newControl.control_Family_Id);
// //   //     setSnackbarMessage('Control family does not exist');
// //   //     setSnackbarSeverity('error');
// //   //     setSnackbarOpen(true);
// //   //     return;
// //   //   }
  
// //   //   try {
// //   //     console.log('Sending request with data:', newControl);
// //   //     const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// //   //     console.log('Received response:', response.data);
// //   //     setControls([...controls, response.data]);
// //   //     setNewControl({
// //   //       fixed_id: '',
// //   //       section: '',
// //   //       section_main_desc: '',
// //   //       section_desc: '',
// //   //       control_type: '',
// //   //       control_Family_Id: ''
// //   //     });
// //   //     setSnackbarMessage('Control added successfully');
// //   //     setSnackbarSeverity('success');
// //   //     setSnackbarOpen(true);
// //   //   } catch (error) {
// //   //     console.error('Error adding control:', error);
// //   //     setSnackbarMessage(error.response && error.response.data ? error.response.data.message : 'Error adding control');
// //   //     setSnackbarSeverity('error');
// //   //     setSnackbarOpen(true);
// //   //   }
// //   // };
  
// //   // const handleAddControl = async () => {
// //   //   const isValidControlFamily = controlFamilies.some(cf => cf._id === newControl.control_Family_Id);
  
// //   //   if (!isValidControlFamily) {
// //   //     setSnackbarMessage('Control family does not exist');
// //   //     setSnackbarSeverity('error');
// //   //     setSnackbarOpen(true);
// //   //     return;
// //   //   }
  
// //   //   try {
// //   //     const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// //   //     setControls([...controls, response.data]);
// //   //     setNewControl({
// //   //       fixed_id: '',
// //   //       section: '',
// //   //       section_main_desc: '',
// //   //       section_desc: '',
// //   //       control_type: '',
// //   //       control_Family_Id: ''
// //   //     });
// //   //     setSnackbarMessage('Control added successfully');
// //   //     setSnackbarSeverity('success');
// //   //     setSnackbarOpen(true);
// //   //   } catch (error) {
// //   //     setSnackbarMessage(error.response?.data?.message || 'Error adding control');
// //   //     setSnackbarSeverity('error');
// //   //     setSnackbarOpen(true);
// //   //   }
// //   // };
  

// //   const handleAddControl = async () => {
// //     const isValidControlFamily = controlFamilies.some(cf => cf._id === newControl.control_Family_Id);
  
// //     if (!isValidControlFamily) {
// //       console.error('Invalid control family ID:', newControl.control_Family_Id);
// //       setSnackbarMessage('Control family does not exist');
// //       setSnackbarSeverity('error');
// //       setSnackbarOpen(true);
// //       return;
// //     }
  
// //     try {
// //       console.log('Sending request with data:', newControl);
// //       const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// //       console.log('Received response:', response.data);
// //       setControls([...controls, response.data]);
// //       setNewControl({
// //         fixed_id: '',
// //         section: '',
// //         section_main_desc: '',
// //         section_desc: '',
// //         control_type: '',
// //         control_Family_Id: ''
// //       });
// //       setSnackbarMessage('Control added successfully');
// //       setSnackbarSeverity('success');
// //       setSnackbarOpen(true);
// //     } catch (error) {
// //       console.error('Error adding control:', error);
// //       setSnackbarMessage(error.response && error.response.data ? error.response.data.message : 'Error adding control');
// //       setSnackbarSeverity('error');
// //       setSnackbarOpen(true);
// //     }
// //   };
  
// //   // Handle editing an existing control
// //   const handleEditControl = async () => {
// //     try {
// //       await axios.put(`http://localhost:8021/api/v1/controls/${editingControl._id}`, editControl);
// //       setControls(controls.map(control =>
// //         control._id === editingControl._id ? { ...control, ...editControl } : control
// //       ));
// //       setEditingControl(null);
// //       setEditControl({
// //         fixed_id: '',
// //         section: '',
// //         section_main_desc: '',
// //         section_desc: '',
// //         control_type: '',
// //         control_Family_Id: ''
// //       });
// //       setSnackbarMessage('Control updated successfully');
// //       setSnackbarSeverity('success');
// //       setSnackbarOpen(true);
// //     } catch (error) {
// //       console.error('Error updating control:', error.response ? error.response.data : error.message);
// //       setSnackbarMessage(error.response ? error.response.data.message : 'Error updating control');
// //       setSnackbarSeverity('error');
// //       setSnackbarOpen(true);
// //     }
// //   };

// //   // Handle deleting a control
// //   const handleDeleteControl = async (id) => {
// //     try {
// //       await axios.delete(`http://localhost:8021/api/v1/controls/${id}`);
// //       setControls(controls.filter(control => control._id !== id));
// //       setSnackbarMessage('Control deleted successfully');
// //       setSnackbarSeverity('success');
// //       setSnackbarOpen(true);
// //     } catch (error) {
// //       console.error('Error deleting control:', error.response ? error.response.data : error.message);
// //       setSnackbarMessage(error.response ? error.response.data.message : 'Error deleting control');
// //       setSnackbarSeverity('error');
// //       setSnackbarOpen(true);
// //     }
// //   };

// //   // Handle pagination page change
// //   const handleChangePage = (event, newPage) => {
// //     setPage(newPage);
// //   };

// //   // Handle rows per page change
// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setPage(0);
// //   };

// //   // Display loading component if data is being fetched
// //   if (loading) {
// //     return <Loading />;
// //   }

// //   return (
// //     <div className="p-4">
// //       <div className="control-form">
// //         <form onSubmit={(e) => {
// //           e.preventDefault();
// //           editingControl ? handleEditControl() : handleAddControl();
// //         }}>
// //           <TextField
// //             label="Section"
// //             value={editingControl ? editControl.section : newControl.section}
// //             onChange={(e) => editingControl ? setEditControl({ ...editControl, section: e.target.value }) : setNewControl({ ...newControl, section: e.target.value })}
// //             required
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Section Main Description"
// //             value={editingControl ? editControl.section_main_desc : newControl.section_main_desc}
// //             onChange={(e) => editingControl ? setEditControl({ ...editControl, section_main_desc: e.target.value }) : setNewControl({ ...newControl, section_main_desc: e.target.value })}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Section Description"
// //             value={editingControl ? editControl.section_desc : newControl.section_desc}
// //             onChange={(e) => editingControl ? setEditControl({ ...editControl, section_desc: e.target.value }) : setNewControl({ ...newControl, section_desc: e.target.value })}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <FormControl fullWidth margin="normal">
// //             <InputLabel>Control Family</InputLabel>
// //             <Select
// //               value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
// //               onChange={handleSelectChange}
// //               required
// //             >
// //               <MenuItem value="" disabled>Select Control Family</MenuItem>
// //               {controlFamilies.map((cf) => (
// //                 <MenuItem key={cf.variable_id} value={cf._id}>{cf.variable_id}</MenuItem>
// //               ))}
// //             </Select>
// //           </FormControl>
// //           <Button type="submit" variant="contained" color="primary" fullWidth  style={{ marginTop: '10px', marginBottom: '10px', maxWidth: '45px' }}
// //           >
// //             {editingControl ? 'Save' : 'Add'}
// //           </Button>
// //           {editingControl && (
// //             <Button
// //               type="button"
// //               variant="outlined"
// //               color="secondary"
// //               fullWidth
// //               style={{ marginTop: '10px' }}
// //               onClick={() => {
// //                 setEditingControl(null);
// //                 setEditControl({
// //                   fixed_id: '',
// //                   section: '',
// //                   section_main_desc: '',
// //                   section_desc: '',
// //                   control_type: '',
// //                   control_Family_Id: ''
// //                 });
// //               }}
// //             >
// //               Cancel
// //             </Button>
// //           )}
// //         </form>
// //       </div>
     
// //       <TableContainer 
// //   component={Paper} 
 
// // >
// //   <Table stickyHeader>
// //     <TableHead>
// //       <TableRow  style={{ maxHeight: '400px', overflow: 'auto', width: '100%', maxWidth: '1000px', margin: 'auto' }} >
// //         <TableCell>Fixed ID</TableCell>
// //         <TableCell>Section</TableCell>
// //         <TableCell>Section Main Description</TableCell>
// //         <TableCell>Section Description</TableCell>
// //         <TableCell>Control Type</TableCell>
// //         <TableCell>Chapter ID</TableCell>
// //         <TableCell>Actions</TableCell>
// //       </TableRow>
// //     </TableHead>
// //     <TableBody>
// //       {controls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((control) => (
// //         <TableRow key={control._id}>
// //           <TableCell>{control.fixed_id}</TableCell>
// //           <TableCell>{control.section}</TableCell>
// //           <TableCell>{control.section_main_desc}</TableCell>
// //           <TableCell>{control.section_desc}</TableCell>
// //           <TableCell>{control.control_type}</TableCell>
// //           <TableCell>
// //             {controlFamilies.find(cf => cf._id === control.control_Family_Id)?.variable_id || 'N/A'}
// //           </TableCell>
// //           <TableCell>
// //             <Button onClick={() => {
// //               setEditingControl(control);
// //               setEditControl({
// //                 fixed_id: control.fixed_id,
// //                 section: control.section,
// //                 section_main_desc: control.section_main_desc,
// //                 section_desc: control.section_desc,
// //                 control_type: control.control_type,
// //                 control_Family_Id: control.control_Family_Id
// //               });
// //             }} disabled={control.isDPDPA}  // Disable the Edit button if isDPDPA is true
// //             >
// //               Edit
// //             </Button>
// //             <Button onClick={() => handleDeleteControl(control._id)} disabled={control.isDPDPA}  // Disable the Edit button if isDPDPA is true
// //             >
// //               Delete
// //             </Button>
// //           </TableCell>
// //         </TableRow>
// //       ))}
// //     </TableBody>
// //   </Table>
// //   <TablePagination
// //     rowsPerPageOptions={[5, 10, 25]}
// //     component="div"
// //     count={controls.length}
// //     rowsPerPage={rowsPerPage}
// //     page={page}
// //     onPageChange={handleChangePage}
// //     onRowsPerPageChange={handleChangeRowsPerPage}
// //   />
// // </TableContainer>

// //       <Snackbar
// //         open={snackbarOpen}
// //         autoHideDuration={6000}
// //         onClose={() => setSnackbarOpen(false)}
// //         message={snackbarMessage}
// //         severity={snackbarSeverity}
// //       />
// //     </div>
// //   );
// // };

// // export default ControlsPage;



// // //   // Handle adding a new control
// // //   // const handleAddControl = async () => {
// // //   //   const isValidControlFamily = controlFamilies.some(cf => cf._id === newControl.control_Family_Id);

// // //   //   if (!isValidControlFamily) {
// // //   //     console.error('Invalid control family ID:', newControl.control_Family_Id);
// // //   //     setSnackbarMessage('Control family does not exist');
// // //   //     setSnackbarSeverity('error');
// // //   //     setSnackbarOpen(true);
// // //   //     return;
// // //   //   }

// // //   //   try {
// // //   //     const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// // //   //     setControls([...controls, response.data]);
// // //   //     setNewControl({
// // //   //       fixed_id: '',
// // //   //       section: '',
// // //   //       section_main_desc: '',
// // //   //       section_desc: '',
// // //   //       control_type: '',
// // //   //       control_Family_Id: ''
// // //   //     });
// // //   //     setSnackbarMessage('Control added successfully');
// // //   //     setSnackbarSeverity('success');
// // //   //     setSnackbarOpen(true);
// // //   //   } catch (error) {
// // //   //     console.error('Error adding control:', error.response ? error.response.data : error.message);
// // //   //     setSnackbarMessage(error.response ? error.response.data.message : 'Error adding control');
// // //   //     setSnackbarSeverity('error');
// // //   //     setSnackbarOpen(true);
// // //   //   }
// // //   // };
  


// // // // import React, { useEffect, useState } from 'react';
// // // // import axios from 'axios';
// // // // import Table from '@mui/material/Table';
// // // // import TableBody from '@mui/material/TableBody';
// // // // import TableCell from '@mui/material/TableCell';
// // // // import TableContainer from '@mui/material/TableContainer';
// // // // import TableHead from '@mui/material/TableHead';
// // // // import TableRow from '@mui/material/TableRow';
// // // // import Paper from '@mui/material/Paper';
// // // // import TablePagination from '@mui/material/TablePagination';
// // // // import Button from '@mui/material/Button';
// // // // import TextField from '@mui/material/TextField';
// // // // import Select from '@mui/material/Select';
// // // // import MenuItem from '@mui/material/MenuItem';
// // // // import FormControl from '@mui/material/FormControl';
// // // // import InputLabel from '@mui/material/InputLabel';
// // // // import Loading from '../components/Loading';
// // // // import Snackbar from '@mui/material/Snackbar';

// // // // const ControlsPage = () => {
// // // //   const [controls, setControls] = useState([]);
// // // //   const [controlFamilies, setControlFamilies] = useState([]);
// // // //   const [newControl, setNewControl] = useState({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' });
// // // //   const [editingControl, setEditingControl] = useState(null);
// // // //   const [editControl, setEditControl] = useState({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' });
// // // //   const [page, setPage] = useState(0);
// // // //   const [rowsPerPage, setRowsPerPage] = useState(5);
// // // //   const [loading, setLoading] = useState(true);

// // // //    // Snackbar state hooks
// // // //    const [snackbarOpen, setSnackbarOpen] = useState(false);
// // // //    const [snackbarMessage, setSnackbarMessage] = useState('');
// // // //    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
   
// // // //   const fetchControls = async () => {
// // // //     try {
// // // //       const response = await axios.get('http://localhost:8021/api/v1/controls');
// // // //       setControls(response.data);
// // // //     } catch (error) {
// // // //       console.error('Error fetching controls:', error);
// // // //     }
// // // //   };

// // // //   const fetchControlFamilies = async () => {
// // // //     try {
// // // //       const response = await axios.get('http://localhost:8021/api/v1/control-families');
// // // //       setControlFamilies(response.data);
// // // //     } catch (error) {
// // // //       console.error('Error fetching control families:', error);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     const fetchData = async () => {
// // // //       setLoading(true);
// // // //       try {
// // // //         await Promise.all([fetchControls(), fetchControlFamilies()]);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchData();
// // // //   }, []);

// // // //   // const handleAddControl = async () => {
// // // //   //   const isValidControlFamily = controlFamilies.some(cf => cf._id === newControl.control_Family_Id);
  
// // // //   //   if (!isValidControlFamily) {
// // // //   //     console.error('Invalid control family ID:', newControl.control_Family_Id);
// // // //   //     return;
// // // //   //   }
  
// // // //   //   try {
// // // //   //     const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// // // //   //     setControls([...controls, response.data]);
// // // //   //     setNewControl({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' });
// // // //   //   } catch (error) {
// // // //   //     console.error('Error adding control:', error.response ? error.response.data : error.message);
// // // //   //   }
// // // //   // };


// // // //   const handleSelectChange = (event) => {
// // // //     const value = event.target.value;
// // // //     console.log('Selected Control Family ID:', value); // Debug log
// // // //     if (editingControl) {
// // // //       setEditControl({ ...editControl, control_Family_Id: value });
// // // //     } else {
// // // //       setNewControl({ ...newControl, control_Family_Id: value });
// // // //     }
// // // //   };

// // // //   const handleAddControl = async () => {
// // // //     const isValidControlFamily = controlFamilies.some(cf => cf._id === newControl.control_Family_Id);
  
// // // //     if (!isValidControlFamily) {
// // // //       console.error('Invalid control family ID:', newControl.control_Family_Id);
// // // //       console.log('Available control families:', controlFamilies.map(cf => cf._id)); // Log available IDs
// // // //       setSnackbarMessage('Control family does not exist');
// // // //       setSnackbarSeverity('error');
// // // //       setSnackbarOpen(true);
// // // //       return;
// // // //     }
  
// // // //     try {
// // // //       const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// // // //       setControls([...controls, response.data]);
// // // //       setNewControl({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' });
// // // //       setSnackbarMessage('Control added successfully');
// // // //       setSnackbarSeverity('success');
// // // //       setSnackbarOpen(true);
// // // //     } catch (error) {
// // // //       setSnackbarMessage(error.response ? error.response.data : 'Error adding control');
// // // //       setSnackbarSeverity('error');
// // // //       setSnackbarOpen(true);
// // // //     }
// // // //   };
  
// // // //   const handleEditControl = async () => {
// // // //     try {
// // // //       await axios.put(`http://localhost:8021/api/v1/controls/${editingControl._id}`, editControl);
// // // //       setControls(controls.map(control =>
// // // //         control._id === editingControl._id ? { ...control, ...editControl } : control
// // // //       ));
// // // //       setEditingControl(null);
// // // //       setEditControl({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' });
// // // //     } catch (error) {
// // // //       console.error('Error updating control:', error.response ? error.response.data : error.message);
// // // //     }
// // // //   };

// // // //   const handleDeleteControl = async (id) => {
// // // //     try {
// // // //       await axios.delete(`http://localhost:8021/api/v1/controls/${id}`);
// // // //       setControls(controls.filter(control => control._id !== id));
// // // //     } catch (error) {
// // // //       console.error('Error deleting control:', error.response ? error.response.data : error.message);
// // // //     }
// // // //   };

// // // //   const handleChangePage = (event, newPage) => {
// // // //     setPage(newPage);
// // // //   };

// // // //   const handleChangeRowsPerPage = (event) => {
// // // //     setRowsPerPage(parseInt(event.target.value, 10));
// // // //     setPage(0);
// // // //   };

// // // //   if (loading) {
// // // //     return <Loading />;
// // // //   }

// // // //   return (
// // // //     <div className="p-4">
// // // //       <div className="control-form">
// // // //         <form onSubmit={(e) => {
// // // //           e.preventDefault();
// // // //           editingControl ? handleEditControl() : handleAddControl();
// // // //         }}>
// // // //           <TextField
// // // //             label="Section"
// // // //             value={editingControl ? editControl.section : newControl.section}
// // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, section: e.target.value }) : setNewControl({ ...newControl, section: e.target.value })}
// // // //             required
// // // //             fullWidth
// // // //             margin="normal"
// // // //           />
// // // //           <TextField
// // // //             label="Section Main Description"
// // // //             value={editingControl ? editControl.section_main_desc : newControl.section_main_desc}
// // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, section_main_desc: e.target.value }) : setNewControl({ ...newControl, section_main_desc: e.target.value })}
// // // //             fullWidth
// // // //             margin="normal"
// // // //           />
// // // //           <TextField
// // // //             label="Section Description"
// // // //             value={editingControl ? editControl.section_desc : newControl.section_desc}
// // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, section_desc: e.target.value }) : setNewControl({ ...newControl, section_desc: e.target.value })}
// // // //             fullWidth
// // // //             margin="normal"
// // // //           />
// // // //           <FormControl fullWidth margin="normal">
// // // //             <InputLabel>Control Family</InputLabel>
// // // //             {/* <Select
// // // //               value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
// // // //               onChange={(e) => editingControl ? setEditControl({ ...editControl, control_Family_Id: e.target.value }) : setNewControl({ ...newControl, control_Family_Id: e.target.value })}
// // // //               required
// // // //             >
// // // //               <MenuItem value="" disabled>Select Control Family</MenuItem>
// // // //               {controlFamilies.map((cf) => (
// // // //                 <MenuItem key={cf._id} value={cf._id}>{cf.fixed_id}</MenuItem>
// // // //               ))}
// // // //             </Select> */}
// // // //             <Select
// // // //   value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
// // // //   onChange={handleSelectChange}
// // // //   required
// // // // >
// // // //   <MenuItem value="" disabled>Select Control Family</MenuItem>
// // // //   {controlFamilies.map((cf) => (
// // // //     <MenuItem key={cf._id} value={cf._id}>{cf.variable_id}</MenuItem>
// // // //   ))}
// // // // </Select>
// // // //           </FormControl>
// // // //           <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '10px' }}>
// // // //             {editingControl ? 'Save' : 'Add'}
// // // //           </Button>
// // // //           {editingControl && <Button type="button" variant="outlined" color="secondary" fullWidth style={{ marginTop: '10px' }} onClick={() => { setEditingControl(null); setEditControl({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' }); }}>Cancel</Button>}
// // // //         </form>
// // // //       </div>
// // // //       <TableContainer component={Paper}>
// // // //         <Table>
// // // //           <TableHead>
// // // //             <TableRow>
// // // //               <TableCell>Fixed ID</TableCell>
// // // //               <TableCell>Section</TableCell>
// // // //               <TableCell>Section Main Description</TableCell>
// // // //               <TableCell>Section Description</TableCell>
// // // //               <TableCell>Control Type</TableCell>
// // // //               <TableCell>Control Family</TableCell>
// // // //               <TableCell>Actions</TableCell>
// // // //             </TableRow>
// // // //           </TableHead>
// // // //           <TableBody>
// // // //             {controls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((control) => (
// // // //               <TableRow key={control._id}>
// // // //                 <TableCell>{control.fixed_id}</TableCell>
// // // //                 <TableCell>{control.section}</TableCell>
// // // //                 <TableCell>{control.section_main_desc}</TableCell>
// // // //                 <TableCell>{control.section_desc}</TableCell>
// // // //                 <TableCell>{control.control_type}</TableCell>
// // // //                 <TableCell>
// // // //                   {controlFamilies.find(cf => cf._id === control.control_Family_Id)?.fixed_id || 'N/A'}
// // // //                 </TableCell>
// // // //                 <TableCell>
// // // //                   <Button
// // // //                     variant="contained"
// // // //                     color="primary"
// // // //                     onClick={() => { setEditingControl(control); setEditControl(control); }}
// // // //                     style={{ marginRight: '10px' }}
// // // //                   >
// // // //                     Edit
// // // //                   </Button>
// // // //                   <Button
// // // //                     variant="contained"
// // // //                     color="secondary"
// // // //                     onClick={() => handleDeleteControl(control._id)}
// // // //                   >
// // // //                     Delete
// // // //                   </Button>
// // // //                 </TableCell>
// // // //               </TableRow>
// // // //             ))}
// // // //           </TableBody>
// // // //         </Table>
// // // //       </TableContainer>
// // // //       <TablePagination
// // // //         rowsPerPageOptions={[5, 10, 25]}
// // // //         component="div"
// // // //         count={controls.length}
// // // //         rowsPerPage={rowsPerPage}
// // // //         page={page}
// // // //         onPageChange={handleChangePage}
// // // //         onRowsPerPageChange={handleChangeRowsPerPage}
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ControlsPage;

// // // // import React, { useEffect, useState } from 'react';
// // // // import axios from 'axios';
// // // // import Table from '@mui/material/Table';
// // // // import TableBody from '@mui/material/TableBody';
// // // // import TableCell from '@mui/material/TableCell';
// // // // import TableContainer from '@mui/material/TableContainer';
// // // // import TableHead from '@mui/material/TableHead';
// // // // import TableRow from '@mui/material/TableRow';
// // // // import Paper from '@mui/material/Paper';
// // // // import TablePagination from '@mui/material/TablePagination';
// // // // import Button from '@mui/material/Button';
// // // // import TextField from '@mui/material/TextField';
// // // // import Select from '@mui/material/Select';
// // // // import MenuItem from '@mui/material/MenuItem';
// // // // import FormControl from '@mui/material/FormControl';
// // // // import InputLabel from '@mui/material/InputLabel';
// // // // import Loading from '../components/Loading'; // Import the Loading component

// // // // const ControlsPage = () => {
// // // //   const [controls, setControls] = useState([]);
// // // //   const [controlFamilies, setControlFamilies] = useState([]);
// // // //   const [newControl, setNewControl] = useState({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' });
// // // //   const [editingControl, setEditingControl] = useState(null);
// // // //   const [editControl, setEditControl] = useState({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' });
// // // //   const [page, setPage] = useState(0);
// // // //   const [rowsPerPage, setRowsPerPage] = useState(5);
// // // //   const [loading, setLoading] = useState(true);

// // // //   const fetchControls = async () => {
// // // //     try {
// // // //       const response = await axios.get('http://localhost:8021/api/v1/controls');
// // // //       setControls(response.data);
// // // //     } catch (error) {
// // // //       console.error('Error fetching controls:', error);
// // // //     }
// // // //   };

// // // //   const fetchControlFamilies = async () => {
// // // //     try {
// // // //       const response = await axios.get('http://localhost:8021/api/v1/control-families');
// // // //       setControlFamilies(response.data);
// // // //     } catch (error) {
// // // //       console.error('Error fetching control families:', error);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     const fetchData = async () => {
// // // //       setLoading(true);
// // // //       try {
// // // //         await Promise.all([fetchControls(), fetchControlFamilies()]);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchData();
// // // //   }, []);

// // // //   const handleAddControl = async () => {
// // // //     // Check if control family ID is valid
// // // //     const isValidControlFamily = controlFamilies.some(cf => cf._id === newControl.control_Family_Id);
  
// // // //     if (!isValidControlFamily) {
// // // //       console.error('Invalid control family ID:', newControl.control_Family_Id);
// // // //       return; // Stop function execution if control family ID is invalid
// // // //     }
  
// // // //     try {
// // // //       const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// // // //       setControls([...controls, response.data]);
// // // //       setNewControl({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' });
// // // //     } catch (error) {
// // // //       console.error('Error adding control:', error.response ? error.response.data : error.message);
// // // //     }
// // // //   };
  

// // // //   const handleEditControl = async () => {
// // // //     try {
// // // //       await axios.put(`http://localhost:8021/api/v1/controls/${editingControl._id}`, editControl);
// // // //       setControls(controls.map(control =>
// // // //         control._id === editingControl._id ? { ...control, ...editControl } : control
// // // //       ));
// // // //       setEditingControl(null);
// // // //       setEditControl({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' });
// // // //     } catch (error) {
// // // //       console.error('Error updating control:', error.response ? error.response.data : error.message);
// // // //     }
// // // //   };

// // // //   const handleDeleteControl = async (id) => {
// // // //     try {
// // // //       await axios.delete(`http://localhost:8021/api/v1/controls/${id}`);
// // // //       setControls(controls.filter(control => control._id !== id));
// // // //     } catch (error) {
// // // //       console.error('Error deleting control:', error.response ? error.response.data : error.message);
// // // //     }
// // // //   };

// // // //   const handleChangePage = (event, newPage) => {
// // // //     setPage(newPage);
// // // //   };

// // // //   const handleChangeRowsPerPage = (event) => {
// // // //     setRowsPerPage(parseInt(event.target.value, 10));
// // // //     setPage(0);
// // // //   };

// // // //   if (loading) {
// // // //     return <Loading />;
// // // //   }

// // // //   return (
// // // //     <div className="p-4">
// // // //       <div className="control-form">
// // // //         <form onSubmit={(e) => {
// // // //           e.preventDefault();
// // // //           editingControl ? handleEditControl() : handleAddControl();
// // // //         }}>
// // // //           {/* <TextField
// // // //             label="Fixed ID"
// // // //             value={editingControl ? editControl.fixed_id : newControl.fixed_id}
// // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, fixed_id: e.target.value }) : setNewControl({ ...newControl, fixed_id: e.target.value })}
// // // //             required
// // // //             fullWidth
// // // //             margin="normal"
// // // //           /> */}
// // // //           <TextField
// // // //             label="Section"
// // // //             value={editingControl ? editControl.section : newControl.section}
// // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, section: e.target.value }) : setNewControl({ ...newControl, section: e.target.value })}
// // // //             required
// // // //             fullWidth
// // // //             margin="normal"
// // // //           />
// // // //           <TextField
// // // //             label="Section Main Description"
// // // //             value={editingControl ? editControl.section_main_desc : newControl.section_main_desc}
// // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, section_main_desc: e.target.value }) : setNewControl({ ...newControl, section_main_desc: e.target.value })}
// // // //             fullWidth
// // // //             margin="normal"
// // // //           />
// // // //           <TextField
// // // //             label="Section Description"
// // // //             value={editingControl ? editControl.section_desc : newControl.section_desc}
// // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, section_desc: e.target.value }) : setNewControl({ ...newControl, section_desc: e.target.value })}
// // // //             fullWidth
// // // //             margin="normal"
// // // //           />
// // // //           {/* <FormControl fullWidth margin="normal">
// // // //             <InputLabel>Control Family</InputLabel>
// // // //             <Select
// // // //               value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
// // // //               onChange={(e) => editingControl ? setEditControl({ ...editControl, control_Family_Id: e.target.value }) : setNewControl({ ...newControl, control_Family_Id: e.target.value })}
// // // //               required
// // // //             >
// // // //               <MenuItem value="" disabled>Select Control Family</MenuItem>
// // // //               {controlFamilies.map((cf) => (
// // // //                 <MenuItem key={cf._id} value={cf._id}>{cf.variable_id}</MenuItem>
// // // //               ))}
// // // //             </Select>
// // // //           </FormControl> */}
// // // //           <FormControl fullWidth margin="normal">
// // // //   <InputLabel>Control Family</InputLabel>
// // // //   <Select
// // // //     value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
// // // //     onChange={(e) => editingControl ? setEditControl({ ...editControl, control_Family_Id: e.target.value }) : setNewControl({ ...newControl, control_Family_Id: e.target.value })}
// // // //     required
// // // //   >
// // // //     <MenuItem value="" disabled>Select Control Family</MenuItem>
// // // //     {controlFamilies.map((cf) => (
// // // //       <MenuItem key={cf._id} value={cf._id}>{cf.variable_id}</MenuItem>
// // // //     ))}
// // // //   </Select>
// // // // </FormControl>

// // // //           <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '10px' }}>
// // // //             {editingControl ? 'Save' : 'Add'}
// // // //           </Button>
// // // //           {editingControl && <Button type="button" variant="outlined" color="secondary" fullWidth style={{ marginTop: '10px' }} onClick={() => { setEditingControl(null); setEditControl({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' }); }}>Cancel</Button>}
// // // //         </form>
// // // //       </div>
// // // //       <TableContainer component={Paper}>
// // // //         <Table>
// // // //           <TableHead>
// // // //             <TableRow>
// // // //               <TableCell>Fixed ID</TableCell>
// // // //               <TableCell>Section</TableCell>
// // // //               <TableCell>Section Main Description</TableCell>
// // // //               <TableCell>Section Description</TableCell>
// // // //               <TableCell>Control Type</TableCell>
// // // //               <TableCell>Control Family</TableCell>
// // // //               <TableCell>Actions</TableCell>
// // // //             </TableRow>
// // // //           </TableHead>
// // // //           <TableBody>
// // // //             {controls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((control) => (
// // // //               <TableRow key={control._id}>
// // // //                 <TableCell>{control.fixed_id}</TableCell>
// // // //                 <TableCell>{control.section}</TableCell>
// // // //                 <TableCell>{control.section_main_desc}</TableCell>
// // // //                 <TableCell>{control.section_desc}</TableCell>
// // // //                 <TableCell>{control.control_type}</TableCell>
// // // //                 <TableCell>
// // // //                   {controlFamilies.find(cf => cf._id === control.control_Family_Id)?.fixed_id || 'N/A'}
// // // //                 </TableCell>
// // // //                 <TableCell>
// // // //                   <Button
// // // //                     variant="contained"
// // // //                     color="primary"
// // // //                     onClick={() => { setEditingControl(control); setEditControl(control); }}
// // // //                     style={{ marginRight: '10px' }}
// // // //                   >
// // // //                     Edit
// // // //                   </Button>
// // // //                   <Button
// // // //                     variant="contained"
// // // //                     color="secondary"
// // // //                     onClick={() => handleDeleteControl(control._id)}
// // // //                   >
// // // //                     Delete
// // // //                   </Button>
// // // //                 </TableCell>
// // // //               </TableRow>
// // // //             ))}
// // // //           </TableBody>
// // // //         </Table>
// // // //       </TableContainer>
// // // //       <TablePagination
// // // //         rowsPerPageOptions={[5, 10, 25]}
// // // //         component="div"
// // // //         count={controls.length}
// // // //         rowsPerPage={rowsPerPage}
// // // //         page={page}
// // // //         onPageChange={handleChangePage}
// // // //         onRowsPerPageChange={handleChangeRowsPerPage}
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ControlsPage;

// // // // import React, { useEffect, useState } from 'react';
// // // // import axios from 'axios';
// // // // import Table from '@mui/material/Table';
// // // // import TableBody from '@mui/material/TableBody';
// // // // import TableCell from '@mui/material/TableCell';
// // // // import TableContainer from '@mui/material/TableContainer';
// // // // import TableHead from '@mui/material/TableHead';
// // // // import TableRow from '@mui/material/TableRow';
// // // // import Paper from '@mui/material/Paper';
// // // // import TablePagination from '@mui/material/TablePagination';
// // // // import Button from '@mui/material/Button';
// // // // import TextField from '@mui/material/TextField';
// // // // import Select from '@mui/material/Select';
// // // // import MenuItem from '@mui/material/MenuItem';
// // // // import FormControl from '@mui/material/FormControl';
// // // // import InputLabel from '@mui/material/InputLabel';
// // // // import Loading from '../components/Loading'; // Import the Loading component

// // // // const ControlsPage = () => {
// // // //   const [controls, setControls] = useState([]);
// // // //   const [controlFamilies, setControlFamilies] = useState([]);
// // // //   const [newControl, setNewControl] = useState({
// // // //     fixed_id: '',
// // // //     section: '',
// // // //     section_main_desc: '',
// // // //     section_desc: '',
// // // //     control_type: '',
// // // //     control_Family_Id: '',
// // // //   });
// // // //   const [editingControl, setEditingControl] = useState(null);
// // // //   const [editControl, setEditControl] = useState({
// // // //     fixed_id: '',
// // // //     section: '',
// // // //     section_main_desc: '',
// // // //     section_desc: '',
// // // //     control_type: '',
// // // //     control_Family_Id: '',
// // // //   });
// // // //   const [page, setPage] = useState(0);
// // // //   const [rowsPerPage, setRowsPerPage] = useState(5);
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     const fetchControls = async () => {
// // // //       try {
// // // //         const response = await axios.get('http://localhost:8021/api/v1/controls');
// // // //         setControls(response.data);
// // // //       } catch (error) {
// // // //         console.error('Error fetching controls:', error);
// // // //       }
// // // //     };

// // // //     const fetchControlFamilies = async () => {
// // // //       try {
// // // //         const response = await axios.get('http://localhost:8021/api/v1/control-families');
// // // //         setControlFamilies(response.data);
// // // //       } catch (error) {
// // // //         console.error('Error fetching control families:', error);
// // // //       }
// // // //     };

// // // //     const fetchData = async () => {
// // // //       setLoading(true); // Set loading to true before fetching data
// // // //       try {
// // // //         await Promise.all([fetchControls(), fetchControlFamilies()]);
// // // //       } finally {
// // // //         setLoading(false); // Set loading to false after fetching data
// // // //       }
// // // //     };

// // // //     fetchData();
// // // //   }, []);

// // // //   const handleAddControl = async () => {
// // // //     try {
// // // //       const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// // // //       setControls([...controls, response.data]);
// // // //       setNewControl({
// // // //         fixed_id: '',
// // // //         section: '',
// // // //         section_main_desc: '',
// // // //         section_desc: '',
// // // //         control_type: '',
// // // //         control_Family_Id: '',
// // // //       });
// // // //     } catch (error) {
// // // //       console.error('Error adding control:', error.response ? error.response.data : error.message);
// // // //     }
// // // //   };

// // // //   const handleEditControl = async () => {
// // // //     try {
// // // //       await axios.put(`http://localhost:8021/api/v1/controls/${editingControl._id}`, editControl);
// // // //       setControls(controls.map(control =>
// // // //         control._id === editingControl._id ? { ...control, ...editControl } : control
// // // //       ));
// // // //       setEditingControl(null);
// // // //       setEditControl({
// // // //         fixed_id: '',
// // // //         section: '',
// // // //         section_main_desc: '',
// // // //         section_desc: '',
// // // //         control_type: '',
// // // //         control_Family_Id: '',
// // // //       });
// // // //     } catch (error) {
// // // //       console.error('Error updating control:', error.response ? error.response.data : error.message);
// // // //     }
// // // //   };

// // // //   const handleDeleteControl = async (id) => {
// // // //     try {
// // // //       await axios.delete(`http://localhost:8021/api/v1/controls/${id}`);
// // // //       setControls(controls.filter(control => control._id !== id));
// // // //     } catch (error) {
// // // //       console.error('Error deleting control:', error.response ? error.response.data : error.message);
// // // //     }
// // // //   };

// // // //   const handleChangePage = (event, newPage) => {
// // // //     setPage(newPage);
// // // //   };

// // // //   const handleChangeRowsPerPage = (event) => {
// // // //     setRowsPerPage(parseInt(event.target.value, 10));
// // // //     setPage(0);
// // // //   };

// // // //   if (loading) {
// // // //     return <Loading />; // Show the loading animation while data is loading
// // // //   }

// // // //   return (
// // // //     <div className="p-4">
// // // //       <div className="control-form">
// // // //         <form onSubmit={(e) => {
// // // //           e.preventDefault();
// // // //           editingControl ? handleEditControl() : handleAddControl();
// // // //         }}>
// // // //           <TextField
// // // //             label="Control ID"
// // // //             value={editingControl ? editControl.fixed_id : newControl.fixed_id}
// // // //             onChange={(e) => editingControl
// // // //               ? setEditControl({ ...editControl, fixed_id: e.target.value })
// // // //               : setNewControl({ ...newControl, fixed_id: e.target.value })}
// // // //             required
// // // //             fullWidth
// // // //             margin="normal"
// // // //           />
// // // //           <TextField
// // // //             label="Section"
// // // //             value={editingControl ? editControl.section : newControl.section}
// // // //             onChange={(e) => editingControl
// // // //               ? setEditControl({ ...editControl, section: e.target.value })
// // // //               : setNewControl({ ...newControl, section: e.target.value })}
// // // //             required
// // // //             fullWidth
// // // //             margin="normal"
// // // //           />
// // // //           <TextField
// // // //             label="Section Main Description"
// // // //             value={editingControl ? editControl.section_main_desc : newControl.section_main_desc}
// // // //             onChange={(e) => editingControl
// // // //               ? setEditControl({ ...editControl, section_main_desc: e.target.value })
// // // //               : setNewControl({ ...newControl, section_main_desc: e.target.value })}
// // // //             required
// // // //             fullWidth
// // // //             margin="normal"
// // // //           />
// // // //           <TextField
// // // //             label="Section Description"
// // // //             value={editingControl ? editControl.section_desc : newControl.section_desc}
// // // //             onChange={(e) => editingControl
// // // //               ? setEditControl({ ...editControl, section_desc: e.target.value })
// // // //               : setNewControl({ ...newControl, section_desc: e.target.value })}
// // // //             fullWidth
// // // //             margin="normal"
// // // //           />
// // // //           <FormControl fullWidth margin="normal">
// // // //             <InputLabel>Control Type</InputLabel>
// // // //             <Select
// // // //               value={editingControl ? editControl.control_type : newControl.control_type}
// // // //               onChange={(e) => editingControl
// // // //                 ? setEditControl({ ...editControl, control_type: e.target.value })
// // // //                 : setNewControl({ ...newControl, control_type: e.target.value })}
// // // //               required
// // // //             >
// // // //               <MenuItem value="" disabled>Select Control Type</MenuItem>
// // // //               <MenuItem value="I">I</MenuItem>
// // // //               <MenuItem value="T">T</MenuItem>
// // // //             </Select>
// // // //           </FormControl>
// // // //           <FormControl fullWidth margin="normal">
// // // //             <InputLabel>Control Family</InputLabel>
// // // //             <Select
// // // //               value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
// // // //               onChange={(e) => editingControl
// // // //                 ? setEditControl({ ...editControl, control_Family_Id: e.target.value })
// // // //                 : setNewControl({ ...newControl, control_Family_Id: e.target.value })}
// // // //               required
// // // //             >
// // // //               <MenuItem value="" disabled>Select Control Family</MenuItem>
// // // //               {controlFamilies.map((cf) => (
// // // //                 <MenuItem key={cf._id} value={cf._id}>{cf.name}</MenuItem>
// // // //               ))}
// // // //             </Select>
// // // //           </FormControl>
// // // //           <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '10px' }}>
// // // //             {editingControl ? 'Save' : 'Add'}
// // // //           </Button>
// // // //           {editingControl && <Button type="button" variant="outlined" color="secondary" fullWidth style={{ marginTop: '10px' }} onClick={() => { setEditingControl(null); setEditControl({ fixed_id: '', section: '', section_main_desc: '', section_desc: '', control_type: '', control_Family_Id: '' }); }}>Cancel</Button>}
// // // //         </form>
// // // //       </div>
// // // //       <TableContainer component={Paper}>
// // // //         <Table>
// // // //           <TableHead>
// // // //             <TableRow>
// // // //               <TableCell>Control ID</TableCell>
// // // //               <TableCell>Section</TableCell>
// // // //               <TableCell>Section Main Description</TableCell>
// // // //               <TableCell>Section Description</TableCell>
// // // //               <TableCell>Control Type</TableCell>
// // // //               <TableCell>Control Family</TableCell>
// // // //               <TableCell>Actions</TableCell>
// // // //             </TableRow>
// // // //           </TableHead>
// // // //           <TableBody>
// // // //             {controls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((control) => (
// // // //               <TableRow key={control._id}>
// // // //                 <TableCell>{control.fixed_id}</TableCell>
// // // //                 <TableCell>{control.section}</TableCell>
// // // //                 <TableCell>{control.section_main_desc}</TableCell>
// // // //                 <TableCell>{control.section_desc}</TableCell>
// // // //                 <TableCell>{control.control_type}</TableCell>
// // // //                 {/* <TableCell>{control.control_Family_Id.name}</TableCell> */}
// // // //                 <TableCell>
// // // //   {control.control_Family_Id ? control.control_Family_Id.name : 'N/A'}
// // // // </TableCell>

// // // //                 <TableCell>
// // // //                   <Button
// // // //                     variant="contained"
// // // //                     color="primary"
// // // //                     onClick={() => { setEditingControl(control); setEditControl(control); }}
// // // //                     style={{ marginRight: '10px' }}
// // // //                   >
// // // //                     Edit
// // // //                   </Button>
// // // //                   <Button
// // // //                     variant="contained"
// // // //                     color="secondary"
// // // //                     onClick={() => handleDeleteControl(control._id)}
// // // //                   >
// // // //                     Delete
// // // //                   </Button>
// // // //                 </TableCell>
// // // //               </TableRow>
// // // //             ))}
// // // //           </TableBody>
// // // //         </Table>
// // // //       </TableContainer>
// // // //       <TablePagination
// // // //         rowsPerPageOptions={[5, 10, 15]}
// // // //         component="div"
// // // //         count={controls.length}
// // // //         rowsPerPage={rowsPerPage}
// // // //         page={page}
// // // //         onPageChange={handleChangePage}
// // // //         onRowsPerPageChange={handleChangeRowsPerPage}
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ControlsPage;

// // // // // import React, { useEffect, useState } from 'react';
// // // // // import axios from 'axios';
// // // // // import Table from '@mui/material/Table';
// // // // // import TableBody from '@mui/material/TableBody';
// // // // // import TableCell from '@mui/material/TableCell';
// // // // // import TableContainer from '@mui/material/TableContainer';
// // // // // import TableHead from '@mui/material/TableHead';
// // // // // import TableRow from '@mui/material/TableRow';
// // // // // import Paper from '@mui/material/Paper';
// // // // // import TablePagination from '@mui/material/TablePagination';
// // // // // import Button from '@mui/material/Button';
// // // // // import TextField from '@mui/material/TextField';
// // // // // import Select from '@mui/material/Select';
// // // // // import MenuItem from '@mui/material/MenuItem';
// // // // // import FormControl from '@mui/material/FormControl';
// // // // // import InputLabel from '@mui/material/InputLabel';
// // // // // import Loading from '../components/Loading'; // Import the Loading component

// // // // // const ControlsPage = () => {
// // // // //   const [controls, setControls] = useState([]);
// // // // //   const [controlFamilies, setControlFamilies] = useState([]);
// // // // //   const [newControl, setNewControl] = useState({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // //   const [editingControl, setEditingControl] = useState(null);
// // // // //   const [editControl, setEditControl] = useState({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // //   const [page, setPage] = useState(0);
// // // // //   const [rowsPerPage, setRowsPerPage] = useState(5);
// // // // //   const [loading, setLoading] = useState(true);

// // // // //   useEffect(() => {
// // // // //     const fetchControls = async () => {
// // // // //       try {
// // // // //         const response = await axios.get('http://localhost:8021/api/v1/controls');
// // // // //         setControls(response.data);
// // // // //       } catch (error) {
// // // // //         console.error('Error fetching controls:', error);
// // // // //       }
// // // // //     };

// // // // //     const fetchControlFamilies = async () => {
// // // // //       try {
// // // // //         const response = await axios.get('http://localhost:8021/api/v1/control-families');
// // // // //         setControlFamilies(response.data);
// // // // //       } catch (error) {
// // // // //         console.error('Error fetching control families:', error);
// // // // //       }
// // // // //     };

// // // // //     const fetchData = async () => {
// // // // //       setLoading(true); // Set loading to true before fetching data
// // // // //       try {
// // // // //         await Promise.all([fetchControls(), fetchControlFamilies()]);
// // // // //       } finally {
// // // // //         setLoading(false); // Set loading to false after fetching data
// // // // //       }
// // // // //     };

// // // // //     fetchData();
// // // // //   }, []);

// // // // //   // const handleAddControl = async () => {
// // // // //   //   try {
// // // // //   //     const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// // // // //   //     setControls([...controls, response.data]);
// // // // //   //     setNewControl({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // //   //   } catch (error) {
// // // // //   //     console.error('Error adding control:', error.response ? error.response.data : error.message);
// // // // //   //   }
// // // // //   // };

// // // // //     const handleAddControl = async () => {
// // // // //     try {
// // // // //       const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// // // // //       setControls([...controls, response.data]);
// // // // //       setNewControl({ control_Id: '', name: '', description: '', control_Family_Id: '', criticality: '' });
// // // // //     } catch (error) {
// // // // //       console.error('Error adding control:', error.response ? error.response.data : error.message);
// // // // //     }
// // // // //   };
// // // // //   const handleEditControl = async () => {
// // // // //     try {
// // // // //       await axios.put(`http://localhost:8021/api/v1/controls/${editingControl._id}`, editControl);
// // // // //       setControls(controls.map(control =>
// // // // //         control._id === editingControl._id ? { ...control, ...editControl } : control
// // // // //       ));
// // // // //       setEditingControl(null);
// // // // //       setEditControl({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // //     } catch (error) {
// // // // //       console.error('Error updating control:', error.response ? error.response.data : error.message);
// // // // //     }
// // // // //   };

// // // // //   const handleDeleteControl = async (id) => {
// // // // //     try {
// // // // //       await axios.delete(`http://localhost:8021/api/v1/controls/${id}`);
// // // // //       setControls(controls.filter(control => control._id !== id));
// // // // //     } catch (error) {
// // // // //       console.error('Error deleting control:', error.response ? error.response.data : error.message);
// // // // //     }
// // // // //   };

// // // // //   const handleChangePage = (event, newPage) => {
// // // // //     setPage(newPage);
// // // // //   };

// // // // //   const handleChangeRowsPerPage = (event) => {
// // // // //     setRowsPerPage(parseInt(event.target.value, 10));
// // // // //     setPage(0);
// // // // //   };

// // // // //   if (loading) {
// // // // //     return <Loading />; // Show the loading animation while data is loading
// // // // //   }

// // // // //   return (
// // // // //     <div className="p-4">
// // // // //       <div className="control-form">
// // // // //         <form onSubmit={(e) => {
// // // // //           e.preventDefault();
// // // // //           editingControl ? handleEditControl() : handleAddControl();
// // // // //         }}>
// // // // //           <TextField
// // // // //             label="Control ID"
// // // // //             value={editingControl ? editControl.control_Id : newControl.control_Id}
// // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, control_Id: e.target.value }) : setNewControl({ ...newControl, control_Id: e.target.value })}
// // // // //             required
// // // // //             fullWidth
// // // // //             margin="normal"
// // // // //           />
// // // // //           <TextField
// // // // //             label="Name"
// // // // //             value={editingControl ? editControl.name : newControl.name}
// // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, name: e.target.value }) : setNewControl({ ...newControl, name: e.target.value })}
// // // // //             required
// // // // //             fullWidth
// // // // //             margin="normal"
// // // // //           />
// // // // //           <TextField
// // // // //             label="Description"
// // // // //             value={editingControl ? editControl.description : newControl.description}
// // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, description: e.target.value }) : setNewControl({ ...newControl, description: e.target.value })}
// // // // //             fullWidth
// // // // //             margin="normal"
// // // // //           />
// // // // //           <FormControl fullWidth margin="normal">
// // // // //             <InputLabel>Control Family</InputLabel>
// // // // //             <Select
// // // // //               value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
// // // // //               onChange={(e) => editingControl ? setEditControl({ ...editControl, control_Family_Id: e.target.value }) : setNewControl({ ...newControl, control_Family_Id: e.target.value })}
// // // // //               required
// // // // //             >
// // // // //               <MenuItem value="" disabled>Select Control Family</MenuItem>
// // // // //               {controlFamilies.map((cf) => (
// // // // //                 <MenuItem key={cf._id} value={cf._id}>{cf.name}</MenuItem>
// // // // //               ))}
// // // // //             </Select>
// // // // //           </FormControl>
// // // // //           <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '10px' }}>
// // // // //             {editingControl ? 'Save' : 'Add'}
// // // // //           </Button>
// // // // //           {editingControl && <Button type="button" variant="outlined" color="secondary" fullWidth style={{ marginTop: '10px' }} onClick={() => { setEditingControl(null); setEditControl({ control_Id: '', name: '', description: '', control_Family_Id: '' }); }}>Cancel</Button>}
// // // // //         </form>
// // // // //       </div>
// // // // //       <TableContainer component={Paper}>
// // // // //         <Table>
// // // // //           <TableHead>
// // // // //             <TableRow>
// // // // //               <TableCell>Control ID</TableCell>
// // // // //               <TableCell>Name</TableCell>
// // // // //               <TableCell>Description</TableCell>
// // // // //               <TableCell>criticality</TableCell>
// // // // //               <TableCell>Control Family</TableCell>
// // // // //               <TableCell>Actions</TableCell>
// // // // //             </TableRow>
// // // // //           </TableHead>
// // // // //           <TableBody>
// // // // //             {controls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((control) => (
// // // // //               <TableRow key={control._id}>
// // // // //                 <TableCell>{control.control_Id}</TableCell>
// // // // //                 <TableCell>{control.name}</TableCell>
// // // // //                 <TableCell>{control.description}</TableCell>
// // // // //                 <TableCell>{control.criticality}</TableCell>
// // // // //                 <TableCell>{control.control_Family_Id.name}</TableCell>
// // // // //                 <TableCell>
// // // // //                   <Button
// // // // //                     variant="contained"
// // // // //                     color="primary"
// // // // //                     onClick={() => { setEditingControl(control); setEditControl(control); }}
// // // // //                     disabled={control.isDPDPA}
// // // // //                     style={{ marginRight: '10px' }}
// // // // //                   >
// // // // //                     Edit
// // // // //                   </Button>
// // // // //                   <Button
// // // // //                     variant="contained"
// // // // //                     color="secondary"
// // // // //                     onClick={() => handleDeleteControl(control._id)}
// // // // //                     disabled={control.isDPDPA}
// // // // //                   >
// // // // //                     Delete
// // // // //                   </Button>
// // // // //                 </TableCell>
// // // // //               </TableRow>
// // // // //             ))}
// // // // //           </TableBody>
// // // // //         </Table>
// // // // //       </TableContainer>
// // // // //       <TablePagination
// // // // //         rowsPerPageOptions={[5, 10, 15]}
// // // // //         component="div"
// // // // //         count={controls.length}
// // // // //         rowsPerPage={rowsPerPage}
// // // // //         page={page}
// // // // //         onPageChange={handleChangePage}
// // // // //         onRowsPerPageChange={handleChangeRowsPerPage}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default ControlsPage;

// // // // // // import React, { useEffect, useState } from 'react';
// // // // // // import axios from 'axios';
// // // // // // import Table from '@mui/material/Table';
// // // // // // import TableBody from '@mui/material/TableBody';
// // // // // // import TableCell from '@mui/material/TableCell';
// // // // // // import TableContainer from '@mui/material/TableContainer';
// // // // // // import TableHead from '@mui/material/TableHead';
// // // // // // import TableRow from '@mui/material/TableRow';
// // // // // // import Paper from '@mui/material/Paper';
// // // // // // import TablePagination from '@mui/material/TablePagination';
// // // // // // import Button from '@mui/material/Button';
// // // // // // import TextField from '@mui/material/TextField';
// // // // // // import Select from '@mui/material/Select';
// // // // // // import MenuItem from '@mui/material/MenuItem';
// // // // // // import FormControl from '@mui/material/FormControl';
// // // // // // import InputLabel from '@mui/material/InputLabel';

// // // // // // const ControlsPage = () => {
// // // // // //   const [controls, setControls] = useState([]);
// // // // // //   const [controlFamilies, setControlFamilies] = useState([]);
// // // // // //   const [newControl, setNewControl] = useState({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // // //   const [editingControl, setEditingControl] = useState(null);
// // // // // //   const [editControl, setEditControl] = useState({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // // //   const [page, setPage] = useState(0);
// // // // // //   const [rowsPerPage, setRowsPerPage] = useState(5);

// // // // // //   useEffect(() => {
// // // // // //     const fetchControls = async () => {
// // // // // //       try {
// // // // // //         const response = await axios.get('http://localhost:8021/api/v1/controls');
// // // // // //         setControls(response.data);
// // // // // //       } catch (error) {
// // // // // //         console.error('Error fetching controls:', error);
// // // // // //       }
// // // // // //     };

// // // // // //     const fetchControlFamilies = async () => {
// // // // // //       try {
// // // // // //         const response = await axios.get('http://localhost:8021/api/v1/control-families');
// // // // // //         setControlFamilies(response.data);
// // // // // //       } catch (error) {
// // // // // //         console.error('Error fetching control families:', error);
// // // // // //       }
// // // // // //     };

// // // // // //     fetchControls();
// // // // // //     fetchControlFamilies();
// // // // // //   }, []);

// // // // // //   const handleAddControl = async () => {
// // // // // //     try {
// // // // // //       const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// // // // // //       setControls([...controls, response.data]);
// // // // // //       setNewControl({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // // //     } catch (error) {
// // // // // //       console.error('Error adding control:', error.response ? error.response.data : error.message);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleEditControl = async () => {
// // // // // //     try {
// // // // // //       await axios.put(`http://localhost:8021/api/v1/controls/${editingControl._id}`, editControl);
// // // // // //       setControls(controls.map(control =>
// // // // // //         control._id === editingControl._id ? { ...control, ...editControl } : control
// // // // // //       ));
// // // // // //       setEditingControl(null);
// // // // // //       setEditControl({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // // //     } catch (error) {
// // // // // //       console.error('Error updating control:', error.response ? error.response.data : error.message);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleDeleteControl = async (id) => {
// // // // // //     try {
// // // // // //       await axios.delete(`http://localhost:8021/api/v1/controls/${id}`);
// // // // // //       setControls(controls.filter(control => control._id !== id));
// // // // // //     } catch (error) {
// // // // // //       console.error('Error deleting control:', error.response ? error.response.data : error.message);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleChangePage = (event, newPage) => {
// // // // // //     setPage(newPage);
// // // // // //   };

// // // // // //   const handleChangeRowsPerPage = (event) => {
// // // // // //     setRowsPerPage(parseInt(event.target.value, 10));
// // // // // //     setPage(0);
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="p-4">
// // // // // //       {/* <h2>Controls</h2> */}
// // // // // //       <div className="control-form">
// // // // // //         {/* <h3>{editingControl ? 'Edit Control' : 'Add New Control'}</h3> */}
// // // // // //         <form onSubmit={(e) => {
// // // // // //           e.preventDefault();
// // // // // //           editingControl ? handleEditControl() : handleAddControl();
// // // // // //         }}>
// // // // // //           <TextField
// // // // // //             label="Control ID"
// // // // // //             value={editingControl ? editControl.control_Id : newControl.control_Id}
// // // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, control_Id: e.target.value }) : setNewControl({ ...newControl, control_Id: e.target.value })}
// // // // // //             required
// // // // // //             fullWidth
// // // // // //             margin="normal"
// // // // // //           />
// // // // // //           <TextField
// // // // // //             label="Name"
// // // // // //             value={editingControl ? editControl.name : newControl.name}
// // // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, name: e.target.value }) : setNewControl({ ...newControl, name: e.target.value })}
// // // // // //             required
// // // // // //             fullWidth
// // // // // //             margin="normal"
// // // // // //           />
// // // // // //           <TextField
// // // // // //             label="Description"
// // // // // //             value={editingControl ? editControl.description : newControl.description}
// // // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, description: e.target.value }) : setNewControl({ ...newControl, description: e.target.value })}
// // // // // //             fullWidth
// // // // // //             margin="normal"
// // // // // //           />
// // // // // //           <FormControl fullWidth margin="normal">
// // // // // //             <InputLabel>Control Family</InputLabel>
// // // // // //             <Select
// // // // // //               value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
// // // // // //               onChange={(e) => editingControl ? setEditControl({ ...editControl, control_Family_Id: e.target.value }) : setNewControl({ ...newControl, control_Family_Id: e.target.value })}
// // // // // //               required
// // // // // //             >
// // // // // //               <MenuItem value="" disabled>Select Control Family</MenuItem>
// // // // // //               {controlFamilies.map((cf) => (
// // // // // //                 <MenuItem key={cf._id} value={cf._id}>{cf.name}</MenuItem>
// // // // // //               ))}
// // // // // //             </Select>
// // // // // //           </FormControl>
// // // // // //           <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '10px' }}>
// // // // // //             {editingControl ? 'Save' : 'Add'}
// // // // // //           </Button>
// // // // // //           {editingControl && <Button type="button" variant="outlined" color="secondary" fullWidth style={{ marginTop: '10px' }} onClick={() => { setEditingControl(null); setEditControl({ control_Id: '', name: '', description: '', control_Family_Id: '' }); }}>Cancel</Button>}
// // // // // //         </form>
// // // // // //       </div>
// // // // // //       <TableContainer component={Paper}>
// // // // // //         <Table>
// // // // // //           <TableHead>
// // // // // //             <TableRow>
// // // // // //               <TableCell>Control ID</TableCell>
// // // // // //               <TableCell>Name</TableCell>
// // // // // //               <TableCell>Description</TableCell>
// // // // // //               <TableCell>Control Family</TableCell>
// // // // // //               <TableCell>Actions</TableCell>
// // // // // //             </TableRow>
// // // // // //           </TableHead>
// // // // // //           <TableBody>
// // // // // //             {controls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((control) => (
// // // // // //               <TableRow key={control._id}>
// // // // // //                 <TableCell>{control.control_Id}</TableCell>
// // // // // //                 <TableCell>{control.name}</TableCell>
// // // // // //                 <TableCell>{control.description}</TableCell>
// // // // // //                 <TableCell>{control.control_Family_Id.name}</TableCell>
// // // // // //                 <TableCell>
// // // // // //                   <Button
// // // // // //                     variant="contained"
// // // // // //                     color="primary"
// // // // // //                     onClick={() => { setEditingControl(control); setEditControl(control); }}
// // // // // //                     disabled={control.isDPDPA}
// // // // // //                     style={{ marginRight: '10px' }}
// // // // // //                   >
// // // // // //                     Edit
// // // // // //                   </Button>
// // // // // //                   <Button
// // // // // //                     variant="contained"
// // // // // //                     color="secondary"
// // // // // //                     onClick={() => handleDeleteControl(control._id)}
// // // // // //                     disabled={control.isDPDPA}
// // // // // //                   >
// // // // // //                     Delete
// // // // // //                   </Button>
// // // // // //                 </TableCell>
// // // // // //               </TableRow>
// // // // // //             ))}
// // // // // //           </TableBody>
// // // // // //         </Table>
// // // // // //       </TableContainer>
// // // // // //       <TablePagination
// // // // // //         rowsPerPageOptions={[5, 10, 15]}
// // // // // //         component="div"
// // // // // //         count={controls.length}
// // // // // //         rowsPerPage={rowsPerPage}
// // // // // //         page={page}
// // // // // //         onPageChange={handleChangePage}
// // // // // //         onRowsPerPageChange={handleChangeRowsPerPage}
// // // // // //       />
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default ControlsPage;

// // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // import axios from 'axios';
// // // // // // // import './ControlsPage.css';

// // // // // // // const ControlsPage = () => {
// // // // // // //   const [controls, setControls] = useState([]);
// // // // // // //   const [controlFamilies, setControlFamilies] = useState([]);
// // // // // // //   const [newControl, setNewControl] = useState({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // // // //   const [editingControl, setEditingControl] = useState(null);
// // // // // // //   const [editControl, setEditControl] = useState({ control_Id: '', name: '', description: '', control_Family_Id: '' });

// // // // // // //   useEffect(() => {
// // // // // // //     const fetchControls = async () => {
// // // // // // //       try {
// // // // // // //         const response = await axios.get('http://localhost:8021/api/v1/controls');
// // // // // // //         setControls(response.data);
// // // // // // //       } catch (error) {
// // // // // // //         console.error('Error fetching controls:', error);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     const fetchControlFamilies = async () => {
// // // // // // //       try {
// // // // // // //         const response = await axios.get('http://localhost:8021/api/v1/control-families');
// // // // // // //         setControlFamilies(response.data);
// // // // // // //       } catch (error) {
// // // // // // //         console.error('Error fetching control families:', error);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     fetchControls();
// // // // // // //     fetchControlFamilies();
// // // // // // //   }, []);

// // // // // // //   const handleAddControl = async () => {
// // // // // // //     try {
// // // // // // //       const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// // // // // // //       setControls([...controls, response.data]);
// // // // // // //       setNewControl({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Error adding control:', error.response ? error.response.data : error.message);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleEditControl = async () => {
// // // // // // //     try {
// // // // // // //       await axios.put(`http://localhost:8021/api/v1/controls/${editingControl._id}`, editControl);
// // // // // // //       setControls(controls.map(control =>
// // // // // // //         control._id === editingControl._id ? { ...control, ...editControl } : control
// // // // // // //       ));
// // // // // // //       setEditingControl(null);
// // // // // // //       setEditControl({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Error updating control:', error.response ? error.response.data : error.message);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleDeleteControl = async (id) => {
// // // // // // //     try {
// // // // // // //       await axios.delete(`http://localhost:8021/api/v1/controls/${id}`);
// // // // // // //       setControls(controls.filter(control => control._id !== id));
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Error deleting control:', error.response ? error.response.data : error.message);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className="controls-container">
// // // // // // //       <h2>Controls</h2>

// // // // // // //       <div className="control-form">
// // // // // // //         <h3>{editingControl ? 'Edit Control' : 'Add New Control'}</h3>
// // // // // // //         <form onSubmit={(e) => {
// // // // // // //           e.preventDefault();
// // // // // // //           editingControl ? handleEditControl() : handleAddControl();
// // // // // // //         }}>
// // // // // // //           <input
// // // // // // //             type="text"
// // // // // // //             value={editingControl ? editControl.control_Id : newControl.control_Id}
// // // // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, control_Id: e.target.value }) : setNewControl({ ...newControl, control_Id: e.target.value })}
// // // // // // //             placeholder="Control ID"
// // // // // // //             required
// // // // // // //           />
// // // // // // //           <input
// // // // // // //             type="text"
// // // // // // //             value={editingControl ? editControl.name : newControl.name}
// // // // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, name: e.target.value }) : setNewControl({ ...newControl, name: e.target.value })}
// // // // // // //             placeholder="Name"
// // // // // // //             required
// // // // // // //           />
// // // // // // //           <input
// // // // // // //             type="text"
// // // // // // //             value={editingControl ? editControl.description : newControl.description}
// // // // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, description: e.target.value }) : setNewControl({ ...newControl, description: e.target.value })}
// // // // // // //             placeholder="Description"
// // // // // // //           />
// // // // // // //           <select
// // // // // // //             value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
// // // // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, control_Family_Id: e.target.value }) : setNewControl({ ...newControl, control_Family_Id: e.target.value })}
// // // // // // //             required
// // // // // // //           >
// // // // // // //             <option value="" disabled>Select Control Family</option>
// // // // // // //             {controlFamilies.map((cf) => (
// // // // // // //               <option key={cf._id} value={cf._id}>{cf.name}</option>
// // // // // // //             ))}
// // // // // // //           </select>
// // // // // // //           <button type="submit" className="submit-button">{editingControl ? 'Save' : 'Add'}</button>
// // // // // // //           {editingControl && <button type="button" className="cancel-button" onClick={() => { setEditingControl(null); setEditControl({ control_Id: '', name: '', description: '', control_Family_Id: '' }); }}>Cancel</button>}
// // // // // // //         </form>
// // // // // // //       </div>
// // // // // // //       <table className="controls-table">
// // // // // // //         <thead>
// // // // // // //           <tr>
// // // // // // //             <th>Control ID</th>
// // // // // // //             <th>Name</th>
// // // // // // //             <th>Description</th>
// // // // // // //             <th>Control Family</th>
// // // // // // //             <th>Actions</th>
// // // // // // //           </tr>
// // // // // // //         </thead>
// // // // // // //         <tbody>
// // // // // // //           {controls.map((control) => (
// // // // // // //             <tr key={control._id}>
// // // // // // //               <td>{control.control_Id}</td>
// // // // // // //               <td>{control.name}</td>
// // // // // // //               <td>{control.description}</td>
// // // // // // //               <td>{control.control_Family_Id.name}</td>
// // // // // // //               <td>
// // // // // // //                 <button
// // // // // // //                   className="edit-button"
// // // // // // //                   onClick={() => { setEditingControl(control); setEditControl(control); }}
// // // // // // //                   disabled={control.isDPDPA}
// // // // // // //                 >
// // // // // // //                   Edit
// // // // // // //                 </button>
// // // // // // //                 <button
// // // // // // //                   className="delete-button"
// // // // // // //                   onClick={() => handleDeleteControl(control._id)}
// // // // // // //                   disabled={control.isDPDPA}
// // // // // // //                 >
// // // // // // //                   Delete
// // // // // // //                 </button>
// // // // // // //               </td>
// // // // // // //             </tr>
// // // // // // //           ))}
// // // // // // //         </tbody>
// // // // // // //       </table>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default ControlsPage;

// // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // import axios from 'axios';
// // // // // // // import './ControlsPage.css';

// // // // // // // const ControlsPage = () => {
// // // // // // //   const [controls, setControls] = useState([]);
// // // // // // //   const [controlFamilies, setControlFamilies] = useState([]);
// // // // // // //   const [newControl, setNewControl] = useState({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // // // //   const [editingControl, setEditingControl] = useState(null);
// // // // // // //   const [editControl, setEditControl] = useState({ control_Id: '', name: '', description: '', control_Family_Id: '' });

// // // // // // //   useEffect(() => {
// // // // // // //     const fetchControls = async () => {
// // // // // // //       try {
// // // // // // //         const response = await axios.get('http://localhost:8021/api/v1/controls');
// // // // // // //         setControls(response.data);
// // // // // // //       } catch (error) {
// // // // // // //         console.error('Error fetching controls:', error);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     const fetchControlFamilies = async () => {
// // // // // // //       try {
// // // // // // //         const response = await axios.get('http://localhost:8021/api/v1/control-families');
// // // // // // //         setControlFamilies(response.data);
// // // // // // //       } catch (error) {
// // // // // // //         console.error('Error fetching control families:', error);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     fetchControls();
// // // // // // //     fetchControlFamilies();
// // // // // // //   }, []);

// // // // // // //   const handleAddControl = async () => {
// // // // // // //     try {
// // // // // // //       const response = await axios.post('http://localhost:8021/api/v1/controls', newControl);
// // // // // // //       setControls([...controls, response.data]);
// // // // // // //       setNewControl({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Error adding control:', error.response ? error.response.data : error.message);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleEditControl = async () => {
// // // // // // //     try {
// // // // // // //       await axios.put(`http://localhost:8021/api/v1/controls/${editingControl._id}`, editControl);
// // // // // // //       setControls(controls.map(control =>
// // // // // // //         control._id === editingControl._id ? { ...control, ...editControl } : control
// // // // // // //       ));
// // // // // // //       setEditingControl(null);
// // // // // // //       setEditControl({ control_Id: '', name: '', description: '', control_Family_Id: '' });
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Error updating control:', error.response ? error.response.data : error.message);
// // // // // // //     }
// // // // // // //   };


// // // // // // //   const handleDeleteControl = async (id) => {
// // // // // // //     try {
// // // // // // //       await axios.delete(`http://localhost:8021/api/v1/controls/${id}`);
// // // // // // //       setControls(controls.filter(control => control._id !== id));
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Error deleting control:', error.response ? error.response.data : error.message);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className="controls-container">
// // // // // // //       <h2>Controls</h2>
      
// // // // // // //       <div className="control-form">
// // // // // // //         <h3>{editingControl ? 'Edit Control' : 'Add New Control'}</h3>
// // // // // // //         <form onSubmit={(e) => {
// // // // // // //           e.preventDefault();
// // // // // // //           editingControl ? handleEditControl() : handleAddControl();
// // // // // // //         }}>
// // // // // // //           <input
// // // // // // //             type="text"
// // // // // // //             value={editingControl ? editControl.control_Id : newControl.control_Id}
// // // // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, control_Id: e.target.value }) : setNewControl({ ...newControl, control_Id: e.target.value })}
// // // // // // //             placeholder="Control ID"
// // // // // // //             required
// // // // // // //           />
// // // // // // //           <input
// // // // // // //             type="text"
// // // // // // //             value={editingControl ? editControl.name : newControl.name}
// // // // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, name: e.target.value }) : setNewControl({ ...newControl, name: e.target.value })}
// // // // // // //             placeholder="Name"
// // // // // // //             required
// // // // // // //           />
// // // // // // //           <input
// // // // // // //             type="text"
// // // // // // //             value={editingControl ? editControl.description : newControl.description}
// // // // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, description: e.target.value }) : setNewControl({ ...newControl, description: e.target.value })}
// // // // // // //             placeholder="Description"
// // // // // // //           />
// // // // // // //           <select
// // // // // // //             value={editingControl ? editControl.control_Family_Id : newControl.control_Family_Id}
// // // // // // //             onChange={(e) => editingControl ? setEditControl({ ...editControl, control_Family_Id: e.target.value }) : setNewControl({ ...newControl, control_Family_Id: e.target.value })}
// // // // // // //             required
// // // // // // //           >
// // // // // // //             <option value="" disabled>Select Control Family</option>
// // // // // // //             {controlFamilies.map((cf) => (
// // // // // // //               <option key={cf._id} value={cf._id}>{cf.name}</option>
// // // // // // //             ))}
// // // // // // //           </select>
// // // // // // //           <button type="submit" className="submit-button">{editingControl ? 'Save' : 'Add'}</button>
// // // // // // //           {editingControl && <button type="button" className="cancel-button" onClick={() => { setEditingControl(null); setEditControl({ control_Id: '', name: '', description: '', control_Family_Id: '' }); }}>Cancel</button>}
// // // // // // //         </form>
// // // // // // //       </div>
// // // // // // //       <table className="controls-table">
// // // // // // //         <thead>
// // // // // // //           <tr>
// // // // // // //             <th>Control ID</th>
// // // // // // //             <th>Name</th>
// // // // // // //             <th>Description</th>
// // // // // // //             <th>Control Family</th>
// // // // // // //             <th>Actions</th>
// // // // // // //           </tr>
// // // // // // //         </thead>
// // // // // // //         <tbody>
// // // // // // //           {controls.map((control) => (
// // // // // // //             <tr key={control._id}>
// // // // // // //               <td>{control.control_Id}</td>
// // // // // // //               <td>{control.name}</td>
// // // // // // //               <td>{control.description}</td>
// // // // // // //               <td>{control.control_Family_Id.name}</td>
// // // // // // //               <td>
// // // // // // //                 <button className="edit-button" onClick={() => { setEditingControl(control); setEditControl(control); }}>Edit</button>
// // // // // // //                 <button className="delete-button" onClick={() => handleDeleteControl(control._id)}>Delete</button>
// // // // // // //               </td>
// // // // // // //             </tr>
// // // // // // //           ))}
// // // // // // //         </tbody>
// // // // // // //       </table>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default ControlsPage;
