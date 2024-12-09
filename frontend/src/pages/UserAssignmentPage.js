import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import { getUsers } from '../api/userApi'; // Assuming your API is in this file
import { getAllTrainings } from '../api/trainingApi';
import { createAssignment, getAssignmentsByUser } from '../api/assignmentApi';

const UserAssignmentPage = () => {
  const [users, setUsers] = useState([]);

  const [trainings, setTrainings] = useState([
    { id: 1, name: 'DPDPA Overview' },
    { id: 2, name: 'Data Protection Principles' },
    { id: 3, name: 'Compliance and Enforcement' },
  ]);

  const [assignments, setAssignments] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTraining, setSelectedTraining] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [progress, setProgress] = useState('');
  const [quizScore, setQuizScore] = useState('');

  // Fetch all users and populate the state
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('fetching users');
        const userData = await getUsers(); // Fetch users using the API
        console.log(userData.users);
        setUsers(userData.users);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]); // Set users to an empty array in case of error
      }
    };

    fetchUsers();
  }, []);

  // Fetch assignments for a specific user when selected
  useEffect(() => {
    if (selectedUser) {
      getAssignmentsByUser(selectedUser)
        .then((data) => setAssignments(data))
        .catch((error) => console.error('Error fetching assignments:', error));
    }
  }, [selectedUser]);

  const handleAssign = async () => {
    if (selectedUser && selectedTraining) {
      const user = users.find((user) => user.id === parseInt(selectedUser));
      const training = trainings.find(
        (training) => training.id === parseInt(selectedTraining)
      );

      // Create the assignment through API
      const assignmentData = {
        user: user.id,
        item: training.id,
        itemType: 'Training',
        dueDate: new Date().toLocaleDateString(), // Just an example for due date
      };

      try {
        await createAssignment(assignmentData);
        setAssignments([
          ...assignments,
          {
            userId: user.id,
            userName: user.name,
            trainingName: training.name,
            assignedDate: new Date().toLocaleDateString(),
            completionDate: null,
            progress: 0,
            quizScore: 'N/A',
          },
        ]);

        setAlertMessage(`Assigned "${training.name}" to "${user.name}".`);
        setTimeout(() => setAlertMessage(''), 3000); // Clear alert after 3 seconds

        // Reset selection fields
        setSelectedUser('');
        setSelectedTraining('');
        setProgress('');
        setQuizScore('');
      } catch (error) {
        setAlertMessage('Failed to assign training. Please try again.');
        setTimeout(() => setAlertMessage(''), 3000);
      }
    } else {
      setAlertMessage('Please select a user and a training.');
      setTimeout(() => setAlertMessage(''), 3000);
    }
  };

  return (
    <Container maxWidth='xl' sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant='h4' gutterBottom>
          User Assignment Page
        </Typography>

        {alertMessage && (
          <Alert severity='info' sx={{ mb: 2 }}>
            {alertMessage}
          </Alert>
        )}

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='user-select-label'>Select User</InputLabel>
              <Select
                labelId='user-select-label'
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <MenuItem value=''>
                  <em>-- Select User --</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.username} - {user.role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='training-select-label'>
                Select Training
              </InputLabel>
              <Select
                labelId='training-select-label'
                value={selectedTraining}
                onChange={(e) => setSelectedTraining(e.target.value)}
              >
                <MenuItem value=''>
                  <em>-- Select Training --</em>
                </MenuItem>
                {trainings.map((training) => (
                  <MenuItem key={training.id} value={training.id}>
                    {training.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant='contained'
          color='primary'
          onClick={handleAssign}
          sx={{ mb: 4 }}
        >
          Assign Training
        </Button>

        <Typography variant='h5' gutterBottom>
          Assigned Trainings
        </Typography>
        {assignments.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Training Name</TableCell>
                  <TableCell>Assigned Date</TableCell>
                  <TableCell>Completion Date</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Quiz Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell>{assignment.userName}</TableCell>
                    <TableCell>{assignment.trainingName}</TableCell>
                    <TableCell>{assignment.assignedDate}</TableCell>
                    <TableCell>{assignment.completionDate || 'N/A'}</TableCell>
                    <TableCell>
                      <LinearProgress
                        variant='determinate'
                        value={assignment.progress}
                      />
                    </TableCell>
                    <TableCell>{assignment.quizScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No trainings assigned yet.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default UserAssignmentPage;
