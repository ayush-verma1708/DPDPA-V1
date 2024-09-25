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
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Loading from '../components/Loading'; // Import the Loading component
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './ControlFamiliesPage.css';

const ControlFamiliesPage = () => {
  const [controlFamilies, setControlFamilies] = useState([]);
  const [newFamily, setNewFamily] = useState({ fixed_id: '', variable_id: '' });
  const [editingFamily, setEditingFamily] = useState(null);
  const [editFamily, setEditFamily] = useState({
    fixed_id: '',
    variable_id: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'

  useEffect(() => {
    const fetchControlFamilies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'http://localhost:8021/api/v1/control-families'
        );
        const sortedFamilies = response.data.sort((a, b) => {
          const numA = parseInt(a.fixed_id.replace(/\D/g, ''), 10);
          const numB = parseInt(b.fixed_id.replace(/\D/g, ''), 10);
          return numA - numB;
        });
        setControlFamilies(sortedFamilies);
      } catch (error) {
        console.error('Error fetching control families:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchControlFamilies();
  }, []);

  const handleOpenModal = (type, family) => {
    setModalType(type);
    if (type === 'edit') {
      setEditingFamily(family);
      setEditFamily({ ...family });
    } else {
      setNewFamily({ fixed_id: '', variable_id: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingFamily(null);
    setEditFamily({ fixed_id: '', variable_id: '' });
  };

  const handleAddFamily = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8021/api/v1/control-families',
        newFamily
      );
      const updatedFamilies = [...controlFamilies, response.data];
      const sortedFamilies = updatedFamilies.sort((a, b) => {
        const numA = parseInt(a.fixed_id.replace(/\D/g, ''), 10);
        const numB = parseInt(b.fixed_id.replace(/\D/g, ''), 10);
        return numA - numB;
      });
      setControlFamilies(sortedFamilies);
      handleCloseModal();
    } catch (error) {
      console.error(
        'Error adding control family:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleEditFamily = async () => {
    try {
      await axios.put(
        `http://localhost:8021/api/v1/control-families/${editingFamily._id}`,
        editFamily
      );
      const updatedFamilies = controlFamilies.map((family) =>
        family._id === editingFamily._id ? { ...family, ...editFamily } : family
      );
      const sortedFamilies = updatedFamilies.sort((a, b) => {
        const numA = parseInt(a.fixed_id.replace(/\D/g, ''), 10);
        const numB = parseInt(b.fixed_id.replace(/\D/g, ''), 10);
        return numA - numB;
      });
      setControlFamilies(sortedFamilies);
      handleCloseModal();
    } catch (error) {
      console.error(
        'Error updating control family:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteFamily = async (id) => {
    try {
      await axios.delete(`http://localhost:8021/api/v1/control-families/${id}`);
      const updatedFamilies = controlFamilies.filter(
        (family) => family._id !== id
      );
      const sortedFamilies = updatedFamilies.sort((a, b) => {
        const numA = parseInt(a.fixed_id.replace(/\D/g, ''), 10);
        const numB = parseInt(b.fixed_id.replace(/\D/g, ''), 10);
        return numA - numB;
      });
      setControlFamilies(sortedFamilies);
    } catch (error) {
      console.error(
        'Error deleting control family:',
        error.response ? error.response.data : error.message
      );
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
    <div className='control-families-container'>
      <Button
        variant='contained'
        color='primary'
        onClick={() => handleOpenModal('add')}
        style={{ marginBottom: '20px' }}
      >
        Add Control Family
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fixed ID</TableCell>
              <TableCell>Variable ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {controlFamilies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cf) => (
                <TableRow key={cf._id}>
                  <TableCell>{cf.fixed_id}</TableCell>
                  <TableCell>{cf.variable_id}</TableCell>
                  <TableCell>
                    {!cf.isDPDPA && (
                      <>
                        <IconButton
                          aria-label='edit'
                          color='primary'
                          onClick={() => handleOpenModal('edit', cf)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label='delete'
                          color='secondary'
                          onClick={() => handleDeleteFamily(cf._id)}
                          style={{ marginLeft: '10px' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>

                  {/* <TableCell>
                    <IconButton
                      aria-label='edit'
                      color='primary'
                      onClick={() => handleOpenModal('edit', cf)}
                      disabled={cf.isDPDPA} // Disable the Edit button if isDPDPA is true
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label='delete'
                      color='secondary'
                      onClick={() => handleDeleteFamily(cf._id)}
                      style={{ marginLeft: '10px' }}
                      disabled={cf.isDPDPA} // Disable the Delete button if isDPDPA is true
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component='div'
        count={controlFamilies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for Add/Edit */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        <Box className='modal-content'>
          <h2 id='modal-title'>
            {modalType === 'add' ? 'Add Control Family' : 'Edit Control Family'}
          </h2>

          <TextField
            label='Variable ID'
            value={
              modalType === 'edit'
                ? editFamily.variable_id
                : newFamily.variable_id
            }
            onChange={(e) => {
              modalType === 'edit'
                ? setEditFamily({ ...editFamily, variable_id: e.target.value })
                : setNewFamily({ ...newFamily, variable_id: e.target.value });
            }}
            required
            fullWidth
            margin='normal'
          />
          <div className='modal-buttons'>
            <Button
              type='button'
              variant='contained'
              color='primary'
              onClick={() => {
                modalType === 'edit' ? handleEditFamily() : handleAddFamily();
              }}
            >
              {modalType === 'edit' ? 'Save' : 'Add'}
            </Button>
            <Button
              type='button'
              variant='outlined'
              color='secondary'
              onClick={handleCloseModal}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ControlFamiliesPage;

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
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Loading from '../components/Loading'; // Import the Loading component
// import IconButton from '@mui/material/IconButton';

// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import './ControlFamiliesPage.css';

// const ControlFamiliesPage = () => {
//   const [controlFamilies, setControlFamilies] = useState([]);
//   const [newFamily, setNewFamily] = useState({ fixed_id: '', variable_id: '' });
//   const [editingFamily, setEditingFamily] = useState(null);
//   const [editFamily, setEditFamily] = useState({
//     fixed_id: '',
//     variable_id: '',
//   });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [loading, setLoading] = useState(true);
//   const [openModal, setOpenModal] = useState(false);
//   const [modalType, setModalType] = useState('add'); // 'add' or 'edit'

//   useEffect(() => {
//     const fetchControlFamilies = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           'http://localhost:8021/api/v1/control-families'
//         );
//         setControlFamilies(response.data);
//       } catch (error) {
//         console.error('Error fetching control families:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchControlFamilies();
//   }, []);

//   const handleOpenModal = (type, family) => {
//     setModalType(type);
//     if (type === 'edit') {
//       setEditingFamily(family);
//       setEditFamily({ ...family });
//     } else {
//       setNewFamily({ fixed_id: '', variable_id: '' });
//     }
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setEditingFamily(null);
//     setEditFamily({ fixed_id: '', variable_id: '' });
//   };

//   const handleAddFamily = async () => {
//     try {
//       const response = await axios.post(
//         'http://localhost:8021/api/v1/control-families',
//         newFamily
//       );
//       setControlFamilies([...controlFamilies, response.data]);
//       handleCloseModal();
//     } catch (error) {
//       console.error(
//         'Error adding control family:',
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const handleEditFamily = async () => {
//     try {
//       await axios.put(
//         `http://localhost:8021/api/v1/control-families/${editingFamily._id}`,
//         editFamily
//       );
//       setControlFamilies(
//         controlFamilies.map((family) =>
//           family._id === editingFamily._id
//             ? { ...family, ...editFamily }
//             : family
//         )
//       );
//       handleCloseModal();
//     } catch (error) {
//       console.error(
//         'Error updating control family:',
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const handleDeleteFamily = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8021/api/v1/control-families/${id}`);
//       setControlFamilies(controlFamilies.filter((family) => family._id !== id));
//     } catch (error) {
//       console.error(
//         'Error deleting control family:',
//         error.response ? error.response.data : error.message
//       );
//     }
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
//     <div className='control-families-container'>
//       <Button
//         variant='contained'
//         color='primary'
//         onClick={() => handleOpenModal('add')}
//         style={{ marginBottom: '20px' }}
//       >
//         Add Control Family
//       </Button>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Fixed ID</TableCell>
//               <TableCell>Variable ID</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {controlFamilies
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((cf) => (
//                 <TableRow key={cf._id}>
//                   <TableCell>{cf.fixed_id}</TableCell>
//                   <TableCell>{cf.variable_id}</TableCell>
//                   {/* <TableCell>
//                     <Button
//                       variant='contained'
//                       color='primary'
//                       onClick={() => handleOpenModal('edit', cf)}
//                       disabled={cf.isDPDPA} // Disable the Edit button if isDPDPA is true
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant='contained'
//                       color='secondary'
//                       onClick={() => handleDeleteFamily(cf._id)}
//                       style={{ marginLeft: '10px' }}
//                       disabled={cf.isDPDPA} // Disable the Delete button if isDPDPA is true
//                     >
//                       Delete
//                     </Button>
//                   </TableCell> */}
//                   <TableCell>
//                     <IconButton
//                       aria-label='edit'
//                       color='primary'
//                       onClick={() => handleOpenModal('edit', cf)}
//                       disabled={cf.isDPDPA} // Disable the Edit button if isDPDPA is true
//                     >
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       aria-label='delete'
//                       color='secondary'
//                       onClick={() => handleDeleteFamily(cf._id)}
//                       style={{ marginLeft: '10px' }}
//                       disabled={cf.isDPDPA} // Disable the Delete button if isDPDPA is true
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 20]}
//         component='div'
//         count={controlFamilies.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       {/* Modal for Add/Edit */}
//       <Modal
//         open={openModal}
//         onClose={handleCloseModal}
//         aria-labelledby='modal-title'
//         aria-describedby='modal-description'
//       >
//         <Box className='modal-content'>
//           <h2 id='modal-title'>
//             {modalType === 'add' ? 'Add Control Family' : 'Edit Control Family'}
//           </h2>

//           <TextField
//             label='Variable ID'
//             value={
//               modalType === 'edit'
//                 ? editFamily.variable_id
//                 : newFamily.variable_id
//             }
//             onChange={(e) => {
//               modalType === 'edit'
//                 ? setEditFamily({ ...editFamily, variable_id: e.target.value })
//                 : setNewFamily({ ...newFamily, variable_id: e.target.value });
//             }}
//             required
//             fullWidth
//             margin='normal'
//           />
//           <div className='modal-buttons'>
//             <Button
//               type='button'
//               variant='contained'
//               color='primary'
//               onClick={() => {
//                 modalType === 'edit' ? handleEditFamily() : handleAddFamily();
//               }}
//             >
//               {modalType === 'edit' ? 'Save' : 'Add'}
//             </Button>
//             <Button
//               type='button'
//               variant='outlined'
//               color='secondary'
//               onClick={handleCloseModal}
//               style={{ marginLeft: '10px' }}
//             >
//               Cancel
//             </Button>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default ControlFamiliesPage;
