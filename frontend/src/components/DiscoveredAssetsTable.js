import React, { useEffect, useState } from 'react';
import {
  processAssetScope,
  getDiscoveredAssets,
} from '../api/discoveredAssetEntryApi';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { submitAssetDetails } from '../api/assetDetailsApi'; // Import the API for submitting asset details
import axios from 'axios';
import { getUsers } from '../api/userApi';

const DiscoveredAssetTable = () => {
  const [assets, setAssets] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState({});
  const [formData, setFormData] = useState({
    assetName: '',
    scopeName: '',
    additionalDetail: '',
    assetType: '',
    assetDesc: '',
    scopeDesc: '',
    criticality: '',
    businessOwnerName: '',
    businessOwnerEmail: '',
    auditorName: '',
    auditorEmail: '',
    itOwnerName: '',
    itOwnerEmail: '',
  });
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getUsers();
        setUsers(userData.users || []); // Extract the users array
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    fetchUsers();
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

  const handleOpen = (asset) => {
    setSelectedAsset(asset);
    setFormData({
      assetName: asset.assetName,
      scopeName: asset.scopeName,
      additionalDetail: '',
      assetType: asset.assetType,
      assetDesc: asset.assetDesc,
      scopeDesc: asset.scopeDesc,
      criticality: '',
      businessOwnerName: '',
      businessOwnerEmail: '',
      auditorName: '',
      auditorEmail: '',
      itOwnerName: '',
      itOwnerEmail: '',
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const columns = [
    { field: 'assetName', headerName: 'Asset Name', width: 150 },
    { field: 'scopeName', headerName: 'Scope Name', width: 150 },
    // ...existing code...
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
    // {
    //   field: 'Add To Asset Details',
    //   headerName: 'Add To Asset Details',
    //   width: 200,
    //   renderCell: (params) => (
    //     <Button
    //       variant='contained'
    //       size='small'
    //       onClick={() => handleOpen(params.row)}
    //       disabled={params.row.processedAt ? false : true} // Enable if processed
    //     >
    //       Add To Asset Details
    //     </Button>
    //   ),
    // },
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
// import {
//   processAssetScope,
//   getDiscoveredAssets,
// } from '../api/discoveredAssetEntryApi';
// import { DataGrid } from '@mui/x-data-grid';
// import {
//   Button,
//   Box,
//   Modal,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   CircularProgress,
// } from '@mui/material';
// import { submitAssetDetails } from '../api/assetDetailsApi'; // Import the API for submitting asset details
// import axios from 'axios';
// import { getUsers } from '../api/userApi';

// const DiscoveredAssetTable = () => {
//   const [assets, setAssets] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selectedAsset, setSelectedAsset] = useState({});
//   const [formData, setFormData] = useState({
//     assetName: '',
//     scopeName: '',
//     additionalDetail: '',
//     assetType: '',
//     assetDesc: '',
//     scopeDesc: '',
//     criticality: '',
//     businessOwnerName: '',
//     businessOwnerEmail: '',
//     auditorName: '',
//     auditorEmail: '',
//     itOwnerName: '',
//     itOwnerEmail: '',
//   });
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [businessOwnerName, setBusinessOwnerName] = useState('');
//   const [businessOwnerEmail, setBusinessOwnerEmail] = useState('');
//   const [itOwnerName, setItOwnerName] = useState('');
//   const [itOwnerEmail, setItOwnerEmail] = useState('');
//   //auditor
//   const [auditorName, setAuditorName] = useState('');
//   const [auditorEmail, setAuditorEmail] = useState('');

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

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const userData = await getUsers();
//         setUsers(userData.users || []); // Extract the users array
//       } catch (error) {
//         console.error('Error fetching users:', error);
//         setUsers([]);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleProcess = async (assetId, scopeId) => {
//     try {
//       const result = await processAssetScope(assetId, scopeId);
//       console.log('Asset and scope processed:', result);
//       // Refetch the data after processing
//       window.location.reload();
//     } catch (error) {
//       console.error('Error processing asset and scope:', error);
//     }
//   };

//   const handleBusinessOwnerChange = (event) => {
//     const selectedUserId = event.target.value;
//     const selectedUser = users.find((user) => user._id === selectedUserId);

//     if (selectedUser) {
//       setFormData({
//         ...formData,
//         businessOwnerName: selectedUser._id,
//         businessOwnerEmail: selectedUser.email,
//       });
//     } else {
//       setFormData({
//         ...formData,
//         businessOwnerName: '',
//         businessOwnerEmail: '',
//       });
//     }
//   };

//   const handleItOwnerChange = (event) => {
//     const selectedUserId = event.target.value;
//     const selectedUser = users.find((user) => user._id === selectedUserId);

//     if (selectedUser) {
//       setFormData({
//         ...formData,
//         itOwnerName: selectedUser._id,
//         itOwnerEmail: selectedUser.email,
//       });
//     } else {
//       setFormData({
//         ...formData,
//         itOwnerName: '',
//         itOwnerEmail: '',
//       });
//     }
//   };

//   const handleAuditorChange = (event) => {
//     const selectedUserId = event.target.value;
//     const selectedUser = users.find((user) => user._id === selectedUserId);

//     if (selectedUser) {
//       setFormData({
//         ...formData,
//         auditorName: selectedUser._id,
//         auditorEmail: selectedUser.email,
//       });
//     } else {
//       setFormData({
//         ...formData,
//         auditorName: '',
//         auditorEmail: '',
//       });
//     }
//   };

//   const handleOpen = (asset) => {
//     setSelectedAsset(asset);
//     setFormData({
//       assetName: asset.assetName,
//       scopeName: asset.scopeName,
//       additionalDetail: '',
//       assetType: asset.assetType,
//       assetDesc: asset.assetDesc,
//       scopeDesc: asset.scopeDesc,
//       criticality: '',
//       businessOwnerName: '',
//       businessOwnerEmail: '',
//       auditorName: '',
//       auditorEmail: '',
//       itOwnerName: '',
//       itOwnerEmail: '',
//     });
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     const newAssetDetails = {
//       asset: formData, // Correctly use selectedAsset.assetId
//       scoped: formData,
//       criticality: formData.criticality,
//       businessOwnerName: formData.businessOwnerName,
//       businessOwnerEmail: formData.businessOwnerEmail,
//       auditorName: formData.auditorName,
//       auditorEmail: formData.auditorEmail,
//       itOwnerName: formData.itOwnerName,
//       itOwnerEmail: formData.itOwnerEmail,
//       coverages: 0, // Assuming coverages is 0 by default
//     };

//     console.log('Asset details submitted:', newAssetDetails);
//     try {
//       await submitAssetDetails(newAssetDetails);
//       handleClose();
//     } catch (error) {
//       console.error('Error submitting asset details:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     { field: 'assetName', headerName: 'Asset Name', width: 150 },
//     { field: 'scopeName', headerName: 'Scope Name', width: 150 },
//     // ...existing code...
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
//       width: 250,
//       renderCell: (params) => (
//         <Button
//           variant='contained'
//           size='small'
//           onClick={() => handleProcess(params.row.assetId, params.row.scopeId)}
//           disabled={params.row.processedAt ? true : false} // Disable if processed
//         >
//           Confirm Discovery
//         </Button>
//       ),
//     },
//     {
//       field: 'Add To Asset Details',
//       headerName: 'Add To Asset Details',
//       width: 200,
//       renderCell: (params) => (
//         <Button
//           variant='contained'
//           size='small'
//           onClick={() => handleOpen(params.row)}
//           disabled={params.row.processedAt ? false : true} // Enable if processed
//         >
//           Add To Asset Details
//         </Button>
//       ),
//     },
//     // ...existing code...
//   ];

//   const rows = assets.flatMap((asset) =>
//     asset.scopes.map((scope) => ({
//       id: `${asset._id}-${scope._id}`,
//       assetId: asset._id, // Add assetId to pass to the handler
//       scopeId: scope._id, // Add scopeId to pass to the handler
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
//       <Modal open={open} onClose={handleClose}>
//         <Box sx={{ ...modalStyle }}>
//           <h2>Add To Asset Details</h2>
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label='Asset Name'
//               name='assetName'
//               value={formData.assetName}
//               onChange={handleChange}
//               fullWidth
//               margin='normal'
//               disabled
//             />
//             <TextField
//               label='Scope Name'
//               name='scopeName'
//               value={formData.scopeName}
//               onChange={handleChange}
//               fullWidth
//               margin='normal'
//               disabled
//             />
//             <TextField
//               label='Asset Type'
//               name='assetType'
//               value={formData.assetType}
//               onChange={handleChange}
//               fullWidth
//               margin='normal'
//               disabled
//             />
//             <TextField
//               label='Asset Description'
//               name='assetDesc'
//               value={formData.assetDesc}
//               onChange={handleChange}
//               fullWidth
//               margin='normal'
//               disabled
//             />
//             <TextField
//               label='Scope Description'
//               name='scopeDesc'
//               value={formData.scopeDesc}
//               onChange={handleChange}
//               fullWidth
//               margin='normal'
//               disabled
//             />
//             <FormControl fullWidth margin='normal'>
//               <InputLabel id='criticality-label'>Criticality</InputLabel>
//               <Select
//                 labelId='criticality-label'
//                 id='criticality'
//                 value={formData.criticality}
//                 onChange={handleChange}
//                 name='criticality'
//                 label='Criticality'
//               >
//                 <MenuItem value='High'>High</MenuItem>
//                 <MenuItem value='Medium'>Medium</MenuItem>
//                 <MenuItem value='Low'>Low</MenuItem>
//               </Select>
//             </FormControl>
//             <FormControl fullWidth margin='normal'>
//               <InputLabel id='business-owner-select-label'>
//                 Select Business Owner
//               </InputLabel>
//               <Select
//                 labelId='business-owner-select-label'
//                 id='business-owner-select'
//                 value={formData.businessOwnerName}
//                 onChange={(e) =>
//                   handleBusinessOwnerChange(
//                     e,
//                     'businessOwnerName',
//                     'businessOwnerEmail'
//                   )
//                 }
//                 fullWidth
//               >
//                 {users.map((user) => (
//                   <MenuItem key={user._id} value={user._id}>
//                     {user.username} ({user.role})
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <TextField
//               id='business-owner-email'
//               label='Business Owner Email'
//               value={formData.businessOwnerEmail}
//               onChange={handleChange}
//               fullWidth
//               margin='normal'
//               disabled
//             />
//             <FormControl fullWidth margin='normal'>
//               <InputLabel id='it-owner-label'>IT Owner</InputLabel>
//               <Select
//                 labelId='it-owner-label'
//                 id='it-owner'
//                 value={formData.itOwnerName}
//                 onChange={(e) =>
//                   handleItOwnerChange(e, 'itOwnerName', 'itOwnerEmail')
//                 }
//                 renderValue={(selected) => {
//                   const selectedUser = users.find(
//                     (user) => user._id === selected
//                   );
//                   return selectedUser
//                     ? selectedUser.username
//                     : 'Select IT Owner';
//                 }}
//               >
//                 {users.map((user) => (
//                   <MenuItem key={user._id} value={user._id}>
//                     {user.username} ({user.role})
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <TextField
//               fullWidth
//               margin='normal'
//               label='IT Owner Email'
//               value={formData.itOwnerEmail}
//               onChange={handleChange}
//               disabled
//             />
//             <FormControl fullWidth margin='normal'>
//               <InputLabel id='auditor-select-label'>Select Auditor</InputLabel>
//               <Select
//                 labelId='auditor-select-label'
//                 id='auditor-select'
//                 value={formData.auditorName}
//                 onChange={(e) =>
//                   handleAuditorChange(e, 'auditorName', 'auditorEmail')
//                 }
//                 fullWidth
//               >
//                 {users.map((user) => (
//                   <MenuItem key={user._id} value={user._id}>
//                     {user.username} ({user.role})
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <TextField
//               id='auditor-email'
//               label='Auditor Email'
//               value={formData.auditorEmail}
//               onChange={handleChange}
//               fullWidth
//               margin='normal'
//               disabled
//             />

//             <Box mt={2}>
//               <Button
//                 variant='contained'
//                 color='primary'
//                 type='submit'
//                 disabled={loading}
//               >
//                 {loading ? <CircularProgress size={24} /> : 'Submit'}
//               </Button>
//             </Box>
//           </form>
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// const modalStyle = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '90%',
//   maxWidth: 600,
//   maxHeight: '90%',
//   overflowY: 'auto',
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// export default DiscoveredAssetTable;
