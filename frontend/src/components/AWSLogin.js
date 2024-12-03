import React, { useState, useEffect } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Chip,
  Stack,
  Tooltip,
  Container,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Cloud, LockOpen, Lock } from '@mui/icons-material';

const AWSLogin = () => {
  const [account, setAccount] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // AWS Cognito User Pool configuration
  const poolData = {
    UserPoolId: 'us-east-1_example', // Your User Pool ID
    ClientId: 'exampleclientid', // Your Client ID
  };
  const userPool = new CognitoUserPool(poolData);

  // Login function with AWS Cognito
  const login = async () => {
    const authenticationData = {
      Username: 'planet-user', // Replace with actual username
      Password: '0uz5lR8!', // Replace with actual password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const userData = {
      Username: 'planet-user', // Replace with actual username
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-1:example-identity-pool-id', // Your Identity Pool ID
          Logins: {
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_example': result
              .getIdToken()
              .getJwtToken(),
          },
        });
        setAccount({ username: cognitoUser.getUsername() });
        fetchAllData();
      },
      onFailure: (err) => {
        console.error('Login error:', err);
      },
    });
  };

  // Logout function
  const logout = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
      setAccount(null);
    }
  };

  // Fetch all data from AWS services
  const fetchAllData = async () => {
    try {
      // Fetch user details
      const userDetails = await fetchUserDetails();
      setUserDetails(userDetails);
    } catch (error) {
      console.error('Error fetching all data:', error);
    }
  };

  // Fetch user details from AWS Cognito
  const fetchUserDetails = async () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.error('Error fetching user details:', err);
          return;
        }
        setUserDetails({ username: cognitoUser.getUsername() });
      });
    }
  };

  useEffect(() => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.error('Initialization error:', err);
          return;
        }
        setAccount({ username: cognitoUser.getUsername() });
        fetchAllData();
      });
    }
  }, []);

  return (
    <Container maxWidth='md'>
      <Box sx={{ mt: 4 }}>
        {!account ? (
          <Card>
            <CardContent>
              <Typography variant='h5' gutterBottom>
                AWS Login
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Button
                variant='contained'
                color='primary'
                startIcon={<LockOpen />}
                onClick={login}
              >
                Login to AWS
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
              >
                <Typography variant='h6'>AWS Services Info</Typography>
                <Stack direction='row' spacing={2}>
                  <Tooltip
                    title={
                      <Box>
                        <Typography>Connected to AWS</Typography>
                        <Button
                          variant='contained'
                          color='secondary'
                          size='small'
                          startIcon={<Lock />}
                          onClick={logout}
                          sx={{ mt: 1 }}
                        >
                          Logout
                        </Button>
                      </Box>
                    }
                  >
                    <Chip
                      icon={<Cloud />}
                      label='AWS'
                      color='primary'
                      variant='outlined'
                    />
                  </Tooltip>
                </Stack>
              </Stack>
            </Paper>
            <Grid container spacing={3}>
              {userDetails && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant='h6'>User Details</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography>Username: {userDetails.username}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Box>
    </Container>
  );
};

export default AWSLogin;
