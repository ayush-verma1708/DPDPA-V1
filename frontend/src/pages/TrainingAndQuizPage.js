import React, { useState, useEffect } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReactPlayer from 'react-player';
import { getAssignmentsByUser } from '../api/assignmentApi'; // Adjust the path as necessary
import useFetchUser from '../hooks/useCurrentUser'; // Adjust the path if necessary
import ViewQuiz from '../components/viewQuiz';

import { getQuizByTrainingid } from '../api/quizApi';

const TrainingAndQuizPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const token = localStorage.getItem('token');
  const { user, loading, error } = useFetchUser(token);
  const userId = user ? user._id : null;

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!userId) return;
      try {
        const assignments = await getAssignmentsByUser(userId);
        setTrainings(
          assignments.filter((a) => a.itemType === 'Training') || []
        );
        setQuizzes(assignments.filter((a) => a.itemType === 'Quiz') || []);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, [userId]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleTrainingCompletion = async (training) => {
    setSelectedTraining(training);
    setTabIndex(1); // Navigate to the quiz tab
    try {
      const quiz = await getQuizByTrainingid(training.item._id);
      console.log(quiz[0]._id);
      setQuizzes([quizzes]);
      setQuiz(quiz[0]._id);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleLectureSelect = (lecture) => {
    setSelectedLecture(lecture);
  };

  if (loading) {
    return (
      <Typography variant='h6' align='center'>
        Loading...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant='h6' align='center' color='error'>
        Error loading data
      </Typography>
    );
  }

  return (
    <div>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label='Trainings' />
        <Tab label='Quiz' />
      </Tabs>
      {tabIndex === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant='h5' align='center' gutterBottom>
              Trainings
            </Typography>
            <List>
              {trainings.map((training) => (
                <div key={training._id}>
                  <ListItem>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant='h6'>
                          {training.item?.title || 'No Title'}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant='body1'>
                          {training.item?.description || 'No Description'}
                        </Typography>
                        <Typography variant='caption'>
                          Due Date:{' '}
                          {training.dueDate
                            ? new Date(training.dueDate).toLocaleDateString()
                            : 'No Due Date'}
                        </Typography>
                        <List>
                          {training.item?.lectures?.map((lecture) => (
                            <ListItem
                              button
                              key={lecture._id}
                              onClick={() => handleLectureSelect(lecture)}
                            >
                              <ListItemText primary={lecture.title} />
                            </ListItem>
                          )) || 'No Lectures'}
                        </List>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={() =>
                                handleTrainingCompletion(training)
                              }
                              color='primary'
                            />
                          }
                          label='Mark as Completed'
                        />
                      </AccordionDetails>
                    </Accordion>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </Grid>
          <Grid item xs={8}>
            {selectedLecture ? (
              <div>
                <Typography variant='h5' gutterBottom>
                  {selectedLecture.title}
                </Typography>
                <ReactPlayer url={selectedLecture.url} controls width='100%' />
                <Typography variant='body1' style={{ marginTop: '10px' }}>
                  Duration: {selectedLecture.duration} minutes
                </Typography>
              </div>
            ) : (
              <Typography variant='h6' align='center'>
                Select a lecture to view details
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
      {tabIndex === 1 && (
        <div>
          {quizzes.length > 0 ? (
            <ViewQuiz userId={userId} quizId={quiz} />
          ) : (
            <Typography
              variant='h5'
              align='center'
              color='success.main'
              gutterBottom
            >
              Congratulations! You have completed all available quizzes.
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainingAndQuizPage;
