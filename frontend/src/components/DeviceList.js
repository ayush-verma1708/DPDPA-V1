import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import {
  Computer,
  PhoneAndroid,
  Router as RouterIcon,
  Wifi,
  Warning,
  CheckCircle,
  Refresh,
  Search,
} from '@mui/icons-material';

const DeviceList = ({ onStatsUpdate = () => {} }) => {
  const [devices, setDevices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockDevices = [
      {
        id: 1,
        name: 'Office-PC-001',
        type: 'computer',
        ip: '192.168.1.100',
        status: 'active',
        lastSeen: new Date(),
        vulnerabilities: 2,
      },
      {
        id: 2,
        name: 'Mobile-001',
        type: 'mobile',
        ip: '192.168.1.101',
        status: 'active',
        lastSeen: new Date(),
        vulnerabilities: 0,
      },
      {
        id: 3,
        name: 'Router-Main',
        type: 'router',
        ip: '192.168.1.1',
        status: 'active',
        lastSeen: new Date(),
        vulnerabilities: 1,
      },
    ];

    setDevices(mockDevices);

    // Add try-catch for stats update
    try {
      const stats = {
        totalDevices: mockDevices.length,
        activeDevices: mockDevices.filter((d) => d.status === 'active').length,
        vulnerabilities: mockDevices.reduce(
          (acc, d) => acc + (d.vulnerabilities || 0),
          0
        ),
        lastScan: new Date(),
      };
      onStatsUpdate(stats);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }, [onStatsUpdate]); // Add onStatsUpdate to dependency array

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'computer':
        return <Computer />;
      case 'mobile':
        return <PhoneAndroid />;
      case 'router':
        return <RouterIcon />;
      default:
        return <Wifi />;
    }
  };

  const getStatusChip = (status, vulnerabilities) => (
    <Stack direction='row' spacing={1}>
      <Chip
        size='small'
        icon={status === 'active' ? <CheckCircle /> : <Warning />}
        label={status}
        color={status === 'active' ? 'success' : 'warning'}
      />
      {vulnerabilities > 0 && (
        <Chip
          size='small'
          icon={<Warning />}
          label={`${vulnerabilities} issues`}
          color='error'
        />
      )}
    </Stack>
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Device</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Seen</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((device) => (
                <TableRow key={device.id} hover>
                  <TableCell>
                    <Stack direction='row' spacing={1} alignItems='center'>
                      {getDeviceIcon(device.type)}
                      <Typography>{device.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{device.ip}</TableCell>
                  <TableCell>
                    {getStatusChip(device.status, device.vulnerabilities)}
                  </TableCell>
                  <TableCell>{device.lastSeen.toLocaleString()}</TableCell>
                  <TableCell align='right'>
                    <Tooltip title='Scan Device'>
                      <IconButton size='small'>
                        <Search />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={devices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
};

export default DeviceList;
