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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Loading from '../components/Loading';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const ControlsPage = () => {
  const [controls, setControls] = useState([]);
  const [controlFamilies, setControlFamilies] = useState([]);
  const [newControl, setNewControl] = useState({
    fixed_id: '',
    section: '',
    section_main_desc: '',
    section_desc: '',
    control_type: '',
    control_Family_Id: '',
    criticality: '',
  });
  const [editingControl, setEditingControl] = useState(null);
  const [editControl, setEditControl] = useState({
    fixed_id: '',
    section: '',
    section_main_desc: '',
    section_desc: '',
    control_type: '',
    control_Family_Id: '',
    criticality: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [modalOpen, setModalOpen] = useState(false);

  // const fetchControls = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8021/api/v1/controls');
  //     const sortedControls = response.data.sort((a, b) => {
  //       const numA = parseInt(a.fixed_id.replace(/\D/g, ''), 10);
  //       const numB = parseInt(b.fixed_id.replace(/\D/g, ''), 10);
  //       return numA - numB;
  //     });
  //     setControls(sortedControls);
  //   } catch (error) {
  //     console.error('Error fetching controls:', error);
  //   }
  // };

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
      const response = await axios.get(
        'http://localhost:8021/api/v1/control-families'
      );
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
    const isValidControlFamily = controlFamilies.some(
      (cf) => cf._id === newControl.control_Family_Id
    );

    if (!isValidControlFamily) {
      setSnackbarMessage('Control family does not exist');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8021/api/v1/controls',
        newControl
      );
      setControls([...controls, response.data]);
      setNewControl({
        fixed_id: '',
        section: '',
        section_main_desc: '',
        section_desc: '',
        control_type: '',
        control_Family_Id: '',
        criticality: '',
      });
      setModalOpen(false);
      setSnackbarMessage('Control added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding control:', error.response?.data);
      setSnackbarMessage(
        error.response?.data?.message || 'Error adding control'
      );
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEditControl = async () => {
    try {
      await axios.put(
        `http://localhost:8021/api/v1/controls/${editingControl._id}`,
        editControl
      );
      setControls(
        controls.map((control) =>
          control._id === editingControl._id
            ? { ...control, ...editControl }
            : control
        )
      );
      setEditingControl(null);
      setEditControl({
        fixed_id: '',
        section: '',
        section_main_desc: '',
        section_desc: '',
        control_type: '',
        control_Family_Id: '',
        criticality: '',
      });
      setModalOpen(false);
      setSnackbarMessage('Control updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        'Error updating control:',
        error.response?.data || error.message
      );
      setSnackbarMessage(
        error.response?.data?.message || 'Error updating control'
      );
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteControl = async (id) => {
    try {
      await axios.delete(`http://localhost:8021/api/v1/controls/${id}`);
      setControls(controls.filter((control) => control._id !== id));
      setSnackbarMessage('Control deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        'Error deleting control:',
        error.response?.data || error.message
      );
      setSnackbarMessage(
        error.response?.data?.message || 'Error deleting control'
      );
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

  const openModal = (control) => {
    if (control) {
      setEditingControl(control);
      setEditControl({ ...control });
    } else {
      setNewControl({
        fixed_id: '',
        section: '',
        section_main_desc: '',
        section_desc: '',
        control_type: '',
        control_Family_Id: '',
        criticality: '',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingControl(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='p-4'>
      <Button
        variant='contained'
        color='primary'
        onClick={() => openModal(null)}
      >
        Add New Control
      </Button>

      <TableContainer
        component={Paper}
        // className='mt-4'
        className='mt-4 table-container'
        style={{ maxHeight: '800px', maxWidth: '100%', overflow: 'auto' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fixed ID</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Section Main Description</TableCell>
              <TableCell>Section Description</TableCell>
              <TableCell>Control Type</TableCell>
              <TableCell>Criticality</TableCell>
              <TableCell>Control Family</TableCell>
              <TableCell>Product Family</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          {/* <TableBody>
            {controls
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((control) => (
                <TableRow key={control._id}>
                  <TableCell>{control.fixed_id}</TableCell>
                  <TableCell>{control.section}</TableCell>
                  <TableCell>{control.section_main_desc}</TableCell>
                  <TableCell>{control.section_desc}</TableCell>
                  <TableCell>{control.control_type}</TableCell>
                  <TableCell>{control.criticality}</TableCell>
                  <TableCell>
                    {
                      controlFamilies.find(
                        (cf) => cf._id === control.control_Family_Id
                      )?.variable_id
                    }
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color='primary'
                      onClick={() => openModal(control)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color='secondary'
                      onClick={() => handleDeleteControl(control._id)}
                      className='ml-2'
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody> */}
          <TableBody>
            {controls
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((control) => (
                <TableRow key={control._id}>
                  <TableCell>{control.fixed_id}</TableCell>
                  <TableCell>{control.section}</TableCell>
                  <TableCell>{control.section_main_desc}</TableCell>
                  <TableCell>{control.section_desc}</TableCell>
                  {/* <TableCell>{control.control_type}</TableCell> */}
                  <TableCell>
                    {control.control_type.toLowerCase() === 'p'
                      ? 'Process'
                      : control.control_type.toLowerCase() === 'd'
                      ? 'Documentation'
                      : control.control_type.toLowerCase() === 't'
                      ? 'Technical'
                      : control.control_type.toLowerCase() === 'i'
                      ? 'Information'
                      : 'Other'}
                  </TableCell>

                  <TableCell>{control.criticality}</TableCell>
                  <TableCell>{control.control_Family_Id.variable_id}</TableCell>

                  <TableCell>
                    {control.product_family_Id?.family_name}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color='primary'
                      onClick={() => openModal(control)}
                      disabled={control.isDPDPA} // Disable if isDPDPA is true
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color='secondary'
                      onClick={() => handleDeleteControl(control._id)}
                      className='ml-2'
                      disabled={control.isDPDPA} // Disable if isDPDPA is true
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  {/* <TableCell>
                    {!control.isDPDPA && (
                      <>
                        <IconButton
                          color='primary'
                          onClick={() => openModal(control)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color='secondary'
                          onClick={() => handleDeleteControl(control._id)}
                          className='ml-2'
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={controls.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>
          {editingControl ? 'Edit Control' : 'Add New Control'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            label='Section'
            name='section'
            value={editingControl ? editControl.section : newControl.section}
            onChange={handleTextChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Section Main Description'
            name='section_main_desc'
            value={
              editingControl
                ? editControl.section_main_desc
                : newControl.section_main_desc
            }
            onChange={handleTextChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Section Description'
            name='section_desc'
            value={
              editingControl
                ? editControl.section_desc
                : newControl.section_desc
            }
            onChange={handleTextChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Control Type'
            name='control_type'
            value={
              editingControl
                ? editControl.control_type
                : newControl.control_type
            }
            onChange={handleTextChange}
            fullWidth
          />
          <FormControl fullWidth margin='normal'>
            <InputLabel>Control Family</InputLabel>
            <Select
              value={
                editingControl
                  ? editControl.control_Family_Id
                  : newControl.control_Family_Id
              }
              onChange={handleSelectChange}
              required
            >
              <MenuItem value='' disabled>
                Select Control Family
              </MenuItem>
              {controlFamilies.map((cf) => (
                <MenuItem key={cf._id} value={cf._id}>
                  {cf.variable_id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin='dense'
            label='Criticality'
            name='criticality'
            value={
              editingControl ? editControl.criticality : newControl.criticality
            }
            onChange={handleTextChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={editingControl ? handleEditControl : handleAddControl}
            color='primary'
          >
            {editingControl ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

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
