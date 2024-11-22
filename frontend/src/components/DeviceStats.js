import React from 'react';
import { Stack, Chip, Tooltip, Box, Typography } from '@mui/material';
import { DevicesOther, Security, Warning } from '@mui/icons-material';

const DeviceStats = ({ stats = {} }) => {
  const {
    totalDevices = 0,
    activeDevices = 0,
    vulnerabilities = 0,
    lastScan = null,
  } = stats || {};

  if (!stats) {
    return (
      <Stack direction='row' spacing={2} alignItems='center'>
        <Typography color='textSecondary'>Loading stats...</Typography>
      </Stack>
    );
  }

  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <Tooltip title='Total Devices'>
        <Chip
          icon={<DevicesOther />}
          label={`${totalDevices} devices`}
          color='primary'
          variant='outlined'
        />
      </Tooltip>

      {activeDevices > 0 && (
        <Tooltip title='Active Devices'>
          <Chip
            icon={<Security />}
            label={`${activeDevices} active`}
            color='success'
            variant='outlined'
          />
        </Tooltip>
      )}

      {vulnerabilities > 0 && (
        <Tooltip title='Vulnerabilities Detected'>
          <Chip
            icon={<Warning />}
            label={`${vulnerabilities} issues`}
            color='error'
            variant='outlined'
          />
        </Tooltip>
      )}

      {lastScan && (
        <Box>
          <Typography variant='caption' color='textSecondary'>
            Last Scan: {new Date(lastScan).toLocaleString()}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default DeviceStats;
