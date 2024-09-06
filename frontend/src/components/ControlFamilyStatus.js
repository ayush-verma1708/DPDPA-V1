import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';

const ControlFamilyStatus = () => {
  const [controlFamilies, setControlFamilies] = useState([]);
  const [assets, setAssets] = useState([]);
  const [scopes, setScopes] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [selectedControlFamily, setSelectedControlFamily] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedScope, setSelectedScope] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [controlFamiliesResponse, assetsResponse, scopesResponse] =
          await Promise.all([
            axios.get('http://localhost:8021/api/v1/control-families'),
            axios.get('http://localhost:8021/api/v1/assets'),
            axios.get('http://localhost:8021/api/v1/scopes'),
          ]);
        setControlFamilies(controlFamiliesResponse.data);
        setAssets(assetsResponse.data);
        setScopes(scopesResponse.data);
      } catch (err) {
        setError('Failed to fetch initial data.');
      }
    };
    fetchInitialData();
  }, []);

  const handleFetchStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        'http://localhost:8021/api/v1/completion-status',
        {
          params: {
            controlFamilyId: selectedControlFamily,
            asset: selectedAsset,
            scope: selectedScope,
          },
        }
      );
      setStatusData(response.data);
    } catch (err) {
      setError('Failed to fetch status data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 5, width: '100%' }}>
      <h2
        style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}
      >
        Completion Status of Controls
      </h2>

      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          marginBottom: '24px',
        }}
      >
        <FormControl fullWidth variant='outlined'>
          <InputLabel>Control Family</InputLabel>
          <Select
            value={selectedControlFamily}
            onChange={(e) => setSelectedControlFamily(e.target.value)}
            label='Control Family'
          >
            <MenuItem value=''>Select Control Family</MenuItem>
            {controlFamilies.map((family) => (
              <MenuItem key={family._id} value={family._id}>
                {family.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant='outlined'>
          <InputLabel>Asset</InputLabel>
          <Select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            label='Asset'
          >
            <MenuItem value=''>Select Asset</MenuItem>
            {assets.map((asset) => (
              <MenuItem key={asset._id} value={asset._id}>
                {asset.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant='outlined'>
          <InputLabel>Scope</InputLabel>
          <Select
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value)}
            label='Scope'
          >
            <MenuItem value=''>Select Scope</MenuItem>
            {scopes.map((scope) => (
              <MenuItem key={scope._id} value={scope._id}>
                {scope.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant='contained'
          color='primary'
          onClick={handleFetchStatus}
          sx={{ alignSelf: 'center' }}
        >
          Fetch Status
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity='error'>{error}</Alert>}

      {statusData.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Control ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Completion Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statusData.map((control) => (
                <TableRow key={control._id}>
                  <TableCell>{control.controlId}</TableCell>
                  <TableCell>{control.description}</TableCell>
                  <TableCell>
                    {control.isCompleted ? 'Completed' : 'Pending'}
                  </TableCell>
                  <TableCell>
                    {control.completedAt
                      ? new Date(control.completedAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ControlFamilyStatus;
