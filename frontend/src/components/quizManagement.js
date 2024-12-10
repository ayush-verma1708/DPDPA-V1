import React, { useState, useEffect } from 'react';
import { createQuiz, updateQuiz, deleteQuiz } from '../api/quizApi';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { getQuizByTrainingid } from '../api/quizApi';

const QuizComponent = ({ training }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    training: training._id,
    questions: [
      { questionText: '', options: [{ optionText: '', isCorrect: false }] },
    ],
    passingScore: 80,
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [viewQuiz, setViewQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        console.log('Fetching quiz by training ID...');
        const existingQuiz = await getQuizByTrainingid(training._id);
        if (existingQuiz) {
          console.log('Existing quiz found:', existingQuiz);
          setQuizzes(existingQuiz[0]);
          setViewQuiz(existingQuiz[0]);
          setTabIndex(1);
        } else {
          console.warn('No existing quiz found for this training ID.');
        }
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [training]);

  const handleCreateQuiz = async () => {
    setLoading(true);
    try {
      const quiz = await createQuiz(newQuiz);
      setQuizzes([...quizzes, quiz]);
      setNewQuiz({
        title: '',
        training: training._id,
        questions: [
          { questionText: '', options: [{ optionText: '', isCorrect: false }] },
        ],
        passingScore: 80,
      });
      setSuccessMessage('Quiz created successfully!');
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
    setLoading(false);
    window.location.reload();
  };

  const handleUpdateQuiz = async (id) => {
    setLoading(true);
    try {
      const updatedQuiz = await updateQuiz(id, selectedQuiz);
      setQuizzes(quizzes.map((quiz) => (quiz._id === id ? updatedQuiz : quiz)));
      setSelectedQuiz(null);
    } catch (error) {
      console.error('Failed to update quiz:', error);
    }
    setLoading(false);
  };

  const handleDeleteQuiz = async (id) => {
    setLoading(true);
    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
    setLoading(false);
  };

  const handleViewQuiz = (quiz) => {
    setViewQuiz(quiz);
    setTabIndex(1);
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Container>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label='Create Quizzes' />
        <Tab label='View Quiz' />
      </Tabs>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          {successMessage && (
            <Alert severity='success' onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          )}
          {tabIndex === 0 && !viewQuiz && (
            <Box>
              <List>
                {quizzes.map((quiz) => (
                  <ListItem key={quiz._id} component={Paper} sx={{ mb: 2 }}>
                    <ListItemText
                      primary={quiz.title}
                      secondary={`Training ID: ${quiz.training}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge='end'
                        onClick={() => handleViewQuiz(quiz)}
                      >
                        <Visibility />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              <Box component={Paper} p={2} mt={2}>
                <Typography variant='h5'>Create New Quiz</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label='Quiz Title'
                      value={newQuiz.title}
                      onChange={(e) =>
                        setNewQuiz({ ...newQuiz, title: e.target.value })
                      }
                      fullWidth
                      margin='normal'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label='Training ID'
                      value={newQuiz.training}
                      onChange={(e) =>
                        setNewQuiz({ ...newQuiz, training: e.target.value })
                      }
                      fullWidth
                      margin='normal'
                      disabled
                    />
                  </Grid>
                  {newQuiz.questions &&
                    newQuiz.questions.map((question, index) => (
                      <Grid item xs={12} key={index}>
                        <Paper variant='outlined' sx={{ p: 2, mb: 2 }}>
                          <TextField
                            label={`Question ${index + 1}`}
                            value={question.questionText}
                            onChange={(e) =>
                              setNewQuiz({
                                ...newQuiz,
                                questions: newQuiz.questions.map((q, i) =>
                                  i === index
                                    ? { ...q, questionText: e.target.value }
                                    : q
                                ),
                              })
                            }
                            fullWidth
                            margin='normal'
                          />
                          {question.options.map((option, optIndex) => (
                            <Grid container spacing={2} key={optIndex}>
                              <Grid item xs={8}>
                                <TextField
                                  label={`Option ${optIndex + 1}`}
                                  value={option.optionText}
                                  onChange={(e) =>
                                    setNewQuiz({
                                      ...newQuiz,
                                      questions: newQuiz.questions.map((q, i) =>
                                        i === index
                                          ? {
                                              ...q,
                                              options: q.options.map(
                                                (opt, oIndex) =>
                                                  oIndex === optIndex
                                                    ? {
                                                        ...opt,
                                                        optionText:
                                                          e.target.value,
                                                      }
                                                    : opt
                                              ),
                                            }
                                          : q
                                      ),
                                    })
                                  }
                                  fullWidth
                                  margin='normal'
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={option.isCorrect}
                                      onChange={(e) =>
                                        setNewQuiz({
                                          ...newQuiz,
                                          questions: newQuiz.questions.map(
                                            (q, i) =>
                                              i === index
                                                ? {
                                                    ...q,
                                                    options: q.options.map(
                                                      (opt, oIndex) =>
                                                        oIndex === optIndex
                                                          ? {
                                                              ...opt,
                                                              isCorrect:
                                                                e.target
                                                                  .checked,
                                                            }
                                                          : opt
                                                    ),
                                                  }
                                                : q
                                          ),
                                        })
                                      }
                                    />
                                  }
                                  label='Correct'
                                />
                              </Grid>
                            </Grid>
                          ))}
                          <Button
                            startIcon={<Add />}
                            onClick={() =>
                              setNewQuiz({
                                ...newQuiz,
                                questions: newQuiz.questions.map((q, i) =>
                                  i === index
                                    ? {
                                        ...q,
                                        options: [
                                          ...q.options,
                                          { optionText: '', isCorrect: false },
                                        ],
                                      }
                                    : q
                                ),
                              })
                            }
                          >
                            Add Option
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  <Grid item xs={12}>
                    <Button
                      startIcon={<Add />}
                      onClick={() =>
                        setNewQuiz({
                          ...newQuiz,
                          questions: [
                            ...newQuiz.questions,
                            {
                              questionText: '',
                              options: [{ optionText: '', isCorrect: false }],
                            },
                          ],
                        })
                      }
                    >
                      Add Question
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      onClick={handleCreateQuiz}
                      disabled={loading}
                      variant='contained'
                      color='primary'
                    >
                      Create Quiz
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {selectedQuiz && (
                <Box component={Paper} p={2} mt={2}>
                  <Typography variant='h5'>
                    Edit Quiz: {selectedQuiz.title}
                  </Typography>
                  <TextField
                    label='Quiz Title'
                    value={selectedQuiz.title}
                    onChange={(e) =>
                      setSelectedQuiz({
                        ...selectedQuiz,
                        title: e.target.value,
                      })
                    }
                    fullWidth
                    margin='normal'
                  />
                  {/* Same UI for editing questions */}
                  <Button
                    onClick={() => handleUpdateQuiz(selectedQuiz._id)}
                    disabled={loading}
                    variant='contained'
                    color='primary'
                  >
                    Update Quiz
                  </Button>
                  <Button onClick={() => setSelectedQuiz(null)}>Cancel</Button>
                </Box>
              )}
            </Box>
          )}
          {tabIndex === 1 && viewQuiz ? (
            <Box component={Paper} p={2} mt={2}>
              <Typography variant='h5'>View Quiz: {viewQuiz.title}</Typography>
              <Typography variant='body1'>
                Training ID: {viewQuiz.training}
              </Typography>
              <Typography variant='body1'>
                Passing Score: {viewQuiz.passingScore}
              </Typography>
              {viewQuiz.questions &&
                viewQuiz.questions.map((question, index) => (
                  <Box key={index} mt={2}>
                    <Typography variant='h6'>
                      Question {index + 1}: {question.questionText}
                    </Typography>
                    {question.options.map((option, optIndex) => (
                      <Typography key={optIndex} variant='body2'>
                        Option {optIndex + 1}: {option.optionText}{' '}
                        {option.isCorrect ? '(Correct)' : ''}
                      </Typography>
                    ))}
                  </Box>
                ))}
              <Button onClick={() => setTabIndex(0)}>Back</Button>
            </Box>
          ) : (
            <Typography variant='body1'>Quiz Already Created</Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default QuizComponent;
