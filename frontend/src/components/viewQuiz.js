import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@mui/material';
import { getQuizById } from '../api/quizApi';

const ViewQuiz = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);

  // Fetch quiz details based on quizId prop
  useEffect(() => {
    if (quizId) {
      const fetchQuiz = async () => {
        setLoading(true);
        try {
          console.log('searching', quizId);
          const data = await getQuizById(quizId);
          console.log('searched', data);
          setQuiz(data.quiz); // Ensure the correct field is accessed
          setResponses(new Array(data.quiz.questions.length).fill('')); // Reset responses on quiz change
        } catch (error) {
          console.error('Error fetching quiz:', error);
        }
        setLoading(false);
      };

      fetchQuiz();
    }
  }, [quizId]);

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
      {loading ? (
        <CircularProgress sx={{ marginTop: 2 }} />
      ) : (
        quiz && (
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
