import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import TrainingComponent from '../components/trainingManagement';
import QuizComponent from '../components/quizManagement';
import { getAllTrainings } from '../api/trainingApi';
import { getAllQuizzes } from '../api/quizApi';

const TrainingQuizPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

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

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const data = await getAllQuizzes();
        setQuizzes(data.quizzes);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      }
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Container className='training-quiz-container'>
      <Typography variant='h4' component='h1' gutterBottom>
        Training and Quiz Management
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label='Add New Training' />
        <Tab label='Existing Trainings' />
        <Tab label='Quiz Management' />
      </Tabs>
      {tabIndex === 0 && (
        <Box className='training-section' mb={4}>
          <Typography variant='h5' component='h2' gutterBottom>
            Add New Training
          </Typography>
          <TrainingComponent />
        </Box>
      )}
      {tabIndex === 1 && (
        <Box className='trainings-list' mt={4}>
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
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => setTabIndex(2)}
                  >
                    Manage Quiz
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}

      {tabIndex === 2 && selectedTraining && (
        <Box className='quiz-section'>
          <Typography variant='h5' component='h2' gutterBottom>
            Quiz Management for: {selectedTraining.title}
          </Typography>
          <QuizComponent training={selectedTraining} />
        </Box>
      )}
    </Container>
  );
};

export default TrainingQuizPage;
