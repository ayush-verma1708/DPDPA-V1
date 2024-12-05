import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
  Container,
  Grid,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';

const UserAssignmentPage = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Ayush Verma' },
    { id: 2, name: 'Priyanshu' },
    { id: 3, name: 'Ishaan' },
  ]);

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

  useEffect(() => {
    // Fetch progress and quiz score from backend (using demo values for now)
    const demoAssignments = [
      {
        userId: 1,
        userName: 'Ayush Verma',
        trainingName: 'DPDPA Overview',
        assignedDate: '01/01/2023',
        completionDate: '01/10/2023',
        progress: 100,
        quizScore: '90%',
      },
      {
        userId: 2,
        userName: 'Ishaan',
        trainingName: 'Data Protection Principles',
        assignedDate: '01/05/2023',
        completionDate: null,
        progress: 50,
        quizScore: 'N/A',
      },
    ];
    setAssignments(demoAssignments);
  }, []);

  const handleAssign = () => {
    if (selectedUser && selectedTraining) {
      const user = users.find((user) => user.id === parseInt(selectedUser));
      const training = trainings.find(
        (training) => training.id === parseInt(selectedTraining)
      );

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

      setSelectedUser('');
      setSelectedTraining('');
      setProgress('');
      setQuizScore('');
      setAlertMessage(`Assigned "${training.name}" to "${user.name}".`);
      setTimeout(() => setAlertMessage(''), 3000); // Clear alert after 3 seconds
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
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
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

          {/* <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Progress'
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Quiz Score'
              value={quizScore}
              onChange={(e) => setQuizScore(e.target.value)}
            />
          </Grid>*/}
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
