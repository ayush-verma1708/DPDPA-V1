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
import Loading from '../components/Loading'; // Import the Loading component
import './ControlFamiliesPage.css';

const ControlFamiliesPage = () => {
    const [controlFamilies, setControlFamilies] = useState([]);
    const [newFamily, setNewFamily] = useState({ fixed_id: '', variable_id: '' });
    const [editingFamily, setEditingFamily] = useState(null);
    const [editFamily, setEditFamily] = useState({ fixed_id: '', variable_id: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchControlFamilies = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8021/api/v1/control-families');
                setControlFamilies(response.data);
            } catch (error) {
                console.error('Error fetching control families:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchControlFamilies();
    }, []);

    const handleAddFamily = async () => {
        try {
            const response = await axios.post('http://localhost:8021/api/v1/control-families', newFamily);
            setControlFamilies([...controlFamilies, response.data]);
            setNewFamily({ fixed_id: '', variable_id: '' });
        } catch (error) {
            console.error('Error adding control family:', error.response ? error.response.data : error.message);
        }
    };

    const handleEditFamily = async () => {
        try {
            await axios.put(`http://localhost:8021/api/v1/control-families/${editingFamily._id}`, editFamily);
            setControlFamilies(controlFamilies.map(family =>
                family._id === editingFamily._id ? { ...family, ...editFamily } : family
            ));
            setEditingFamily(null);
            setEditFamily({ fixed_id: '', variable_id: '' });
        } catch (error) {
            console.error('Error updating control family:', error.response ? error.response.data : error.message);
        }
    };

    const handleDeleteFamily = async (id) => {
        try {
            await axios.delete(`http://localhost:8021/api/v1/control-families/${id}`);
            setControlFamilies(controlFamilies.filter(family => family._id !== id));
        } catch (error) {
            console.error('Error deleting control family:', error.response ? error.response.data : error.message);
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
        <div className="control-families-container">
            <div className="control-family-form">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    editingFamily ? handleEditFamily() : handleAddFamily();
                }}>
                    {/* <TextField
                        label="Fixed ID"
                        value={editingFamily ? editFamily.fixed_id : newFamily.fixed_id}
                        onChange={(e) => {
                            if (editingFamily) {
                                setEditFamily({ ...editFamily, fixed_id: e.target.value });
                            } else {
                                setNewFamily({ ...newFamily, fixed_id: e.target.value });
                            }
                        }}
                        required
                        fullWidth
                        margin="normal"
                    /> */}
                    <TextField
                        label="Variable ID"
                        value={editingFamily ? editFamily.variable_id : newFamily.variable_id}
                        onChange={(e) => {
                            if (editingFamily) {
                                setEditFamily({ ...editFamily, variable_id: e.target.value });
                            } else {
                                setNewFamily({ ...newFamily, variable_id: e.target.value });
                            }
                        }}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <div className="form-buttons">
                        <Button type="submit" variant="contained" color="primary">
                            {editingFamily ? 'Save' : 'Add'}
                        </Button>
                        {editingFamily && (
                            <Button
                                type="button"
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                    setEditingFamily(null);
                                    setEditFamily({ fixed_id: '', variable_id: '' });
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Fixed ID</TableCell>
                            <TableCell>Chapter</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {controlFamilies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cf) => (
                            <TableRow key={cf._id}>
                                <TableCell>{cf.fixed_id}</TableCell>
                                <TableCell>{cf.variable_id}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            setEditingFamily(cf);
                                            setEditFamily({ ...cf });
                                        }}
                                        disabled={cf.isDPDPA}  // Disable the Edit button if isDPDPA is true
                                        >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteFamily(cf._id)}
                                        style={{ marginLeft: '10px' }}
                                        disabled={cf.isDPDPA}  // Disable the Edit button if isDPDPA is true
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
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={controlFamilies.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default ControlFamiliesPage;
