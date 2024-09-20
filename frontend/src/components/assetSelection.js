import React, { useMemo } from 'react';
import { Select, MenuItem, Snackbar, Alert } from '@mui/material';

// Memoize AssetSelect Component
const AssetSelect = React.memo(
  ({ selectedAssetId, assetName, assets, handleAssetChange }) => {
    // Memoize the unique asset list by grouping assets by name
    const memoizedAssets = useMemo(() => {
      return [
        ...new Map(assets.map((asset) => [asset.asset.name, asset])).values(),
      ];
    }, [assets]);

    return (
      <div className='Asset-container'>
        <Select
          value={selectedAssetId}
          onChange={handleAssetChange}
          displayEmpty
          renderValue={(value) =>
            value ? `Asset: ${assetName}` : 'Select Asset'
          }
        >
          {memoizedAssets.map((uniqueAsset) => (
            <MenuItem key={uniqueAsset.asset._id} value={uniqueAsset.asset._id}>
              {uniqueAsset.asset.name}
            </MenuItem>
          ))}
        </Select>
      </div>
    );
  }
);

// Memoize ScopeSelect Component
const ScopeSelect = React.memo(
  ({ selectedScopeId, selectedAssetId, scopes, assets, handleScopeChange }) => {
    // Memoize the scope list
    const memoizedScopes = useMemo(() => {
      return scopes.map((scope) => (
        <MenuItem key={scope._id} value={scope._id}>
          {scope.name}
        </MenuItem>
      ));
    }, [scopes]);

    return (
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
          disabled={
            !selectedAssetId ||
            scopes.length === 0 ||
            !assets.find((asset) => asset.asset._id === selectedAssetId)?.asset
              .isScoped
          }
        >
          {memoizedScopes}
        </Select>
      </div>
    );
  }
);

// Main Component with AssetSelect and ScopeSelect
const AssetSelection = ({
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
      {/* Asset Selection */}
      <AssetSelect
        selectedAssetId={selectedAssetId}
        assetName={assetName}
        assets={assets}
        handleAssetChange={handleAssetChange}
      />

      {/* Scope Selection */}
      <ScopeSelect
        selectedScopeId={selectedScopeId}
        selectedAssetId={selectedAssetId}
        scopes={scopes}
        assets={assets}
        handleScopeChange={handleScopeChange}
      />

      {/* Error Handling */}
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000}>
          <Alert severity='error' sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Notification Handling */}
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

export default AssetSelection;
