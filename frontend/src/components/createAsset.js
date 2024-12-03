import React, { useState, useEffect } from 'react';
import { createScope } from '../api/scopeAPI'; // Import the API methods
import {
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { getAssets } from '../api/assetApi'; // Import API to fetch assets (assuming it's available)

const CreateScopeForm = () => {
  const [scopeName, setScopeName] = useState('');
  const [scopeDesc, setScopeDesc] = useState('');
  const [assetId, setAssetId] = useState(''); // Default asset name: 365
  const [assets, setAssets] = useState([]); // To store fetched assets
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch assets on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const assetData = await getAssets(); // Fetch available assets
        setAssets(assetData);
        setAssetId('365'); // Default to asset with ID 365
      } catch (error) {
        setErrorMessage('Error fetching assets');
      }
    };
    fetchAssets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const newScope = {
      name: scopeName,
      desc: scopeDesc,
      asset: assetId,
    };

    try {
      const data = await createScope(newScope); // Create scope via API
      setSuccessMessage('Scope created successfully!');
      setScopeName('');
      setScopeDesc('');
      setAssetId('365');
    } catch (error) {
      setErrorMessage('Error creating scope: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant='h5' gutterBottom>
        Create New Scope
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack
          spacing={2}
          sx={{ maxWidth: 400, margin: 'auto', paddingTop: 2 }}
        >
          <TextField
            label='Scope Name'
            variant='outlined'
            value={scopeName}
            onChange={(e) => setScopeName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label='Scope Description'
            variant='outlined'
            value={scopeDesc}
            onChange={(e) => setScopeDesc(e.target.value)}
            fullWidth
            required
          />

          <FormControl fullWidth required>
            <InputLabel>Asset</InputLabel>
            <Select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              label='Asset'
            >
              {assets.map((asset) => (
                <MenuItem key={asset._id} value={asset._id}>
                  {asset.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {loading ? (
            <Button variant='contained' color='primary' disabled>
              Creating Scope...
            </Button>
          ) : (
            <Button variant='contained' color='primary' type='submit'>
              Create Scope
            </Button>
          )}

          {successMessage && <Alert severity='success'>{successMessage}</Alert>}

          {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
        </Stack>
      </form>
    </div>
  );
};

export default CreateScopeForm;
