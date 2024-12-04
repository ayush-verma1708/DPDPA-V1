import React, { useEffect, useState } from 'react';
import {
  processAssetScope,
  getDiscoveredAssets,
} from '../api/discoveredAssetEntryApi';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';

const AddToAssetDetail = (assetId, scopeId) => {
  console.log('Asset ID: ', assetId);
  console.log('scope ID: ', scopeId);
};

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

  const handleProcess = async (assetId, scopeId) => {
    try {
      const result = await processAssetScope(assetId, scopeId);
      console.log('Asset and scope processed:', result);
      // Refetch the data after processing
      window.location.reload();
    } catch (error) {
      console.error('Error processing asset and scope:', error);
    }
  };

  const columns = [
    { field: 'assetName', headerName: 'Asset Name', width: 150 },
    { field: 'scopeName', headerName: 'Scope Name', width: 150 },
    // { field: 'scopeDesc', headerName: 'Scope Description', width: 300 },
    {
      field: 'isProcessed',
      headerName: 'Processed',
      width: 150,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    // ...existing code...
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
      width: 250,
      renderCell: (params) => (
        <Button
          variant='contained'
          size='small'
          onClick={() => handleProcess(params.row.assetId, params.row.scopeId)}
          disabled={params.row.processedAt ? true : false} // Disable if processed
        >
          Confirm Discovery
        </Button>
      ),
    },
    {
      field: 'Add To Asset Details',
      headerName: 'Add To Asset Details',
      width: 200,
      renderCell: (params) => (
        <Button
          variant='contained'
          size='small'
          onClick={() =>
            AddToAssetDetail(params.row.assetId, params.row.scopeId)
          }
          disabled={params.row.processedAt ? false : true} // Enable if processed
        >
          Add To Asset Details
        </Button>
      ),
    },
    // ...existing code...
  ];

  const rows = assets.flatMap((asset) =>
    asset.scopes.map((scope) => ({
      id: `${asset._id}-${scope._id}`,
      assetId: asset._id, // Add assetId to pass to the handler
      scopeId: scope._id, // Add scopeId to pass to the handler
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

// import React, { useEffect, useState } from 'react';
// import { getDiscoveredAssets } from '../api/discoveredAssetEntryApi';
// import { DataGrid } from '@mui/x-data-grid';
// import { Button, Box } from '@mui/material';
// import processAssetScope from '../api/discoveredAssetEntryApi';

// const DiscoveredAssetTable = () => {
//   const [assets, setAssets] = useState([]);

//   useEffect(() => {
//     const fetchAssets = async () => {
//       try {
//         const data = await getDiscoveredAssets();
//         setAssets(data.discoveredAssets);
//       } catch (error) {
//         console.error('Error fetching discovered assets:', error);
//       }
//     };

//     fetchAssets();
//   }, []);

//   const handleProcess = async (assetId, scopeId) => {
//     try {
//       const result = await processAssetScope(assetId, scopeId);
//       console.log('Asset and scope processed:', result);
//       // Optionally, you can update the asset status in the state after processing
//     } catch (error) {
//       console.error('Error processing asset and scope:', error);
//     }
//   };

//   const columns = [
//     { field: 'assetName', headerName: 'Asset Name', width: 150 },
//     // { field: 'assetType', headerName: 'Asset Type', width: 150 },
//     // { field: 'assetDesc', headerName: 'Asset Description', width: 300 },
//     { field: 'scopeName', headerName: 'Scope Name', width: 150 },
//     { field: 'scopeDesc', headerName: 'Scope Description', width: 300 },
//     {
//       field: 'isProcessed',
//       headerName: 'Processed',
//       width: 150,
//       renderCell: (params) => (params.value ? 'Yes' : 'No'),
//     },
//     {
//       field: 'processedAt',
//       headerName: 'Processed At',
//       width: 200,
//       renderCell: (params) =>
//         params.value ? new Date(params.value).toLocaleString() : 'N/A',
//     },
//     {
//       field: 'action',
//       headerName: 'Action',
//       width: 150,
//       renderCell: () => (
//         <Button
//           variant='contained'
//           size='small'
//           onClick={
//             () => handleProcess(params.row.assetId, params.row.scopeId) // Call handleProcess on button click
//           }
//         >
//           Process
//         </Button>
//       ),
//     },
//   ];

//   const rows = assets.flatMap((asset) =>
//     asset.scopes.map((scope) => ({
//       id: `${asset._id}-${scope._id}`,
//       assetName: asset.name,
//       assetType: asset.type,
//       assetDesc: asset.desc,
//       scopeName: scope.name,
//       scopeDesc: scope.desc,
//       isProcessed: scope.isProcessed,
//       processedAt: scope.processedAt,
//     }))
//   );

//   return (
//     <Box sx={{ height: 400, width: '100%' }}>
//       <DataGrid rows={rows} columns={columns} pageSize={5} />
//     </Box>
//   );
// };

// export default DiscoveredAssetTable;
