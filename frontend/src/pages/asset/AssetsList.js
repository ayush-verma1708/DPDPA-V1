import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { getAssets } from "../../api/assetApi";
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
  const [criticality, setCriticality] = useState("");
  const [businessOwnerName, setBusinessOwnerName] = useState("");
  const [businessOwnerEmail, setBusinessOwnerEmail] = useState("");
  const [itOwnerName, setItOwnerName] = useState("");
  const [itOwnerEmail, setItOwnerEmail] = useState("");
  const [loading, setLoading] = useState(true);

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
        "http://localhost:8021/api/v1/assetDetails/"
      );
      setAssetDetails(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching asset details:", error);
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
    setSelectedScoped("");
    setCoverageCount("");

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
          "http://localhost:8021/api/v1/assetDetails/add",
          newAssetDetails
        );
      }

      // Reset form fields
      setSelectedScoped("");
      setCoverageCount("");
      setEditCoverageId(null);
      setSelectedAsset("");
      setCriticality("");
      setBusinessOwnerName("");
      setBusinessOwnerEmail("");
      setItOwnerName("");
      setItOwnerEmail("");

      // Refresh data
      fetchAssetDetailData();
    } catch (error) {
      console.error("Error submitting coverage data:", error);
      alert("Failed to submit data. Please try again.");
    }
  };

  const handleEdit = (assetDet) => {
    setEditCoverageId(assetDet._id);
    setSelectedAsset(assetDet.asset?._id || "");
    setSelectedScoped(assetDet.scoped?._id || "");
    setCoverageCount(assetDet.coverages);
    setCriticality(assetDet.criticality || "");
    setBusinessOwnerName(assetDet.businessOwnerName || "");
    setBusinessOwnerEmail(assetDet.businessOwnerEmail || "");
    setItOwnerName(assetDet.itOwnerName || "");
    setItOwnerEmail(assetDet.itOwnerEmail || "");
  };

  const handleDelete = async (assetDetId) => {
    try {
      await axios.delete(
        `http://localhost:8021/api/v1/assetDetails/${assetDetId}`
      );
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
    setNewAssetIsScoped(false);
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
        isScoped: newAssetIsScoped,
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
        asset: selectedAsset,
      });

      // Refresh scoped data after adding a new one
      const { data } = await axios.get(
        `http://localhost:8021/api/v1/assets/${selectedAsset}/scoped`
      );
      setScoped(data);

      handleCloseNewScopedDialog();
    } catch (error) {
      console.error("Error adding new scoped:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 230 },
    { field: "asset", headerName: "Asset", width: 150 },
    { field: "scoped", headerName: "Scoped", width: 150 },
    { field: "criticality", headerName: "Criticality", width: 150 },
    {
      field: "businessOwnerName",
      headerName: "Business Owner Name",
      width: 200,
    },
    {
      field: "businessOwnerEmail",
      headerName: "Business Owner Email",
      width: 250,
    },
    { field: "itOwnerName", headerName: "IT Owner Name", width: 200 },
    { field: "itOwnerEmail", headerName: "IT Owner Email", width: 250 },
    // { field: "coverages", headerName: "Coverages", width: 150 },
    { field: "createdAt", headerName: "Created Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(params.row.id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = assetDetails.map((assetDet) => ({
    id: assetDet._id,
    asset: assetDet.asset?.name || "Unknown",
    scoped: assetDet.scoped?.name || "non-scoped",
    criticality: assetDet.criticality || "",
    businessOwnerName: assetDet.businessOwnerName || "",
    businessOwnerEmail: assetDet.businessOwnerEmail || "",
    itOwnerName: assetDet.itOwnerName || "",
    itOwnerEmail: assetDet.itOwnerEmail || "",
    coverages: assetDet.coverages,
    createdAt: moment(assetDet.createdAt).format("YYYY-MM-DD"),
  }));

  return (
    <Container>
      <Box mb={2} display="flex" justifyContent="space-between">
        <Button variant="contained" onClick={handleOpenNewAssetDialog}>
          <AddIcon /> Add New Asset
        </Button>
        <Button variant="contained" onClick={handleOpenNewScopedDialog}>
          <AddIcon /> Add New Scoped
        </Button>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Asset</InputLabel>
          <Select value={selectedAsset} onChange={handleAssetChange}>
            {assets.map((asset) => (
              <MenuItem key={asset._id} value={asset._id}>
               {asset.name} - {asset.type} (
              {asset.isScoped ? "Scoped" : "Non-Scoped"})
            </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Scoped (if applicable)</InputLabel>
          <Select value={selectedScoped} onChange={handleScopedChange}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {scoped.map((scopedItem) => (
              <MenuItem key={scopedItem._id} value={scopedItem._id}>
                {scopedItem.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        <TextField
          fullWidth
          margin="normal"
          label="Business Owner Name"
          value={businessOwnerName}
          onChange={(e) => setBusinessOwnerName(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Business Owner Email"
          value={businessOwnerEmail}
          onChange={(e) => setBusinessOwnerEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="IT Owner Name"
          value={itOwnerName}
          onChange={(e) => setItOwnerName(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="IT Owner Email"
          value={itOwnerEmail}
          onChange={(e) => setItOwnerEmail(e.target.value)}
        />
        {/* <TextField
          fullWidth
          margin="normal"
          label="Coverages"
          value={coverageCount}
          onChange={(e) => setCoverageCount(e.target.value)}
        /> */}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!selectedAsset || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Box>
      </Box>
      <Box height={400}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </Box>

      {/* New Asset Dialog */}
      <Dialog open={newAssetDialogOpen} onClose={handleCloseNewAssetDialog}>
        <DialogTitle>Add New Asset</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Asset Name"
            fullWidth
            value={newAssetName}
            onChange={(e) => setNewAssetName(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Asset Type"
            fullWidth
            value={newAssetType}
            onChange={(e) => setNewAssetType(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Asset Description"
            fullWidth
            multiline
            value={newAssetDesc}
            onChange={(e) => setNewAssetDesc(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Is Scoped</InputLabel>
            <Select
              value={newAssetIsScoped ? "Yes" : "No"}
              onChange={(e) => setNewAssetIsScoped(e.target.value === "Yes")}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewAssetDialog}>Cancel</Button>
          <Button onClick={handleAddAsset} color="primary">
            Add Asset
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Scoped Dialog */}
      <Dialog open={newScopedDialogOpen} onClose={handleCloseNewScopedDialog}>
        <DialogTitle>Add New Scoped</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Scoped Name"
            fullWidth
            value={newScopedName}
            onChange={(e) => setNewScopedName(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Scoped Description"
            fullWidth
            multiline
            value={newScopedDesc}
            onChange={(e) => setNewScopedDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewScopedDialog}>Cancel</Button>
          <Button onClick={handleAddScoped} color="primary">
            Add Scoped
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssetList;

// import React, { useState, useEffect } from "react";
// import {
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Button,
//   Container,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import axios from "axios";
// import moment from "moment";
// import { getAssets } from "../../api/assetApi";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";

// const AssetList = () => {
//   const [assets, setAssets] = useState([]);
//   const [scoped, setScoped] = useState([]);
//   const [selectedAsset, setSelectedAsset] = useState("");
//   const [selectedScoped, setSelectedScoped] = useState("");
//   const [coverageCount, setCoverageCount] = useState("");
//   const [assetDetails, setAssetDetails] = useState([]);
//   const [editCoverageId, setEditCoverageId] = useState(null);
//   const [newAssetDialogOpen, setNewAssetDialogOpen] = useState(false);
//   const [newScopedDialogOpen, setNewScopedDialogOpen] = useState(false);
//   const [newAssetName, setNewAssetName] = useState("");
//   const [newAssetType, setNewAssetType] = useState("");
//   const [newAssetDesc, setNewAssetDesc] = useState("");
//   const [newAssetIsScoped, setNewAssetIsScoped] = useState(false);
//   const [newScopedName, setNewScopedName] = useState("");
//   const [newScopedDesc, setNewScopedDesc] = useState("");
//   const [criticality, setCriticality] = useState("");
//   const [businessOwnerName, setBusinessOwnerName] = useState("");
//   const [businessOwnerEmail, setBusinessOwnerEmail] = useState("");
//   const [itOwnerName, setItOwnerName] = useState("");
//   const [itOwnerEmail, setItOwnerEmail] = useState("");
//   const [loading, setLoading] = useState(true);

  
//   useEffect(() => {
//     const fetchAssets = async () => {
//       const data = await getAssets();
//       setAssets(data);
//     };
//     fetchAssets();
//   }, []);

//   const fetchAssetDetailData = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:8021/api/v1/assetDetails/"
//       );
//       setAssetDetails(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("Error fetching asset details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     fetchAssetDetailData();
//   }, []);

//   const handleAssetChange = async (event) => {
//     const assetId = event.target.value;
//     setSelectedAsset(assetId);
//     setSelectedScoped("");
//     setCoverageCount("");

//     try {
//       const assetobj = assets.find((a) => a._id === assetId);
//       if (assetobj) {
//         const { data } = await axios.get(
//           `http://localhost:8021/api/v1/assets/${assetId}/scoped`
//         );
//         setScoped(Array.isArray(data) ? data : []);
//       } else {
//         setScoped([]);
//       }
//     } catch (error) {
//       console.error("Error fetching scoped data:", error);
//       setScoped([]);
//     }
//   };

//   const handleScopedChange = (event) => {
//     setSelectedScoped(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newAssetDetails = {
//       criticality,
//       businessOwnerName,
//       businessOwnerEmail,
//       itOwnerName,
//       itOwnerEmail,
//       asset: selectedAsset,
//       scoped: selectedScoped || "non-scoped",
//       coverages: coverageCount,
//     };

//     try {
//       if (editCoverageId) {
//         await axios.put(
//           `http://localhost:8021/api/v1/assetDetails/${editCoverageId}`,
//           newAssetDetails
//         );
//       } else {
//         await axios.post(
//           "http://localhost:8021/api/v1/assetDetails/add",
//           newAssetDetails
//         );
//       }

//       // Reset form fields
//       setSelectedScoped("");
//       setCoverageCount("");
//       setEditCoverageId(null);
//       setSelectedAsset("");
//       setCriticality("");
//       setBusinessOwnerName("");
//       setBusinessOwnerEmail("");
//       setItOwnerName("");
//       setItOwnerEmail("");

//       // Refresh data
//       fetchAssetDetailData();
//     } catch (error) {
//       console.error("Error submitting coverage data:", error);
//       alert("Failed to submit data. Please try again.");
//     }
//   };

//   const handleEdit = (assetDet) => {
//     setEditCoverageId(assetDet._id);
//     setSelectedAsset(assetDet.asset?._id || "");
//     setSelectedScoped(assetDet.scoped?._id || "");
//     setCoverageCount(assetDet.coverages);
//     setCriticality(assetDet.criticality || "");
//     setBusinessOwnerName(assetDet.businessOwnerName || "");
//     setBusinessOwnerEmail(assetDet.businessOwnerEmail || "");
//     setItOwnerName(assetDet.itOwnerName || "");
//     setItOwnerEmail(assetDet.itOwnerEmail || "");
//   };

//   const handleDelete = async (assetDetId) => {
//     try {
//       await axios.delete(
//         `http://localhost:8021/api/v1/assetDetails/${assetDetId}`
//       );
//       setAssetDetails(assetDetails.filter((ad) => ad._id !== assetDetId));
//     } catch (error) {
//       console.error("Error deleting coverage:", error);
//     }
//   };

//   const handleOpenNewAssetDialog = () => {
//     setNewAssetDialogOpen(true);
//   };

//   const handleOpenNewScopedDialog = () => {
//     setNewScopedDialogOpen(true);
//   };

//   const handleCriticalityChange = (event) => {
//     setCriticality(event.target.value);
//   };

//   const handleCloseNewAssetDialog = () => {
//     setNewAssetDialogOpen(false);
//     setNewAssetName("");
//     setNewAssetType("");
//     setNewAssetDesc("");
//     setNewAssetIsScoped(false);
//   };

//   const handleCloseNewScopedDialog = () => {
//     setNewScopedDialogOpen(false);
//     setNewScopedName("");
//     setNewScopedDesc("");
//   };

//   const handleAddAsset = async () => {
//     try {
//       await axios.post("http://localhost:8021/api/v1/assets/add-asset", {
//         name: newAssetName,
//         type: newAssetType,
//         desc: newAssetDesc,
//         isScoped: newAssetIsScoped,
//       });

//       // Refresh assets after adding a new one
//       const { data } = await axios.get("http://localhost:8021/api/v1/assets/");
//       setAssets(data);

//       handleCloseNewAssetDialog();
//     } catch (error) {
//       console.error("Error adding new asset:", error);
//     }
//   };

//   const handleAddScoped = async () => {
//     try {
//       await axios.post("http://localhost:8021/api/v1/scoped/add", {
//         name: newScopedName,
//         desc: newScopedDesc,
//         asset: selectedAsset,
//       });

//       // Refresh scoped data after adding a new one
//       const { data } = await axios.get(
//         `http://localhost:8021/api/v1/assets/${selectedAsset}/scoped`
//       );
//       setScoped(data);

//       handleCloseNewScopedDialog();
//     } catch (error) {
//       console.error("Error adding new scoped:", error);
//     }
//   };

//   const columns = [
//     { field: "id", headerName: "ID", width: 230 },
//     { field: "asset", headerName: "Asset", width: 150 },
//     { field: "scoped", headerName: "Scoped", width: 150 },
//     { field: "criticality", headerName: "Criticality", width: 150 },
//     {
//       field: "businessOwnerName",
//       headerName: "Business Owner Name",
//       width: 200,
//     },
//     {
//       field: "businessOwnerEmail",
//       headerName: "Business Owner Email",
//       width: 250,
//     },
//     { field: "itOwnerName", headerName: "IT Owner Name", width: 200 },
//     { field: "itOwnerEmail", headerName: "IT Owner Email", width: 250 },
//     { field: "coverages", headerName: "Coverages", width: 150 },
//     { field: "createdAt", headerName: "Created Date", width: 150 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 100,
//       renderCell: (params) => (
//         <div>
//           <IconButton color="primary" onClick={() => handleEdit(params.row)}>
//             <EditIcon />
//           </IconButton>
//           <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
//             <DeleteIcon />
//           </IconButton>
//         </div>
//       ),
//     },
//   ];

//   const rows = Array.isArray(assetDetails)
//     ? assetDetails.map((ad) => ({
//         id: ad._id,
//         asset: ad.asset?.name || "N/A",
//         scoped: ad.scoped?.name || "N/A",
//         criticality: ad.criticality || "N/A",
//         businessOwnerName: ad.businessOwnerName || "N/A",
//         businessOwnerEmail: ad.businessOwnerEmail || "N/A",
//         itOwnerName: ad.itOwnerName || "N/A",
//         itOwnerEmail: ad.itOwnerEmail || "N/A",
//         coverages: ad.coverages || "N/A",
//         createdAt: moment(ad.createdAt).format("YYYY-MM-DD HH:mm:ss"),
//       }))
//     : [];

//   return (
//     <Container>
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleOpenNewAssetDialog}
//           startIcon={<AddIcon />}
//         >
//           Add Asset
//         </Button>
        
//       </Box>
//       <Box sx={{ height: 400, width: "100%" }}>
//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <DataGrid rows={rows} columns={columns} pageSize={10} />
//         )}
//       </Box>
//       <Dialog open={newAssetDialogOpen} onClose={handleCloseNewAssetDialog}>
//         <DialogTitle>Add New Asset</DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             label="Asset Name"
//             fullWidth
//             variant="outlined"
//             value={newAssetName}
//             onChange={(e) => setNewAssetName(e.target.value)}
//           />
//           <TextField
//             margin="dense"
//             label="Asset Type"
//             fullWidth
//             variant="outlined"
//             value={newAssetType}
//             onChange={(e) => setNewAssetType(e.target.value)}
//           />
//           <TextField
//             margin="dense"
//             label="Asset Description"
//             fullWidth
//             variant="outlined"
//             value={newAssetDesc}
//             onChange={(e) => setNewAssetDesc(e.target.value)}
//           />
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Is Scoped</InputLabel>
//             <Select
//               value={newAssetIsScoped}
//               onChange={(e) => setNewAssetIsScoped(e.target.value)}
//               label="Is Scoped"
//             >
//               <MenuItem value={true}>Yes</MenuItem>
//               <MenuItem value={false}>No</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNewAssetDialog}>Cancel</Button>
//           <Button onClick={handleAddAsset}>Add</Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog open={newScopedDialogOpen} onClose={handleCloseNewScopedDialog}>
//         <DialogTitle>Add New Scoped</DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             label="Scoped Name"
//             fullWidth
//             variant="outlined"
//             value={newScopedName}
//             onChange={(e) => setNewScopedName(e.target.value)}
//           />
//           <TextField
//             margin="dense"
//             label="Scoped Description"
//             fullWidth
//             variant="outlined"
//             value={newScopedDesc}
//             onChange={(e) => setNewScopedDesc(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNewScopedDialog}>Cancel</Button>
//           <Button onClick={handleAddScoped}>Add</Button>
//         </DialogActions>
//       </Dialog>
//       <form onSubmit={handleSubmit}>
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Asset</InputLabel>
//           <Select
//             value={selectedAsset}
//             onChange={handleAssetChange}
//             label="Asset"
//           >
//             {assets.map((asset) => (
//               <MenuItem key={asset._id} value={asset._id}>
//               {asset.name} - {asset.type} (
//              {asset.isScoped ? "Scoped" : "Non-Scoped"})
//              </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleOpenNewScopedDialog}
//           startIcon={<AddIcon />}
//         >
//           Add Scoped
//         </Button>
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Scoped</InputLabel>
//           <Select
//             value={selectedScoped}
//             onChange={handleScopedChange}
//             label="Scoped"
//           >
//             {scoped.map((scope) => (
//               <MenuItem key={scope._id} value={scope._id}>
//                 {scope.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <TextField
//           margin="normal"
//           label="Coverage Count"
//           fullWidth
//           variant="outlined"
//           value={coverageCount}
//           onChange={(e) => setCoverageCount(e.target.value)}
//         />

//         {/* <TextField
//           margin="normal"
//           label="Criticality"
//           fullWidth
//           variant="outlined"
//           value={criticality}
//           onChange={handleCriticalityChange}
//         /> */}
//         <FormControl fullWidth margin="normal">
//   <InputLabel id="criticality-label">Criticality</InputLabel>
//   <Select
//     labelId="criticality-label"
//     id="criticality"
//     value={criticality}
//     onChange={(e) => setCriticality(e.target.value)}
//     label="Criticality"
//   >
//     <MenuItem value="High">High</MenuItem>
//     <MenuItem value="Medium">Medium</MenuItem>
//     <MenuItem value="Low">Low</MenuItem>
//   </Select>
// </FormControl>

//         <TextField
//           margin="normal"
//           label="Business Owner Name"
//           fullWidth
//           variant="outlined"
//           value={businessOwnerName}
//           onChange={(e) => setBusinessOwnerName(e.target.value)}
//         />
//         <TextField
//           margin="normal"
//           label="Business Owner Email"
//           fullWidth
//           variant="outlined"
//           value={businessOwnerEmail}
//           onChange={(e) => setBusinessOwnerEmail(e.target.value)}
//         />
//         <TextField
//           margin="normal"
//           label="IT Owner Name"
//           fullWidth
//           variant="outlined"
//           value={itOwnerName}
//           onChange={(e) => setItOwnerName(e.target.value)}
//         />
//         <TextField
//           margin="normal"
//           label="IT Owner Email"
//           fullWidth
//           variant="outlined"
//           value={itOwnerEmail}
//           onChange={(e) => setItOwnerEmail(e.target.value)}
//         />
//         <Button type="submit" variant="contained" color="primary">
//           {editCoverageId ? "Update" : "Submit"}
//         </Button>
//       </form>
//     </Container>
//   );
// };

// export default AssetList;

// // import React, { useState, useEffect } from "react";
// // import {
// //   FormControl,
// //   InputLabel,
// //   MenuItem,
// //   Select,
// //   TextField,
// //   Button,
// //   Container,
// //   IconButton,
// //   Dialog,
// //   DialogActions,
// //   DialogContent,
// //   DialogTitle,
// //   CircularProgress,
// //   Box,
// // } from "@mui/material";
// // import { DataGrid } from "@mui/x-data-grid";
// // import axios from "axios";
// // import moment from "moment";
// // import { getAssets } from "../../api/assetApi";
// // import EditIcon from "@mui/icons-material/Edit";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import AddIcon from "@mui/icons-material/Add";

// // const AssetList = () => {
// //   const [assets, setAssets] = useState([]);
// //   const [scoped, setScoped] = useState([]);
// //   const [selectedAsset, setSelectedAsset] = useState("");
// //   const [selectedScoped, setSelectedScoped] = useState("");
// //   const [coverageCount, setCoverageCount] = useState("");
// //   const [assetDetails, setAssetDetails] = useState([]);
// //   const [editCoverageId, setEditCoverageId] = useState(null);
// //   const [newAssetDialogOpen, setNewAssetDialogOpen] = useState(false);
// //   const [newScopedDialogOpen, setNewScopedDialogOpen] = useState(false);
// //   const [newAssetName, setNewAssetName] = useState("");
// //   const [newAssetType, setNewAssetType] = useState("");
// //   const [newAssetDesc, setNewAssetDesc] = useState("");
// //   const [newAssetIsScoped, setNewAssetIsScoped] = useState(false);
// //   const [newScopedName, setNewScopedName] = useState("");
// //   const [newScopedDesc, setNewScopedDesc] = useState("");
// //   const [criticality, setCriticality] = useState(false);
// //   const [businessOwnerName, setBusinessOwnerName] = useState("");
// //   const [businessOwnerEmail, setBusinessOwnerEmail] = useState("");
// //   const [itOwnerName, setItOwnerName] = useState("");
// //   const [itOwnerEmail, setItOwnerEmail] = useState("");
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchAssets = async () => {
// //       const data = await getAssets();
// //       setAssets(data);
// //     };
// //     fetchAssets();
// //   }, []);

// //   const fetchAssetDetailData = async () => {
// //     try {
// //       const response = await axios.get(
// //         "http://localhost:8021/api/v1/assetDetails/"
// //       );

// //       if (Array.isArray(response.data)) {
// //         setAssetDetails(response.data);
// //       } else {
// //         setAssetDetails([]); // Handle cases where the data isn't an array
// //       }
// //     } catch (error) {
// //       console.error("Error fetching asset details:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     setLoading(true);

// //     fetchAssetDetailData();
// //   }, []);

// //   const handleAssetChange = async (event) => {
// //     const assetId = event.target.value;
// //     setSelectedAsset(assetId);
// //     setSelectedScoped("");
// //     setCoverageCount("");

// //     try {
// //       const assetobj = assets.find((a) => a._id === assetId);
// //       console.log(assetobj);
      
// //       if (assetobj) {
// //         const { data } = await axios.get(
// //           `http://localhost:8021/api/v1/assets/${assetId}/scoped`
// //         );
// //         if (Array.isArray(data) && data.length > 0) {
// //           setScoped(data);
// //         }
// //       } else {
// //         setScoped([]); // Set to empty array if no data is returned
// //       }
// //     } catch (error) {
// //       console.error("Error fetching scoped data:", error);
// //       setScoped([]);
// //     }
// //   };

// //   const handleScopedChange = (event) => {
// //     setSelectedScoped(event.target.value);
// //   };

// //   // const handleSubmit = async (event) => {
// //   //   event.preventDefault();

// //   //   const newAssetDetails = {
// //   //     criticality,
// //   //     businessOwnerName,
// //   //     businessOwnerEmail,
// //   //     itOwnerName,
// //   //     itOwnerEmail,
// //   //     asset: selectedAsset,
// //   //     scoped: selectedScoped || "non-scoped",
// //   //     coverages: coverageCount,
// //   //   };

// //   //   try {
// //   //     if (editCoverageId) {
// //   //       await axios.put(
// //   //         `http://localhost:8021/api/v1/assetDetailss/${editCoverageId}`,
// //   //         newAssetDetails
// //   //       );
// //   //     } else {
// //   //       await axios.post(
// //   //         "http://localhost:8021/api/v1/assetDetails/add",
// //   //         newAssetDetails
// //   //       );
// //   //     }

// //   //     setSelectedScoped("");
// //   //     setCoverageCount("");
// //   //     setEditCoverageId(null);
// //   //     setSelectedAsset("");
// //   //     setCriticality("");
// //   //     setBusinessOwnerName("");
// //   //     setBusinessOwnerEmail("");
// //   //     setItOwnerName("");
// //   //     setItOwnerEmail("");

// //   //     // Refresh coverage data after submission
// //   //     const data = await axios.get(
// //   //       "http://localhost:8021/api/v1/assetDetails/"
// //   //     );
// //   //     fetchAssetDetailData();
// //   //     setAssetDetails(data);
// //   //   } catch (error) {
// //   //     console.error("Error submitting coverage data:", error);
// //   //   }
// //   // };



// //   // const handleSubmit = async (event) => {
// //   //   event.preventDefault();

// //   //   const newAssetDetails = {
// //   //     criticality,
// //   //     businessOwnerName,
// //   //     businessOwnerEmail,
// //   //     itOwnerName,
// //   //     itOwnerEmail,
// //   //     asset: selectedAsset,
// //   //     scoped: selectedScoped || "non-scoped",
// //   //     coverages: coverageCount,
// //   //   };

// //   //   try {
// //   //     if (editCoverageId) {
// //   //       await axios.put(
// //   //         `http://localhost:8021/api/v1/assetDetailss/${editCoverageId}`,
// //   //         newAssetDetails
// //   //       );
// //   //     } else {
// //   //       await axios.post(
// //   //         "http://localhost:8021/api/v1/assetDetails/add",
// //   //         newAssetDetails
// //   //       );
// //   //     }

// //   //     // Reset form fields
// //   //     setSelectedScoped("");
// //   //     setCoverageCount("");
// //   //     setEditCoverageId(null);
// //   //     setSelectedAsset("");
// //   //     setCriticality("");
// //   //     setBusinessOwnerName("");
// //   //     setBusinessOwnerEmail("");
// //   //     setItOwnerName("");
// //   //     setItOwnerEmail("");

// //   //     // Refresh data
// //   //     const data = await axios.get("http://localhost:8021/api/v1/assetDetails/");
// //   //     setAssetDetails(data.data);
// //   //   } catch (error) {
// //   //     console.error("Error submitting coverage data:", error);
// //   //     // Show user-friendly error message
// //   //     alert("Failed to submit data. Please try again.");
// //   //   }
// //   // };


// //   const handleSubmit = async (data) => {
// //     try {
// //       const response = await axios.post('/api/asset-details', data);
// //       console.log('Successfully submitted:', response.data);
// //     } catch (error) {
// //       if (error.response) {
// //         // Server responded with a status other than 2xx
// //         console.error('Error response data:', error.response.data);
// //         console.error('Error response status:', error.response.status);
// //         console.error('Error response headers:', error.response.headers);
// //       } else if (error.request) {
// //         // No response was received
// //         console.error('No response received:', error.request);
// //       } else {
// //         // Something else caused the error
// //         console.error('Error setting up request:', error.message);
// //       }
// //       console.error('Error config:', error.config);
// //     }
// //   };

// //   const handleEdit = (assetDet) => {
// //     setEditCoverageId(assetDet.id);
// //     setSelectedAsset(assetDet.scoped.asset?._id || "");
// //     setSelectedScoped(assetDet.scoped?._id || "");
// //     setCoverageCount(assetDet.coverageCount);
// //     setCriticality(assetDet.criticality);
// //     setBusinessOwnerName(assetDet.businessOwnerName);
// //     setBusinessOwnerEmail(assetDet.businessOwnerEmail);
// //     setItOwnerName(assetDet.itOwnerName);
// //     setItOwnerEmail(assetDet.itOwnerEmail);
// //   };

// //   const handleDelete = async (assetDetId) => {
// //     try {
// //       await axios.delete(
// //         `http://localhost:8021/api/v1/assetDetails/${assetDetId}`
// //       );
// //       setAssetDetails(assetDetails.filter((ad) => ad._id !== assetDetId));
// //     } catch (error) {
// //       console.error("Error deleting coverage:", error);
// //     }
// //   };

// //   const handleOpenNewAssetDialog = () => {
// //     setNewAssetDialogOpen(true);
// //   };

// //   const handleOpenNewScopedDialog = () => {
// //     setNewScopedDialogOpen(true);
// //   };

// //   const handleCriticalityChange = (event) => {
// //     setCriticality(event.target.value);
// //   };

// //   const handleCloseNewAssetDialog = () => {
// //     setNewAssetDialogOpen(false);
// //     setNewAssetName("");
// //     setNewAssetType("");
// //     setNewAssetDesc("");
// //     setNewAssetIsScoped(false); // Reset new asset isScoped
// //   };

// //   const handleCloseNewScopedDialog = () => {
// //     setNewScopedDialogOpen(false);
// //     setNewScopedName("");
// //     setNewScopedDesc("");
// //   };

// //   const handleAddAsset = async () => {
// //     try {
// //       await axios.post("http://localhost:8021/api/v1/assets/add-asset", {
// //         name: newAssetName,
// //         type: newAssetType,
// //         desc: newAssetDesc,
// //         isScoped: newAssetIsScoped, // Pass isScoped
// //       });

// //       // Refresh assets after adding a new one
// //       const { data } = await axios.get("http://localhost:8021/api/v1/assets/");
// //       setAssets(data);

// //       handleCloseNewAssetDialog();
// //     } catch (error) {
// //       console.error("Error adding new asset:", error);
// //     }
// //   };

// //   const handleAddScoped = async () => {
// //     try {
// //       await axios.post("http://localhost:8021/api/v1/scoped/add", {
// //         name: newScopedName,
// //         desc: newScopedDesc,
// //         asset: selectedAsset, // Pass isScoped
// //       });

// //       // Refresh assets after adding a new one
// //       const { data } = await axios.get(
// //         `http://localhost:8021/api/v1/assets/${selectedAsset}/scoped`
// //       );
// //       console.log(data);

// //       setScoped(data);

// //       handleCloseNewScopedDialog();
// //     } catch (error) {
// //       console.error("Error adding new asset:", error);
// //     }
// //   };
  
// //   const columns = [
// //     { field: "id", headerName: "ID", width: 230 },
// //     { field: "asset", headerName: "Asset", width: 150 },
// //     { field: "scoped", headerName: "Scoped", width: 150 },
// //     { field: "criticality", headerName: "Criticality", width: 150 },
// //     {
// //       field: "businessOwnerName",
// //       headerName: "Business Owner Name",
// //       width: 200,
// //     },
// //     {
// //       field: "businessOwnerEmail",
// //       headerName: "Business Owner Email",
// //       width: 250,
// //     },
// //     { field: "itOwnerName", headerName: "IT Owner Name", width: 200 },
// //     { field: "itOwnerEmail", headerName: "IT Owner Email", width: 250 },
// //     { field: "coverages", headerName: "Coverages", width: 150 },
// //     { field: "createdAt", headerName: "Created Date", width: 150 },
// //     {
// //       field: "actions",
// //       headerName: "Actions",
// //       width: 100,
// //       renderCell: (params) => (
// //         <div>
// //           <IconButton color="primary" onClick={() => handleEdit(params.row)}>
// //             <EditIcon />
// //           </IconButton>
// //           <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
// //             <DeleteIcon />
// //           </IconButton>
// //         </div>
// //       ),
// //     },
// //   ];

// //   const rows = Array.isArray(assetDetails)
// //     ? assetDetails.map((detail, index) => {
// //         try {
// //           return {
// //             id: detail._id || "", // Assign the MongoDB ObjectId as the unique id for DataGrid
// //             asset: detail.asset ? detail.asset.name : "Unknown Asset",
// //             scoped: detail.scoped ? detail.scoped.name : "non-scoped",
// //             criticality: detail.criticality || "N/A",
// //             businessOwnerName: detail.businessOwnerName || "N/A",
// //             businessOwnerEmail: detail.businessOwnerEmail || "N/A",
// //             itOwnerName: detail.itOwnerName || "N/A",
// //             itOwnerEmail: detail.itOwnerEmail || "N/A",
// //             coverages: detail.coverages || 0,
// //             createdAt: moment(detail.createdAt).format("YYYY-MM-DD HH:mm"),
// //           };
// //         } catch (error) {
// //           console.error("Error processing detail at index", index, ":", error);
// //           return {
// //             id: "",
// //             asset: "Error",
// //             scoped: "Error",
// //             criticality: "Error",
// //             coverages: 0,
// //           };
// //         }
// //       })
// //     : [];

// //   const sortModel = [
// //     {
// //       field: "createdAt",
// //       sort: "desc",
// //     },
// //   ];

// //   return (
// //     <>
// //       <form onSubmit={handleSubmit}>
// //         <Box
// //           sx={{
// //             display: "flex",
// //             justifyContent: "flex-end",
// //             alignItems: "center",            
// //             gap: "15px",
// //           }}
// //         >
// //           <FormControl fullWidth margin="normal">
// //             <InputLabel id="asset-label">Asset</InputLabel>
// //             <Select
// //               labelId="asset-label"
// //               value={selectedAsset}
// //               onChange={handleAssetChange}
// //               label="Asset"
// //             >
// //               <MenuItem key="add-new-asset" value="">
// //                 <Button
// //                   variant="outlined"
// //                   color="primary"
// //                   startIcon={<AddIcon />}
// //                   onClick={handleOpenNewAssetDialog}
// //                 >
// //                   Add New Asset
// //                 </Button>
// //               </MenuItem>
// //               {assets.map((asset) => (
// //                 <MenuItem key={asset._id} value={asset._id}>
// //                   {asset.name} - {asset.type} (
// //                   {asset.isScoped ? "Scoped" : "Non-Scoped"})
// //                 </MenuItem>
// //               ))}
// //             </Select>
// //           </FormControl>
// //           {selectedAsset &&
// //             assets.find((a) => a._id === selectedAsset)?.isScoped && (
// //               <FormControl fullWidth margin="normal">
// //                 <InputLabel>Scoped</InputLabel>
// //                 <Select
// //                   value={selectedScoped}
// //                   onChange={handleScopedChange}
// //                   label="Scoped"
// //                 >
// //                   <MenuItem key="add-new-asset" value="">
// //                     <Button
// //                       variant="outlined"
// //                       color="primary"
// //                       startIcon={<AddIcon />}
// //                       onClick={handleOpenNewScopedDialog}
// //                     >
// //                       Add New Scoped
// //                     </Button>
// //                   </MenuItem>
// //                   {scoped.map((scope) => (
// //                     <MenuItem key={scope._id} value={scope._id}>
// //                       {scope.name}
// //                     </MenuItem>
// //                   ))}
// //                 </Select>
// //               </FormControl>
// //             )}
// //           {/* {selectedScoped && (
// //             <TextField
// //               label="Coverage Count"
// //               type="number"
// //               fullWidth
// //               margin="normal"
// //               value={coverageCount}
// //               onChange={(e) => setCoverageCount(e.target.value)}
// //             />
// //           )} */}
// //         </Box>
// //         <Box
// //           sx={{
// //             display: "flex",
// //             justifyContent: "flex-end",
// //             alignItems: "center",
// //             gap: "15px",
// //           }}
// //         >
// //           {selectedAsset && (
// //             <>
// //               <TextField
// //                 label="Business Owner Name"
// //                 fullWidth
// //                 margin="normal"
// //                 value={businessOwnerName}
// //                 onChange={(e) => setBusinessOwnerName(e.target.value)}
// //               />
// //               <TextField
// //                 label="Business Owner Email"
// //                 fullWidth
// //                 margin="normal"
// //                 value={businessOwnerEmail}
// //                 onChange={(e) => setBusinessOwnerEmail(e.target.value)}
// //               />
// //               <TextField
// //                 label="IT Owner Name"
// //                 fullWidth
// //                 margin="normal"
// //                 value={itOwnerName}
// //                 onChange={(e) => setItOwnerName(e.target.value)}
// //               />
// //               <TextField
// //                 label="IT Owner Email"
// //                 fullWidth
// //                 margin="normal"
// //                 value={itOwnerEmail}
// //                 onChange={(e) => setItOwnerEmail(e.target.value)}
// //               />
// //               <TextField
// //               label="Coverage Count"
// //               type="number"
// //               fullWidth
// //               margin="normal"
// //               value={coverageCount}
// //               onChange={(e) => setCoverageCount(e.target.value)}
// //             />
// //               <FormControl fullWidth margin="normal">
// //                 <InputLabel id="criticality-label">Criticality</InputLabel>
// //                 <Select
// //                   labelId="criticality-label"
// //                   id="criticality"
// //                   value={criticality}
// //                   onChange={handleCriticalityChange}
// //                   label="Criticality"
// //                 >
// //                   <MenuItem value="High">High</MenuItem>
// //                   <MenuItem value="Medium">Medium</MenuItem>
// //                   <MenuItem value="Low">Low</MenuItem>
// //                 </Select>
// //               </FormControl>
// //               <Button
// //                 type="submit"
// //                 variant="contained"
// //                 fullWidth
// //                 sx={{
// //                   height: "50px",
// //                 }}
// //                 color="primary"
// //                 style={{ marginTop: "5px" }}
// //               >
// //                 {editCoverageId ? "Update" : "Submit"}
// //               </Button>
// //             </>
// //           )}
// //         </Box>
// //       </form>
// //       <Container>
// //         <div style={{ height: 400, width: "100%", marginTop: "10px" }}>
// //           {loading ? (
// //             <div
// //               style={{
// //                 position: "absolute",
// //                 top: "50%",
// //                 left: "50%",
// //                 transform: "translate(-50%, -50%)",
// //               }}
// //             >
// //               <CircularProgress />
// //             </div>
// //           ) : (
// //             <DataGrid
// //               rows={rows}
// //               columns={columns}
// //               pageSize={5}
// //               sortModel={sortModel}
// //               rowsPerPageOptions={[10]}
// //             />
// //           )}
// //         </div>
// //         <Dialog open={newAssetDialogOpen} onClose={handleCloseNewAssetDialog}>
// //           <DialogTitle>Add New Asset</DialogTitle>
// //           <DialogContent>
// //             <TextField
// //               autoFocus
// //               margin="dense"
// //               label="Name"
// //               type="text"
// //               fullWidth
// //               value={newAssetName}
// //               onChange={(e) => setNewAssetName(e.target.value)}
// //             />
// //             <TextField
// //               margin="dense"
// //               label="Type"
// //               type="text"
// //               fullWidth
// //               value={newAssetType}
// //               onChange={(e) => setNewAssetType(e.target.value)}
// //             />
// //             <TextField
// //               margin="dense"
// //               label="Description"
// //               type="text"
// //               fullWidth
// //               value={newAssetDesc}
// //               onChange={(e) => setNewAssetDesc(e.target.value)}
// //             />
// //             <FormControl fullWidth margin="normal">
// //               <InputLabel id="is-scoped-label">Is Scoped</InputLabel>
// //               <Select
// //                 labelId="is-scoped-label"
// //                 value={newAssetIsScoped}
// //                 onChange={(e) => setNewAssetIsScoped(e.target.value)}
// //                 label="Is Scoped"
// //               >
// //                 <MenuItem value={true}>Yes</MenuItem>
// //                 <MenuItem value={false}>No</MenuItem>
// //               </Select>
// //             </FormControl>
// //           </DialogContent>
// //           <DialogActions>
// //             <Button onClick={handleCloseNewAssetDialog} color="primary">
// //               Cancel
// //             </Button>
// //             <Button onClick={handleAddAsset} color="primary">
// //               Add
// //             </Button>
// //           </DialogActions>
// //         </Dialog>
// //         <Dialog open={newScopedDialogOpen} onClose={handleCloseNewScopedDialog}>
// //           <DialogTitle>Add New Scoped</DialogTitle>
// //           <DialogContent>
// //             <TextField
// //               autoFocus
// //               margin="dense"
// //               label="Name"
// //               type="text"
// //               fullWidth
// //               value={newScopedName}
// //               onChange={(e) => setNewScopedName(e.target.value)}
// //             />
// //             <TextField
// //               margin="dense"
// //               label="Description"
// //               type="text"
// //               fullWidth
// //               value={newScopedDesc}
// //               onChange={(e) => setNewScopedDesc(e.target.value)}
// //             />
// //           </DialogContent>
// //           <DialogActions>
// //             <Button onClick={handleCloseNewScopedDialog} color="primary">
// //               Cancel
// //             </Button>
// //             <Button onClick={handleAddScoped} color="primary">
// //               Add
// //             </Button>
// //           </DialogActions>
// //         </Dialog>
// //       </Container>
// //     </>
// //   );
// // };
// // export default AssetList;
