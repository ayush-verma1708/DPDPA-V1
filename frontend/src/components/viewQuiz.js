import React from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

const ViewQuizComponent = ({ quiz }) => {
  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        {quiz.title}
      </Typography>
      <Typography variant='h6' gutterBottom>
        Training ID: {quiz.training}
      </Typography>
      <Typography variant='h6' gutterBottom>
        Passing Score: {quiz.passingScore}%
      </Typography>
      <Box mt={2}>
        <List>
          {quiz.questions.map((question, index) => (
            <ListItem key={index} component={Paper} sx={{ mb: 2 }}>
              <ListItemText
                primary={`Question ${index + 1}: ${question.questionText}`}
              />
              <Box mt={2}>
                {question.options.map((option, optIndex) => (
                  <Grid container spacing={2} key={optIndex}>
                    <Grid item xs={8}>
                      <Typography variant='body1'>
                        {`Option ${optIndex + 1}: ${option.optionText}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={option.isCorrect} disabled />
                        }
                        label='Correct'
                      />
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ViewQuizComponent;
