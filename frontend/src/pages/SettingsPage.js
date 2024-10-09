import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import axios from 'axios';

const SettingsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [permissions, setPermissions] = useState({
    home: false,
    scoreboard: false,
    riskAnalysis: false,
    userCreation: false,
    assetManagement: false,
    listOfActions: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8021/api/users'); // Adjust the endpoint as needed
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setUsers([]); // Reset to an empty array if data is not an array
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
    setPermissions({
      home: false,
      scoreboard: false,
      riskAnalysis: false,
      userCreation: false,
      assetManagement: false,
      listOfActions: false,
    });
  };

  const handlePermissionChange = (event) => {
    const { name, checked } = event.target;
    setPermissions((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/update-permissions', {
        user: selectedUser,
        permissions,
      }); // Adjust as needed
      alert('Permissions updated successfully');
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Settings Page
      </Typography>
      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Box mb={3}>
          <FormControl fullWidth>
            <InputLabel id='user-select-label'>Select User</InputLabel>
            <Select
              labelId='user-select-label'
              value={selectedUser}
              onChange={handleUserChange}
              label='Select User'
            >
              {users.length > 0 ? (
                users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} {/* Adjust based on user data structure */}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value=''>No users available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ marginBottom: 2 }} />

        <Typography variant='h6' gutterBottom>
          Permissions
        </Typography>

        <Box>
          <Grid container spacing={2}>
            {Object.keys(permissions).map((permission) => (
              <Grid item xs={12} sm={6} key={permission}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={permission}
                      checked={permissions[permission]}
                      onChange={handlePermissionChange}
                    />
                  }
                  label={permission.replace(/([A-Z])/g, ' $1').toUpperCase()}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mt={3}>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSave}
            fullWidth
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
