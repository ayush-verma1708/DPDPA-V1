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
import {
  createAssignment,
  getAssignmentsByUser,
  getAllAssignments,
  assignToRole,
} from '../api/assignmentApi';

const UserAssignmentPage = () => {
  const [users, setUsers] = useState([]);

  const [trainings, setTrainings] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTraining, setSelectedTraining] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const [progress, setProgress] = useState('');
  const [quizScore, setQuizScore] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Fetch all users and populate the state
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getUsers(); // Fetch users using the API
        setUsers(userData.users);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]); // Set users to an empty array in case of error
      }
    };

    fetchUsers();
  }, []);

  // Fetch all users and populate the state
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const trainingData = await getAllTrainings(); // Fetch users using the API
        setTrainings(trainingData.trainings);
      } catch (error) {
        console.error('Error fetching Trainings:', error);
        setTrainings([]); // Set users to an empty array in case of error
      }
    };

    fetchTrainings();
  }, []);

  useEffect(() => {
    fetchAllAssignments();
  }, []);

  // Fetch all assignments and populate the state
  const fetchAllAssignments = async () => {
    try {
      const assignmentData = await getAllAssignments();
      console.log(assignmentData);
      const formattedAssignments = assignmentData.map((assignment) => ({
        userId: assignment.user._id,
        userName: assignment.user.username,
        trainingName: assignment.item.title,
        assignedDate: new Date(assignment.assignedAt).toLocaleDateString(),
        completionDate: assignment.completedAt
          ? new Date(assignment.completedAt).toLocaleDateString()
          : 'N/A',
        progress: assignment.status === 'Completed' ? 100 : 0,
        quizScore: assignment.score !== null ? assignment.score : 'N/A',
      }));
      setAssignments(formattedAssignments);
    } catch (error) {
      console.error('Error fetching all assignments:', error);
      setAssignments([]); // Set assignments to an empty array in case of error
    }
  };

  const handleAssign = async () => {
    if (selectedUser && selectedTraining) {
      const existingAssignment = assignments.find(
        (assignment) =>
          assignment.userId === selectedUser &&
          assignment.trainingName ===
            trainings.find((t) => t._id === selectedTraining).title
      );

      if (existingAssignment) {
        setAlertMessage(
          'This training is already assigned to the selected user.'
        );
        setTimeout(() => setAlertMessage(''), 3000);
        return;
      }

      console.log(selectedUser, selectedTraining);
      const user = users.find((user) => user._id === selectedUser);
      const training = trainings.find(
        (training) => training._id === selectedTraining
      );

      // Create the assignment through API
      const assignmentData = {
        user: user._id,
        item: training._id,
        itemType: 'Training',
        dueDate: new Date().toLocaleDateString(), // Just an example for due date
      };

      try {
        await createAssignment(assignmentData);
        setAssignments([
          ...assignments,
          {
            userId: user._id,
            userName: user.username,
            trainingName: training.title,
            assignedDate: new Date().toLocaleDateString(),
            completionDate: null,
            progress: 0,
            quizScore: 'N/A',
          },
        ]);

        setAlertMessage(`Assigned "${training.title}" to "${user.username}".`);
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
    fetchAllAssignments();
  };

  const handleAssignToRole = async () => {
    if (selectedRole && selectedTraining) {
      const existingAssignment = assignments.find(
        (assignment) =>
          assignment.userName === selectedRole &&
          assignment.trainingName ===
            trainings.find((t) => t._id === selectedTraining).title
      );

      if (existingAssignment) {
        setAlertMessage(
          'This training is already assigned to the selected role.'
        );
        setTimeout(() => setAlertMessage(''), 3000);
        return;
      }

      const assignmentData = {
        role: selectedRole,
        item: selectedTraining,
        itemType: 'Training',
        dueDate: new Date().toLocaleDateString(), // Just an example for due date
      };

      try {
        await assignToRole(assignmentData);
        setAlertMessage(
          `Assigned "${selectedTraining}" to role "${selectedRole}".`
        );
        setTimeout(() => setAlertMessage(''), 3000); // Clear alert after 3 seconds

        // Reset selection fields
        setSelectedRole('');
        setSelectedTraining('');
        fetchAllAssignments();
      } catch (error) {
        setAlertMessage('Failed to assign training to role. Please try again.');
        setTimeout(() => setAlertMessage(''), 3000);
      }
    } else {
      setAlertMessage('Please select a role and a training.');
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
                value={selectedUser || ''}
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
                value={selectedTraining || ''}
                onChange={(e) => setSelectedTraining(e.target.value)}
              >
                <MenuItem value=''>
                  <em>-- Select Training --</em>
                </MenuItem>
                {trainings.map((training) => (
                  <MenuItem key={training._id} value={training._id}>
                    {training.title}
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

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id='role-select-label'>Select Role</InputLabel>
              <Select
                labelId='role-select-label'
                value={selectedRole || ''}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <MenuItem value=''>
                  <em>-- Select Role --</em>
                </MenuItem>
                {users
                  .map((user) => user.role)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
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
                value={selectedTraining || ''}
                onChange={(e) => setSelectedTraining(e.target.value)}
              >
                <MenuItem value=''>
                  <em>-- Select Training --</em>
                </MenuItem>
                {trainings.map((training) => (
                  <MenuItem key={training._id} value={training._id}>
                    {training.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant='contained'
          color='secondary'
          onClick={handleAssignToRole}
          sx={{ mb: 4 }}
        >
          Assign Training to Role
        </Button>

        <Typography variant='h5' gutterBottom>
          Assigned Trainings
        </Typography>

        {assignments.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Training</TableCell>
                  <TableCell>Assigned Date</TableCell>
                  <TableCell>Completion Date</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Quiz Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.userId + assignment.trainingName}>
                    <TableCell>{assignment.userName}</TableCell>
                    <TableCell>{assignment.trainingName}</TableCell>
                    <TableCell>{assignment.assignedDate}</TableCell>
                    <TableCell>{assignment.completionDate}</TableCell>
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
