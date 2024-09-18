// src/pages/RiskAnalysis.js

import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import RiskDashboard from '../components/RiskDashboard'; // Adjust the path if necessary

const RiskAnalysis = () => {
  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Risk Analysis
      </Typography>
      <Paper sx={{ padding: 2 }}>
        <Box>
          <RiskDashboard />
        </Box>
      </Paper>
    </Container>
  );
};

export default RiskAnalysis;
