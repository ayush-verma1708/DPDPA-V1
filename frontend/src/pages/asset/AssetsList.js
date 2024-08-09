import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  CircularProgress
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { getAssets } from "../../api/assetAPI";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [scoped, setScoped] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedScoped, setSelectedScoped] = useState("");
  const [coverageCount, setCoverageCount] = useState("");
  const [assetDetails, setAssetDetails] = useState([]);
  const [editCoverageId, setEditCoverageId] = useState(null);
  const [newAssetDialogOpen, setNewAssetDialogOpen] = useState(false);
  const [newScopedDialogOpen, setNewScopedDialogOpen] = useState(false);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState("");
  const [newAssetDesc, setNewAssetDesc] = useState("");
  const [newAssetIsScoped, setNewAssetIsScoped] = useState(false);
  const [newScopedName, setNewScopedName] = useState("");
  const [newScopedDesc, setNewScopedDesc] = useState("");
  const [newScopedAsset, setNewScopedAsset] = useState("");
  const [isScopedAsset, setIsScopedAsset] = useState('');
  const [criticality, setCriticality] = useState(false);
  const [businessOwnerName, setBusinessOwnerName] = useState("");
  const [businessOwnerEmail, setBusinessOwnerEmail] = useState("");
  const [itOwnerName, setItOwnerName] = useState("");
  const [itOwnerEmail, setItOwnerEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    asset: '',
    scoped: '',
    criticality: '',
    businessOwnerName: '',
    businessOwnerEmail: '',
    itOwnerName: '',
    itOwnerEmail: '',
    coverages: 0,
  });
  
  useEffect(() => {
    const fetchAssets = async () => {
      const data = await getAssets();
      setAssets(data);
      
      if(data.isScoped === true){
        setIsScopedAsset('Scoped');
      }
      else{
        setIsScopedAsset('non-scoped');
      }
    };
    fetchAssets();
  }, []);

  const fetchAssetDetailData = async () => {
    try {
      const response = await axios.get('http://localhost:8021/api/v1/assetDetails/');
      
      if (Array.isArray(response.data)) {
        setAssetDetails(response.data);
      } else {
        setAssetDetails([]); // Handle cases where the data isn't an array
      }
    } catch (error) {
      console.error('Error fetching asset details:', error);
    }
  finally {
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
    setSelectedScoped("");
    setCoverageCount("");

    try {
      const assetobj = assets.find((a) => a._id === assetId);
      if (assetobj) {
        

        const { data } = await axios.get(
          `http://localhost:8021/api/v1/assets/${assetId}/scoped`
        );
        if (Array.isArray(data) && data.length > 0) {
          setScoped(data);
        }
      } else {
        setScoped([]); // Set to empty array if no data is returned
      }
    } catch (error) {
      console.error("Error fetching scoped data:", error);
      setScoped([]);
    }
  };

  const handleScopedChange = (event) => {
    setSelectedScoped(event.target.value);
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const newAssetDetails = {
      criticality,
      businessOwnerName,
      businessOwnerEmail,
      itOwnerName,
      itOwnerEmail,
      asset: selectedAsset,
      scoped: selectedScoped || "non-scoped",
      coverages: coverageCount
    };

    try {
      if (editCoverageId) {
        await axios.put(
          `http://localhost:8021/api/v1/assetDetailss/${editCoverageId}`,
          newAssetDetails
        );
      } else {
        await axios.post(
          "http://localhost:8021/api/v1/assetDetails/add",
          newAssetDetails
        );
      }

      setSelectedScoped("");
      setCoverageCount("");
      setEditCoverageId(null);
      setSelectedAsset("");
      setCriticality("");
      setBusinessOwnerName("");
      setBusinessOwnerEmail("");
      setItOwnerName("");
      setItOwnerEmail("");

      // Refresh coverage data after submission
      const data  = await axios.get(
        "http://localhost:8021/api/v1/assetDetails/"
      );
      fetchAssetDetailData();
      setAssetDetails(data);
    } catch (error) {
      console.error("Error submitting coverage data:", error);
    }
  };

  const handleEdit = (assetDet) => {
    setEditCoverageId(assetDet.id);
    setSelectedAsset(assetDet.scoped.asset?._id || "");
    setSelectedScoped(assetDet.scoped?._id || "");
    setCoverageCount(assetDet.coverageCount);
    setCriticality(assetDet.criticality);
    setBusinessOwnerName(assetDet.businessOwnerName);
    setBusinessOwnerEmail(assetDet.businessOwnerEmail);
    setItOwnerName(assetDet.itOwnerName);
    setItOwnerEmail(assetDet.itOwnerEmail);
  };

  const handleDelete = async (assetDetId) => {
    try {
      await axios.delete(`http://localhost:8021/api/v1/assetDetails/${assetDetId}`);
      setAssetDetails(assetDetails.filter((ad) => ad._id !== assetDetId));
    } catch (error) {
      console.error("Error deleting coverage:", error);
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
    setNewAssetName("");
    setNewAssetType("");
    setNewAssetDesc("");
    setNewAssetIsScoped(false); // Reset new asset isScoped
  };

  const handleCloseNewScopedDialog = () => {
    setNewScopedDialogOpen(false);
    setNewScopedName("");
    setNewScopedDesc("");
  };

  const handleAddAsset = async () => {
    try {
      await axios.post("http://localhost:8021/api/v1/assets/add-asset", {
        name: newAssetName,
        type: newAssetType,
        desc: newAssetDesc,
        isScoped: newAssetIsScoped, // Pass isScoped
      });

      // Refresh assets after adding a new one
      const { data } = await axios.get("http://localhost:8021/api/v1/assets/");
      setAssets(data);

      handleCloseNewAssetDialog();
    } catch (error) {
      console.error("Error adding new asset:", error);
    }
  };

  const handleAddScoped = async () => {
    try {
      await axios.post("http://localhost:8021/api/v1/scoped/add", {
        name: newScopedName,
        desc: newScopedDesc,
        asset: selectedAsset, // Pass isScoped
      });

      // Refresh assets after adding a new one
      const { data } = await axios.get(
          `http://localhost:8021/api/v1/assets/${selectedAsset}/scoped`);
      console.log(data);
      
      setScoped(data);

      handleCloseNewScopedDialog();
    } catch (error) {
      console.error("Error adding new asset:", error);
    }
  };

  const handleEditClick = (id) => {
    const selectedDetail = assetDetails.find(detail => detail._id === id);
    if (selectedDetail) {
      setFormData({
        asset: selectedDetail.asset,
        scoped: selectedDetail.scoped,
        criticality: selectedDetail.criticality,
        businessOwnerName: selectedDetail.businessOwnerName,
        businessOwnerEmail: selectedDetail.businessOwnerEmail,
        itOwnerName: selectedDetail.itOwnerName,
        itOwnerEmail: selectedDetail.itOwnerEmail,
        coverages: selectedDetail.coverages,
      });
    }
  };


  const columns = [
    { field: 'id', headerName: 'ID', width: 230 },
    { field: 'asset', headerName: 'Asset', width: 150 },
    { field: 'scoped', headerName: 'Scoped', width: 150 },
    { field: 'criticality', headerName: 'Criticality', width: 150 },
    { field: 'businessOwnerName', headerName: 'Business Owner Name', width: 200 },
    { field: 'businessOwnerEmail', headerName: 'Business Owner Email', width: 250 },
    { field: 'itOwnerName', headerName: 'IT Owner Name', width: 200 },
    { field: 'itOwnerEmail', headerName: 'IT Owner Email', width: 250 },
    { field: 'coverages', headerName: 'Coverages', width: 150 },
    { field: 'createdAt', headerName: 'Created Date', width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <div>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = Array.isArray(assetDetails) ? assetDetails.map((detail, index) => {
    try {
      return {
        id: detail._id || '',  // Assign the MongoDB ObjectId as the unique id for DataGrid
        asset: detail.asset ? detail.asset.name : 'Unknown Asset',
        scoped: detail.scoped ? detail.scoped.name : 'non-scoped',
        criticality: detail.criticality || 'N/A',
        businessOwnerName: detail.businessOwnerName || 'N/A',
        businessOwnerEmail: detail.businessOwnerEmail || 'N/A',
        itOwnerName: detail.itOwnerName || 'N/A',
        itOwnerEmail: detail.itOwnerEmail || 'N/A',
        coverages: detail.coverages || 0,
        createdAt : moment(detail.createdAt).format("YYYY-MM-DD HH:mm"),
      };
    } catch (error) {
      console.error('Error processing detail at index', index, ':', error);
      return { id: '', asset: 'Error', scoped: 'Error', criticality: 'Error', coverages: 0 };
    }
  }) : [];
  

  const sortModel = [
    {
      field: "createdAt",
      sort: "desc",
    },
  ];

  return (
    <>
      <Container>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="asset-label">Asset</InputLabel>
                <Select
                  labelId="asset-label"
                  value={selectedAsset}
                  onChange={handleAssetChange}
                  label="Asset"
                >
                  <MenuItem key="add-new-asset" value="">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleOpenNewAssetDialog}
                    >
                      Add New Asset
                    </Button>
                  </MenuItem>
                  {assets.map((asset) => (
                    <MenuItem key={asset._id} value={asset._id}>
                      {asset.name} - {asset.type} (
                      {asset.isScoped ? "Scoped" : "Non-Scoped"})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {selectedAsset &&
              assets.find((a) => a._id === selectedAsset)?.isScoped && (
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Scoped</InputLabel>
                    <Select
                      value={selectedScoped}
                      onChange={handleScopedChange}
                      label="Scoped"
                    >
                      <MenuItem key="add-new-asset" value="">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleOpenNewScopedDialog}
                    >
                      Add New Scoped
                    </Button>
                  </MenuItem>
                  {scoped.map((scope) => (
                        <MenuItem key={scope._id} value={scope._id}>
                          {scope.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            {selectedScoped && (
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Coverage Count"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={coverageCount}
                  onChange={(e) => setCoverageCount(e.target.value)}
                />
              </Grid>
            )}
            {selectedAsset && (
              <>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Business Owner Name"
                    fullWidth
                    margin="normal"
                    value={businessOwnerName}
                    onChange={(e) => setBusinessOwnerName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Business Owner Email"
                    fullWidth
                    margin="normal"
                    value={businessOwnerEmail}
                    onChange={(e) => setBusinessOwnerEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="IT Owner Name"
                    fullWidth
                    margin="normal"
                    value={itOwnerName}
                    onChange={(e) => setItOwnerName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="IT Owner Email"
                    fullWidth
                    margin="normal"
                    value={itOwnerEmail}
                    onChange={(e) => setItOwnerEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="criticality-label">Criticality</InputLabel>
                    <Select
                      labelId="criticality-label"
                      id="criticality"
                      value={criticality}
                      onChange={handleCriticalityChange}
                      label="Criticality"
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={1}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  height: '50px',
                  padding: '0 16px', // Adjust padding as necessary
              }}
                color="primary"
                style={{ marginTop: '5px' }}
              >
                {editCoverageId ? "Update" : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>

        

        <div style={{ height: 400, width: "100%", marginTop: "10px" }}>
        {loading ? (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress />
        </div>
      ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            sortModel={sortModel}
            rowsPerPageOptions={[10]}
          />)
      }
        </div>
        <Dialog open={newAssetDialogOpen} onClose={handleCloseNewAssetDialog}>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Type"
              type="text"
              fullWidth
              value={newAssetType}
              onChange={(e) => setNewAssetType(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              value={newAssetDesc}
              onChange={(e) => setNewAssetDesc(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="is-scoped-label">Is Scoped</InputLabel>
              <Select
                labelId="is-scoped-label"
                value={newAssetIsScoped}
                onChange={(e) => setNewAssetIsScoped(e.target.value)}
                label="Is Scoped"
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewAssetDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddAsset} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={newScopedDialogOpen} onClose={handleCloseNewScopedDialog}>
          <DialogTitle>Add New Scoped</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              value={newScopedName}
              onChange={(e) => setNewScopedName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              value={newScopedDesc}
              onChange={(e) => setNewScopedDesc(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewScopedDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddScoped} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};
export default AssetList;