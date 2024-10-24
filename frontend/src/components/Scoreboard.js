import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  TablePagination,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { styled } from '@mui/system';
import ComplianceSnapshot from './ComplianceSnapshot';

const StatusBadge = styled('span')(({ isCompleted }) => ({
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '12px',
  backgroundColor: isCompleted ? '#4caf50' : '#f44336',
  color: '#fff',
  fontWeight: 600,
  textAlign: 'center',
}));

const COLORS = ['#4caf50', '#f44336']; // Colors for the PieChart

const Scoreboard = () => {
  const [statuses, setStatuses] = useState([]);
  const [filteredActions, setFilteredActions] = useState([]);
  const [filters, setFilters] = useState({
    asset: '',
    controlFamily: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [uniqueAssets, setUniqueAssets] = useState([]);
  const [uniqueControlFamilies, setUniqueControlFamilies] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8021/api/v1/completion-status/all/'
        );
        const data = response.data;
        setStatuses(data);
        setFilteredActions(data);
        setLoading(false);

        const assets = [...new Set(data.map((action) => action.assetId?.name))];
        const controlFamilies = [
          ...new Set(data.map((action) => action.familyId?.fixed_id)),
        ];
        const statuses = [...new Set(data.map((action) => action.status))];

        setUniqueAssets(assets);
        setUniqueControlFamilies(controlFamilies);
        setUniqueStatuses(statuses);
      } catch (err) {
        setError('Failed to fetch statuses.');
        setLoading(false);
      }
    };
    fetchStatuses();
  }, []);

  const handleFilterChange = (filter, value) => {
    const updatedFilters = { ...filters, [filter]: value };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const applyFilters = (filters) => {
    let updatedActions = statuses;

    if (filters.asset) {
      updatedActions = updatedActions.filter(
        (action) => action.assetId?.name === filters.asset
      );
    }

    if (filters.controlFamily) {
      updatedActions = updatedActions.filter(
        (action) => action.familyId?.fixed_id === filters.controlFamily
      );
    }

    if (filters.status) {
      updatedActions = updatedActions.filter(
        (action) => action.status === filters.status
      );
    }

    setFilteredActions(updatedActions);
  };

  const calculateProgress = (actionsArray) => {
    if (!actionsArray.length) return 0;
    const completed = actionsArray.filter(
      (action) => action.isCompleted
    ).length;
    return (completed / actionsArray.length) * 100;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusIcon = (isCompleted) => {
    return isCompleted ? (
      <CheckCircleOutline style={{ color: '#4caf50' }} />
    ) : (
      <ErrorOutline style={{ color: '#f44336' }} />
    );
  };

  // Data for pie chart
  const pieData = [
    {
      name: 'Completed',
      value: filteredActions.filter((a) => a.isCompleted).length,
    },
    {
      name: 'Pending',
      value: filteredActions.filter((a) => !a.isCompleted).length,
    },
  ];

  // Data for bar chart (control family distribution)
  const barData = uniqueControlFamilies.map((family) => {
    return {
      family: family,
      count: filteredActions.filter(
        (action) => action.familyId?.fixed_id === family
      ).length,
    };
  });

  if (loading)
    return (
      <div className='flex justify-center items-center h-screen'>
        <CircularProgress size={60} />
      </div>
    );
  if (error) return <Alert severity='error'>{error}</Alert>;

  const tableData = filteredActions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className='p-5 w-full bg-gray-50 min-h-screen'>
      <h2 className='text-3xl font-bold mb-6 text-center'>Action Scoreboard</h2>
      <ComplianceSnapshot />

      {/* Grid layout for progress and status distribution */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        {/* Completion Progress */}
        <div className='p-6 bg-white shadow rounded-lg'>
          <h3 className='font-semibold'>Completion Progress</h3>
          <div className='w-full mt-2'>
            <LinearProgress
              variant='determinate'
              value={calculateProgress(filteredActions)}
              style={{ height: '10px', borderRadius: '5px' }}
            />
            <div className='text-sm text-gray-500 mt-2'>
              {calculateProgress(filteredActions).toFixed(2)}% Completed
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className='p-6 bg-white shadow rounded-lg'>
          <h3 className='font-semibold'>Status Distribution</h3>
          <ResponsiveContainer width='100%' height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={60}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Control Family Distribution */}
      <div className='p-6 bg-white shadow rounded-lg mb-6'>
        <h3 className='font-semibold'>Control Family Distribution</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='family' />
            <YAxis />
            <ChartTooltip />
            <Legend />
            <Bar dataKey='count' fill='#4caf50' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        {/* Asset Filter */}
        <FormControl fullWidth className='mb-4'>
          <InputLabel>Asset</InputLabel>
          <Select
            value={filters.asset}
            onChange={(e) => handleFilterChange('asset', e.target.value)}
            label='Asset'
          >
            <MenuItem value=''>All Assets</MenuItem>
            {uniqueAssets.map((asset, index) => (
              <MenuItem key={index} value={asset}>
                {asset}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Control Family Filter */}
        <FormControl fullWidth className='mb-4'>
          <InputLabel>Control Family</InputLabel>
          <Select
            value={filters.controlFamily}
            onChange={(e) =>
              handleFilterChange('controlFamily', e.target.value)
            }
            label='Control Family'
          >
            <MenuItem value=''>All Control Families</MenuItem>
            {uniqueControlFamilies.map((family, index) => (
              <MenuItem key={index} value={family}>
                {family}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Filter */}
        <FormControl fullWidth className='mb-4'>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            label='Status'
          >
            <MenuItem value=''>All Statuses</MenuItem>
            {uniqueStatuses.map((status, index) => (
              <MenuItem key={index} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Control Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated By</TableCell>
              <TableCell>Completion Date</TableCell>
              <TableCell>Feedback</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((action) => {
              return (
                <TableRow key={action._id}>
                  <TableCell>{action.assetId?.name}</TableCell>
                  <TableCell>{action.actionId?.variable_id}</TableCell>
                  <TableCell>{action.controlId?.section_main_desc}</TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        action.isCompleted
                          ? 'Completed successfully'
                          : 'Pending action'
                      }
                      arrow
                    >
                      <span className='flex items-center'>
                        {getStatusIcon(action.isCompleted)}
                        <StatusBadge isCompleted={action.isCompleted}>
                          {action.isCompleted ? 'Completed' : 'Pending'}
                        </StatusBadge>
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {action.AssignedBy.username || 'Unknown'} (
                    {action.AssignedBy.role || 'Unknown'})
                  </TableCell>
                  {/* <TableCell>
                    {action.completedAt
                      ? new Date(action.completedAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell> */}
                  <TableCell>
                    {action.completedAt
                      ? new Date(action.completedAt).toLocaleDateString(
                          'en-IN',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }
                        )
                      : 'N/A'}
                  </TableCell>

                  <TableCell>{action.feedback || 'N/A'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredActions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default Scoreboard;
