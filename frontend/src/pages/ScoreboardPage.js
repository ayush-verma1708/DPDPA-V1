// src/pages/Scoreboard.js

import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import ScoreboardComponent from '../components/Scoreboard'; // Rename the import to avoid conflict
import LineageDiagram from '../components/RiskLineage';

const ScoreboardPage = () => {
  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Scoreboard
      </Typography>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Box>
          <ScoreboardComponent />
        </Box>
        <Box>
          <LineageDiagram />
        </Box>
      </Paper>
    </Container>
  );
};

export default ScoreboardPage;
