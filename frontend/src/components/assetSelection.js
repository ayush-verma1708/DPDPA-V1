import React from 'react';
import { Select, MenuItem, Snackbar, Alert } from '@mui/material';

const assetSelection = ({
  selectedAssetId,
  assetName,
  assets,
  selectedScopeId,
  scopes,
  handleScopeChange,
  handleAssetChange,
  error,
  notification,
  handleSnackbarClose,
}) => {
  return (
    <div className='page-container'>
      <div className='Asset-container'>
        <Select
          value={selectedAssetId}
          onChange={handleAssetChange}
          displayEmpty
          renderValue={(value) =>
            value ? `Asset: ${assetName}` : 'Select Asset'
          }
        >
          {assets.map((asset) => (
            <MenuItem key={asset.asset._id} value={asset.asset._id}>
              {asset.asset.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className='Scope-container'>
        <Select
          value={selectedScopeId}
          onChange={handleScopeChange}
          displayEmpty
          renderValue={(value) =>
            value
              ? `Scope: ${scopes.find((scope) => scope._id === value)?.name}`
              : 'Select Scope'
          }
          disabled={scopes.length === 0}
        >
          {scopes.map((scope) => (
            <MenuItem key={scope._id} value={scope._id}>
              {scope.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          //   onClose={() => setError('')}
        >
          <Alert
            // onClose={() => setError('')}
            severity='error'
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}

      <Snackbar
        open={!!notification.message}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default assetSelection;
