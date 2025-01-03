import React, { useState, useEffect } from 'react';
import UserPreferencesForm from './UserPreferencesForm';
import { getUserResponsesByCompanyId } from '../api/userResonseApi';
import { getAllProductFamilies } from '../api/productFamilyApi';
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom'; // If using React Router for navigation
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material'; // Icon for the button
import './UserResponsesManager.css';

const UserResponsesManager = ({ companyId }) => {
  const [responses, setResponses] = useState([]);
  const [productFamilies, setProductFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch user responses
  const fetchUserResponses = async () => {
    try {
      const response = await getUserResponsesByCompanyId(companyId);
      const userResponses = response.data;
      setResponses(userResponses);
    } catch (err) {
      setError(err.message || 'Error fetching responses');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch product families
  const fetchProductFamilies = async () => {
    try {
      const data = await getAllProductFamilies();
      setProductFamilies(data);
    } catch (err) {
      setError('Error fetching product families');
    }
  };

  // Fetch user responses and product families on component mount
  useEffect(() => {
    fetchUserResponses();
    fetchProductFamilies();
  }, [companyId]);

  return (
    <div
      className='responses-container'
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80vh',
      }}
    >
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography
          variant='h6'
          color='error'
          align='center'
          sx={{ marginBottom: '1rem' }}
        >
          {error}
        </Typography>
      )}

      {/* Display user responses in a grid */}
      {responses.length > 0 ? (
        <>
          <Typography variant='h4' gutterBottom align='center'>
            Your Responses
          </Typography>
          <Grid container spacing={3} justifyContent='center'>
            {responses.map((response) => {
              const productFamily = productFamilies.find(
                (family) => family._id === response.productFamilyId
              );

              return (
                <Grid item xs={12} sm={6} md={4} key={response._id}>
                  <Paper
                    elevation={3}
                    sx={{ padding: '20px', borderRadius: '8px' }}
                  >
                    <Typography variant='h6' color='primary' gutterBottom>
                      <p style={{ fontWeight: 'bold', color: '#0073e6' }}>
                        {/* Display product family name */}
                        {response.productFamily.family_name}
                        {/* {productFamily ? productFamily.family_name : 'Unknown'} */}
                      </p>
                    </Typography>
                    <Box>
                      <Typography variant='body1' color='textSecondary'>
                        <strong>Selected Software:</strong>
                      </Typography>
                      <Typography variant='body2'>
                        {response.selectedSoftware
                          ? response.selectedSoftware.software_name
                          : 'None selected'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        <Typography variant='h6' align='center' gutterBottom>
          Kindly Submit Softwares for Product Families
        </Typography>
      )}

      {/* Show the UserPreferencesForm if there are no responses */}
      {responses.length === 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <UserPreferencesForm
            className='user-form'
            companyId={companyId}
            onSubmitSuccess={fetchUserResponses} // Re-fetch user responses after submission
          />
        </div>
      )}

      {/* Button at the bottom with an icon */}
      <Box
        sx={{ marginTop: '2rem', textAlign: 'center', marginBottom: '1rem' }}
      >
        <Button
          variant='contained'
          color='primary'
          fullWidth
          component={Link} // Using react-router-dom Link component
          to='/Compliance-Operation'
          startIcon={<ArrowForwardIcon />} // Icon to add to the button
        >
          Go Back To Compliance Operation
        </Button>
      </Box>
    </div>
  );
};

export default UserResponsesManager;
