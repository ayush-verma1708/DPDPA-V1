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
    title: 'Compliance Training',
    program: 'Compliance',
    description: 'A training program on company compliance policies',
    lectures: [
      {
        title: 'Introduction to Compliance',
        url: 'https://example.com/lecture1',
        duration: 30,
      },
      {
        title: 'Advanced Compliance Topics',
        url: 'https://example.com/lecture2',
        duration: 45,
      },
    ],
  });
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLectureChange = (index, field, value) => {
    const updatedLectures = newTraining.lectures.map((lecture, i) =>
      i === index ? { ...lecture, [field]: value } : lecture
    );
    setNewTraining({ ...newTraining, lectures: updatedLectures });
  };

  const addLecture = () => {
    setNewTraining({
      ...newTraining,
      lectures: [...newTraining.lectures, { title: '', url: '', duration: 0 }],
    });
  };

  const removeLecture = (index) => {
    setNewTraining({
      ...newTraining,
      lectures: newTraining.lectures.filter((_, i) => i !== index),
    });
  };

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
      console.log(newTraining);
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
    window.location.reload();
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

            <Typography variant='h6'>Lectures</Typography>
            {newTraining.lectures.map((lecture, index) => (
              <Box key={index} mb={2}>
                <TextField
                  label='Lecture Title'
                  value={lecture.title}
                  onChange={(e) =>
                    handleLectureChange(index, 'title', e.target.value)
                  }
                  fullWidth
                  margin='normal'
                />
                <TextField
                  label='Lecture URL'
                  value={lecture.url}
                  onChange={(e) =>
                    handleLectureChange(index, 'url', e.target.value)
                  }
                  fullWidth
                  margin='normal'
                />
                <TextField
                  label='Lecture Duration'
                  type='number'
                  value={lecture.duration}
                  onChange={(e) =>
                    handleLectureChange(index, 'duration', e.target.value)
                  }
                  fullWidth
                  margin='normal'
                />
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => removeLecture(index)}
                >
                  Remove Lecture
                </Button>
              </Box>
            ))}
            <Button variant='contained' onClick={addLecture}>
              Add Lecture
            </Button>
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

              <Typography variant='h6'>Lectures</Typography>
              {selectedTraining.lectures.map((lecture, index) => (
                <Box key={index} mb={2}>
                  <TextField
                    label='Lecture Title'
                    value={lecture.title}
                    onChange={(e) =>
                      setSelectedTraining({
                        ...selectedTraining,
                        lectures: selectedTraining.lectures.map((lec, i) =>
                          i === index ? { ...lec, title: e.target.value } : lec
                        ),
                      })
                    }
                    fullWidth
                    margin='normal'
                  />
                  <TextField
                    label='Lecture URL'
                    value={lecture.url}
                    onChange={(e) =>
                      setSelectedTraining({
                        ...selectedTraining,
                        lectures: selectedTraining.lectures.map((lec, i) =>
                          i === index ? { ...lec, url: e.target.value } : lec
                        ),
                      })
                    }
                    fullWidth
                    margin='normal'
                  />
                  <TextField
                    label='Lecture Duration'
                    type='number'
                    value={lecture.duration}
                    onChange={(e) =>
                      setSelectedTraining({
                        ...selectedTraining,
                        lectures: selectedTraining.lectures.map((lec, i) =>
                          i === index
                            ? { ...lec, duration: e.target.value }
                            : lec
                        ),
                      })
                    }
                    fullWidth
                    margin='normal'
                  />
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() =>
                      setSelectedTraining({
                        ...selectedTraining,
                        lectures: selectedTraining.lectures.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                  >
                    Remove Lecture
                  </Button>
                </Box>
              ))}
              <Button
                variant='contained'
                onClick={() =>
                  setSelectedTraining({
                    ...selectedTraining,
                    lectures: [
                      ...selectedTraining.lectures,
                      { title: '', url: '', duration: 0 },
                    ],
                  })
                }
              >
                Add Lecture
              </Button>
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
