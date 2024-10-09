import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Container,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Box,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import { getAssets } from '../../api/assetApi';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getUsers } from '../../api/userApi';

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [scoped, setScoped] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedScoped, setSelectedScoped] = useState('');
  const [coverageCount, setCoverageCount] = useState('');
  const [assetDetails, setAssetDetails] = useState([]);
  const [editCoverageId, setEditCoverageId] = useState(null);
  const [newAssetDialogOpen, setNewAssetDialogOpen] = useState(false);
  const [newScopedDialogOpen, setNewScopedDialogOpen] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState('');
  const [newAssetDesc, setNewAssetDesc] = useState('');
  const [newAssetIsScoped, setNewAssetIsScoped] = useState(false);
  const [newScopedName, setNewScopedName] = useState('');
  const [newScopedDesc, setNewScopedDesc] = useState('');
  const [criticality, setCriticality] = useState('');
  const [businessOwnerName, setBusinessOwnerName] = useState('');
  const [businessOwnerEmail, setBusinessOwnerEmail] = useState('');
  const [itOwnerName, setItOwnerName] = useState('');
  const [itOwnerEmail, setItOwnerEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const [isAssetAddVisible, setIsAssetAddVisible] = useState(false);
  const [mainModalOpen, setMainModalOpen] = useState(false);

  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    const fetchAssets = async () => {
      const data = await getAssets();
      setAssets(data);
    };
    fetchAssets();
  }, []);

  const fetchAssetDetailData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8021/api/v1/assetDetails/'
      );
      setAssetDetails(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching asset details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAssetDetailData();
  }, []);

  const handleAssetChange = async (event) => {
    const assetId = event.target.value;
    setSelectedAsset(assetId);
    setSelectedScoped('');
    setCoverageCount('');

    try {
      const assetobj = assets.find((a) => a._id === assetId);
      if (assetobj && assetobj.isScoped) {
        const { data } = await axios.get(
          `http://localhost:8021/api/v1/assets/${assetId}/scoped`
        );
        setScoped(Array.isArray(data) ? data : []);
      } else {
        setScoped([]);
      }
    } catch (error) {
      console.error('Error fetching scoped data:', error);
      setScoped([]);
    }
  };

  // const handleScopedChange = (event) => {
  //   setSelectedScoped(event.target.value);
  // };

  // const handleAssetChange = async (event) => {
  //   const assetId = event.target.value;
  //   setSelectedAsset(assetId);
  //   setSelectedScoped("");
  //   setCoverageCount("");

  //   try {
  //     const assetobj = assets.find((a) => a._id === assetId);
  //     if (assetobj && assetobj.isScoped) {
  //       const { data } = await axios.get(
  //         `http://localhost:8021/api/v1/assets/${assetId}/scoped`
  //       );
  //       setScoped(Array.isArray(data) ? data : []);
  //     } else {
  //       setScoped([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching scoped data:", error);
  //     setScoped([]);
  //   }
  // };

  const handleScopedChange = (event) => {
    setSelectedScoped(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newAssetDetails = {
      criticality,
      businessOwnerName,
      businessOwnerEmail,
      itOwnerName: itOwnerName, // Ensure this is the selected user ID or name
      itOwnerEmail: itOwnerEmail, // Ensure this is the selected user's email
      asset: selectedAsset,
      scoped: selectedScoped || 'non-scoped',
      coverages: coverageCount,
    };

    try {
      if (editCoverageId) {
        await axios.put(
          `http://localhost:8021/api/v1/assetDetails/${editCoverageId}`,
          newAssetDetails
        );
      } else {
        await axios.post(
          'http://localhost:8021/api/v1/assetDetails/add',
          newAssetDetails
        );
      }

      // Reset form fields
      setSelectedScoped('');
      setCoverageCount('');
      setEditCoverageId(null);
      setSelectedAsset('');
      setCriticality('');
      setBusinessOwnerName('');
      setBusinessOwnerEmail('');
      setItOwnerName('');
      setItOwnerEmail('');

      // Refresh data
      fetchAssetDetailData();
    } catch (error) {
      console.error('Error submitting coverage data:', error);
      alert('Failed to submit data. Please try again.');
    }
  };

  const handleEdit = (assetDet) => {
    setEditCoverageId(assetDet._id);
    setSelectedAsset(assetDet.asset?._id || ''); // Ensure this is an ID, not a name
    setSelectedScoped(assetDet.scoped?._id || ''); // Ensure this is an ID, not a name
    setCoverageCount(assetDet.coverages);
    setCriticality(assetDet.criticality || '');
    setBusinessOwnerName(assetDet.businessOwnerName || ''); // Ensure this is an ID
    setBusinessOwnerEmail(assetDet.businessOwnerEmail || '');
    setItOwnerName(assetDet.itOwnerName || ''); // Ensure this is an ID
    setItOwnerEmail(assetDet.itOwnerEmail || '');
  };
  // const handleEdit = (assetDet) => {
  //   setEditCoverageId(assetDet._id);
  //   setSelectedAsset(assetDet.asset?._id || "");
  //   setSelectedScoped(assetDet.scoped?._id || "");
  //   setCoverageCount(assetDet.coverages);
  //   setCriticality(assetDet.criticality || "");
  //   setBusinessOwnerName(assetDet.businessOwnerName || "");
  //   setBusinessOwnerEmail(assetDet.businessOwnerEmail || "");
  //   setItOwnerName(assetDet.itOwnerName || "");
  //   setItOwnerEmail(assetDet.itOwnerEmail || "");
  // };

  const handleDelete = async (assetDetId) => {
    try {
      await axios.delete(
        `http://localhost:8021/api/v1/assetDetails/${assetDetId}`
      );
      setAssetDetails(assetDetails.filter((ad) => ad._id !== assetDetId));
    } catch (error) {
      console.error('Error deleting coverage:', error);
    }
  };

  const handleOpenNewAssetDialog = () => {
    setNewAssetDialogOpen(true);
  };

  const handleOpenNewScopedDialog = () => {
    setNewScopedDialogOpen(true);
  };

  const handleCriticalityChange = (event) => {
    setCriticality(event.target.value);
  };

  const handleCloseNewAssetDialog = () => {
    setNewAssetDialogOpen(false);
    setNewAssetName('');
    setNewAssetType('');
    setNewAssetDesc('');
    setNewAssetIsScoped(false);
  };

  const handleCloseNewScopedDialog = () => {
    setNewScopedDialogOpen(false);
    setNewScopedName('');
    setNewScopedDesc('');
  };

  const handleAddAsset = async () => {
    try {
      await axios.post('http://localhost:8021/api/v1/assets/add-asset', {
        name: newAssetName,
        type: newAssetType,
        desc: newAssetDesc,
        isScoped: newAssetIsScoped,
      });

      // Refresh assets after adding a new one
      const { data } = await axios.get('http://localhost:8021/api/v1/assets/');
      setAssets(data);

      handleCloseNewAssetDialog();
    } catch (error) {
      console.error('Error adding new asset:', error);
    }
  };

  const handleItOwnerChange = (event) => {
    const selectedUserId = event.target.value;
    const selectedUser = users.find((user) => user._id === selectedUserId);

    if (selectedUser) {
      setItOwnerName(selectedUser._id);
      setItOwnerEmail(selectedUser.email); // Automatically set the email when the user is selected
    } else {
      setItOwnerName('');
      setItOwnerEmail('');
    }
  };

  const handleBusinessOwnerChange = (event) => {
    const selectedUserId = event.target.value;
    const selectedUser = users.find((user) => user._id === selectedUserId);

    if (selectedUser) {
      setBusinessOwnerName(selectedUser._id);
      setBusinessOwnerEmail(selectedUser.email); // Automatically set the email when the user is selected
    } else {
      setBusinessOwnerName('');
      setBusinessOwnerEmail('');
    }
  };

  const handleAddScoped = async () => {
    try {
      await axios.post('http://localhost:8021/api/v1/scoped/add', {
        name: newScopedName,
        desc: newScopedDesc,
        asset: selectedAsset,
      });

      // Refresh scoped data after adding a new one
      const { data } = await axios.get(
        `http://localhost:8021/api/v1/assets/${selectedAsset}/scoped`
      );
      setScoped(data);

      handleCloseNewScopedDialog();
    } catch (error) {
      console.error('Error adding new scoped:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 230 },
    { field: 'asset', headerName: 'Asset', width: 150 },
    { field: 'scoped', headerName: 'Scoped', width: 150 },
    { field: 'criticality', headerName: 'Criticality', width: 150 },
    {
      field: 'businessOwnerName',
      headerName: 'Business Owner Id',
      width: 200,
    },
    {
      field: 'businessOwnerEmail',
      headerName: 'Business Owner Email',
      width: 250,
    },
    { field: 'itOwnerName', headerName: 'IT Owner Id', width: 200 },
    { field: 'itOwnerEmail', headerName: 'IT Owner Email', width: 250 },
    // { field: "coverages", headerName: "Coverages", width: 150 },
    { field: 'createdAt', headerName: 'Created Date', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <div>
          <IconButton
            color='primary'
            onClick={() => handleEdit(params.row)}
            size='small'
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color='secondary'
            onClick={() => handleDelete(params.row.id)}
            size='small'
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = assetDetails.map((assetDet) => ({
    id: assetDet._id.substring(0, 7),
    asset: assetDet.asset?.name || 'Unknown',
    scoped: assetDet.scoped?.name || 'non-scoped',
    criticality: assetDet.criticality || '',
    businessOwnerName: assetDet.businessOwnerName.username || '',
    businessOwnerEmail: assetDet.businessOwnerEmail || '',
    itOwnerName: assetDet.itOwnerName.username || '',
    itOwnerEmail: assetDet.itOwnerEmail || '',
    coverages: assetDet.coverages,
    createdAt: moment(assetDet.createdAt).format('DD-MM-YYYY'),
  }));

  return (
    <Container>
      <Button
        variant='contained'
        onClick={() => {
          setIsAssetAddVisible(true);
          setMainModalOpen(true);
        }}
        sx={{
          mb: 2,
        }}
      >
        <AddIcon /> Add New Asset
      </Button>
      {isAssetAddVisible && (
        <>
          <Dialog
            open={mainModalOpen}
            onClose={() => {
              setMainModalOpen(false);
            }}
          >
            <Box padding={5}>
              <Box mb={2} display='flex' justifyContent='space-between'>
                <Button variant='contained' onClick={handleOpenNewAssetDialog}>
                  <AddIcon /> Add New Asset
                </Button>
                <Button variant='contained' onClick={handleOpenNewScopedDialog}>
                  <AddIcon /> Add New Scoped
                </Button>
              </Box>
              <Box mb={2}>
                <FormControl fullWidth margin='normal'>
                  <InputLabel>Select Asset</InputLabel>
                  <Select value={selectedAsset} onChange={handleAssetChange}>
                    {assets.map((asset) => (
                      <MenuItem key={asset._id} value={asset._id}>
                        {asset.name} - {asset.type} (
                        {asset.isScoped ? 'Scoped' : 'Non-Scoped'})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <InputLabel>Select Scoped (if applicable)</InputLabel>
                  <Select value={selectedScoped} onChange={handleScopedChange}>
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    {scoped.map((scopedItem) => (
                      <MenuItem key={scopedItem._id} value={scopedItem._id}>
                        {scopedItem.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <InputLabel id='criticality-label'>Criticality</InputLabel>
                  <Select
                    labelId='criticality-label'
                    id='criticality'
                    value={criticality}
                    onChange={handleCriticalityChange}
                    label='Criticality'
                  >
                    <MenuItem value='High'>High</MenuItem>
                    <MenuItem value='Medium'>Medium</MenuItem>
                    <MenuItem value='Low'>Low</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin='normal'>
                  <InputLabel id='business-owner-select-label'>
                    Select Business Owner
                  </InputLabel>
                  <Select
                    labelId='business-owner-select-label'
                    id='business-owner-select'
                    value={businessOwnerName}
                    onChange={handleBusinessOwnerChange}
                    fullWidth
                  >
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.username} ({user.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  id='business-owner-email'
                  label='Business Owner Email'
                  value={businessOwnerEmail}
                  onChange={(e) => setBusinessOwnerEmail(e.target.value)}
                  fullWidth
                  margin='normal'
                  disabled
                />
                <FormControl fullWidth margin='normal'>
                  <InputLabel id='it-owner-label'>IT Owner</InputLabel>
                  <Select
                    labelId='it-owner-label'
                    id='it-owner'
                    value={itOwnerName}
                    onChange={handleItOwnerChange} // Updated this line
                    // onChange={(e) => setItOwnerName(e.target.value)}
                    renderValue={(selected) => {
                      const selectedUser = users.find(
                        (user) => user._id === selected
                      );
                      return selectedUser
                        ? selectedUser.username
                        : 'Select IT Owner';
                    }}
                  >
                    {(users || []).map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.username} ({user.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  margin='normal'
                  label='IT Owner Email'
                  value={itOwnerEmail}
                  onChange={(e) => setItOwnerEmail(e.target.value)}
                  disabled // Disable manual input
                />

                <Box mt={2}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                    disabled={!selectedAsset || loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Dialog>

          {/* New Asset Dialog */}
          <Dialog open={newAssetDialogOpen} onClose={handleCloseNewAssetDialog}>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogContent>
              <TextField
                margin='normal'
                label='Asset Name'
                fullWidth
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
              />
              <TextField
                margin='normal'
                label='Asset Type'
                fullWidth
                value={newAssetType}
                onChange={(e) => setNewAssetType(e.target.value)}
              />
              <TextField
                margin='normal'
                label='Asset Description'
                fullWidth
                multiline
                value={newAssetDesc}
                onChange={(e) => setNewAssetDesc(e.target.value)}
              />
              <FormControl fullWidth margin='normal'>
                <InputLabel>Is Scoped</InputLabel>
                <Select
                  value={newAssetIsScoped ? 'Yes' : 'No'}
                  onChange={(e) =>
                    setNewAssetIsScoped(e.target.value === 'Yes')
                  }
                >
                  <MenuItem value='Yes'>Yes</MenuItem>
                  <MenuItem value='No'>No</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseNewAssetDialog}>Cancel</Button>
              <Button onClick={handleAddAsset} color='primary'>
                Add Asset
              </Button>
            </DialogActions>
          </Dialog>

          {/* New Scoped Dialog */}
          <Dialog
            open={newScopedDialogOpen}
            onClose={handleCloseNewScopedDialog}
          >
            <DialogTitle>Add New Scoped</DialogTitle>
            <DialogContent>
              <TextField
                margin='normal'
                label='Scoped Name'
                fullWidth
                value={newScopedName}
                onChange={(e) => setNewScopedName(e.target.value)}
              />
              <TextField
                margin='normal'
                label='Scoped Description'
                fullWidth
                multiline
                value={newScopedDesc}
                onChange={(e) => setNewScopedDesc(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseNewScopedDialog}>Cancel</Button>
              <Button onClick={handleAddScoped} color='primary'>
                Add Scoped
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <Box height={400}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </Box>
    </Container>
  );
};

export default AssetList;
