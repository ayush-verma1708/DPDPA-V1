import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { getAssetNameById } from '../api/assetApi.js';

const RiskDashboard = () => {
  const [overallRisk, setOverallRisk] = useState(null);
  const [assetNames, setAssetNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedScope, setSelectedScope] = useState('');
  const [selectedCriticality, setSelectedCriticality] = useState('low'); // New criticality state

  const fetchRiskData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8021/api/v1/completion-status/risk-overall'
      );
      const riskData = response.data;
      setOverallRisk(riskData);

      // Fetch asset names
      const assetIds = [
        ...new Set(riskData.assetRisks.map((risk) => risk.assetId)),
      ];
      const names = await Promise.all(
        assetIds.map((id) => getAssetNameById(id))
      );

      // Map asset IDs to their names
      const assetNamesMap = assetIds.reduce((acc, id, index) => {
        acc[id] = names[index]?.name || 'Unknown';
        return acc;
      }, {});

      setAssetNames(assetNamesMap);
    } catch (error) {
      console.error('Error fetching overall risk:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, []);

  if (loading) {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='100vh'
        padding={2}
      >
        <CircularProgress />
        <Typography variant='h6' sx={{ marginTop: 2 }}>
          Loading data, please wait...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='100vh'
        padding={2}
      >
        <Alert severity='error'>{error}</Alert>
        <Button
          variant='contained'
          sx={{ marginTop: 2 }}
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchRiskData();
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!overallRisk || !overallRisk.assetRisks) {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='100vh'
        padding={2}
      >
        <Typography variant='h6'>No data available</Typography>
      </Box>
    );
  }

  // Aggregate risk scores by assetId, scopeId, and criticality
  const assetRiskData = overallRisk.assetRisks.reduce((acc, risk) => {
    const { assetId, scopeId, criticality, riskScore } = risk;
    const key = `${assetId}-${scopeId}`;

    if (!acc[key]) {
      acc[key] = {
        assetId,
        scopeId,
        assetName: assetNames[assetId] || 'Unknown',
        criticalities: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
        },
      };
    }
    acc[key].criticalities[criticality] += riskScore;
    return acc;
  }, {});

  const aggregatedRisks = Object.values(assetRiskData);

  // List of unique assets and scopes
  const uniqueAssets = [...new Set(aggregatedRisks.map((r) => r.assetId))];
  const filteredScopes = aggregatedRisks
    .filter((r) => r.assetId === selectedAsset)
    .map((r) => r.scopeId);

  const handleAssetChange = (event) => {
    setSelectedAsset(event.target.value);
    setSelectedScope(''); // Reset scope when a new asset is selected
  };

  const handleScopeChange = (event) => {
    setSelectedScope(event.target.value);
  };

  const handleCriticalityChange = (event, newCriticality) => {
    setSelectedCriticality(newCriticality);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        {/* Dropdown for Asset Selection */}
        <Grid item xs={12} sm={6} lg={4}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Select Asset</InputLabel>
            <Select value={selectedAsset} onChange={handleAssetChange}>
              {uniqueAssets.map((assetId) => (
                <MenuItem key={assetId} value={assetId}>
                  {assetNames[assetId]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Dropdown for Scope Selection */}
        {selectedAsset && (
          <Grid item xs={12} sm={6} lg={4}>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Select Scope</InputLabel>
              <Select value={selectedScope} onChange={handleScopeChange}>
                {filteredScopes.map((scopeId) => (
                  <MenuItem key={scopeId} value={scopeId}>
                    Scope {scopeId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Toggle for Criticality Selection */}
        <Grid item xs={12} sm={6} lg={4}>
          <ToggleButtonGroup
            value={selectedCriticality}
            exclusive
            onChange={handleCriticalityChange}
            aria-label='risk criticality'
            sx={{ marginBottom: 2 }}
          >
            <ToggleButton value='low' aria-label='low risk'>
              Low
            </ToggleButton>
            <ToggleButton value='medium' aria-label='medium risk'>
              Medium
            </ToggleButton>
            <ToggleButton value='high' aria-label='high risk'>
              High
            </ToggleButton>
            <ToggleButton value='critical' aria-label='critical risk'>
              Critical
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      {/* Enhanced Table for Risk Data */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Asset Name</TableCell>
              <TableCell>Scope ID</TableCell>
              <TableCell>Total Risk Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aggregatedRisks
              .filter((risk) => risk.criticalities[selectedCriticality] > 0) // Filter by selected criticality
              .map((risk) => (
                <TableRow key={`${risk.assetId}-${risk.scopeId}`}>
                  <TableCell>{risk.assetName}</TableCell>
                  <TableCell>{risk.scopeId}</TableCell>
                  <TableCell>
                    {risk.criticalities[selectedCriticality]}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* BarChart for Selected Criticality */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant='h6' gutterBottom>
          Risk Distribution for{' '}
          {selectedCriticality.charAt(0).toUpperCase() +
            selectedCriticality.slice(1)}{' '}
          Risks
        </Typography>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={aggregatedRisks.filter(
              (risk) => risk.criticalities[selectedCriticality] > 0
            )}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='assetName' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={`criticalities.${selectedCriticality}`}
              fill='#8884d8'
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default RiskDashboard;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   LineChart,
//   Line,
// } from 'recharts';
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   LinearProgress,
//   Alert,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Grid,
// } from '@mui/material';
// import { getAssetNameById } from '../api/assetApi.js';

// const RiskDashboard = () => {
//   const [overallRisk, setOverallRisk] = useState(null);
//   const [assetNames, setAssetNames] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedAsset, setSelectedAsset] = useState('');
//   const [selectedScope, setSelectedScope] = useState('');

//   const fetchRiskData = async () => {
//     try {
//       const response = await axios.get(
//         'http://localhost:8021/api/v1/completion-status/risk-overall'
//       );
//       const riskData = response.data;
//       setOverallRisk(riskData);

//       // Fetch asset names
//       const assetIds = [
//         ...new Set(riskData.assetRisks.map((risk) => risk.assetId)),
//       ];
//       const names = await Promise.all(
//         assetIds.map((id) => getAssetNameById(id))
//       );

//       // Map asset IDs to their names
//       const assetNamesMap = assetIds.reduce((acc, id, index) => {
//         acc[id] = names[index]?.name || 'Unknown'; // Default to 'Unknown' if no name is returned
//         return acc;
//       }, {});

//       setAssetNames(assetNamesMap);
//     } catch (error) {
//       console.error('Error fetching overall risk:', error);
//       setError('Failed to fetch data. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRiskData();
//   }, []);

//   if (loading) {
//     return (
//       <Box
//         display='flex'
//         flexDirection='column'
//         justifyContent='center'
//         alignItems='center'
//         height='100vh'
//         padding={2}
//       >
//         <CircularProgress />
//         <Typography variant='h6' sx={{ marginTop: 2 }}>
//           Loading data, please wait...
//         </Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box
//         display='flex'
//         flexDirection='column'
//         justifyContent='center'
//         alignItems='center'
//         height='100vh'
//         padding={2}
//       >
//         <Alert severity='error'>{error}</Alert>
//         <Button
//           variant='contained'
//           sx={{ marginTop: 2 }}
//           onClick={() => {
//             setLoading(true);
//             setError(null);
//             fetchRiskData();
//           }}
//         >
//           Retry
//         </Button>
//       </Box>
//     );
//   }

//   if (!overallRisk || !overallRisk.assetRisks) {
//     return (
//       <Box
//         display='flex'
//         flexDirection='column'
//         justifyContent='center'
//         alignItems='center'
//         height='100vh'
//         padding={2}
//       >
//         <Typography variant='h6'>No data available</Typography>
//       </Box>
//     );
//   }

//   // Aggregate risk scores by assetId, scopeId, and criticality
//   const assetRiskData = overallRisk.assetRisks.reduce((acc, risk) => {
//     const { assetId, scopeId, criticality, riskScore } = risk;
//     const key = `${assetId}-${scopeId}`;

//     if (!acc[key]) {
//       acc[key] = {
//         assetId,
//         scopeId,
//         assetName: assetNames[assetId] || 'Unknown', // Use assetName from the map
//         criticalities: {
//           low: 0,
//           medium: 0,
//           high: 0,
//           critical: 0,
//         },
//       };
//     }
//     acc[key].criticalities[criticality] += riskScore;
//     return acc;
//   }, {});

//   const aggregatedRisks = Object.values(assetRiskData);

//   // List of unique assets and scopes
//   const uniqueAssets = [...new Set(aggregatedRisks.map((r) => r.assetId))];
//   const filteredScopes = aggregatedRisks
//     .filter((r) => r.assetId === selectedAsset)
//     .map((r) => r.scopeId);

//   const handleAssetChange = (event) => {
//     setSelectedAsset(event.target.value);
//     setSelectedScope(''); // Reset scope when a new asset is selected
//   };

//   const handleScopeChange = (event) => {
//     setSelectedScope(event.target.value);
//   };

//   // Define colors for PieChart
//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Grid container spacing={4}>
//         {/* Dropdown for Asset Selection */}
//         <Grid item xs={12} sm={6} lg={4}>
//           <FormControl fullWidth sx={{ marginBottom: 2 }}>
//             <InputLabel>Select Asset</InputLabel>
//             <Select value={selectedAsset} onChange={handleAssetChange}>
//               {uniqueAssets.map((assetId) => (
//                 <MenuItem key={assetId} value={assetId}>
//                   {assetNames[assetId]}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {/* Dropdown for Scope Selection */}
//         {selectedAsset && (
//           <Grid item xs={12} sm={6} lg={4}>
//             <FormControl fullWidth sx={{ marginBottom: 2 }}>
//               <InputLabel>Select Scope</InputLabel>
//               <Select value={selectedScope} onChange={handleScopeChange}>
//                 {filteredScopes.map((scopeId) => (
//                   <MenuItem key={scopeId} value={scopeId}>
//                     Scope {scopeId}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//         )}
//       </Grid>

//       {/* Total Risk Score */}
//       <Typography variant='h4' gutterBottom>
//         Total Risk Score: {overallRisk.totalRiskScore || 0}
//       </Typography>

//       {/* Enhanced Table for Risk Data */}
//       <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
//         <Table>
//           <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//             <TableRow>
//               <TableCell>Asset Name</TableCell>
//               <TableCell>Scope ID</TableCell>
//               <TableCell>Total Risk Score</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Progress</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {aggregatedRisks.map((risk) => (
//               <TableRow key={`${risk.assetId}-${risk.scopeId}`}>
//                 <TableCell>{risk.assetName}</TableCell>
//                 <TableCell>{risk.scopeId}</TableCell>
//                 <TableCell>
//                   {Object.values(risk.criticalities).reduce((a, b) => a + b, 0)}
//                 </TableCell>
//                 <TableCell>
//                   {Object.values(risk.criticalities).reduce(
//                     (a, b) => a + b,
//                     0
//                   ) === 0
//                     ? 'Completed'
//                     : 'In Progress'}
//                 </TableCell>
//                 <TableCell>
//                   <LinearProgress
//                     variant='determinate'
//                     value={
//                       (Object.values(risk.criticalities).reduce(
//                         (a, b) => a + b,
//                         0
//                       ) /
//                         100) *
//                       100
//                     }
//                     sx={{ width: '100%', height: '10px', borderRadius: '5px' }}
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Bar Chart for Overall Risk Evaluation */}
//       <Box sx={{ marginBottom: 4 }}>
//         <Typography variant='h6' gutterBottom>
//           Risk Distribution per Criticality
//         </Typography>
//         <ResponsiveContainer width='100%' height={400}>
//           <BarChart data={aggregatedRisks}>
//             <CartesianGrid strokeDasharray='3 3' />
//             <XAxis dataKey='assetName' />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey='criticalities.low' stackId='a' fill='#0088FE' />
//             <Bar dataKey='criticalities.medium' stackId='a' fill='#00C49F' />
//             <Bar dataKey='criticalities.high' stackId='a' fill='#FFBB28' />
//             <Bar dataKey='criticalities.critical' stackId='a' fill='#FF8042' />
//           </BarChart>
//         </ResponsiveContainer>
//       </Box>

//       {/* Pie Charts for Risk by Criticality */}
//       <Grid container spacing={4}>
//         {aggregatedRisks
//           .filter(
//             (risk) =>
//               risk.assetId === selectedAsset &&
//               (!selectedScope || risk.scopeId === selectedScope)
//           )
//           .map((risk) => {
//             // Prepare pie chart data for each asset and scope
//             const pieData = Object.keys(risk.criticalities).map(
//               (criticality) => ({
//                 name:
//                   criticality.charAt(0).toUpperCase() + criticality.slice(1),
//                 value: risk.criticalities[criticality],
//               })
//             );

//             return (
//               <Grid
//                 item
//                 xs={12}
//                 sm={6}
//                 md={4}
//                 key={`${risk.assetId}-${risk.scopeId}`}
//               >
//                 <Typography variant='h6'>
//                   {risk.assetName} - Scope {risk.scopeId}
//                 </Typography>
//                 <Box sx={{ width: '100%', height: 300 }}>
//                   <ResponsiveContainer>
//                     <PieChart>
//                       <Pie
//                         data={pieData}
//                         dataKey='value'
//                         nameKey='name'
//                         outerRadius={100}
//                         fill='#8884d8'
//                         label
//                       >
//                         {pieData.map((entry, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={COLORS[index % COLORS.length]}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </Box>
//               </Grid>
//             );
//           })}
//       </Grid>

//       {/* Line Chart for Risk Trends (if available in data) */}
//       <Box sx={{ marginTop: 4 }}>
//         <Typography variant='h6' gutterBottom>
//           Risk Trend Over Time
//         </Typography>
//         <ResponsiveContainer width='100%' height={400}>
//           <LineChart data={aggregatedRisks}>
//             <CartesianGrid strokeDasharray='3 3' />
//             <XAxis dataKey='assetName' />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line
//               type='monotone'
//               dataKey='criticalities.low'
//               stroke='#0088FE'
//               activeDot={{ r: 8 }}
//             />
//             <Line
//               type='monotone'
//               dataKey='criticalities.medium'
//               stroke='#00C49F'
//             />
//             <Line
//               type='monotone'
//               dataKey='criticalities.high'
//               stroke='#FFBB28'
//             />
//             <Line
//               type='monotone'
//               dataKey='criticalities.critical'
//               stroke='#FF8042'
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </Box>
//     </Box>
//   );
// };

// export default RiskDashboard;

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import {
// //   PieChart,
// //   Pie,
// //   Cell,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from 'recharts';
// // import {
// //   Box,
// //   Typography,
// //   CircularProgress,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   LinearProgress,
// //   Alert,
// //   Button,
// //   MenuItem,
// //   Select,
// //   FormControl,
// //   InputLabel,
// // } from '@mui/material';
// // import { getAssetNameById } from '../api/assetApi.js';

// // const RiskDashboard = () => {
// //   const [overallRisk, setOverallRisk] = useState(null);
// //   const [assetNames, setAssetNames] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [selectedAsset, setSelectedAsset] = useState('');
// //   const [selectedScope, setSelectedScope] = useState('');

// //   const fetchRiskData = async () => {
// //     try {
// //       const response = await axios.get(
// //         'http://localhost:8021/api/v1/completion-status/risk-overall'
// //       );
// //       const riskData = response.data;
// //       setOverallRisk(riskData);

// //       // Fetch asset names
// //       const assetIds = [
// //         ...new Set(riskData.assetRisks.map((risk) => risk.assetId)),
// //       ];
// //       const names = await Promise.all(
// //         assetIds.map((id) => getAssetNameById(id))
// //       );

// //       // Map asset IDs to their names
// //       const assetNamesMap = assetIds.reduce((acc, id, index) => {
// //         acc[id] = names[index]?.name || 'Unknown'; // Default to 'Unknown' if no name is returned
// //         return acc;
// //       }, {});

// //       setAssetNames(assetNamesMap);
// //     } catch (error) {
// //       console.error('Error fetching overall risk:', error);
// //       setError('Failed to fetch data. Please try again later.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchRiskData();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <Box
// //         display='flex'
// //         flexDirection='column'
// //         justifyContent='center'
// //         alignItems='center'
// //         height='100vh'
// //         padding={2}
// //       >
// //         <CircularProgress />
// //         <Typography variant='h6' sx={{ marginTop: 2 }}>
// //           Loading data, please wait...
// //         </Typography>
// //       </Box>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <Box
// //         display='flex'
// //         flexDirection='column'
// //         justifyContent='center'
// //         alignItems='center'
// //         height='100vh'
// //         padding={2}
// //       >
// //         <Alert severity='error'>{error}</Alert>
// //         <Button
// //           variant='contained'
// //           sx={{ marginTop: 2 }}
// //           onClick={() => {
// //             setLoading(true);
// //             setError(null);
// //             fetchRiskData();
// //           }}
// //         >
// //           Retry
// //         </Button>
// //       </Box>
// //     );
// //   }

// //   if (!overallRisk || !overallRisk.assetRisks) {
// //     return (
// //       <Box
// //         display='flex'
// //         flexDirection='column'
// //         justifyContent='center'
// //         alignItems='center'
// //         height='100vh'
// //         padding={2}
// //       >
// //         <Typography variant='h6'>No data available</Typography>
// //       </Box>
// //     );
// //   }

// //   // Aggregate risk scores by assetId, scopeId, and criticality
// //   const assetRiskData = overallRisk.assetRisks.reduce((acc, risk) => {
// //     const { assetId, scopeId, criticality, riskScore } = risk;
// //     const key = `${assetId}-${scopeId}`;

// //     if (!acc[key]) {
// //       acc[key] = {
// //         assetId,
// //         scopeId,
// //         assetName: assetNames[assetId] || 'Unknown', // Use assetName from the map
// //         criticalities: {
// //           low: 0,
// //           medium: 0,
// //           high: 0,
// //           critical: 0,
// //         },
// //       };
// //     }
// //     acc[key].criticalities[criticality] += riskScore;
// //     return acc;
// //   }, {});

// //   const aggregatedRisks = Object.values(assetRiskData);

// //   // List of unique assets and scopes
// //   const uniqueAssets = [...new Set(aggregatedRisks.map((r) => r.assetId))];
// //   const filteredScopes = aggregatedRisks
// //     .filter((r) => r.assetId === selectedAsset)
// //     .map((r) => r.scopeId);

// //   const handleAssetChange = (event) => {
// //     setSelectedAsset(event.target.value);
// //     setSelectedScope(''); // Reset scope when a new asset is selected
// //   };

// //   const handleScopeChange = (event) => {
// //     setSelectedScope(event.target.value);
// //   };

// //   // Define colors for PieChart
// //   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// //   return (
// //     <Box sx={{ padding: 4 }}>
// //       {/* Dropdown for Asset Selection */}
// //       <FormControl fullWidth sx={{ marginBottom: 2 }}>
// //         <InputLabel>Select Asset</InputLabel>
// //         <Select value={selectedAsset} onChange={handleAssetChange}>
// //           {uniqueAssets.map((assetId) => (
// //             <MenuItem key={assetId} value={assetId}>
// //               {assetNames[assetId]}
// //             </MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>

// //       {/* Dropdown for Scope Selection (only if asset is selected) */}
// //       {selectedAsset && (
// //         <FormControl fullWidth sx={{ marginBottom: 2 }}>
// //           <InputLabel>Select Scope</InputLabel>
// //           <Select value={selectedScope} onChange={handleScopeChange}>
// //             {filteredScopes.map((scopeId) => (
// //               <MenuItem key={scopeId} value={scopeId}>
// //                 Scope {scopeId}
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl>
// //       )}

// //       {/* Risk Summary */}
// //       <Typography variant='h4' gutterBottom>
// //         Total Risk Score: {overallRisk.totalRiskScore || 0}
// //       </Typography>

// //       {/* Table for Aggregated Risk Data */}
// //       <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>Asset Name</TableCell>
// //               <TableCell>Scope ID</TableCell>
// //               <TableCell>Total Risk Score</TableCell>
// //               <TableCell>Status</TableCell>
// //               <TableCell>Progress</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {aggregatedRisks.map((risk) => (
// //               <TableRow key={`${risk.assetId}-${risk.scopeId}`}>
// //                 <TableCell>{risk.assetName}</TableCell>
// //                 <TableCell>{risk.scopeId}</TableCell>
// //                 <TableCell>
// //                   {Object.values(risk.criticalities).reduce((a, b) => a + b, 0)}
// //                 </TableCell>
// //                 <TableCell>
// //                   {Object.values(risk.criticalities).reduce(
// //                     (a, b) => a + b,
// //                     0
// //                   ) === 0
// //                     ? 'Completed'
// //                     : 'In Progress'}
// //                 </TableCell>
// //                 <TableCell>
// //                   <LinearProgress
// //                     variant='determinate'
// //                     value={
// //                       (Object.values(risk.criticalities).reduce(
// //                         (a, b) => a + b,
// //                         0
// //                       ) /
// //                         100) *
// //                       100
// //                     } // Adjust the denominator based on max score
// //                     sx={{ width: '100%' }}
// //                   />
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>

// //       {/* Pie Charts for Risk Evaluation by Asset and Scope */}
// //       <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
// //         {aggregatedRisks
// //           .filter(
// //             (risk) =>
// //               risk.assetId === selectedAsset &&
// //               (!selectedScope || risk.scopeId === selectedScope)
// //           )
// //           .map((risk) => {
// //             // Prepare pie chart data for each asset and scope
// //             const pieData = Object.keys(risk.criticalities).map(
// //               (criticality) => ({
// //                 name:
// //                   criticality.charAt(0).toUpperCase() + criticality.slice(1),
// //                 value: risk.criticalities[criticality],
// //               })
// //             );

// //             return (
// //               <Box key={`${risk.assetId}-${risk.scopeId}`} sx={{ margin: 2 }}>
// //                 <Typography variant='h6'>
// //                   {risk.assetName} - Scope {risk.scopeId}
// //                 </Typography>
// //                 <Box sx={{ width: 300, height: 300 }}>
// //                   <ResponsiveContainer width='100%' height='100%'>
// //                     <PieChart>
// //                       <Pie
// //                         data={pieData}
// //                         dataKey='value'
// //                         nameKey='name'
// //                         outerRadius={100}
// //                         fill='#8884d8'
// //                         label
// //                       >
// //                         {pieData.map((entry, index) => (
// //                           <Cell
// //                             key={`cell-${index}`}
// //                             fill={COLORS[index % COLORS.length]}
// //                           />
// //                         ))}
// //                       </Pie>
// //                       <Tooltip />
// //                       <Legend />
// //                     </PieChart>
// //                   </ResponsiveContainer>
// //                 </Box>
// //               </Box>
// //             );
// //           })}
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default RiskDashboard;

// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import {
// // //   PieChart,
// // //   Pie,
// // //   Cell,
// // //   Tooltip,
// // //   Legend,
// // //   ResponsiveContainer,
// // // } from 'recharts';
// // // import {
// // //   Box,
// // //   Typography,
// // //   CircularProgress,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   Paper,
// // //   LinearProgress,
// // //   Alert,
// // //   Button,
// // // } from '@mui/material';
// // // import { getAssetNameById } from '../api/assetApi.js';

// // // const RiskDashboard = () => {
// // //   const [overallRisk, setOverallRisk] = useState(null);
// // //   const [assetNames, setAssetNames] = useState({});
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   const fetchRiskData = async () => {
// // //     try {
// // //       const response = await axios.get(
// // //         'http://localhost:8021/api/v1/completion-status/risk-overall'
// // //       );
// // //       const riskData = response.data;
// // //       setOverallRisk(riskData);

// // //       // Fetch asset names
// // //       const assetIds = [
// // //         ...new Set(riskData.assetRisks.map((risk) => risk.assetId)),
// // //       ];
// // //       const names = await Promise.all(
// // //         assetIds.map((id) => getAssetNameById(id))
// // //       );

// // //       // Map asset IDs to their names
// // //       const assetNamesMap = assetIds.reduce((acc, id, index) => {
// // //         acc[id] = names[index]?.name || 'Unknown'; // Default to 'Unknown' if no name is returned
// // //         return acc;
// // //       }, {});

// // //       setAssetNames(assetNamesMap);
// // //     } catch (error) {
// // //       console.error('Error fetching overall risk:', error);
// // //       setError('Failed to fetch data. Please try again later.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchRiskData();
// // //   }, []);

// // //   if (loading) {
// // //     return (
// // //       <Box
// // //         display='flex'
// // //         flexDirection='column'
// // //         justifyContent='center'
// // //         alignItems='center'
// // //         height='100vh'
// // //         padding={2}
// // //       >
// // //         <CircularProgress />
// // //         <Typography variant='h6' sx={{ marginTop: 2 }}>
// // //           Loading data, please wait...
// // //         </Typography>
// // //       </Box>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <Box
// // //         display='flex'
// // //         flexDirection='column'
// // //         justifyContent='center'
// // //         alignItems='center'
// // //         height='100vh'
// // //         padding={2}
// // //       >
// // //         <Alert severity='error'>{error}</Alert>
// // //         <Button
// // //           variant='contained'
// // //           sx={{ marginTop: 2 }}
// // //           onClick={() => {
// // //             setLoading(true);
// // //             setError(null);
// // //             fetchRiskData();
// // //           }}
// // //         >
// // //           Retry
// // //         </Button>
// // //       </Box>
// // //     );
// // //   }

// // //   if (!overallRisk || !overallRisk.assetRisks) {
// // //     return (
// // //       <Box
// // //         display='flex'
// // //         flexDirection='column'
// // //         justifyContent='center'
// // //         alignItems='center'
// // //         height='100vh'
// // //         padding={2}
// // //       >
// // //         <Typography variant='h6'>No data available</Typography>
// // //       </Box>
// // //     );
// // //   }

// // //   // Aggregate risk scores by assetId and criticality, including scopeId
// // //   const assetRiskData = overallRisk.assetRisks.reduce((acc, risk) => {
// // //     if (!acc[risk.assetId]) {
// // //       acc[risk.assetId] = {
// // //         assetId: risk.assetId,
// // //         assetName: assetNames[risk.assetId] || 'Unknown', // Use assetName from the map
// // //         scopeId: risk.scopeId, // Add scopeId here
// // //         criticalities: {
// // //           low: 0,
// // //           medium: 0,
// // //           high: 0,
// // //           critical: 0,
// // //         },
// // //       };
// // //     }
// // //     acc[risk.assetId].criticalities[risk.criticality] =
// // //       (acc[risk.assetId].criticalities[risk.criticality] || 0) + risk.riskScore;
// // //     return acc;
// // //   }, {});

// // //   const aggregatedRisks = Object.values(assetRiskData);

// // //   // Define colors for PieChart
// // //   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// // //   return (
// // //     <Box sx={{ padding: 4 }}>
// // //       {/* Risk Summary */}
// // //       <Typography variant='h4' gutterBottom>
// // //         Total Risk Score: {overallRisk.totalRiskScore || 0}
// // //       </Typography>

// // //       {/* Table for Aggregated Risk Data */}
// // //       <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
// // //         <Table>
// // //           <TableHead>
// // //             <TableRow>
// // //               <TableCell>Asset Name</TableCell>
// // //               <TableCell>Scope ID</TableCell> {/* New column for scopeId */}
// // //               <TableCell>Total Risk Score</TableCell>
// // //               <TableCell>Status</TableCell>
// // //               <TableCell>Progress</TableCell>
// // //             </TableRow>
// // //           </TableHead>
// // //           <TableBody>
// // //             {aggregatedRisks.map((risk) => (
// // //               <TableRow key={risk.assetId}>
// // //                 <TableCell>{risk.assetName}</TableCell>
// // //                 <TableCell>{risk.scopeId}</TableCell> {/* Display scopeId */}
// // //                 <TableCell>
// // //                   {Object.values(risk.criticalities).reduce((a, b) => a + b, 0)}
// // //                 </TableCell>
// // //                 <TableCell>
// // //                   {Object.values(risk.criticalities).reduce(
// // //                     (a, b) => a + b,
// // //                     0
// // //                   ) === 0
// // //                     ? 'Completed'
// // //                     : 'In Progress'}
// // //                 </TableCell>
// // //                 <TableCell>
// // //                   <LinearProgress
// // //                     variant='determinate'
// // //                     value={
// // //                       (Object.values(risk.criticalities).reduce(
// // //                         (a, b) => a + b,
// // //                         0
// // //                       ) /
// // //                         100) *
// // //                       100
// // //                     } // Adjust the denominator based on max score
// // //                     sx={{ width: '100%' }}
// // //                   />
// // //                 </TableCell>
// // //               </TableRow>
// // //             ))}
// // //           </TableBody>
// // //         </Table>
// // //       </TableContainer>

// // //       {/* Pie Charts for Risk Evaluation by Asset */}
// // //       {aggregatedRisks.map((risk) => {
// // //         // Prepare pie chart data for each asset
// // //         const pieData = Object.keys(risk.criticalities).map((criticality) => ({
// // //           name: criticality.charAt(0).toUpperCase() + criticality.slice(1),
// // //           value: risk.criticalities[criticality],
// // //         }));

// // //         return (
// // //           <Box key={risk.assetId} sx={{ marginBottom: 4 }}>
// // //             <Typography variant='h6'>
// // //               {risk.assetName} (Scope ID: {risk.scopeId}){' '}
// // //               {/* Display scopeId */}
// // //             </Typography>
// // //             <Box sx={{ width: '100%', height: 300 }}>
// // //               <ResponsiveContainer width='100%' height='100%'>
// // //                 <PieChart>
// // //                   <Pie
// // //                     data={pieData}
// // //                     cx='50%'
// // //                     cy='50%'
// // //                     outerRadius={80}
// // //                     label
// // //                     dataKey='value'
// // //                   >
// // //                     {pieData.map((entry, index) => (
// // //                       <Cell
// // //                         key={`cell-${index}`}
// // //                         fill={COLORS[index % COLORS.length]}
// // //                       />
// // //                     ))}
// // //                   </Pie>
// // //                   <Tooltip />
// // //                   <Legend />
// // //                 </PieChart>
// // //               </ResponsiveContainer>
// // //             </Box>
// // //           </Box>
// // //         );
// // //       })}
// // //     </Box>
// // //   );
// // // };

// // // export default RiskDashboard;

// // // // import React, { useState, useEffect } from 'react';
// // // // import axios from 'axios';
// // // // import {
// // // //   PieChart,
// // // //   Pie,
// // // //   Cell,
// // // //   Tooltip,
// // // //   Legend,
// // // //   ResponsiveContainer,
// // // // } from 'recharts';
// // // // import {
// // // //   Box,
// // // //   Typography,
// // // //   CircularProgress,
// // // //   Table,
// // // //   TableBody,
// // // //   TableCell,
// // // //   TableContainer,
// // // //   TableHead,
// // // //   TableRow,
// // // //   Paper,
// // // //   LinearProgress,
// // // //   Alert,
// // // //   Button,
// // // // } from '@mui/material';
// // // // import { getAssetNameById } from '../api/assetApi.js';

// // // // const RiskDashboard = () => {
// // // //   const [overallRisk, setOverallRisk] = useState(null);
// // // //   const [assetNames, setAssetNames] = useState({});
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState(null);

// // // //   const fetchRiskData = async () => {
// // // //     try {
// // // //       const response = await axios.get(
// // // //         'http://localhost:8021/api/v1/completion-status/risk-overall'
// // // //       );
// // // //       const riskData = response.data;
// // // //       setOverallRisk(riskData);

// // // //       // Fetch asset names
// // // //       const assetIds = [
// // // //         ...new Set(riskData.assetRisks.map((risk) => risk.assetId)),
// // // //       ];
// // // //       const names = await Promise.all(
// // // //         assetIds.map((id) => getAssetNameById(id))
// // // //       );

// // // //       // Map asset IDs to their names
// // // //       const assetNamesMap = assetIds.reduce((acc, id, index) => {
// // // //         acc[id] = names[index]?.name || 'Unknown'; // Default to 'Unknown' if no name is returned
// // // //         return acc;
// // // //       }, {});

// // // //       setAssetNames(assetNamesMap);
// // // //     } catch (error) {
// // // //       console.error('Error fetching overall risk:', error);
// // // //       setError('Failed to fetch data. Please try again later.');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchRiskData();
// // // //   }, []);

// // // //   if (loading) {
// // // //     return (
// // // //       <Box
// // // //         display='flex'
// // // //         flexDirection='column'
// // // //         justifyContent='center'
// // // //         alignItems='center'
// // // //         height='100vh'
// // // //         padding={2}
// // // //       >
// // // //         <CircularProgress />
// // // //         <Typography variant='h6' sx={{ marginTop: 2 }}>
// // // //           Loading data, please wait...
// // // //         </Typography>
// // // //       </Box>
// // // //     );
// // // //   }

// // // //   if (error) {
// // // //     return (
// // // //       <Box
// // // //         display='flex'
// // // //         flexDirection='column'
// // // //         justifyContent='center'
// // // //         alignItems='center'
// // // //         height='100vh'
// // // //         padding={2}
// // // //       >
// // // //         <Alert severity='error'>{error}</Alert>
// // // //         <Button
// // // //           variant='contained'
// // // //           sx={{ marginTop: 2 }}
// // // //           onClick={() => {
// // // //             setLoading(true);
// // // //             setError(null);
// // // //             fetchRiskData();
// // // //           }}
// // // //         >
// // // //           Retry
// // // //         </Button>
// // // //       </Box>
// // // //     );
// // // //   }

// // // //   if (!overallRisk || !overallRisk.assetRisks) {
// // // //     return (
// // // //       <Box
// // // //         display='flex'
// // // //         flexDirection='column'
// // // //         justifyContent='center'
// // // //         alignItems='center'
// // // //         height='100vh'
// // // //         padding={2}
// // // //       >
// // // //         <Typography variant='h6'>No data available</Typography>
// // // //       </Box>
// // // //     );
// // // //   }

// // // //   // Aggregate risk scores by assetId and criticality
// // // //   const assetRiskData = overallRisk.assetRisks.reduce((acc, risk) => {
// // // //     if (!acc[risk.assetId]) {
// // // //       acc[risk.assetId] = {
// // // //         assetId: risk.assetId,
// // // //         assetName: assetNames[risk.assetId] || 'Unknown', // Use assetName from the map
// // // //         criticalities: {
// // // //           low: 0,
// // // //           medium: 0,
// // // //           high: 0,
// // // //           critical: 0,
// // // //         },
// // // //       };
// // // //     }
// // // //     acc[risk.assetId].criticalities[risk.criticality] =
// // // //       (acc[risk.assetId].criticalities[risk.criticality] || 0) + risk.riskScore;
// // // //     return acc;
// // // //   }, {});

// // // //   const aggregatedRisks = Object.values(assetRiskData);

// // // //   // Define colors for PieChart
// // // //   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// // // //   return (
// // // //     <Box sx={{ padding: 4 }}>
// // // //       {/* Risk Summary */}
// // // //       <Typography variant='h4' gutterBottom>
// // // //         Total Risk Score: {overallRisk.totalRiskScore || 0}
// // // //       </Typography>

// // // //       {/* Table for Aggregated Risk Data */}
// // // //       <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
// // // //         <Table>
// // // //           <TableHead>
// // // //             <TableRow>
// // // //               <TableCell>Asset Name</TableCell>
// // // //               <TableCell>Total Risk Score</TableCell>
// // // //               <TableCell>Status</TableCell>
// // // //               <TableCell>Progress</TableCell>
// // // //             </TableRow>
// // // //           </TableHead>
// // // //           <TableBody>
// // // //             {aggregatedRisks.map((risk) => (
// // // //               <TableRow key={risk.assetId}>
// // // //                 <TableCell>{risk.assetName}</TableCell>
// // // //                 <TableCell>
// // // //                   {Object.values(risk.criticalities).reduce((a, b) => a + b, 0)}
// // // //                 </TableCell>
// // // //                 <TableCell>
// // // //                   {Object.values(risk.criticalities).reduce(
// // // //                     (a, b) => a + b,
// // // //                     0
// // // //                   ) === 0
// // // //                     ? 'Completed'
// // // //                     : 'In Progress'}
// // // //                 </TableCell>
// // // //                 <TableCell>
// // // //                   <LinearProgress
// // // //                     variant='determinate'
// // // //                     value={
// // // //                       (Object.values(risk.criticalities).reduce(
// // // //                         (a, b) => a + b,
// // // //                         0
// // // //                       ) /
// // // //                         100) *
// // // //                       100
// // // //                     } // Adjust the denominator based on max score
// // // //                     sx={{ width: '100%' }}
// // // //                   />
// // // //                 </TableCell>
// // // //               </TableRow>
// // // //             ))}
// // // //           </TableBody>
// // // //         </Table>
// // // //       </TableContainer>

// // // //       {/* Pie Charts for Risk Evaluation by Asset */}
// // // //       {aggregatedRisks.map((risk) => {
// // // //         // Prepare pie chart data for each asset
// // // //         const pieData = Object.keys(risk.criticalities).map((criticality) => ({
// // // //           name: criticality.charAt(0).toUpperCase() + criticality.slice(1),
// // // //           value: risk.criticalities[criticality],
// // // //         }));

// // // //         return (
// // // //           <Box key={risk.assetId} sx={{ marginBottom: 4 }}>
// // // //             <Typography variant='h6'>{risk.assetName}</Typography>
// // // //             <Box sx={{ width: '100%', height: 300 }}>
// // // //               <ResponsiveContainer width='100%' height='100%'>
// // // //                 <PieChart>
// // // //                   <Pie
// // // //                     data={pieData}
// // // //                     cx='50%'
// // // //                     cy='50%'
// // // //                     outerRadius={80}
// // // //                     label
// // // //                     dataKey='value'
// // // //                   >
// // // //                     {pieData.map((entry, index) => (
// // // //                       <Cell
// // // //                         key={`cell-${index}`}
// // // //                         fill={COLORS[index % COLORS.length]}
// // // //                       />
// // // //                     ))}
// // // //                   </Pie>
// // // //                   <Tooltip />
// // // //                   <Legend />
// // // //                 </PieChart>
// // // //               </ResponsiveContainer>
// // // //             </Box>
// // // //           </Box>
// // // //         );
// // // //       })}
// // // //     </Box>
// // // //   );
// // // // };

// // // // export default RiskDashboard;

// // // // // import React, { useState, useEffect } from 'react';
// // // // // import axios from 'axios';
// // // // // import {
// // // // //   PieChart,
// // // // //   Pie,
// // // // //   Cell,
// // // // //   Tooltip,
// // // // //   Legend,
// // // // //   ResponsiveContainer,
// // // // // } from 'recharts';
// // // // // import {
// // // // //   Box,
// // // // //   Typography,
// // // // //   CircularProgress,
// // // // //   Table,
// // // // //   TableBody,
// // // // //   TableCell,
// // // // //   TableContainer,
// // // // //   TableHead,
// // // // //   TableRow,
// // // // //   Paper,
// // // // //   LinearProgress,
// // // // //   Alert,
// // // // //   Button,
// // // // //   Divider,
// // // // //   Grid,
// // // // // } from '@mui/material';
// // // // // import { getAssetNameById } from '../api/assetApi.js';

// // // // // const RiskDashboard = () => {
// // // // //   const [overallRisk, setOverallRisk] = useState(null);
// // // // //   const [assetNames, setAssetNames] = useState({});
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [error, setError] = useState(null);

// // // // //   const fetchRiskData = async () => {
// // // // //     try {
// // // // //       const response = await axios.get(
// // // // //         'http://localhost:8021/api/v1/completion-status/risk-overall'
// // // // //       );
// // // // //       const riskData = response.data;
// // // // //       setOverallRisk(riskData);

// // // // //       // Fetch asset names
// // // // //       const assetIds = [
// // // // //         ...new Set(riskData.assetRisks.map((risk) => risk.assetId)),
// // // // //       ];
// // // // //       const names = await Promise.all(
// // // // //         assetIds.map((id) => getAssetNameById(id))
// // // // //       );

// // // // //       // Map asset IDs to their names
// // // // //       const assetNamesMap = assetIds.reduce((acc, id, index) => {
// // // // //         acc[id] = names[index]?.name || 'Unknown'; // Default to 'Unknown' if no name is returned
// // // // //         return acc;
// // // // //       }, {});

// // // // //       setAssetNames(assetNamesMap);
// // // // //     } catch (error) {
// // // // //       console.error('Error fetching overall risk:', error);
// // // // //       setError('Failed to fetch data. Please try again later.');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     fetchRiskData();
// // // // //   }, []);

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <Box
// // // // //         display='flex'
// // // // //         flexDirection='column'
// // // // //         justifyContent='center'
// // // // //         alignItems='center'
// // // // //         height='100vh'
// // // // //         padding={2}
// // // // //       >
// // // // //         <CircularProgress />
// // // // //         <Typography variant='h6' sx={{ marginTop: 2 }}>
// // // // //           Loading data, please wait...
// // // // //         </Typography>
// // // // //       </Box>
// // // // //     );
// // // // //   }

// // // // //   if (error) {
// // // // //     return (
// // // // //       <Box
// // // // //         display='flex'
// // // // //         flexDirection='column'
// // // // //         justifyContent='center'
// // // // //         alignItems='center'
// // // // //         height='100vh'
// // // // //         padding={2}
// // // // //       >
// // // // //         <Alert severity='error'>{error}</Alert>
// // // // //         <Button
// // // // //           variant='contained'
// // // // //           sx={{ marginTop: 2 }}
// // // // //           onClick={() => {
// // // // //             setLoading(true);
// // // // //             setError(null);
// // // // //             fetchRiskData();
// // // // //           }}
// // // // //         >
// // // // //           Retry
// // // // //         </Button>
// // // // //       </Box>
// // // // //     );
// // // // //   }

// // // // //   if (!overallRisk || !overallRisk.assetRisks) {
// // // // //     return (
// // // // //       <Box
// // // // //         display='flex'
// // // // //         flexDirection='column'
// // // // //         justifyContent='center'
// // // // //         alignItems='center'
// // // // //         height='100vh'
// // // // //         padding={2}
// // // // //       >
// // // // //         <Typography variant='h6'>No data available</Typography>
// // // // //       </Box>
// // // // //     );
// // // // //   }

// // // // //   // Aggregate risk scores by assetId and criticality
// // // // //   const riskMap = overallRisk.assetRisks.reduce((acc, risk) => {
// // // // //     if (!acc[risk.assetId]) {
// // // // //       acc[risk.assetId] = {
// // // // //         assetId: risk.assetId,
// // // // //         assetName: assetNames[risk.assetId] || 'Unknown', // Use assetName from the map
// // // // //         criticalityMap: {
// // // // //           low: 0,
// // // // //           medium: 0,
// // // // //           high: 0,
// // // // //           critical: 0,
// // // // //         },
// // // // //       };
// // // // //     }

// // // // //     // Increment risk scores by criticality
// // // // //     const criticality =
// // // // //       overallRisk.assetRisks.find((r) => r.assetId === risk.assetId)
// // // // //         ?.criticality || 'low';
// // // // //     acc[risk.assetId].criticalityMap[criticality] += risk.riskScore;

// // // // //     return acc;
// // // // //   }, {});

// // // // //   const aggregatedRisks = Object.values(riskMap);

// // // // //   // Define colors for PieChart
// // // // //   const COLORS = {
// // // // //     low: '#0088FE',
// // // // //     medium: '#00C49F',
// // // // //     high: '#FFBB28',
// // // // //     critical: '#FF8042',
// // // // //   };

// // // // //   // Prepare pie chart data
// // // // //   const pieDataByCriticality = ['low', 'medium', 'high', 'critical'].map(
// // // // //     (level) => ({
// // // // //       name: level.charAt(0).toUpperCase() + level.slice(1),
// // // // //       value: aggregatedRisks.reduce(
// // // // //         (sum, risk) => sum + risk.criticalityMap[level],
// // // // //         0
// // // // //       ),
// // // // //     })
// // // // //   );

// // // // //   return (
// // // // //     <Box sx={{ padding: 4 }}>
// // // // //       {/* Risk Summary */}
// // // // //       <Typography variant='h4' gutterBottom>
// // // // //         Total Risk Score: {overallRisk.totalRiskScore || 0}
// // // // //       </Typography>

// // // // //       {/* Table for Aggregated Risk Data */}
// // // // //       <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
// // // // //         <Table>
// // // // //           <TableHead>
// // // // //             <TableRow>
// // // // //               <TableCell>Asset Name</TableCell>
// // // // //               <TableCell>Criticality Level</TableCell>
// // // // //               <TableCell>Total Risk Score</TableCell>
// // // // //               <TableCell>Status</TableCell>
// // // // //               <TableCell>Progress</TableCell>
// // // // //             </TableRow>
// // // // //           </TableHead>
// // // // //           <TableBody>
// // // // //             {aggregatedRisks.map((risk) => (
// // // // //               <React.Fragment key={risk.assetId}>
// // // // //                 {Object.entries(risk.criticalityMap).map(
// // // // //                   ([criticality, score]) => (
// // // // //                     <TableRow key={`${risk.assetId}-${criticality}`}>
// // // // //                       <TableCell>{risk.assetName}</TableCell>
// // // // //                       <TableCell>
// // // // //                         {criticality.charAt(0).toUpperCase() +
// // // // //                           criticality.slice(1)}
// // // // //                       </TableCell>
// // // // //                       <TableCell>{score}</TableCell>
// // // // //                       <TableCell>
// // // // //                         {score === 0 ? 'Completed' : 'In Progress'}
// // // // //                       </TableCell>
// // // // //                       <TableCell>
// // // // //                         <LinearProgress
// // // // //                           variant='determinate'
// // // // //                           value={(score / 100) * 100} // Adjust the denominator based on max score
// // // // //                           sx={{ width: '100%' }}
// // // // //                         />
// // // // //                       </TableCell>
// // // // //                     </TableRow>
// // // // //                   )
// // // // //                 )}
// // // // //               </React.Fragment>
// // // // //             ))}
// // // // //           </TableBody>
// // // // //         </Table>
// // // // //       </TableContainer>

// // // // //       <Divider sx={{ marginBottom: 4 }} />

// // // // //       {/* Pie Chart for Risk Evaluation */}
// // // // //       <Typography variant='h5' gutterBottom>
// // // // //         Risk Distribution by Criticality
// // // // //       </Typography>
// // // // //       <Box sx={{ width: '100%', height: 300 }}>
// // // // //         <ResponsiveContainer width='100%' height='100%'>
// // // // //           <PieChart>
// // // // //             <Pie
// // // // //               data={pieDataByCriticality}
// // // // //               cx='50%'
// // // // //               cy='50%'
// // // // //               outerRadius={80}
// // // // //               label
// // // // //               dataKey='value'
// // // // //             >
// // // // //               {pieDataByCriticality.map((entry, index) => (
// // // // //                 <Cell
// // // // //                   key={`cell-${index}`}
// // // // //                   fill={COLORS[entry.name.toLowerCase()]}
// // // // //                 />
// // // // //               ))}
// // // // //             </Pie>
// // // // //             <Tooltip />
// // // // //             <Legend />
// // // // //           </PieChart>
// // // // //         </ResponsiveContainer>
// // // // //       </Box>
// // // // //     </Box>
// // // // //   );
// // // // // };

// // // // // export default RiskDashboard;

// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import axios from 'axios';
// // // // // // import {
// // // // // //   PieChart,
// // // // // //   Pie,
// // // // // //   Cell,
// // // // // //   Tooltip,
// // // // // //   Legend,
// // // // // //   ResponsiveContainer,
// // // // // // } from 'recharts';
// // // // // // import {
// // // // // //   Box,
// // // // // //   Typography,
// // // // // //   CircularProgress,
// // // // // //   Table,
// // // // // //   TableBody,
// // // // // //   TableCell,
// // // // // //   TableContainer,
// // // // // //   TableHead,
// // // // // //   TableRow,
// // // // // //   Paper,
// // // // // //   LinearProgress,
// // // // // //   Alert,
// // // // // //   Button,
// // // // // // } from '@mui/material';
// // // // // // import { getAssetNameById } from '../api/assetApi.js';

// // // // // // const RiskDashboard = () => {
// // // // // //   const [overallRisk, setOverallRisk] = useState(null);
// // // // // //   const [assetNames, setAssetNames] = useState({});
// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [error, setError] = useState(null);

// // // // // //   const fetchRiskData = async () => {
// // // // // //     try {
// // // // // //       const response = await axios.get(
// // // // // //         'http://localhost:8021/api/v1/completion-status/risk-overall'
// // // // // //       );
// // // // // //       const riskData = response.data;
// // // // // //       setOverallRisk(riskData);

// // // // // //       // Fetch asset names
// // // // // //       const assetIds = [
// // // // // //         ...new Set(riskData.assetRisks.map((risk) => risk.assetId)),
// // // // // //       ];
// // // // // //       const names = await Promise.all(
// // // // // //         assetIds.map((id) => getAssetNameById(id))
// // // // // //       );

// // // // // //       // Map asset IDs to their names
// // // // // //       const assetNamesMap = assetIds.reduce((acc, id, index) => {
// // // // // //         acc[id] = names[index]?.name || 'Unknown'; // Default to 'Unknown' if no name is returned
// // // // // //         return acc;
// // // // // //       }, {});

// // // // // //       setAssetNames(assetNamesMap);
// // // // // //     } catch (error) {
// // // // // //       console.error('Error fetching overall risk:', error);
// // // // // //       setError('Failed to fetch data. Please try again later.');
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     fetchRiskData();
// // // // // //   }, []);

// // // // // //   if (loading) {
// // // // // //     return (
// // // // // //       <Box
// // // // // //         display='flex'
// // // // // //         flexDirection='column'
// // // // // //         justifyContent='center'
// // // // // //         alignItems='center'
// // // // // //         height='100vh'
// // // // // //         padding={2}
// // // // // //       >
// // // // // //         <CircularProgress />
// // // // // //         <Typography variant='h6' sx={{ marginTop: 2 }}>
// // // // // //           Loading data, please wait...
// // // // // //         </Typography>
// // // // // //       </Box>
// // // // // //     );
// // // // // //   }

// // // // // //   if (error) {
// // // // // //     return (
// // // // // //       <Box
// // // // // //         display='flex'
// // // // // //         flexDirection='column'
// // // // // //         justifyContent='center'
// // // // // //         alignItems='center'
// // // // // //         height='100vh'
// // // // // //         padding={2}
// // // // // //       >
// // // // // //         <Alert severity='error'>{error}</Alert>
// // // // // //         <Button
// // // // // //           variant='contained'
// // // // // //           sx={{ marginTop: 2 }}
// // // // // //           onClick={() => {
// // // // // //             setLoading(true);
// // // // // //             setError(null);
// // // // // //             fetchRiskData();
// // // // // //           }}
// // // // // //         >
// // // // // //           Retry
// // // // // //         </Button>
// // // // // //       </Box>
// // // // // //     );
// // // // // //   }

// // // // // //   if (!overallRisk || !overallRisk.assetRisks) {
// // // // // //     return (
// // // // // //       <Box
// // // // // //         display='flex'
// // // // // //         flexDirection='column'
// // // // // //         justifyContent='center'
// // // // // //         alignItems='center'
// // // // // //         height='100vh'
// // // // // //         padding={2}
// // // // // //       >
// // // // // //         <Typography variant='h6'>No data available</Typography>
// // // // // //       </Box>
// // // // // //     );
// // // // // //   }

// // // // // //   // Aggregate risk scores by assetId
// // // // // //   const riskMap = overallRisk.assetRisks.reduce((acc, risk) => {
// // // // // //     if (!acc[risk.assetId]) {
// // // // // //       acc[risk.assetId] = {
// // // // // //         assetId: risk.assetId,
// // // // // //         assetName: assetNames[risk.assetId] || 'Unknown', // Use assetName from the map
// // // // // //         totalRiskScore: 0,
// // // // // //         count: 0,
// // // // // //       };
// // // // // //     }
// // // // // //     acc[risk.assetId].totalRiskScore += risk.riskScore;
// // // // // //     acc[risk.assetId].count += 1;
// // // // // //     return acc;
// // // // // //   }, {});

// // // // // //   const aggregatedRisks = Object.values(riskMap);

// // // // // //   // Define colors for PieChart
// // // // // //   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// // // // // //   // Prepare pie chart data
// // // // // //   const pieData = aggregatedRisks.map((risk) => ({
// // // // // //     name: risk.assetName, // Display assetName in the chart
// // // // // //     value: risk.totalRiskScore,
// // // // // //   }));

// // // // // //   return (
// // // // // //     <Box sx={{ padding: 4 }}>
// // // // // //       {/* Risk Summary */}
// // // // // //       <Typography variant='h4' gutterBottom>
// // // // // //         Total Risk Score: {overallRisk.totalRiskScore || 0}
// // // // // //       </Typography>

// // // // // //       {/* Table for Aggregated Risk Data */}
// // // // // //       <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
// // // // // //         <Table>
// // // // // //           <TableHead>
// // // // // //             <TableRow>
// // // // // //               <TableCell>Asset Name</TableCell>
// // // // // //               <TableCell>Total Risk Score</TableCell>
// // // // // //               <TableCell>Status</TableCell>
// // // // // //               <TableCell>Progress</TableCell>
// // // // // //             </TableRow>
// // // // // //           </TableHead>
// // // // // //           <TableBody>
// // // // // //             {aggregatedRisks.map((risk) => (
// // // // // //               <TableRow key={risk.assetId}>
// // // // // //                 <TableCell>{risk.assetName}</TableCell>
// // // // // //                 <TableCell>{risk.totalRiskScore}</TableCell>
// // // // // //                 <TableCell>
// // // // // //                   {risk.totalRiskScore === 0 ? 'Completed' : 'In Progress'}
// // // // // //                 </TableCell>
// // // // // //                 <TableCell>
// // // // // //                   <LinearProgress
// // // // // //                     variant='determinate'
// // // // // //                     value={(risk.totalRiskScore / 100) * 100} // Adjust the denominator based on max score
// // // // // //                     sx={{ width: '100%' }}
// // // // // //                   />
// // // // // //                 </TableCell>
// // // // // //               </TableRow>
// // // // // //             ))}
// // // // // //           </TableBody>
// // // // // //         </Table>
// // // // // //       </TableContainer>

// // // // // //       {/* Pie Chart for Risk Evaluation */}
// // // // // //       <Box sx={{ width: '100%', height: 300 }}>
// // // // // //         <ResponsiveContainer width='100%' height='100%'>
// // // // // //           <PieChart>
// // // // // //             <Pie
// // // // // //               data={pieData}
// // // // // //               cx='50%'
// // // // // //               cy='50%'
// // // // // //               outerRadius={80}
// // // // // //               label
// // // // // //               dataKey='value'
// // // // // //             >
// // // // // //               {pieData.map((entry, index) => (
// // // // // //                 <Cell
// // // // // //                   key={`cell-${index}`}
// // // // // //                   fill={COLORS[index % COLORS.length]}
// // // // // //                 />
// // // // // //               ))}
// // // // // //             </Pie>
// // // // // //             <Tooltip />
// // // // // //             <Legend />
// // // // // //           </PieChart>
// // // // // //         </ResponsiveContainer>
// // // // // //       </Box>
// // // // // //     </Box>
// // // // // //   );
// // // // // // };

// // // // // // export default RiskDashboard;
