import React, { useState, useEffect } from 'react';
import { Drawer, Button, TextField, Container, Typography, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';

const UserCreation = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [permissions, setPermissions] = useState({
    view: false,
    add: false,
    edit: false,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8021/api/users');
      setUsers(response.data.users);
    } catch (error) {
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddEditUser = async (e) => {
    e.preventDefault();
    const user = { username, password, role, permissions };
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8021/api/users/${selectedUser._id}`, user);
      } else {
        await axios.post('http://localhost:8021/api/users', user);
      }
      fetchUsers();
      setDrawerOpen(false);
      setUsername('');
      setPassword('');
      setRole('user');
      setPermissions({ view: false, add: false, edit: false });
    } catch (error) {
      setError(`Error ${isEditing ? 'editing' : 'creating'} user: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:8021/api/users/${selectedUser._id}`);
      fetchUsers();
      setDrawerOpen(false);
    } catch (error) {
      setError(`Error deleting user: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const openDrawerForAdd = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setUsername('');
    setPassword('');
    setRole('user');
    setPermissions({ view: false, add: false, edit: false });
    setDrawerOpen(true);
  };

  const openDrawerForEdit = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
    setUsername(user.username);
    setPassword(user.password);
    setRole(user.role);
    setPermissions(user.permissions);
    setDrawerOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button variant="contained" color="primary" onClick={openDrawerForAdd}>
        Add User
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Executive</TableCell>
              <TableCell>IT Team</TableCell>
              <TableCell>Auditor</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.password}</TableCell>
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
                  <Button variant="contained" color="secondary" onClick={() => openDrawerForEdit(user)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Container>
          <Typography variant="h5" gutterBottom>
            {isEditing ? 'Edit User' : 'Add User'}
          </Typography>
          <form onSubmit={handleAddEditUser}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography variant="h6">Permissions</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={permissions.view}
                    onChange={(e) => setPermissions({ ...permissions, view: e.target.checked })}
                  />
                }
                label="Executive"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={permissions.add}
                    onChange={(e) => setPermissions({ ...permissions, add: e.target.checked })}
                  />
                }
                label="IT Team"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={permissions.edit}
                    onChange={(e) => setPermissions({ ...permissions, edit: e.target.checked })}
                  />
                }
                label="Auditor"
              />
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
            {isEditing && (
              <Button 
                variant="contained" 
                color="error" 
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
// import { Drawer, Button, TextField, Container, Typography, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel } from '@mui/material';
// import axios from 'axios';

// const UserCreation = () => {
//   const [users, setUsers] = useState([]);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [error, setError] = useState('');

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('http://localhost:8021/api/users');
//       setUsers(response.data.users);
//     } catch (error) {
//       setError('Failed to fetch users');
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleAddEditUser = async (e) => {
//     e.preventDefault();
//     const user = { username, password, role };
//     try {
//       if (isEditing) {
//         await axios.put(`http://localhost:8021/api/users/${selectedUser._id}`, user);
//       } else {
//         await axios.post('http://localhost:8021/api/users', user);
//       }
//       fetchUsers();
//       setDrawerOpen(false);
//       setUsername('');
//       setPassword('');
//       setRole('user');
//     } catch (error) {
//       setError(`Error ${isEditing ? 'editing' : 'creating'} user: ${error.response ? error.response.data.message : error.message}`);
//     }
//   };

//   const handleDeleteUser = async () => {
//     try {
//       await axios.delete(`http://localhost:8021/api/users/${selectedUser._id}`);
//       fetchUsers(); // Refresh the user list
//       setDrawerOpen(false); // Close the drawer after deletion
//     } catch (error) {
//       setError(`Error deleting user: ${error.response ? error.response.data.message : error.message}`);
//     }
//   };

//   const openDrawerForAdd = () => {
//     setIsEditing(false);
//     setSelectedUser(null);
//     setUsername('');
//     setPassword('');
//     setRole('user');
//     setDrawerOpen(true);
//   };

//   const openDrawerForEdit = (user) => {
//     setIsEditing(true);
//     setSelectedUser(user);
//     setUsername(user.username);
//     setPassword(user.password);
//     setRole(user.role);
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
//               <TableCell>Username</TableCell>
//               <TableCell>Password</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>Edit</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {users.map((user) => (
//               <TableRow key={user._id}>
//                 <TableCell>{user.username}</TableCell>
//                 <TableCell>{user.password}</TableCell>
//                 <TableCell>{user.role}</TableCell>
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
//                 <MenuItem value="admin">Admin</MenuItem>
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

// // import React, { useState, useEffect } from 'react';
// // import {
// //   Drawer, Button, TextField, Container, Typography, Select, MenuItem,
// //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
// //   FormControl, InputLabel
// // } from '@mui/material';
// // import axios from 'axios';

// // const UserCreation = () => {
// //   const [users, setUsers] = useState([]);
// //   const [username, setUsername] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [role, setRole] = useState('user');
// //   const [drawerOpen, setDrawerOpen] = useState(false);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [error, setError] = useState('');

// //   // Fetch users
// //   const fetchUsers = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:8021/api/users');
// //       setUsers(response.data.users);
// //     } catch (error) {
// //       setError('Failed to fetch users');
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUsers();
// //   }, []);

// //   // Add or Edit user
// //   const handleAddEditUser = async (e) => {
// //     e.preventDefault();
// //     const user = { username, password, role };
// //     try {
// //       if (isEditing) {
// //         // Update existing user
// //         await axios.put(`http://localhost:8021/api/users/${selectedUser._id}`, user);
// //       } else {
// //         // Create new user
// //         await axios.post('http://localhost:8021/api/users', user);
// //       }
// //       fetchUsers();
// //       setDrawerOpen(false);
// //       setUsername('');
// //       setPassword('');
// //       setRole('user');
// //     } catch (error) {
// //       setError(`Error ${isEditing ? 'editing' : 'creating'} user: ${error.response ? error.response.data.message : error.message}`);
// //     }
// //   };

// //   // Delete user
// //   const handleDeleteUser = async (userId) => {
// //     try {
// //       await axios.delete(`http://localhost:8021/api/users/${userId}`);
// //       fetchUsers(); // Refresh the user list
// //     } catch (error) {
// //       setError(`Error deleting user: ${error.response ? error.response.data.message : error.message}`);
// //     }
// //   };

// //   // Open drawer to add user
// //   const openDrawerForAdd = () => {
// //     setIsEditing(false);
// //     setUsername('');
// //     setPassword('');
// //     setRole('user');
// //     setDrawerOpen(true);
// //   };

// //   // Open drawer to edit user
// //   const openDrawerForEdit = (user) => {
// //     setIsEditing(true);
// //     setSelectedUser(user);
// //     setUsername(user.username);
// //     setPassword(user.password);
// //     setRole(user.role);
// //     setDrawerOpen(true);
// //   };

// //   return (
// //     <Container maxWidth="lg">
// //       <Typography variant="h4" gutterBottom>
// //         User Management
// //       </Typography>
// //       <Button variant="contained" color="primary" onClick={openDrawerForAdd}>
// //         Add User
// //       </Button>
// //       {error && <Typography color="error">{error}</Typography>}
// //       <TableContainer component={Paper}>
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>Username</TableCell>
// //               <TableCell>Password</TableCell>
// //               <TableCell>Role</TableCell>
// //               <TableCell>Edit</TableCell>
// //               <TableCell>Delete</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {users.map((user) => (
// //               <TableRow key={user._id}>
// //                 <TableCell>{user.username}</TableCell>
// //                 <TableCell>{user.password}</TableCell>
// //                 <TableCell>{user.role}</TableCell>
// //                 <TableCell>
// //                   <Button variant="contained" color="secondary" onClick={() => openDrawerForEdit(user)}>
// //                     Edit
// //                   </Button>
// //                 </TableCell>
// //                 <TableCell>
// //                   <Button variant="contained" color="error" onClick={() => handleDeleteUser(user._id)}>
// //                     Delete
// //                   </Button>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>
// //       <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
// //         <Container>
// //           <Typography variant="h5" gutterBottom>
// //             {isEditing ? 'Edit User' : 'Add User'}
// //           </Typography>
// //           <form onSubmit={handleAddEditUser}>
// //             <TextField
// //               label="Username"
// //               fullWidth
// //               margin="normal"
// //               value={username}
// //               onChange={(e) => setUsername(e.target.value)}
// //             />
// //             <TextField
// //               label="Password"
// //               type="password"
// //               fullWidth
// //               margin="normal"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //             />
// //             <FormControl fullWidth margin="normal">
// //               <InputLabel>Role</InputLabel>
// //               <Select value={role} onChange={(e) => setRole(e.target.value)}>
// //                 <MenuItem value="admin">Admin</MenuItem>
// //                 <MenuItem value="user">User</MenuItem>
// //               </Select>
// //             </FormControl>
// //             <Button type="submit" variant="contained" color="primary">
// //               {isEditing ? 'Update User' : 'Create User'}
// //             </Button>
// //           </form>
// //         </Container>
// //       </Drawer>
// //     </Container>
// //   );
// // };

// // export default UserCreation;


// // // import React, { useState, useEffect } from 'react';
// // // import { Drawer, Button, TextField, Container, Typography, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel } from '@mui/material';
// // // import axios from 'axios';

// // // const UserCreation = () => {
// // //   const [users, setUsers] = useState([]);
// // //   const [username, setUsername] = useState('');
// // //   const [password, setPassword] = useState('');
// // //   const [role, setRole] = useState('user');
// // //   const [drawerOpen, setDrawerOpen] = useState(false);
// // //   const [isEditing, setIsEditing] = useState(false);
// // //   const [selectedUser, setSelectedUser] = useState(null);
// // //   const [error, setError] = useState('');

// // //   const fetchUsers = async () => {
// // //     try {
// // //       const response = await axios.get('http://localhost:8021/api/users');
// // //       setUsers(response.data.users);
// // //     } catch (error) {
// // //       setError('Failed to fetch users');
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchUsers();
// // //   }, []);

// // //   const handleAddEditUser = async (e) => {
// // //     e.preventDefault();
// // //     const user = { username, password, role };
// // //     try {
// // //       if (isEditing) {
// // //         await axios.put(`http://localhost:8021/api/users/${selectedUser._id}`, user);
// // //       } else {
// // //         await axios.post('http://localhost:8021/api/users', user);
// // //       }
// // //       fetchUsers();
// // //       setDrawerOpen(false);
// // //       setUsername('');
// // //       setPassword('');
// // //       setRole('user');
// // //     } catch (error) {
// // //       setError(`Error ${isEditing ? 'editing' : 'creating'} user: ${error.response ? error.response.data.message : error.message}`);
// // //     }
// // //   };

// // //   const handleDeleteUser = async (userId) => {
// // //     try {
// // //       await axios.delete(`http://localhost:8021/api/users/${userId}`);
// // //       fetchUsers(); // Refresh the user list
// // //     } catch (error) {
// // //       setError(`Error deleting user: ${error.response ? error.response.data.message : error.message}`);
// // //     }
// // //   };

// // //   const openDrawerForAdd = () => {
// // //     setIsEditing(false);
// // //     setUsername('');
// // //     setPassword('');
// // //     setRole('user');
// // //     setDrawerOpen(true);
// // //   };

// // //   const openDrawerForEdit = (user) => {
// // //     setIsEditing(true);
// // //     setSelectedUser(user);
// // //     setUsername(user.username);
// // //     setPassword(user.password);
// // //     setRole(user.role);
// // //     setDrawerOpen(true);
// // //   };

// // //   return (
// // //     <Container maxWidth="lg">
// // //       <Typography variant="h4" gutterBottom>
// // //         User Management
// // //       </Typography>
// // //       <Button variant="contained" color="primary" onClick={openDrawerForAdd}>
// // //         Add User
// // //       </Button>
// // //       {error && <Typography color="error">{error}</Typography>}
// // //       <TableContainer component={Paper}>
// // //         <Table>
// // //           <TableHead>
// // //             <TableRow>
// // //               <TableCell>Username</TableCell>
// // //               <TableCell>Password</TableCell>
// // //               <TableCell>Role</TableCell>
// // //               <TableCell>Permissions</TableCell>
// // //               <TableCell>Edit</TableCell>
// // //               <TableCell>Delete</TableCell>
// // //             </TableRow>
// // //           </TableHead>
// // //           <TableBody>
// // //             {users.map((user) => (
// // //               <TableRow key={user._id}>
// // //                 <TableCell>{user.username}</TableCell>
// // //                 <TableCell>{user.password}</TableCell>
// // //                 <TableCell>{user.role}</TableCell>
// // //                 <TableCell>
// // //                   {/* Permissions component here */}
// // //                 </TableCell>
// // //                 <TableCell>
// // //                   <Button variant="contained" color="secondary" onClick={() => openDrawerForEdit(user)}>
// // //                     Edit
// // //                   </Button>
// // //                 </TableCell>
// // //                 <TableCell>
// // //                   <Button variant="contained" color="error" onClick={() => handleDeleteUser(user._id)}>
// // //                     Delete
// // //                   </Button>
// // //                 </TableCell>
// // //               </TableRow>
// // //             ))}
// // //           </TableBody>
// // //         </Table>
// // //       </TableContainer>
// // //       <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
// // //         <Container>
// // //           <Typography variant="h5" gutterBottom>
// // //             {isEditing ? 'Edit User' : 'Add User'}
// // //           </Typography>
// // //           <form onSubmit={handleAddEditUser}>
// // //             <TextField
// // //               label="Username"
// // //               fullWidth
// // //               margin="normal"
// // //               value={username}
// // //               onChange={(e) => setUsername(e.target.value)}
// // //             />
// // //             <TextField
// // //               label="Password"
// // //               type="password"
// // //               fullWidth
// // //               margin="normal"
// // //               value={password}
// // //               onChange={(e) => setPassword(e.target.value)}
// // //             />
// // //             <FormControl fullWidth margin="normal">
// // //               <InputLabel>Role</InputLabel>
// // //               <Select value={role} onChange={(e) => setRole(e.target.value)}>
// // //                 <MenuItem value="admin">Admin</MenuItem>
// // //                 <MenuItem value="user">User</MenuItem>
// // //               </Select>
// // //             </FormControl>
// // //             <Button type="submit" variant="contained" color="primary">
// // //               {isEditing ? 'Update User' : 'Create User'}
// // //             </Button>
// // //           </form>
// // //         </Container>
// // //       </Drawer>
// // //     </Container>
// // //   );
// // // };

// // // export default UserCreation;


// // // edit user 

// // // import React, { useState, useEffect } from 'react';
// // // import { Drawer, Button, TextField, Container, Typography, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel } from '@mui/material';
// // // import axios from 'axios';

// // // const UserCreation = () => {
// // //   const [users, setUsers] = useState([]);
// // //   const [username, setUsername] = useState('');
// // //   const [password, setPassword] = useState('');
// // //   const [role, setRole] = useState('user');
// // //   const [drawerOpen, setDrawerOpen] = useState(false);
// // //   const [isEditing, setIsEditing] = useState(false);
// // //   const [selectedUser, setSelectedUser] = useState(null);
// // //   const [error, setError] = useState('');

// // //   const fetchUsers = async () => {
// // //     try {
// // //       const response = await axios.get('http://localhost:8021/api/users');
// // //       setUsers(response.data.users);
// // //     } catch (error) {
// // //       setError('Failed to fetch users');
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchUsers();
// // //   }, []);

// // //   const handleAddEditUser = async (e) => {
// // //     e.preventDefault();
// // //     const user = { username, password, role };
// // //     try {
// // //       if (isEditing) {
// // //         await axios.put(`http://localhost:8021/api/users/${selectedUser._id}`, user);
// // //       } else {
// // //         await axios.post('http://localhost:8021/api/users', user);
// // //       }
// // //       fetchUsers();
// // //       setDrawerOpen(false);
// // //       setUsername('');
// // //       setPassword('');
// // //       setRole('user');
// // //     } catch (error) {
// // //       setError(`Error ${isEditing ? 'editing' : 'creating'} user: ${error.response ? error.response.data.message : error.message}`);
// // //     }
// // //   };

// // //   const openDrawerForAdd = () => {
// // //     setIsEditing(false);
// // //     setUsername('');
// // //     setPassword('');
// // //     setRole('user');
// // //     setDrawerOpen(true);
// // //   };

// // //   const openDrawerForEdit = (user) => {
// // //     setIsEditing(true);
// // //     setSelectedUser(user);
// // //     setUsername(user.username);
// // //     setPassword(user.password);
// // //     setRole(user.role);
// // //     setDrawerOpen(true);
// // //   };

// // //   return (
// // //     <Container maxWidth="lg">
// // //       <Typography variant="h4" gutterBottom>
// // //         User Management
// // //       </Typography>
// // //       <Button variant="contained" color="primary" onClick={openDrawerForAdd}>
// // //         Add User
// // //       </Button>
// // //       {error && <Typography color="error">{error}</Typography>}
// // //       <TableContainer component={Paper}>
// // //         <Table>
// // //           <TableHead>
// // //             <TableRow>
// // //               <TableCell>Username</TableCell>
// // //               <TableCell>Password</TableCell>
// // //               <TableCell>Role</TableCell>
// // //               <TableCell>Permissions</TableCell>
// // //               <TableCell>Edit</TableCell>
// // //             </TableRow>
// // //           </TableHead>
// // //           <TableBody>
// // //             {users.map((user) => (
// // //               <TableRow key={user._id}>
// // //                 <TableCell>{user.username}</TableCell>
// // //                 <TableCell>{user.password}</TableCell>
// // //                 <TableCell>{user.role}</TableCell>
// // //                 <TableCell>
// // //                   {/* Permissions component here */}
// // //                 </TableCell>
// // //                 <TableCell>
// // //                   <Button variant="contained" color="secondary" onClick={() => openDrawerForEdit(user)}>
// // //                     Edit
// // //                   </Button>
// // //                 </TableCell>
// // //               </TableRow>
// // //             ))}
// // //           </TableBody>
// // //         </Table>
// // //       </TableContainer>
// // //       <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
// // //         <Container>
// // //           <Typography variant="h5" gutterBottom>
// // //             {isEditing ? 'Edit User' : 'Add User'}
// // //           </Typography>
// // //           <form onSubmit={handleAddEditUser}>
// // //             <TextField
// // //               label="Username"
// // //               fullWidth
// // //               margin="normal"
// // //               value={username}
// // //               onChange={(e) => setUsername(e.target.value)}
// // //             />
// // //             <TextField
// // //               label="Password"
// // //               type="password"
// // //               fullWidth
// // //               margin="normal"
// // //               value={password}
// // //               onChange={(e) => setPassword(e.target.value)}
// // //             />
// // //             <FormControl fullWidth margin="normal">
// // //               <InputLabel>Role</InputLabel>
// // //               <Select value={role} onChange={(e) => setRole(e.target.value)}>
// // //                 <MenuItem value="admin">Admin</MenuItem>
// // //                 <MenuItem value="user">User</MenuItem>
// // //               </Select>
// // //             </FormControl>
// // //             <Button type="submit" variant="contained" color="primary">
// // //               {isEditing ? 'Update User' : 'Create User'}
// // //             </Button>
// // //           </form>
// // //         </Container>
// // //       </Drawer>
// // //     </Container>
// // //   );
// // // };

// // // export default UserCreation;

// // // // This is a component working for user creation
// // // // import React, { useState, useEffect } from 'react';
// // // // import TextField from '@mui/material/TextField';
// // // // import Button from '@mui/material/Button';
// // // // import Container from '@mui/material/Container';
// // // // import Typography from '@mui/material/Typography';
// // // // import Select from '@mui/material/Select';
// // // // import MenuItem from '@mui/material/MenuItem';
// // // // import axios from 'axios';

// // // // const UserCreation = () => {
// // // //   const [username, setUsername] = useState('');
// // // //   const [password, setPassword] = useState('');
// // // //   const [role, setRole] = useState('user');
// // // //   const [users, setUsers] = useState([]);
// // // //   const [message, setMessage] = useState('');
// // // //   const [error, setError] = useState('');

// // // //   const fetchUsers = async () => {
// // // //     try {
// // // //       const response = await axios.get('http://localhost:8021/api/users');
// // // //       setUsers(response.data.users);
// // // //     } catch (error) {
// // // //       setError('Failed to fetch users');
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchUsers();
// // // //   }, []);

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     setMessage('');
// // // //     setError('');
// // // //     try {
// // // //       const response = await axios.post('http://localhost:8021/api/users', { username, password, role });
// // // //       setMessage(`User created: ${response.data.data.username}`);
// // // //       fetchUsers(); // Refresh the user list
// // // //     } catch (error) {
// // // //       setError(`Error creating user: ${error.response ? error.response.data.message : error.message}`);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <Container maxWidth="sm">
// // // //       <Typography variant="h4" gutterBottom>
// // // //         User Creation
// // // //       </Typography>
// // // //       <form onSubmit={handleSubmit}>
// // // //         <TextField
// // // //           label="Username"
// // // //           fullWidth
// // // //           margin="normal"
// // // //           value={username}
// // // //           onChange={(e) => setUsername(e.target.value)}
// // // //         />
// // // //         <TextField
// // // //           label="Password"
// // // //           type="password"
// // // //           fullWidth
// // // //           margin="normal"
// // // //           value={password}
// // // //           onChange={(e) => setPassword(e.target.value)}
// // // //         />
// // // //         <Select
// // // //           label="Role"
// // // //           fullWidth
// // // //           margin="normal"
// // // //           value={role}
// // // //           onChange={(e) => setRole(e.target.value)}
// // // //         >
// // // //           <MenuItem value="admin">Admin</MenuItem>
// // // //           <MenuItem value="user">User</MenuItem>
// // // //         </Select>
// // // //         <Button type="submit" variant="contained" color="primary">
// // // //           Create User
// // // //         </Button>
// // // //       </form>
// // // //       {message && <Typography color="success">{message}</Typography>}
// // // //       {error && <Typography color="error">{error}</Typography>}
// // // //       <Typography variant="h6" gutterBottom>
// // // //         Existing Users
// // // //       </Typography>
// // // //       <ul>
// // // //         {users.map(user => (
// // // //           <li key={user._id}>{user.username} - {user.role}</li>
// // // //         ))}
// // // //       </ul>
// // // //     </Container>
// // // //   );
// // // // };

// // // // export default UserCreation;

// // // // // import React, { useState, useEffect } from 'react';
// // // // // import TextField from '@mui/material/TextField';
// // // // // import Button from '@mui/material/Button';
// // // // // import Container from '@mui/material/Container';
// // // // // import Typography from '@mui/material/Typography';
// // // // // import axios from 'axios';

// // // // // const UserCreation = () => {
// // // // //   const [username, setUsername] = useState('');
// // // // //   const [password, setPassword] = useState('');
// // // // //   const [role, setRole] = useState('user');
// // // // //   const [users, setUsers] = useState([]);
// // // // //   const [message, setMessage] = useState('');
// // // // //   const [error, setError] = useState('');

// // // // //   const fetchUsers = async () => {
// // // // //     try {
// // // // //       const response = await axios.get('http://localhost:8021/api/users');
// // // // //       setUsers(response.data.users);
// // // // //     } catch (error) {
// // // // //       setError('Failed to fetch users');
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     fetchUsers();
// // // // //   }, []);

// // // // //   const handleSubmit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     setMessage('');
// // // // //     setError('');
// // // // //     try {
// // // // //       const response = await axios.post('http://localhost:8021/api/users', { username, password, role });
// // // // //       setMessage(`User created: ${response.data.data.username}`);
// // // // //       fetchUsers(); // Refresh the user list
// // // // //     } catch (error) {
// // // // //       setError(`Error creating user: ${error.response ? error.response.data.message : error.message}`);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <Container maxWidth="sm">
// // // // //       <Typography variant="h4" gutterBottom>
// // // // //         User Creation
// // // // //       </Typography>
// // // // //       <form onSubmit={handleSubmit}>
// // // // //         <TextField
// // // // //           label="Username"
// // // // //           fullWidth
// // // // //           margin="normal"
// // // // //           value={username}
// // // // //           onChange={(e) => setUsername(e.target.value)}
// // // // //         />
// // // // //         <TextField
// // // // //           label="Password"
// // // // //           type="password"
// // // // //           fullWidth
// // // // //           margin="normal"
// // // // //           value={password}
// // // // //           onChange={(e) => setPassword(e.target.value)}
// // // // //         />
// // // // //         <TextField
// // // // //           label="Role"
// // // // //           fullWidth
// // // // //           margin="normal"
// // // // //           value={role}
// // // // //           onChange={(e) => setRole(e.target.value)}
// // // // //         />
// // // // //         <Button type="submit" variant="contained" color="primary">
// // // // //           Create User
// // // // //         </Button>
// // // // //       </form>
// // // // //       {message && <Typography color="success">{message}</Typography>}
// // // // //       {error && <Typography color="error">{error}</Typography>}
// // // // //       <Typography variant="h6" gutterBottom>
// // // // //         Existing Users
// // // // //       </Typography>
// // // // //       <ul>
// // // // //         {users.map(user => (
// // // // //           <li key={user._id}>{user.username} - {user.role}</li>
// // // // //         ))}
// // // // //       </ul>
// // // // //     </Container>
// // // // //   );
// // // // // };

// // // // // export default UserCreation;
