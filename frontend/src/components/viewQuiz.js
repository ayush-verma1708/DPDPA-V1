import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { getQuizById } from '../api/quizApi';
import { getAssignmentsByUser, submitQuizAnswers } from '../api/userAnswerApi';

const ViewQuiz = ({ quizId, userId }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [previousRecords, setPreviousRecords] = useState([]);

  // Fetch quiz details based on quizId
  useEffect(() => {
    if (quizId) {
      const fetchQuiz = async () => {
        setLoading(true);
        try {
          const data = await getQuizById(quizId);
          setQuiz(data.quiz);
          setResponses(new Array(data.quiz.questions.length).fill('')); // Reset responses
        } catch (error) {
          console.error('Error fetching quiz:', error);
        }
        setLoading(false);
      };

      fetchQuiz();
    }
  }, [quizId]);

  // Fetch user's previous records
  useEffect(() => {
    if (quizId && userId) {
      const fetchRecords = async () => {
        try {
          const records = await getAssignmentsByUser(quizId, userId);
          console.log('Found', records);
          setPreviousRecords(records);
        } catch (error) {
          console.error('Error fetching previous records:', error);
        }
      };

      fetchRecords();
    }
  }, [quizId, userId]);

  const handleOptionChange = (questionIndex, value) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async () => {
    try {
      const answers = quiz.questions.map((question, index) => ({
        questionId: question._id,
        selectedOptionId: responses[index],
      }));

      const result = await submitQuizAnswers(quizId, userId, answers);
      setSubmissionResult(result);

      // Fetch updated records after submission
      const updatedRecords = await getAssignmentsByUser(quizId, userId);
      setPreviousRecords(updatedRecords);
    } catch (error) {
      console.error('Error submitting quiz answers:', error);
    }
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

            {submissionResult && (
              <Box sx={{ marginTop: 4 }}>
                <Typography variant='h6'>Quiz Submission Result</Typography>
                <Typography>Score: {submissionResult.score}</Typography>
                <Typography>
                  Passed: {submissionResult.passed ? 'Yes' : 'No'}
                </Typography>
              </Box>
            )}

            {previousRecords.length > 0 ? (
              <Box sx={{ marginTop: 4 }}>
                <Typography variant='h6'>Previous Records</Typography>
                <Paper>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Passed</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previousRecords.map((record) => (
                        <TableRow key={record._id}>
                          {/* <TableCell>{record.submittedAt}</TableCell>
                           */}
                          <TableCell>
                            {new Date(record.submittedAt).toLocaleDateString(
                              'en-GB',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}
                          </TableCell>

                          <TableCell>{record.score}</TableCell>
                          <TableCell>{record.passed ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            ) : (
              <Typography variant='h6' sx={{ marginTop: 4 }}>
                No previous records found.
              </Typography>
            )}
          </Box>
        )
      )}
    </Box>
  );
};

export default ViewQuiz;
