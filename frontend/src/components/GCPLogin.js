import React, { useState, useEffect } from 'react';
import { callMsGraph } from '../components/graph'; // Assuming you have a separate file for graph API calls
import { msalInstance } from '../components/msalInstance'; // Assuming you have a separate file for msalInstance
import { InteractionRequiredAuthError } from '@azure/msal-browser'; // Add missing import

import {
  fetchAccessLogs,
  fetchDataGovernance,
  fetchDataInventory,
  fetchAuditLogs,
} from '../api/azureFetchApi.js';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Container,
  Paper,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Person,
  Business,
  Storage,
  Timeline,
  Security,
  Assessment,
  AccountBox,
  ExpandMore,
  CheckCircle,
  Cancel,
  Domain,
  Cloud,
  Router,
  Refresh,
  Dashboard,
} from '@mui/icons-material';

// Update the formatValue function to better handle complex objects
const formatValue = (value) => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (Array.isArray(value)) {
    if (value.length === 0) return 'None';
    return (
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {value.map((item, i) => (
          <li key={i}>{formatValue(item)}</li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'object') {
    // Handle Date objects
    if (value instanceof Date) {
      return value.toLocaleString();
    }

    // Handle special cases for known object structures
    if (value.used !== undefined && value.total !== undefined) {
      return `${value.used} / ${value.total}`;
    }

    // For other objects, create a nested structure
    return (
      <Box sx={{ pl: 2 }}>
        {Object.entries(value).map(([k, v]) => {
          // Skip internal properties and null/undefined values
          if (k.startsWith('@') || v === null || v === undefined) return null;

          return (
            <Box key={k} sx={{ mb: 1 }}>
              <Typography variant='subtitle2' color='textSecondary'>
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </Typography>
              <Typography component='div'>{formatValue(v)}</Typography>
            </Box>
          );
        })}
      </Box>
    );
  }
  return String(value);
};

// Update how we render values in the Grid items for user and company details
const renderDetailItem = (key, value) => (
  <Grid item xs={12} key={key}>
    <Typography variant='subtitle2' color='textSecondary'>
      {key.charAt(0).toUpperCase() + key.slice(1)}
    </Typography>
    <Typography component='div'>{formatValue(value)}</Typography>
  </Grid>
);

// Update the DataCard component to use component="div" for Typography
const DataCard = ({ title, icon, children, data }) => (
  <Card sx={{ height: '100%', mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant='h6' sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {data ? (
        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Typography component='div'>{formatValue(data)}</Typography>
        </Box>
      ) : (
        children
      )}
    </CardContent>
  </Card>
);

// Add helper functions for company details organization
const organizeCompanyData = (companyDetails) => {
  if (!companyDetails?.value?.[0]) return null;
  const data = companyDetails.value[0];

  return {
    basicInfo: {
      displayName: data.displayName,
      businessPhones: data.businessPhones,
      technicalNotificationMails: data.technicalNotificationMails,
      createdDateTime: new Date(data.createdDateTime).toLocaleString(),
      preferredLanguage: data.preferredLanguage,
    },
    location: {
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      countryLetterCode: data.countryLetterCode,
    },
    quotaAndUsage: {
      directorySizeQuota: data.directorySizeQuota,
      tenantType: data.tenantType,
    },
    domains:
      data.verifiedDomains?.map((domain) => ({
        name: domain.name,
        type: domain.type,
        isDefault: domain.isDefault,
        // Convert capabilities to array if it's a string, or handle if it's an object
        capabilities:
          typeof domain.capabilities === 'string'
            ? [domain.capabilities]
            : Array.isArray(domain.capabilities)
            ? domain.capabilities
            : typeof domain.capabilities === 'object'
            ? Object.keys(domain.capabilities)
            : [],
      })) || [],
    plans: {
      assigned:
        data.assignedPlans?.filter(
          (plan) => plan.capabilityStatus === 'Enabled'
        ) || [],
      provisioned: data.provisionedPlans || [],
    },
  };
};

const renderStatusChip = (status) => (
  <Chip
    size='small'
    icon={status === 'Enabled' ? <CheckCircle /> : <Cancel />}
    color={status === 'Enabled' ? 'success' : 'error'}
    label={status}
  />
);

const AzureLogin = () => {
  const [account, setAccount] = useState(null); // To store user account info
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Handle UI popup state
  const [userDetails, setUserDetails] = useState(null); // To store additional user details
  const [companyDetails, setCompanyDetails] = useState(null); // To store company details
  const [dataInventory, setDataInventory] = useState(null);
  const [accessLogs, setAccessLogs] = useState(null);
  const [dataGovernance, setDataGovernance] = useState(null);
  const [auditLogs, setAuditLogs] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0); // Define missing state

  // Decode JWT to extract user details
  function decodeJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  // Update the company details card rendering
  const CompanyDetailsCard = ({ data }) => {
    const organized = organizeCompanyData(data);
    if (!organized) return null;

    return (
      <DataCard title='Company Details' icon={<Business color='primary' />}>
        <Tabs
          value={selectedTab}
          onChange={(e, v) => setSelectedTab(v)}
          sx={{ mb: 2 }}
        >
          <Tab label='Basic Info' />
          <Tab label='Location' />
          <Tab label='Services' />
          <Tab label='Domains' />
        </Tabs>

        {selectedTab === 0 && (
          <Stack spacing={2}>
            {Object.entries(organized.basicInfo).map(([key, value]) => (
              <Box key={key}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Typography>
                <Typography>
                  {Array.isArray(value) ? value.join(', ') : value || 'N/A'}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}

        {selectedTab === 1 && (
          <Stack spacing={2}>
            {Object.entries(organized.location).map(([key, value]) => (
              <Box key={key}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Typography>
                <Typography>{value || 'N/A'}</Typography>
              </Box>
            ))}
          </Stack>
        )}

        {selectedTab === 2 && (
          <Stack spacing={2}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>
                  Assigned Plans ({organized.plans.assigned.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {organized.plans.assigned.map((plan, idx) => (
                    <Grid item xs={12} key={idx}>
                      <Paper variant='outlined' sx={{ p: 1 }}>
                        <Stack
                          direction='row'
                          justifyContent='space-between'
                          alignItems='center'
                        >
                          <Typography variant='subtitle2'>
                            {plan.service}
                          </Typography>
                          {renderStatusChip(plan.capabilityStatus)}
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Stack>
        )}

        {selectedTab === 3 && (
          <Stack spacing={2}>
            {organized.domains.map((domain, idx) => (
              <Paper key={idx} variant='outlined' sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Typography variant='subtitle1'>{domain.name}</Typography>
                    {domain.isDefault && (
                      <Chip
                        size='small'
                        icon={<Domain />}
                        label='Default'
                        color='primary'
                      />
                    )}
                  </Stack>
                  <Typography variant='body2' color='textSecondary'>
                    Type: {domain.type}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Capabilities:{' '}
                    {Array.isArray(domain.capabilities)
                      ? domain.capabilities.join(', ')
                      : 'None'}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </DataCard>
    );
  };

  // Login function with corrected scopes
  const login = async () => {
    try {
      setIsPopupOpen(true);
      const response = await msalInstance.loginPopup({
        scopes: [
          'openid',
          'profile',
          'email',
          'User.Read',
          'Directory.Read.All',
          'AuditLog.Read.All',
          'Reports.Read.All',
        ],
      });

      // Decode ID token for user details
      const decodedToken = decodeJwt(response.idToken);

      setAccount({
        username:
          decodedToken.preferred_username ||
          decodedToken.name ||
          'Unknown User',
        email: decodedToken.email,
      });

      // Use the new fetchAllData function
      await fetchAllData();

      // Store session info
      localStorage.setItem('sessionId', response.account.homeAccountId);
      localStorage.setItem('authId', response.idToken);
    } catch (error) {
      console.error('Login error:', error);
      if (error.errorCode === 'invalid_scope') {
        console.error(
          'Invalid scope requested. Please check application permissions.'
        );
      }
    } finally {
      setIsPopupOpen(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await msalInstance.initialize(); // Ensure MSAL instance is initialized
      await msalInstance.logoutPopup();
      localStorage.removeItem('sessionId');
      localStorage.removeItem('authId');
      setAccount(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  // Add new function to fetch all data
  const fetchAllData = async () => {
    try {
      // Fetch additional user details
      const userDetails = await fetchUserDetails();
      setUserDetails(userDetails);

      // Fetch company details
      const companyDetails = await fetchCompanyDetails();
      setCompanyDetails(companyDetails);

      // Fetch other data
      try {
        const dataInventoryResult = await fetchDataInventory();
        setDataInventory(dataInventoryResult);

        const accessLogsResult = await fetchAccessLogs();
        setAccessLogs(accessLogsResult);

        const dataGovernanceResult = await fetchDataGovernance();
        setDataGovernance(dataGovernanceResult);

        const auditLogsResult = await fetchAuditLogs();
        setAuditLogs(auditLogsResult);
      } catch (dataError) {
        console.error('Error fetching data:', dataError);
      }
    } catch (error) {
      console.error('Error fetching all data:', error);
    }
  };

  // Initialize MSAL and attempt silent login
  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize(); // Ensure MSAL instance is initialized

        const sessionId = localStorage.getItem('sessionId');
        const authId = localStorage.getItem('authId');

        if (sessionId && authId) {
          const decodedToken = decodeJwt(authId);
          setAccount({
            username:
              decodedToken.preferred_username ||
              decodedToken.name ||
              'Unknown User',
            email: decodedToken.email,
          });

          // Fetch all data when session exists
          await fetchAllData();
        } else {
          // Attempt silent login
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await fetchAllData(); // Also fetch data for silent login
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeMsal();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const account = msalInstance.getAllAccounts()[0];
      const response = await msalInstance.acquireTokenSilent({
        scopes: ['User.Read'],
        account: account,
      });
      const userDetails = await callMsGraph(response.accessToken, '/me');
      return userDetails;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const response = await msalInstance.acquireTokenPopup({
          scopes: ['User.Read'],
        });
        const userDetails = await callMsGraph(response.accessToken, '/me');
        return userDetails;
      } else {
        console.error('Error fetching user details:', error);
      }
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      const account = msalInstance.getAllAccounts()[0];
      const response = await msalInstance.acquireTokenSilent({
        scopes: ['Directory.Read.All'],
        account: account,
      });
      const companyDetails = await callMsGraph(
        response.accessToken,
        '/organization'
      );
      console.log('Fetched Company Details:', companyDetails); // Add logging
      return companyDetails;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const response = await msalInstance.acquireTokenPopup({
          scopes: ['Directory.Read.All'],
        });
        const companyDetails = await callMsGraph(
          response.accessToken,
          '/organization'
        );
        console.log('Fetched Company Details:', companyDetails); // Add logging
        return companyDetails;
      } else {
        console.error('Error fetching company details:', error);
      }
    }
  };

  return (
    <Box>
      {!account ? (
        <Button variant='contained' color='primary' onClick={login}>
          Login to GCP
        </Button>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='center'
            >
              <Typography variant='h6'>Cloud Provider</Typography>
              <Stack direction='row' spacing={2}>
                <Tooltip
                  title={
                    <Box>
                      <Typography>Connected to Azure AD</Typography>
                      <Button
                        variant='contained'
                        color='secondary'
                        size='small'
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
                    label='Azure AD'
                    color='primary'
                    variant='outlined'
                  />
                </Tooltip>
              </Stack>
            </Stack>
          </Paper>
          <Grid container spacing={3}>
            {userDetails && (
              <Grid item xs={12} md={6}>
                <DataCard
                  title='User Details'
                  icon={<Person color='primary' />}
                >
                  <Grid container spacing={2}>
                    {Object.entries(userDetails)
                      .filter(
                        ([key]) => !['@odata.context', 'id'].includes(key)
                      )
                      .map(([key, value]) => renderDetailItem(key, value))}
                  </Grid>
                </DataCard>
              </Grid>
            )}
            {companyDetails && (
              <Grid item xs={12} md={6}>
                <CompanyDetailsCard data={companyDetails} />
              </Grid>
            )}
            {dataGovernance && (
              <Grid item xs={12} md={6}>
                <DataCard
                  title='Data Governance'
                  icon={<Assessment color='primary' />}
                  data={dataGovernance}
                />
              </Grid>
            )}
            {auditLogs && (
              <Grid item xs={12} md={6}>
                <DataCard
                  title='Audit Logs'
                  icon={<Timeline color='primary' />}
                  data={auditLogs}
                />
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};
export default AzureLogin;
