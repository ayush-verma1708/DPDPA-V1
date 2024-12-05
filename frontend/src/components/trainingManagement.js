import React, { useState, useEffect } from 'react';
import {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining,
} from '../api/trainingApi';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';

const TrainingComponent = () => {
  const [trainings, setTrainings] = useState([]);
  const [newTraining, setNewTraining] = useState({
    title: '',
    program: '',
    description: '',
    lectures: [{ title: '', url: '', duration: 0 }],
  });
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all trainings on initial render
  useEffect(() => {
    const fetchTrainings = async () => {
      setLoading(true);
      try {
        const data = await getAllTrainings();
        setTrainings(data.trainings);
      } catch (error) {
        console.error('Failed to fetch trainings:', error);
      }
      setLoading(false);
    };
    fetchTrainings();
  }, []);

  const handleCreateTraining = async () => {
    setLoading(true);
    try {
      const training = await createTraining(newTraining);
      setTrainings([...trainings, training]);
      setNewTraining({
        title: '',
        program: '',
        description: '',
        lectures: [{ title: '', url: '', duration: 0 }],
      });
    } catch (error) {
      console.error('Failed to create training:', error);
    }
    setLoading(false);
  };

  const handleDeleteTraining = async (id) => {
    setLoading(true);
    try {
      await deleteTraining(id);
      setTrainings(trainings.filter((training) => training._id !== id));
    } catch (error) {
      console.error('Failed to delete training:', error);
    }
    setLoading(false);
  };

  const handleUpdateTraining = async (id) => {
    setLoading(true);
    try {
      const updatedTraining = await updateTraining(id, selectedTraining);
      setTrainings(
        trainings.map((training) =>
          training._id === id ? updatedTraining : training
        )
      );
      setSelectedTraining(null);
    } catch (error) {
      console.error('Failed to update training:', error);
    }
    setLoading(false);
  };

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Training Programs
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <List>
            {trainings.map((training) => (
              <ListItem key={training._id} divider>
                <ListItemText
                  primary={training.title}
                  secondary={training.description}
                />
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => setSelectedTraining(training)}
                >
                  Edit
                </Button>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => handleDeleteTraining(training._id)}
                >
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>

          <Box mt={4}>
            <Typography variant='h5'>Create New Training</Typography>
            <TextField
              label='Title'
              value={newTraining.title}
              onChange={(e) =>
                setNewTraining({ ...newTraining, title: e.target.value })
              }
              fullWidth
              margin='normal'
            />
            <TextField
              label='Description'
              value={newTraining.description}
              onChange={(e) =>
                setNewTraining({ ...newTraining, description: e.target.value })
              }
              fullWidth
              margin='normal'
              multiline
              rows={4}
            />
            <Button
              variant='contained'
              color='primary'
              onClick={handleCreateTraining}
              disabled={loading}
            >
              Create Training
            </Button>
          </Box>

          {selectedTraining && (
            <Box mt={4}>
              <Typography variant='h5'>
                Edit Training: {selectedTraining.title}
              </Typography>
              <TextField
                label='Title'
                value={selectedTraining.title}
                onChange={(e) =>
                  setSelectedTraining({
                    ...selectedTraining,
                    title: e.target.value,
                  })
                }
                fullWidth
                margin='normal'
              />
              <TextField
                label='Description'
                value={selectedTraining.description}
                onChange={(e) =>
                  setSelectedTraining({
                    ...selectedTraining,
                    description: e.target.value,
                  })
                }
                fullWidth
                margin='normal'
                multiline
                rows={4}
              />
              <Button
                variant='contained'
                color='primary'
                onClick={() => handleUpdateTraining(selectedTraining._id)}
                disabled={loading}
              >
                Update Training
              </Button>
              <Button
                variant='contained'
                onClick={() => setSelectedTraining(null)}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default TrainingComponent;
