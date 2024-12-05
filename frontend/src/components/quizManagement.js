import React, { useState, useEffect } from 'react';
import {
  createQuiz,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
} from '../api/quizApi';
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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const QuizComponent = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    training: '',
    questions: [{ question: '', options: ['', '', '', ''], answer: '' }],
    passingScore: 80,
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleCreateQuiz = async () => {
    setLoading(true);
    try {
      const quiz = await createQuiz(newQuiz);
      setQuizzes([...quizzes, quiz]);
      setNewQuiz({
        title: '',
        training: '',
        questions: [{ question: '', options: ['', '', '', ''], answer: '' }],
        passingScore: 80,
      });
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
    setLoading(false);
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

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Quizzes
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
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
                    aria-label='edit'
                    onClick={() => setSelectedQuiz(quiz)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge='end'
                    aria-label='delete'
                    onClick={() => handleDeleteQuiz(quiz._id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Box component={Paper} p={2} mt={2}>
            <Typography variant='h5'>Create New Quiz</Typography>
            <TextField
              label='Quiz Title'
              value={newQuiz.title}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, title: e.target.value })
              }
              fullWidth
              margin='normal'
            />
            <TextField
              label='Training ID'
              value={newQuiz.training}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, training: e.target.value })
              }
              fullWidth
              margin='normal'
            />
            <Box>
              {newQuiz.questions.map((question, index) => (
                <Box key={index} mb={2}>
                  <TextField
                    label={`Question ${index + 1}`}
                    value={question.question}
                    onChange={(e) =>
                      setNewQuiz({
                        ...newQuiz,
                        questions: newQuiz.questions.map((q, i) =>
                          i === index ? { ...q, question: e.target.value } : q
                        ),
                      })
                    }
                    fullWidth
                    margin='normal'
                  />
                  <TextField
                    label='Option 1'
                    value={question.options[0]}
                    onChange={(e) =>
                      setNewQuiz({
                        ...newQuiz,
                        questions: newQuiz.questions.map((q, i) =>
                          i === index
                            ? {
                                ...q,
                                options: [
                                  e.target.value,
                                  ...q.options.slice(1),
                                ],
                              }
                            : q
                        ),
                      })
                    }
                    fullWidth
                    margin='normal'
                  />
                  {/* Add more options similarly */}
                </Box>
              ))}
              <Button
                onClick={() =>
                  setNewQuiz({
                    ...newQuiz,
                    questions: [
                      ...newQuiz.questions,
                      { question: '', options: ['', '', '', ''], answer: '' },
                    ],
                  })
                }
              >
                Add Question
              </Button>
            </Box>
            <Button
              onClick={handleCreateQuiz}
              disabled={loading}
              variant='contained'
              color='primary'
            >
              Create Quiz
            </Button>
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
                  setSelectedQuiz({ ...selectedQuiz, title: e.target.value })
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
    </Container>
  );
};

export default QuizComponent;
