import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  TextField,
  Container,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Checkbox,
} from '@mui/material';
import { getUsers, saveUser, deleteUser } from '../api/userApi'; // Adjust the path as necessary

const UserCreation = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // New state for email
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [permissions, setPermissions] = useState({
    view: false,
    add: false,
    edit: false,
    delegate: false,
    uploadEvidence: false,
    confirmEvidence: false,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddEditUser = async (e) => {
    e.preventDefault();
    const companyId = window.localStorage.getItem('company');

    try {
      await saveUser(
        { username, email, password, role, permissions, company: companyId },
        isEditing,
        selectedUser?._id
      );
      fetchUsers();
      setDrawerOpen(false);
      setUsername('');
      setEmail(''); // Clear email after submission
      setPassword('');
      setRole('user');
      setPermissions({
        view: false,
        add: false,
        edit: false,
        delegate: false,
        uploadEvidence: false,
        confirmEvidence: false,
      });
    } catch (error) {
      setError(
        `Error ${isEditing ? 'editing' : 'creating'} user: ${error.message}`
      );
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser._id);
      fetchUsers();
      setDrawerOpen(false);
    } catch (error) {
      setError(`Error deleting user: ${error.message}`);
    }
  };

  const openDrawerForAdd = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setUsername('');
    setEmail(''); // Reset email field when adding a new user
    setPassword('');
    setRole('user');
    setPermissions({
      view: false,
      add: false,
      edit: false,
      delegate: false,
      uploadEvidence: false,
      confirmEvidence: false,
    });
    setDrawerOpen(true);
  };

  const openDrawerForEdit = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
    setUsername(user.username);
    setEmail(user.email); // Set email for editing
    setPassword(user.password);
    setRole(user.role);
    setPermissions(user.permissions);
    setDrawerOpen(true);
  };

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4' gutterBottom>
        User Management
      </Typography>
      <Button variant='contained' color='primary' onClick={openDrawerForAdd}>
        Add User
      </Button>
      {error && <Typography color='error'>{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.no.</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>View Permission</TableCell>
              <TableCell>Add Permission</TableCell>
              <TableCell>Edit Permission</TableCell>
              <TableCell>Delegate Permission</TableCell>
              <TableCell>Upload Evidence Permission</TableCell>
              <TableCell>Confirm Evidence Permission</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>{' '}
                {/* Display sequence number */}
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell> {/* Display email */}
                <TableCell>********</TableCell> {/* Masked password */}
                {/* <TableCell>{user.password}</TableCell> */}
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Checkbox checked={user.permissions.view} disabled />
                </TableCell>
                <TableCell>
                  <Checkbox checked={user.permissions.add} disabled />
                </TableCell>
                <TableCell>
                  <Checkbox checked={user.permissions.edit} disabled />
                </TableCell>
                <TableCell>
                  <Checkbox checked={user.permissions.delegate} disabled />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={user.permissions.uploadEvidence}
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={user.permissions.confirmEvidence}
                    disabled
                  />
                </TableCell>
                <TableCell>{user._id}</TableCell>
                <TableCell>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => openDrawerForEdit(user)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Container>
          <Typography variant='h5' gutterBottom>
            {isEditing ? 'Edit User' : 'Add User'}
          </Typography>
          <form onSubmit={handleAddEditUser}>
            <TextField
              label='Username'
              fullWidth
              margin='normal'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label='Email' // Email field
              type='email'
              fullWidth
              margin='normal'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label='Password'
              type='password'
              fullWidth
              margin='normal'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl fullWidth margin='normal'>
              <InputLabel>Role</InputLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <MenuItem value='Admin'>Admin</MenuItem>
                <MenuItem value='Executive'>Executive</MenuItem>
                <MenuItem value='Compliance Team'>Compliance Team</MenuItem>
                <MenuItem value='IT Team'>IT Team</MenuItem>
                <MenuItem value='Auditor'>Auditor</MenuItem>
                <MenuItem value='External Auditor'>External Auditor</MenuItem>
                <MenuItem value='user'>User</MenuItem>
              </Select>
            </FormControl>
            <Button type='submit' variant='contained' color='primary'>
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
            {isEditing && (
              <Button
                variant='contained'
                color='error'
                onClick={handleDeleteUser}
                style={{ marginLeft: '10px' }}
              >
                Delete User
              </Button>
            )}
          </form>
        </Container>
      </Drawer>
    </Container>
  );
};

export default UserCreation;

// import React, { useState, useEffect } from 'react';
// import {
//   Drawer, Button, TextField, Container, Typography, Select, MenuItem,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   FormControl, InputLabel, Checkbox, FormControlLabel
// } from '@mui/material';
// import { getUsers, saveUser, deleteUser } from '../api/userApi'; // Adjust the path as necessary

// const UserCreation = () => {
//   const [users, setUsers] = useState([]);
//   const [username, setUsername] = useState('');

//   const [email, setEmail] = useState(''); // New state for email
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const [permissions, setPermissions] = useState({
//     view: false,
//     add: false,
//     edit: false,
//     delegate: false,
//     uploadEvidence: false,
//     confirmEvidence: false
//   });
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [error, setError] = useState('');

//   const fetchUsers = async () => {
//     try {
//       const response = await getUsers();
//       setUsers(response.users);
//     } catch (error) {
//       console.error('Failed to fetch users:', error);
//       setError('Failed to fetch users');
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleAddEditUser = async (e) => {
//     e.preventDefault();
//     const user = { username,email, password, role, permissions };

//     try {
//       await saveUser(user, isEditing, selectedUser?._id);
//       fetchUsers();
//       setDrawerOpen(false);
//       setUsername('');
//       setEmail(''); // Clear email after submission
//       setPassword('');
//       setRole('user');
//       setPermissions({
//         view: false,
//         add: false,
//         edit: false,
//         delegate: false,
//         uploadEvidence: false,
//         confirmEvidence: false
//       });
//     } catch (error) {
//       setError(`Error ${isEditing ? 'editing' : 'creating'} user: ${error.message}`);
//     }
//   };

//   const handleDeleteUser = async () => {
//     try {
//       await deleteUser(selectedUser._id);
//       fetchUsers();
//       setDrawerOpen(false);
//     } catch (error) {
//       setError(`Error deleting user: ${error.message}`);
//     }
//   };

//   const openDrawerForAdd = () => {
//     setIsEditing(false);
//     setSelectedUser(null);
//     setUsername('');
//     setEmail(''); // Reset email field when adding a new user
//     setPassword('');
//     setRole('user');
//     setPermissions({
//       view: false,
//       add: false,
//       edit: false,
//       delegate: false,
//       uploadEvidence: false,
//       confirmEvidence: false
//     });
//     setDrawerOpen(true);
//   };

//   const openDrawerForEdit = (user) => {
//     setIsEditing(true);
//     setSelectedUser(user);
//     setUsername(user.username);
//     setEmail(user.email); // Set email for editing
//     setPassword(user.password);
//     setRole(user.role);
//     setPermissions(user.permissions);
//     setDrawerOpen(true);
//   };

//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h4" gutterBottom>
//         User Management
//       </Typography>
//       <Button variant="contained" color="primary" onClick={openDrawerForAdd}>
//         Add User
//       </Button>
//       {error && <Typography color="error">{error}</Typography>}
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>User ID</TableCell>
//               <TableCell>Username</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Password</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>View Permission</TableCell>
//               <TableCell>Add Permission</TableCell>
//               <TableCell>Edit Permission</TableCell>
//               <TableCell>Delegate Permission</TableCell>
//               <TableCell>Upload Evidence Permission</TableCell>
//               <TableCell>Confirm Evidence Permission</TableCell>
//               <TableCell>Edit</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {users.map((user) => (
//               <TableRow key={user._id}>
//                 <TableCell>{user._id}</TableCell>
//                 <TableCell>{user.username}</TableCell>
//                 <TableCell>{user.email}</TableCell> {/* Display email */}
//                 <TableCell>{user.password}</TableCell>
//                 <TableCell>{user.role}</TableCell>
//                 <TableCell>
//                   <Checkbox checked={user.permissions.view} disabled />
//                 </TableCell>
//                 <TableCell>
//                   <Checkbox checked={user.permissions.add} disabled />
//                 </TableCell>
//                 <TableCell>
//                   <Checkbox checked={user.permissions.edit} disabled />
//                 </TableCell>
//                 <TableCell>
//                   <Checkbox checked={user.permissions.delegate} disabled />
//                 </TableCell>
//                 <TableCell>
//                   <Checkbox checked={user.permissions.uploadEvidence} disabled />
//                 </TableCell>
//                 <TableCell>
//                   <Checkbox checked={user.permissions.confirmEvidence} disabled />
//                 </TableCell>
//                 <TableCell>
//                   <Button variant="contained" color="secondary" onClick={() => openDrawerForEdit(user)}>
//                     Edit
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
//         <Container>
//           <Typography variant="h5" gutterBottom>
//             {isEditing ? 'Edit User' : 'Add User'}
//           </Typography>
//           <form onSubmit={handleAddEditUser}>
//             <TextField
//               label="Username"
//               fullWidth
//               margin="normal"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <TextField
//               label="Password"
//               type="password"
//               fullWidth
//               margin="normal"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Role</InputLabel>
//               <Select value={role} onChange={(e) => setRole(e.target.value)}>
//                 <MenuItem value="Admin">Admin</MenuItem>
//                 <MenuItem value="Executive">Executive</MenuItem>
//                 <MenuItem value="Compliance Team">Compliance Team</MenuItem>
//                 <MenuItem value="IT Team">IT Team</MenuItem>
//                 <MenuItem value="Auditor">Auditor</MenuItem>
//                 <MenuItem value="user">User</MenuItem>
//               </Select>
//             </FormControl>
//             <Button type="submit" variant="contained" color="primary">
//               {isEditing ? 'Update User' : 'Create User'}
//             </Button>
//             {isEditing && (
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={handleDeleteUser}
//                 style={{ marginLeft: '10px' }}
//               >
//                 Delete User
//               </Button>
//             )}
//           </form>
//         </Container>
//       </Drawer>
//     </Container>
//   );
// };

// export default UserCreation;
