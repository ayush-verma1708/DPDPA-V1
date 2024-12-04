import React, { useEffect, useState } from 'react';
import { getDiscoveredAssets } from '../api/discoveredAssetEntryApi';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';

const DiscoveredAssetTable = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await getDiscoveredAssets();
        setAssets(data.discoveredAssets);
      } catch (error) {
        console.error('Error fetching discovered assets:', error);
      }
    };

    fetchAssets();
  }, []);

  const columns = [
    { field: 'assetName', headerName: 'Asset Name', width: 150 },
    // { field: 'assetType', headerName: 'Asset Type', width: 150 },
    // { field: 'assetDesc', headerName: 'Asset Description', width: 300 },
    { field: 'scopeName', headerName: 'Scope Name', width: 150 },
    { field: 'scopeDesc', headerName: 'Scope Description', width: 300 },
    {
      field: 'isProcessed',
      headerName: 'Processed',
      width: 150,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    {
      field: 'processedAt',
      headerName: 'Processed At',
      width: 200,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString() : 'N/A',
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: () => (
        <Button variant='contained' size='small'>
          Action
        </Button>
      ),
    },
  ];

  const rows = assets.flatMap((asset) =>
    asset.scopes.map((scope) => ({
      id: `${asset._id}-${scope._id}`,
      assetName: asset.name,
      assetType: asset.type,
      assetDesc: asset.desc,
      scopeName: scope.name,
      scopeDesc: scope.desc,
      isProcessed: scope.isProcessed,
      processedAt: scope.processedAt,
    }))
  );

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </Box>
  );
};

export default DiscoveredAssetTable;
