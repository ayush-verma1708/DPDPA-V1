import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@mui/material';
import { getAllQuizzes, getQuizById } from '../api/quizApi';

const ViewQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);

  // Fetch all quizzes on component load
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const data = await getAllQuizzes();
        console.log(data);
        setQuizzes(data.quizzes); // Assuming the API returns a quizzes field
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  // Fetch quiz details based on selected quiz
  useEffect(() => {
    if (selectedQuizId) {
      const fetchQuiz = async () => {
        setLoading(true);
        try {
          const data = await getQuizById(selectedQuizId);
          setQuiz(data.quiz); // Ensure the correct field is accessed
          setResponses(new Array(data.quiz.questions.length).fill('')); // Reset responses on quiz change
        } catch (error) {
          console.error('Error fetching quiz:', error);
        }
        setLoading(false);
      };

      fetchQuiz();
    }
  }, [selectedQuizId]);

  const handleQuizSelection = (event) => {
    setSelectedQuizId(event.target.value);
  };

  const handleOptionChange = (questionIndex, value) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = value;
    setResponses(newResponses);
  };

  const handleSubmit = () => {
    console.log('User responses:', responses); // Handle form submission
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant='h4' gutterBottom>
        Select a Quiz
      </Typography>

      {/* Quiz selection dropdown */}
      <FormControl fullWidth>
        <InputLabel id='select-quiz-label'>Select Quiz</InputLabel>
        <Select
          labelId='select-quiz-label'
          value={selectedQuizId}
          onChange={handleQuizSelection}
          label='Select Quiz'
        >
          {quizzes.map((quiz) => (
            <MenuItem key={quiz._id} value={quiz._id}>
              {quiz.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Show quiz questions if a quiz is selected */}
      {loading ? (
        <CircularProgress sx={{ marginTop: 2 }} />
      ) : (
        quiz &&
        selectedQuizId && (
          <Box sx={{ marginTop: 4 }}>
            <Typography variant='h5' gutterBottom>
              {quiz.title}
            </Typography>

            {quiz.questions &&
              quiz.questions.map((question, questionIndex) => (
                <Box key={question._id} sx={{ marginBottom: 4 }}>
                  <Typography variant='h6'>{question.questionText}</Typography>

                  <RadioGroup
                    value={responses[questionIndex]}
                    onChange={(e) =>
                      handleOptionChange(questionIndex, e.target.value)
                    }
                  >
                    {question.options.map((option) => (
                      <FormControlLabel
                        key={option._id}
                        value={option._id}
                        control={<Radio />}
                        label={option.optionText}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              ))}

            <Button
              variant='contained'
              color='primary'
              sx={{ marginTop: 2 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        )
      )}
    </Box>
  );
};

export default ViewQuiz;
