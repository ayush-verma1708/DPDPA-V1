import React, { useState } from 'react';
import { Box, Typography, Container, Tabs, Tab } from '@mui/material';
import {
  Business,
  Storage,
  Cloud,
  Router,
  Dashboard,
} from '@mui/icons-material';

import NetworkScanner from '../components/NetworkScanner';
import CloudScanner from '../components/CloudScanner';
import { DBScanner } from '../components/DBScanner';
import { SAASScanner } from '../components/SAASScanner';
import { LOBApplication } from '../components/LOBApplication';

const AzureLogin = () => {
  const [mainTab, setMainTab] = useState(0);

  return (
    <>
      <Box>
        <Container>
          <Box>
            <Tabs
              value={mainTab}
              onChange={(e, v) => setMainTab(v)}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
            >
              <Tab
                icon={<Router />}
                label='Network Scanner'
                iconPosition='start'
              />
              <Tab
                icon={<Cloud />}
                label='Cloud Provider'
                iconPosition='start'
              />
              <Tab icon={<Storage />} label='DB Scanner' iconPosition='start' />
              <Tab
                icon={<Business />}
                label='SAAS Scanner'
                iconPosition='start'
              />
              <Tab
                icon={<Dashboard />}
                label='LOB Application'
                iconPosition='start'
              />
            </Tabs>

            {mainTab === 0 && <NetworkScanner />}
            {mainTab === 1 && <CloudScanner />}
            {mainTab === 2 && <DBScanner />}
            {mainTab === 3 && <SAASScanner />}
            {mainTab === 4 && <LOBApplication />}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AzureLogin;
