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
    const [newFamily, setNewFamily] = useState({ control_Family_Id: '', name: '', description: '' });
    const [editingFamily, setEditingFamily] = useState(null);
    const [editFamily, setEditFamily] = useState({ control_Family_Id: '', name: '', description: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchControlFamilies = async () => {
            setLoading(true); // Set loading to true before fetching data
            try {
                const response = await axios.get('http://localhost:8021/api/v1/control-families');
                setControlFamilies(response.data);
            } catch (error) {
                console.error('Error fetching control families:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchControlFamilies();
    }, []);

    const handleAddFamily = async () => {
        try {
            const response = await axios.post('http://localhost:8021/api/v1/control-families', newFamily);
            setControlFamilies([...controlFamilies, response.data]);
            setNewFamily({ control_Family_Id: '', name: '', description: '' });
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
            setEditFamily({ control_Family_Id: '', name: '', description: '' });
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
        return <Loading />; // Show the loading animation while data is loading
    }

    return (
        <div className="control-families-container">
            <div className="control-family-form">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    editingFamily ? handleEditFamily() : handleAddFamily();
                }}>
                    <TextField
                        label="Control Family ID"
                        value={editingFamily ? editFamily.control_Family_Id : newFamily.control_Family_Id}
                        onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, control_Family_Id: e.target.value }) : setNewFamily({ ...newFamily, control_Family_Id: e.target.value })}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Name"
                        value={editingFamily ? editFamily.name : newFamily.name}
                        onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, name: e.target.value }) : setNewFamily({ ...newFamily, name: e.target.value })}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        value={editingFamily ? editFamily.description : newFamily.description}
                        onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, description: e.target.value }) : setNewFamily({ ...newFamily, description: e.target.value })}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <div className="form-buttons">
                        <Button type="submit" variant="contained" color="primary">
                            {editingFamily ? 'Save' : 'Add'}
                        </Button>
                        {editingFamily && (
                            <Button type="button" variant="outlined" color="secondary" onClick={() => { setEditingFamily(null); setEditFamily({ control_Family_Id: '', name: '', description: '' }); }}>
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
                            <TableCell>Control Family ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {controlFamilies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cf) => (
                            <TableRow key={cf._id}>
                                <TableCell>{cf.control_Family_Id}</TableCell>
                                <TableCell>{cf.name}</TableCell>
                                <TableCell>{cf.description}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setEditingFamily(cf); setEditFamily(cf); }}
                                        disabled={cf.isDPDPA}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteFamily(cf._id)}
                                        disabled={cf.isDPDPA}
                                        style={{ marginLeft: '10px' }}
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
// import './ControlFamiliesPage.css';

// const ControlFamiliesPage = () => {
//     const [controlFamilies, setControlFamilies] = useState([]);
//     const [newFamily, setNewFamily] = useState({ control_Family_Id: '', name: '', description: '' });
//     const [editingFamily, setEditingFamily] = useState(null);
//     const [editFamily, setEditFamily] = useState({ control_Family_Id: '', name: '', description: '' });
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);

//     useEffect(() => {
//         const fetchControlFamilies = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8021/api/v1/control-families');
//                 setControlFamilies(response.data);
//             } catch (error) {
//                 console.error('Error fetching control families:', error);
//             }
//         };

//         fetchControlFamilies();
//     }, []);

//     const handleAddFamily = async () => {
//         try {
//             const response = await axios.post('http://localhost:8021/api/v1/control-families', newFamily);
//             setControlFamilies([...controlFamilies, response.data]);
//             setNewFamily({ control_Family_Id: '', name: '', description: '' });
//         } catch (error) {
//             console.error('Error adding control family:', error.response ? error.response.data : error.message);
//         }
//     };

//     const handleEditFamily = async () => {
//         try {
//             await axios.put(`http://localhost:8021/api/v1/control-families/${editingFamily._id}`, editFamily);
//             setControlFamilies(controlFamilies.map(family =>
//                 family._id === editingFamily._id ? { ...family, ...editFamily } : family
//             ));
//             setEditingFamily(null);
//             setEditFamily({ control_Family_Id: '', name: '', description: '' });
//         } catch (error) {
//             console.error('Error updating control family:', error.response ? error.response.data : error.message);
//         }
//     };

//     const handleDeleteFamily = async (id) => {
//         try {
//             await axios.delete(`http://localhost:8021/api/v1/control-families/${id}`);
//             setControlFamilies(controlFamilies.filter(family => family._id !== id));
//         } catch (error) {
//             console.error('Error deleting control family:', error.response ? error.response.data : error.message);
//         }
//     };

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     return (
//         <div className="control-families-container">
//             {/* <h2>Control Families</h2> */}
//             <div className="control-family-form">
//                 {/* <h3>{editingFamily ? 'Edit Control Family' : 'Add New Control Family'}</h3> */}
//                 <form onSubmit={(e) => {
//                     e.preventDefault();
//                     editingFamily ? handleEditFamily() : handleAddFamily();
//                 }}>
//                     <TextField
//                         label="Control Family ID"
//                         value={editingFamily ? editFamily.control_Family_Id : newFamily.control_Family_Id}
//                         onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, control_Family_Id: e.target.value }) : setNewFamily({ ...newFamily, control_Family_Id: e.target.value })}
//                         required
//                         fullWidth
//                         margin="normal"
//                     />
//                     <TextField
//                         label="Name"
//                         value={editingFamily ? editFamily.name : newFamily.name}
//                         onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, name: e.target.value }) : setNewFamily({ ...newFamily, name: e.target.value })}
//                         required
//                         fullWidth
//                         margin="normal"
//                     />
//                     <TextField
//                         label="Description"
//                         value={editingFamily ? editFamily.description : newFamily.description}
//                         onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, description: e.target.value }) : setNewFamily({ ...newFamily, description: e.target.value })}
//                         required
//                         fullWidth
//                         margin="normal"
//                     />
//                     <div className="form-buttons">
//                         <Button type="submit" variant="contained" color="primary">
//                             {editingFamily ? 'Save' : 'Add'}
//                         </Button>
//                         {editingFamily && (
//                             <Button type="button" variant="outlined" color="secondary" onClick={() => { setEditingFamily(null); setEditFamily({ control_Family_Id: '', name: '', description: '' }); }}>
//                                 Cancel
//                             </Button>
//                         )}
//                     </div>
//                 </form>
//             </div>
//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Control Family ID</TableCell>
//                             <TableCell>Name</TableCell>
//                             <TableCell>Description</TableCell>
//                             <TableCell>Actions</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {controlFamilies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cf) => (
//                             <TableRow key={cf._id}>
//                                 <TableCell>{cf.control_Family_Id}</TableCell>
//                                 <TableCell>{cf.name}</TableCell>
//                                 <TableCell>{cf.description}</TableCell>
//                                 <TableCell>
//                                     <Button
//                                         variant="contained"
//                                         color="primary"
//                                         onClick={() => { setEditingFamily(cf); setEditFamily(cf); }}
//                                         disabled={cf.isDPDPA}
//                                     >
//                                         Edit
//                                     </Button>
//                                     <Button
//                                         variant="contained"
//                                         color="secondary"
//                                         onClick={() => handleDeleteFamily(cf._id)}
//                                         disabled={cf.isDPDPA}
//                                         style={{ marginLeft: '10px' }}
//                                     >
//                                         Delete
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             <TablePagination
//                 rowsPerPageOptions={[5, 10, 20]}
//                 component="div"
//                 count={controlFamilies.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//         </div>
//     );
// };

// export default ControlFamiliesPage;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './ControlFamiliesPage.css';

// const ControlFamiliesPage = () => {
//     const [controlFamilies, setControlFamilies] = useState([]);
//     const [newFamily, setNewFamily] = useState({ control_Family_Id: '', name: '', description: '' });
//     const [editingFamily, setEditingFamily] = useState(null);
//     const [editFamily, setEditFamily] = useState({ control_Family_Id: '', name: '', description: '' });

//     useEffect(() => {
//         const fetchControlFamilies = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8021/api/v1/control-families');
//                 setControlFamilies(response.data);
//             } catch (error) {
//                 console.error('Error fetching control families:', error);
//             }
//         };

//         fetchControlFamilies();
//     }, []);

//     const handleAddFamily = async () => {
//         try {
//             const response = await axios.post('http://localhost:8021/api/v1/control-families', newFamily);
//             setControlFamilies([...controlFamilies, response.data]);
//             setNewFamily({ control_Family_Id: '', name: '', description: '' });
//         } catch (error) {
//             console.error('Error adding control family:', error.response ? error.response.data : error.message);
//         }
//     };

//     const handleEditFamily = async () => {
//         try {
//             await axios.put(`http://localhost:8021/api/v1/control-families/${editingFamily._id}`, editFamily);
//             setControlFamilies(controlFamilies.map(family =>
//                 family._id === editingFamily._id ? { ...family, ...editFamily } : family
//             ));
//             setEditingFamily(null);
//             setEditFamily({ control_Family_Id: '', name: '', description: '' });
//         } catch (error) {
//             console.error('Error updating control family:', error.response ? error.response.data : error.message);
//         }
//     };

//     const handleDeleteFamily = async (id) => {
//         try {
//             await axios.delete(`http://localhost:8021/api/v1/control-families/${id}`);
//             setControlFamilies(controlFamilies.filter(family => family._id !== id));
//         } catch (error) {
//             console.error('Error deleting control family:', error.response ? error.response.data : error.message);
//         }
//     };

//     return (
//         <div className="control-families-container">
//             <h2>Control Families</h2>
//             <div className="control-family-form">
//                 <h3>{editingFamily ? 'Edit Control Family' : 'Add New Control Family'}</h3>
//                 <form onSubmit={(e) => {
//                     e.preventDefault();
//                     editingFamily ? handleEditFamily() : handleAddFamily();
//                 }}>
//                     <input
//                         type="text"
//                         value={editingFamily ? editFamily.control_Family_Id : newFamily.control_Family_Id}
//                         onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, control_Family_Id: e.target.value }) : setNewFamily({ ...newFamily, control_Family_Id: e.target.value })}
//                         placeholder="Control Family ID"
//                         required
//                     />
//                     <input
//                         type="text"
//                         value={editingFamily ? editFamily.name : newFamily.name}
//                         onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, name: e.target.value }) : setNewFamily({ ...newFamily, name: e.target.value })}
//                         placeholder="Name"
//                         required
//                     />
//                     <input
//                         type="text"
//                         value={editingFamily ? editFamily.description : newFamily.description}
//                         onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, description: e.target.value }) : setNewFamily({ ...newFamily, description: e.target.value })}
//                         placeholder="Description"
//                         required
//                     />
//                     <button type="submit" className="submit-button">{editingFamily ? 'Save' : 'Add'}</button>
//                     {editingFamily && <button type="button" className="cancel-button" onClick={() => { setEditingFamily(null); setEditFamily({ control_Family_Id: '', name: '', description: '' }); }}>Cancel</button>}
//                 </form>
//             </div>
//             <table className="control-families-table">
//                 <thead>
//                     <tr>
//                         <th>Control Family ID</th>
//                         <th>Name</th>
//                         <th>Description</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {controlFamilies.map((cf) => (
//                         <tr key={cf._id}>
//                             <td>{cf.control_Family_Id}</td>
//                             <td>{cf.name}</td>
//                             <td>{cf.description}</td>
//                             <td>
//                                 <button
//                                     className="edit-button"
//                                     onClick={() => { setEditingFamily(cf); setEditFamily(cf); }}
//                                     disabled={cf.isDPDPA}
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     className="delete-button"
//                                     onClick={() => handleDeleteFamily(cf._id)}
//                                     disabled={cf.isDPDPA}
//                                 >
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default ControlFamiliesPage;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './ControlFamiliesPage.css';

// const ControlFamiliesPage = () => {
//     const [controlFamilies, setControlFamilies] = useState([]);
//     const [newFamily, setNewFamily] = useState({ control_Family_Id: '', name: '', description: '' });
//     const [editingFamily, setEditingFamily] = useState(null);
//     const [editFamily, setEditFamily] = useState({ control_Family_Id: '', name: '', description: '' });

//     useEffect(() => {
//         const fetchControlFamilies = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8021/api/v1/control-families');
//                 setControlFamilies(response.data);
//             } catch (error) {
//                 console.error('Error fetching control families:', error);
//             }
//         };

//         fetchControlFamilies();
//     }, []);

//     const handleAddFamily = async () => {
//         try {
//             const response = await axios.post('http://localhost:8021/api/v1/control-families', newFamily);
//             setControlFamilies([...controlFamilies, response.data]);
//             setNewFamily({ control_Family_Id: '', name: '', description: '' });
//         } catch (error) {
//             console.error('Error adding control family:', error.response ? error.response.data : error.message);
//         }
//     };

//     const handleEditFamily = async () => {
//         try {
//             await axios.put(`http://localhost:8021/api/v1/control-families/${editingFamily._id}`, editFamily);
//             setControlFamilies(controlFamilies.map(family =>
//                 family._id === editingFamily._id ? { ...family, ...editFamily } : family
//             ));
//             setEditingFamily(null);
//             setEditFamily({ control_Family_Id: '', name: '', description: '' });
//         } catch (error) {
//             console.error('Error updating control family:', error.response ? error.response.data : error.message);
//         }
//     };

//     const handleDeleteFamily = async (id) => {
//         try {
//             await axios.delete(`http://localhost:8021/api/v1/control-families/${id}`);
//             setControlFamilies(controlFamilies.filter(family => family._id !== id));
//         } catch (error) {
//             console.error('Error deleting control family:', error.response ? error.response.data : error.message);
//         }
//     };

//     return (
//         <div className="control-families-container">
//             <h2>Control Families</h2>
           
//             <div className="control-family-form">
//                 <h3>{editingFamily ? 'Edit Control Family' : 'Add New Control Family'}</h3>
//                 <form onSubmit={(e) => {
//                     e.preventDefault();
//                     editingFamily ? handleEditFamily() : handleAddFamily();
//                 }}>
//                     <input
//                         type="text"
//                         value={editingFamily ? editFamily.control_Family_Id : newFamily.control_Family_Id}
//                         onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, control_Family_Id: e.target.value }) : setNewFamily({ ...newFamily, control_Family_Id: e.target.value })}
//                         placeholder="Control Family ID"
//                         required
//                     />
//                     <input
//                         type="text"
//                         value={editingFamily ? editFamily.name : newFamily.name}
//                         onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, name: e.target.value }) : setNewFamily({ ...newFamily, name: e.target.value })}
//                         placeholder="Name"
//                         required
//                     />
//                     <input
//                         type="text"
//                         value={editingFamily ? editFamily.description : newFamily.description}
//                         onChange={(e) => editingFamily ? setEditFamily({ ...editFamily, description: e.target.value }) : setNewFamily({ ...newFamily, description: e.target.value })}
//                         placeholder="Description"
//                         required
//                     />
//                     <button type="submit" className="submit-button">{editingFamily ? 'Save' : 'Add'}</button>
//                     {editingFamily && <button type="button" className="cancel-button" onClick={() => { setEditingFamily(null); setEditFamily({ control_Family_Id: '', name: '', description: '' }); }}>Cancel</button>}
//                 </form>
//             </div>
//             <table className="control-families-table">
//                 <thead>
//                     <tr>
//                         <th>Control Family ID</th>
//                         <th>Name</th>
//                         <th>Description</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {controlFamilies.map((cf) => (
//                         <tr key={cf._id}>
//                             <td>{cf.control_Family_Id}</td>
//                             <td>{cf.name}</td>
//                             <td>{cf.description}</td>
//                             <td>
//                                 <button className="edit-button" onClick={() => { setEditingFamily(cf); setEditFamily(cf); }}>Edit</button>
//                                 <button className="delete-button" onClick={() => handleDeleteFamily(cf._id)}>Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default ControlFamiliesPage;
