import React, { useState } from 'react';
import { fetchNetworkScan, analyzePackets } from '../api/ipService'; // API for packet analysis
import DeviceList from '../components/DeviceList'; // Import the device list component
import DeviceStats from '../components/DeviceStats'; // Import the device stats component
import AzureLogin from '../components/AzureLogin'; // Import the device stats component
import AzureDetails from '../components/AzureDetails';
import './ScannerPage.css';

// Function to detect if the device is a TV
const isTV = (device) => {
  return device.Hostnames.some((hostname) =>
    hostname.toLowerCase().includes('tv')
  );
};

// Function to detect if the device is a Router
const isRouter = (device) => {
  return (
    device.OS.toLowerCase().includes('router') ||
    device.Hostnames.some((hostname) =>
      hostname.toLowerCase().includes('router')
    )
  );
};

// Function to detect if the device is a Mobile
const isMobile = (device) => {
  return (
    device.OS.toLowerCase().includes('android') ||
    device.OS.toLowerCase().includes('ios')
  );
};

// Function to detect if the device is a Laptop
const isLaptop = (device) => {
  return (
    device.OS.toLowerCase().includes('windows') ||
    device.OS.toLowerCase().includes('mac') ||
    device.OS.toLowerCase().includes('linux')
  );
};

const ScannerPage = () => {
  const [devices, setDevices] = useState([]); // State to hold the devices
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [deviceStats, setDeviceStats] = useState({
    tv: 0,
    router: 0,
    mobile: 0,
    laptop: 0,
    other: 0,
  }); // State to hold the device statistics
  const [selectedDevices, setSelectedDevices] = useState([]); // State to track selected devices

  const [isAzureLoggedIn, setIsAzureLoggedIn] = useState(false);
  const [azureUserData, setAzureUserData] = useState(null);

  // Function to fetch devices
  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNetworkScan();
      setDevices(data.devices || []);
      updateDeviceStats(data.devices || []);
    } catch (err) {
      setError('Error fetching devices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to update device stats
  const updateDeviceStats = (devices) => {
    const stats = devices.reduce(
      (acc, device) => {
        if (isTV(device)) acc.tv++;
        else if (isRouter(device)) acc.router++;
        else if (isMobile(device)) acc.mobile++;
        else if (isLaptop(device)) acc.laptop++;
        else acc.other++;
        return acc;
      },
      { tv: 0, router: 0, mobile: 0, laptop: 0, other: 0 }
    );
    setDeviceStats(stats);
  };

  // Handle device selection
  const handleDeviceSelection = (deviceIP) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceIP)
        ? prev.filter((ip) => ip !== deviceIP)
        : [...prev, deviceIP]
    );
  };

  // Analyze packets of selected devices
  const analyzeSelectedDevices = async () => {
    if (selectedDevices.length === 0) {
      alert('Please select at least one device for analysis.');
      return;
    }

    try {
      const analysisResults = await analyzePackets(selectedDevices);
      console.log('Packet Analysis Results:', analysisResults);
      // You can display these results in a new section or modal.
    } catch (err) {
      console.error('Error analyzing packets:', err);
      alert('Error analyzing packets');
    }
  };

  return (
    <div className='scanner-page'>
      <header className='scanner-header'>
        <h1>Network Scanner</h1>
        <AzureLogin
          setIsLoggedIn={setIsAzureLoggedIn}
          setUserData={setAzureUserData}
          setError={setError}
        />
        {isAzureLoggedIn && azureUserData && (
          <div className='user-info'>
            <p>Welcome, {azureUserData.username}</p>
          </div>
        )}
      </header>

      <main className='scanner-content'>
        {error && <p className='error-message'>{error}</p>}

        <div className='actions'>
          <button
            className='btn-primary'
            onClick={fetchDevices}
            disabled={loading}
          >
            {loading ? 'Fetching Devices...' : 'Get Devices List'}
          </button>

          {devices.length > 0 && (
            <button
              className='btn-secondary'
              onClick={analyzeSelectedDevices}
              disabled={selectedDevices.length === 0}
            >
              Analyze Selected Devices
            </button>
          )}
        </div>

        {loading && <p className='loading-message'>Loading devices...</p>}

        {!loading && devices.length === 0 && (
          <p className='no-devices-message'>
            No devices found. Please scan the network.
          </p>
        )}

        {devices.length > 0 && (
          <>
            <DeviceStats deviceStats={deviceStats} />
            <DeviceList
              devices={devices}
              selectedDevices={selectedDevices}
              handleDeviceSelection={handleDeviceSelection}
            />
          </>
        )}
      </main>

      {/* <AzureDetails /> */}
    </div>
  );
};

export default ScannerPage;
