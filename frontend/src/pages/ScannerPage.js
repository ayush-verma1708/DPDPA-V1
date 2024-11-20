import React, { useState } from 'react';
import { fetchNetworkScan, analyzePackets } from '../api/ipService'; // API for packet analysis
import DeviceList from '../components/DeviceList'; // Import the device list component
import DeviceStats from '../components/DeviceStats'; // Import the device stats component
import AzureLogin from '../components/AzureLogin'; // Import the device stats component
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
  const [azureUserData, setazureUserData] = useState(null);

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
    <div className='scanner-page-container'>
      <h2>Network Devices</h2>
      <AzureLogin
        setIsLoggedIn={isAzureLoggedIn}
        setUserData={azureUserData}
        setError={setError}
      />

      {loading && <p className='loading-message'>Loading devices...</p>}
      {error && <p className='error-message'>{error}</p>}

      <button onClick={fetchDevices} disabled={loading}>
        {loading ? 'Fetching Devices...' : 'Get Devices List'}
      </button>

      <DeviceStats deviceStats={deviceStats} />

      {devices.length > 0 ? (
        <DeviceList
          devices={devices}
          selectedDevices={selectedDevices}
          handleDeviceSelection={handleDeviceSelection}
        />
      ) : (
        !loading && <p>No devices found.</p>
      )}

      <button onClick={analyzeSelectedDevices} disabled={loading}>
        Analyze Packets of Selected Devices
      </button>
    </div>
  );
};

export default ScannerPage;

// import React, { useState } from 'react';
// import { fetchNetworkScan, analyzePackets } from '../api/ipService'; // API for packet analysis
// import './ScannerPage.css';

// // Define the device types detection functions as before (isTV, isRouter, isMobile, etc.)

// const ScannerPage = () => {
//   const [devices, setDevices] = useState([]); // State to hold the devices
//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const [deviceStats, setDeviceStats] = useState({
//     tv: 0,
//     router: 0,
//     mobile: 0,
//     laptop: 0,
//     other: 0,
//   }); // State to hold the device statistics
//   const [selectedDevices, setSelectedDevices] = useState([]); // State to track selected devices

//   // Function to fetch devices
//   const fetchDevices = async () => {
//     setLoading(true); // Start loading
//     setError(null); // Clear previous errors
//     try {
//       const data = await fetchNetworkScan(); // Fetch the devices using the API
//       setDevices(data.devices || []); // Set the devices into state
//       updateDeviceStats(data.devices || []); // Update device stats
//     } catch (err) {
//       setError('Error fetching devices'); // Handle error
//       console.error(err);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // Function to handle device selection (checkboxes)
//   const handleDeviceSelection = (deviceIP) => {
//     setSelectedDevices(
//       (prev) =>
//         prev.includes(deviceIP)
//           ? prev.filter((ip) => ip !== deviceIP) // Deselect if already selected
//           : [...prev, deviceIP] // Add if not selected
//     );
//   };

//   // Function to trigger packet analysis
//   const analyzeSelectedDevices = async () => {
//     if (selectedDevices.length === 0) {
//       alert('Please select at least one device for analysis.');
//       return;
//     }

//     try {
//       const analysisResults = await analyzePackets(selectedDevices);
//       console.log('Packet Analysis Results:', analysisResults);
//       // You can display these results in a new section or modal.
//     } catch (err) {
//       console.error('Error analyzing packets:', err);
//       alert('Error analyzing packets');
//     }
//   };

//   return (
//     <div className='scanner-page-container'>
//       <h2>Network Devices</h2>

//       {/* Loading state */}
//       {loading && <p className='loading-message'>Loading devices...</p>}

//       {/* Error message */}
//       {error && <p className='error-message'>{error}</p>}

//       {/* Fetch Devices Button */}
//       <button onClick={fetchDevices} disabled={loading}>
//         {loading ? 'Fetching Devices...' : 'Get Devices List'}
//       </button>

//       {/* Device Statistics */}
//       <div className='device-stats'>
//         <h3>Device Statistics:</h3>
//         <ul>
//           <li>TVs: {deviceStats.tv}</li>
//           <li>Routers: {deviceStats.router}</li>
//           <li>Mobiles: {deviceStats.mobile}</li>
//           <li>Laptops: {deviceStats.laptop}</li>
//           <li>Other: {deviceStats.other}</li>
//         </ul>
//       </div>

//       {/* Device List with Checkboxes */}
//       {devices.length > 0 ? (
//         <div className='device-list-container'>
//           {devices.map((device, index) => (
//             <div key={index} className='device-item'>
//               <input
//                 type='checkbox'
//                 checked={selectedDevices.includes(device.IP)}
//                 onChange={() => handleDeviceSelection(device.IP)}
//               />
//               <h3>{device.IP}</h3>
//               <p>
//                 <strong>Hostnames:</strong>{' '}
//                 {device.Hostnames.join(', ') || 'N/A'}
//               </p>
//               <p>
//                 <strong>OS:</strong> {device.OS || 'Unknown'}
//               </p>
//               <p>
//                 <strong>Open Ports:</strong>{' '}
//                 {device['Open Ports'].length > 0
//                   ? device['Open Ports'].join(', ')
//                   : 'None'}
//               </p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         !loading && <p>No devices found.</p>
//       )}

//       {/* Button to start packet analysis */}
//       <button onClick={analyzeSelectedDevices} disabled={loading}>
//         Analyze Packets of Selected Devices
//       </button>
//     </div>
//   );
// };

// export default ScannerPage;

// // import React, { useState } from 'react';
// // import { fetchNetworkScan } from '../api/ipService'; // Import the function to fetch network devices
// // import './ScannerPage.css';

// // // Function to render UI for a TV
// // const TVDevice = ({ device }) => (
// //   <div className='device-item tv-device'>
// //     <h3>{device.IP} (TV)</h3>
// //     <p>
// //       <strong>Hostnames:</strong> {device.Hostnames.join(', ') || 'N/A'}
// //     </p>
// //     <p>
// //       <strong>OS:</strong> {device.OS || 'Unknown'}
// //     </p>
// //     <p>
// //       <strong>Open Ports:</strong>{' '}
// //       {device['Open Ports'].length > 0
// //         ? device['Open Ports'].join(', ')
// //         : 'None'}
// //     </p>
// //   </div>
// // );

// // // Function to render UI for a Router
// // const RouterDevice = ({ device }) => (
// //   <div className='device-item router-device'>
// //     <h3>{device.IP} (Router)</h3>
// //     <p>
// //       <strong>Hostnames:</strong> {device.Hostnames.join(', ') || 'N/A'}
// //     </p>
// //     <p>
// //       <strong>OS:</strong> {device.OS || 'Unknown'}
// //     </p>
// //     <p>
// //       <strong>Open Ports:</strong>{' '}
// //       {device['Open Ports'].length > 0
// //         ? device['Open Ports'].join(', ')
// //         : 'None'}
// //     </p>
// //   </div>
// // );

// // // Function to render UI for a Mobile
// // const MobileDevice = ({ device }) => (
// //   <div className='device-item mobile-device'>
// //     <h3>{device.IP} (Mobile)</h3>
// //     <p>
// //       <strong>Hostnames:</strong> {device.Hostnames.join(', ') || 'N/A'}
// //     </p>
// //     <p>
// //       <strong>OS:</strong> {device.OS || 'Unknown'}
// //     </p>
// //     <p>
// //       <strong>Open Ports:</strong>{' '}
// //       {device['Open Ports'].length > 0
// //         ? device['Open Ports'].join(', ')
// //         : 'None'}
// //     </p>
// //   </div>
// // );

// // // Function to render UI for a Laptop
// // const LaptopDevice = ({ device }) => (
// //   <div className='device-item laptop-device'>
// //     <h3>{device.IP} (Laptop)</h3>
// //     <p>
// //       <strong>Hostnames:</strong> {device.Hostnames.join(', ') || 'N/A'}
// //     </p>
// //     <p>
// //       <strong>OS:</strong> {device.OS || 'Unknown'}
// //     </p>
// //     <p>
// //       <strong>Open Ports:</strong>{' '}
// //       {device['Open Ports'].length > 0
// //         ? device['Open Ports'].join(', ')
// //         : 'None'}
// //     </p>
// //   </div>
// // );

// // const ScannerPage = () => {
// //   const [devices, setDevices] = useState([]); // State to hold the devices
// //   const [loading, setLoading] = useState(false); // Loading state
// //   const [error, setError] = useState(null); // Error state
// //   const [deviceStats, setDeviceStats] = useState({
// //     tv: 0,
// //     router: 0,
// //     mobile: 0,
// //     laptop: 0,
// //     other: 0,
// //   }); // State to hold the device statistics

// //   // Function to fetch devices
// //   const fetchDevices = async () => {
// //     setLoading(true); // Start loading
// //     setError(null); // Clear previous errors
// //     try {
// //       const data = await fetchNetworkScan(); // Fetch the devices using the API
// //       setDevices(data.devices || []); // Set the devices into state
// //       updateDeviceStats(data.devices || []); // Update device stats
// //     } catch (err) {
// //       setError('Error fetching devices'); // Handle error
// //       console.error(err);
// //     } finally {
// //       setLoading(false); // Stop loading
// //     }
// //   };

// //   // Function to update the statistics of devices
// //   const updateDeviceStats = (devices) => {
// //     let stats = { tv: 0, router: 0, mobile: 0, laptop: 0, other: 0 };

// //     devices.forEach((device) => {
// //       if (isTV(device)) stats.tv += 1;
// //       else if (isRouter(device)) stats.router += 1;
// //       else if (isMobile(device)) stats.mobile += 1;
// //       else if (isLaptop(device)) stats.laptop += 1;
// //       else stats.other += 1;
// //     });

// //     setDeviceStats(stats); // Update the device statistics state
// //   };

// //   return (
// //     <div className='scanner-page-container'>
// //       <h2>Network Devices</h2>

// //       {/* Loading state */}
// //       {loading && <p className='loading-message'>Loading devices...</p>}

// //       {/* Error message */}
// //       {error && <p className='error-message'>{error}</p>}

// //       {/* Fetch Devices Button */}
// //       <button onClick={fetchDevices} disabled={loading}>
// //         {loading ? 'Fetching Devices...' : 'Get Devices List'}
// //       </button>

// //       {/* Device Statistics */}
// //       <div className='device-stats'>
// //         <h3>Device Statistics:</h3>
// //         <ul>
// //           <li>TVs: {deviceStats.tv}</li>
// //           <li>Routers: {deviceStats.router}</li>
// //           <li>Mobiles: {deviceStats.mobile}</li>
// //           <li>Laptops: {deviceStats.laptop}</li>
// //           <li>Other: {deviceStats.other}</li>
// //         </ul>
// //       </div>

// //       {/* Device List */}
// //       {devices.length > 0 ? (
// //         <div className='device-list-container'>
// //           {devices.map((device, index) => {
// //             if (isTV(device)) {
// //               return <TVDevice key={index} device={device} />;
// //             }
// //             if (isRouter(device)) {
// //               return <RouterDevice key={index} device={device} />;
// //             }
// //             if (isMobile(device)) {
// //               return <MobileDevice key={index} device={device} />;
// //             }
// //             if (isLaptop(device)) {
// //               return <LaptopDevice key={index} device={device} />;
// //             }
// //             return (
// //               <div key={index} className='device-item'>
// //                 <h3>{device.IP}</h3>
// //                 <p>
// //                   <strong>Hostnames:</strong>{' '}
// //                   {device.Hostnames.join(', ') || 'N/A'}
// //                 </p>
// //                 <p>
// //                   <strong>OS:</strong> {device.OS || 'Unknown'}
// //                 </p>
// //                 <p>
// //                   <strong>Open Ports:</strong>{' '}
// //                   {device['Open Ports'].length > 0
// //                     ? device['Open Ports'].join(', ')
// //                     : 'None'}
// //                 </p>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       ) : (
// //         !loading && <p>No devices found.</p> // If no devices, show this message
// //       )}
// //     </div>
// //   );
// // };

// // export default ScannerPage;

// // // import React, { useState } from 'react';
// // // import { fetchNetworkScan } from '../api/ipService'; // Import the function to fetch network devices
// // // import './ScannerPage.css';

// // // // Function to detect if the device is a TV
// // // const isTV = (device) => {
// // //   return device.Hostnames.some((hostname) =>
// // //     hostname.toLowerCase().includes('tv')
// // //   );
// // // };

// // // // Function to detect if the device is a Router
// // // const isRouter = (device) => {
// // //   return (
// // //     device.OS.toLowerCase().includes('router') ||
// // //     device.Hostnames.some((hostname) =>
// // //       hostname.toLowerCase().includes('router')
// // //     )
// // //   );
// // // };

// // // // Function to render UI for a TV
// // // const TVDevice = ({ device }) => (
// // //   <div className='device-item tv-device'>
// // //     <h3>{device.IP} (TV)</h3>
// // //     <p>
// // //       <strong>Hostnames:</strong> {device.Hostnames.join(', ') || 'N/A'}
// // //     </p>
// // //     <p>
// // //       <strong>OS:</strong> {device.OS || 'Unknown'}
// // //     </p>
// // //     <p>
// // //       <strong>Open Ports:</strong>{' '}
// // //       {device['Open Ports'].length > 0
// // //         ? device['Open Ports'].join(', ')
// // //         : 'None'}
// // //     </p>
// // //   </div>
// // // );

// // // // Function to render UI for a Router
// // // const RouterDevice = ({ device }) => (
// // //   <div className='device-item router-device'>
// // //     <h3>{device.IP} (Router)</h3>
// // //     <p>
// // //       <strong>Hostnames:</strong> {device.Hostnames.join(', ') || 'N/A'}
// // //     </p>
// // //     <p>
// // //       <strong>OS:</strong> {device.OS || 'Unknown'}
// // //     </p>
// // //     <p>
// // //       <strong>Open Ports:</strong>{' '}
// // //       {device['Open Ports'].length > 0
// // //         ? device['Open Ports'].join(', ')
// // //         : 'None'}
// // //     </p>
// // //   </div>
// // // );

// // // const ScannerPage = () => {
// // //   const [devices, setDevices] = useState([]); // State to hold the devices
// // //   const [loading, setLoading] = useState(false); // Loading state
// // //   const [error, setError] = useState(null); // Error state

// // //   // Function to fetch devices
// // //   const fetchDevices = async () => {
// // //     setLoading(true); // Start loading
// // //     setError(null); // Clear previous errors
// // //     try {
// // //       const data = await fetchNetworkScan(); // Fetch the devices using the API
// // //       setDevices(data.devices || []); // Set the devices into state
// // //     } catch (err) {
// // //       setError('Error fetching devices'); // Handle error
// // //       console.error(err);
// // //     } finally {
// // //       setLoading(false); // Stop loading
// // //     }
// // //   };

// // //   return (
// // //     <div className='scanner-page-container'>
// // //       <h2>Network Devices</h2>

// // //       {/* Loading state */}
// // //       {loading && <p className='loading-message'>Loading devices...</p>}

// // //       {/* Error message */}
// // //       {error && <p className='error-message'>{error}</p>}

// // //       {/* Fetch Devices Button */}
// // //       <button onClick={fetchDevices} disabled={loading}>
// // //         {loading ? 'Fetching Devices...' : 'Get Devices List'}
// // //       </button>

// // //       {/* Device List */}
// // //       {devices.length > 0 ? (
// // //         <div className='device-list-container'>
// // //           {devices.map((device, index) => {
// // //             if (isTV(device)) {
// // //               return <TVDevice key={index} device={device} />;
// // //             }
// // //             if (isRouter(device)) {
// // //               return <RouterDevice key={index} device={device} />;
// // //             }
// // //             return (
// // //               <div key={index} className='device-item'>
// // //                 <h3>{device.IP}</h3>
// // //                 <p>
// // //                   <strong>Hostnames:</strong>{' '}
// // //                   {device.Hostnames.join(', ') || 'N/A'}
// // //                 </p>
// // //                 <p>
// // //                   <strong>OS:</strong> {device.OS || 'Unknown'}
// // //                 </p>
// // //                 <p>
// // //                   <strong>Open Ports:</strong>{' '}
// // //                   {device['Open Ports'].length > 0
// // //                     ? device['Open Ports'].join(', ')
// // //                     : 'None'}
// // //                 </p>
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       ) : (
// // //         !loading && <p>No devices found.</p> // If no devices, show this message
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default ScannerPage;

// // // // import React, { useState } from 'react';
// // // // import { fetchNetworkScan } from '../api/ipService'; // Import the function to fetch network devices
// // // // import './ScannerPage.css';

// // // // const ScannerPage = () => {
// // // //   const [devices, setDevices] = useState([]); // State to hold the devices
// // // //   const [loading, setLoading] = useState(false); // Loading state
// // // //   const [error, setError] = useState(null); // Error state

// // // //   // Function to fetch devices
// // // //   const fetchDevices = async () => {
// // // //     setLoading(true); // Start loading
// // // //     setError(null); // Clear previous errors
// // // //     try {
// // // //       const data = await fetchNetworkScan(); // Fetch the devices using the API
// // // //       setDevices(data.devices || []); // Set the devices into state
// // // //     } catch (err) {
// // // //       setError('Error fetching devices'); // Handle error
// // // //       console.error(err);
// // // //     } finally {
// // // //       setLoading(false); // Stop loading
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className='scanner-page-container'>
// // // //       <h2>Network Devices</h2>

// // // //       {/* Loading state */}
// // // //       {loading && <p className='loading-message'>Loading devices...</p>}

// // // //       {/* Error message */}
// // // //       {error && <p className='error-message'>{error}</p>}

// // // //       {/* Fetch Devices Button */}
// // // //       <button onClick={fetchDevices} disabled={loading}>
// // // //         {loading ? 'Fetching Devices...' : 'Get Devices List'}
// // // //       </button>

// // // //       {/* Device List */}
// // // //       {devices.length > 0 ? (
// // // //         <div className='device-list-container'>
// // // //           {devices.map((device, index) => (
// // // //             <div key={index} className='device-item'>
// // // //               <h3>{device.IP}</h3>
// // // //               <p>
// // // //                 <strong>Hostnames:</strong>{' '}
// // // //                 {device.Hostnames.join(', ') || 'N/A'}
// // // //               </p>
// // // //               <p>
// // // //                 <strong>OS:</strong> {device.OS || 'Unknown'}
// // // //               </p>
// // // //               <p>
// // // //                 <strong>Open Ports:</strong>{' '}
// // // //                 {device['Open Ports'].length > 0
// // // //                   ? device['Open Ports'].join(', ')
// // // //                   : 'None'}
// // // //               </p>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       ) : (
// // // //         !loading && <p>No devices found.</p> // If no devices, show this message
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ScannerPage;
