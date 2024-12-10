import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import AzureLogin from './AzureLogin';
import AWSLogin from './AWSLogin';
import GCPLogin from './GCPLogin';

const CloudScanner = () => {
  const [activeTab, setActiveTab] = useState('azure');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label='Azure' value='azure' />
        <Tab label='AWS' value='aws' disabled />
        <Tab label='GCP' value='gcp' disabled />
      </Tabs>
      <Box className='tab-content'>
        {activeTab === 'azure' && <AzureLogin />}
        {activeTab === 'aws' && <AWSLogin />}
        {activeTab === 'gcp' && <GCPLogin />}
      </Box>
    </Box>
  );
};

export default CloudScanner;
