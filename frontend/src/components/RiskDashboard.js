import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { getAssetNameById } from '../api/assetApi.js';

const RiskDashboard = () => {
  const [overallRisk, setOverallRisk] = useState(null);
  const [assetNames, setAssetNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedScope, setSelectedScope] = useState('');
  const [selectedCriticality, setSelectedCriticality] = useState('low');

  const fetchRiskData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8021/api/v1/completion-status/risk-overall'
      );
      const riskData = response.data;
      setOverallRisk(riskData);

      const assetIds = [
        ...new Set(riskData.assetRisks.map((risk) => risk.assetId)),
      ];
      const names = await Promise.all(
        assetIds.map((id) => getAssetNameById(id))
      );

      const assetNamesMap = assetIds.reduce((acc, id, index) => {
        acc[id] = names[index]?.name || 'Unknown';
        return acc;
      }, {});

      setAssetNames(assetNamesMap);
    } catch (error) {
      console.error('Error fetching overall risk:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, []);

  if (loading) {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='100vh'
        padding={2}
      >
        <CircularProgress />
        <Typography variant='h6' sx={{ marginTop: 2 }}>
          Loading data, please wait...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='100vh'
        padding={2}
      >
        <Alert severity='error'>{error}</Alert>
        <Button
          variant='contained'
          sx={{ marginTop: 2 }}
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchRiskData();
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!overallRisk || !overallRisk.assetRisks) {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='100vh'
        padding={2}
      >
        <Typography variant='h6'>No data available</Typography>
      </Box>
    );
  }

  // Aggregate risk scores by assetId and criticality
  const assetRiskData = overallRisk.assetRisks.reduce((acc, risk) => {
    const { assetId, scopeId, criticality, riskScore } = risk;
    const key = `${assetId}-${scopeId}`;

    if (!acc[key]) {
      acc[key] = {
        assetId,
        scopeId,
        assetName: assetNames[assetId] || 'Unknown',
        criticalities: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
        },
        taskCounts: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
        },
      };
    }
    acc[key].criticalities[criticality] += riskScore;
    acc[key].taskCounts[criticality] += 1; // Increment task count for this criticality
    return acc;
  }, {});

  const aggregatedRisks = Object.values(assetRiskData);

  // List of unique assets and scopes
  const uniqueAssets = [...new Set(aggregatedRisks.map((r) => r.assetId))];
  const filteredScopes = aggregatedRisks
    .filter((r) => r.assetId === selectedAsset)
    .map((r) => r.scopeId);

  const handleAssetChange = (event) => {
    setSelectedAsset(event.target.value);
    setSelectedScope(''); // Reset scope when a new asset is selected
  };

  const handleScopeChange = (event) => {
    setSelectedScope(event.target.value);
  };

  const handleCriticalityChange = (event, newCriticality) => {
    setSelectedCriticality(newCriticality);
  };

  // Filter aggregatedRisks based on the selected asset
  const filteredRisks = aggregatedRisks.filter(
    (risk) => risk.assetId === selectedAsset
  );

  // Calculate task counts for selected asset
  const taskCountsByCriticality = filteredRisks.reduce(
    (acc, risk) => {
      Object.keys(risk.taskCounts).forEach((level) => {
        acc[level] += risk.taskCounts[level];
      });
      return acc;
    },
    {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    }
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        {/* Dropdown for Asset Selection */}
        <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Select Asset</InputLabel>
            <Select value={selectedAsset} onChange={handleAssetChange}>
              {uniqueAssets.map((assetId) => (
                <MenuItem key={assetId} value={assetId}>
                  {assetNames[assetId]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Dropdown for Scope Selection */}
        {selectedAsset && (
          <Grid item xs={12} sm={6} lg={4}>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Select Scope</InputLabel>
              <Select value={selectedScope} onChange={handleScopeChange}>
                {filteredScopes.map((scopeId) => (
                  <MenuItem key={scopeId} value={scopeId}>
                    Scope {scopeId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Toggle for Criticality Selection */}
        <Grid item xs={12} sm={6} lg={4}>
          <ToggleButtonGroup
            value={selectedCriticality}
            exclusive
            onChange={handleCriticalityChange}
            aria-label='risk criticality'
            sx={{ marginBottom: 2 }}
          >
            <ToggleButton value='low' aria-label='low risk'>
              Low
            </ToggleButton>
            <ToggleButton value='medium' aria-label='medium risk'>
              Medium
            </ToggleButton>
            <ToggleButton value='high' aria-label='high risk'>
              High
            </ToggleButton>
            <ToggleButton value='critical' aria-label='critical risk'>
              Critical
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      {/* Count of Tasks by Criticality */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant='h6'>Count of Tasks by Criticality</Typography>
        <Grid container spacing={2}>
          {['low', 'medium', 'high', 'critical'].map((level) => (
            <Grid item xs={6} sm={3} key={level}>
              <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant='h6'>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Typography>
                <Typography variant='body1'>
                  {taskCountsByCriticality[level]}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Enhanced Table for Risk Data */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Asset Name</TableCell>
              <TableCell>Scope ID</TableCell>
              <TableCell>Total Risk Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRisks
              .filter((risk) => risk.criticalities[selectedCriticality] > 0)
              .map((risk) => (
                <TableRow key={`${risk.assetId}-${risk.scopeId}`}>
                  <TableCell>{risk.assetName}</TableCell>
                  <TableCell>{risk.scopeId}</TableCell>
                  <TableCell>
                    {risk.criticalities[selectedCriticality]}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* BarChart for Selected Criticality */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant='h6' gutterBottom>
          Risk Distribution for{' '}
          {selectedCriticality.charAt(0).toUpperCase() +
            selectedCriticality.slice(1)}{' '}
          Risks
        </Typography>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={aggregatedRisks.filter(
              (risk) => risk.criticalities[selectedCriticality] > 0
            )}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='assetName' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={`criticalities.${selectedCriticality}`}
              fill='#8884d8'
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default RiskDashboard;
