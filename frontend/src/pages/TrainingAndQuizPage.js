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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReactPlayer from 'react-player';

const TrainingAndQuizPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const dummyTrainings = [
      {
        id: 1,
        title: 'Compliance Training',
        program: 'Compliance',
        description: 'A training program on company compliance policies.',
        lectures: [
          {
            title: 'Introduction to Compliance',
            url: 'https://youtu.be/HjhbJKK5OJU',
            duration: 30,
          },
          {
            title: 'Advanced Compliance Topics',
            url: 'https://youtu.be/LdllXZqRZUA',
            duration: 45,
          },
        ],
      },
      {
        id: 2,
        title: 'Cybersecurity Basics',
        description: 'Learn the basics of cybersecurity.',
        lectures: [
          {
            title: 'What is Cybersecurity?',
            url: 'https://youtu.be/HjhbJKK5OJU',
            duration: 20,
          },
          {
            title: 'Best Practices',
            url: 'https://youtu.be/LdllXZqRZUA',
            duration: 35,
          },
        ],
      },
    ];

    const dummyQuizzes = [
      {
        id: 1,
        title: 'Cybersecurity Quiz',
        description: 'Test your knowledge on cybersecurity.',
      },
      {
        id: 2,
        title: 'Data Privacy Quiz',
        description: 'Evaluate your understanding of data privacy.',
      },
    ];

    setTrainings(dummyTrainings);
    setQuizzes(dummyQuizzes);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      {/* Tabs for Navigation */}
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label='Trainings' />
        <Tab label='Quizzes' />
      </Tabs>

      {/* Content Section */}
      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#fff',
        }}
      >
        {tabIndex === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='h4' align='center' color='primary'>
                Assigned Trainings
              </Typography>
              <List>
                {trainings.map((training) => (
                  <React.Fragment key={training.id}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${training.id}-content`}
                        id={`panel-${training.id}-header`}
                      >
                        <Typography variant='h6'>{training.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant='body2' color='textSecondary'>
                          {training.description}
                        </Typography>
                        <List style={{ marginTop: '16px' }}>
                          {training.lectures.map((lecture, index) => (
                            <React.Fragment key={index}>
                              <ListItem>
                                <ListItemText
                                  primary={lecture.title}
                                  secondary={`Duration: ${lecture.duration} minutes`}
                                />
                                <Button
                                  variant='contained'
                                  color='primary'
                                  onClick={() => setSelectedVideo(lecture.url)}
                                  style={{ marginLeft: '16px' }}
                                >
                                  Watch
                                </Button>
                              </ListItem>
                              <Divider />
                            </React.Fragment>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                    <Divider style={{ margin: '16px 0' }} />
                  </React.Fragment>
                ))}
              </List>
            </Grid>

            {/* Video Player Section */}
            {selectedVideo && (
              <Grid item xs={12}>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <ReactPlayer url={selectedVideo} controls width='80%' />
                </div>
              </Grid>
            )}
          </Grid>
        )}

        {tabIndex === 1 && (
          <div>
            <Typography
              variant='h4'
              gutterBottom
              style={{ textAlign: 'center' }}
              color='primary'
            >
              Assigned Quizzes
            </Typography>
            <List>
              {quizzes.map((quiz) => (
                <React.Fragment key={quiz.id}>
                  <ListItem>
                    <ListItemText
                      primary={quiz.title}
                      secondary={quiz.description}
                    />
                    <Button
                      variant='contained'
                      color='secondary'
                      style={{ marginLeft: '16px' }}
                      onClick={() => alert(`Starting ${quiz.title}`)}
                    >
                      Start Quiz
                    </Button>
                  </ListItem>
                  <Divider style={{ marginTop: '8px' }} />
                </React.Fragment>
              ))}
            </List>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingAndQuizPage;
