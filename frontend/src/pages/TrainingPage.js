import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import TrainingComponent from '../components/trainingManagement';
import QuizComponent from '../components/quizManagement';
import { getAllTrainings } from '../api/trainingApi';

const TrainingQuizPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <Container className='training-quiz-container'>
      <Typography variant='h4' component='h1' gutterBottom>
        Create Training and Quiz
      </Typography>

      {/* Training Section */}
      <Box className='training-section' mb={4}>
        <Typography variant='h5' component='h2' gutterBottom>
          Training Section
        </Typography>
        <TrainingComponent />
      </Box>

      {/* Existing Trainings List */}
      <Box className='trainings-list' mb={4}>
        <Typography variant='h5' component='h2' gutterBottom>
          Existing Trainings
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {trainings.map((training) => (
              <ListItem
                key={training._id}
                button
                onClick={() => setSelectedTraining(training)}
              >
                <ListItemText primary={training.title} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Quiz Section */}
      {selectedTraining && (
        <Box className='quiz-section'>
          <Typography variant='h5' component='h2' gutterBottom>
            Quiz Section
          </Typography>
          <Box className='quiz-container'>
            <Typography variant='h6' component='h3' gutterBottom>
              Add Quiz for: {selectedTraining.title}
            </Typography>
            <QuizComponent training={selectedTraining} />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default TrainingQuizPage;
