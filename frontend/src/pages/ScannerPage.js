import React, { useState } from 'react';
import { fetchNetworkScan } from '../api/ipService'; // Import the function to fetch network devices
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

// Function to render UI for a TV
const TVDevice = ({ device }) => (
  <div className='device-item tv-device'>
    <h3>{device.IP} (TV)</h3>
    <p>
      <strong>Hostnames:</strong> {device.Hostnames.join(', ') || 'N/A'}
    </p>
    <p>
      <strong>OS:</strong> {device.OS || 'Unknown'}
    </p>
    <p>
      <strong>Open Ports:</strong>{' '}
      {device['Open Ports'].length > 0
        ? device['Open Ports'].join(', ')
        : 'None'}
    </p>
  </div>
);

// Function to render UI for a Router
const RouterDevice = ({ device }) => (
  <div className='device-item router-device'>
    <h3>{device.IP} (Router)</h3>
    <p>
      <strong>Hostnames:</strong> {device.Hostnames.join(', ') || 'N/A'}
    </p>
    <p>
      <strong>OS:</strong> {device.OS || 'Unknown'}
    </p>
    <p>
      <strong>Open Ports:</strong>{' '}
      {device['Open Ports'].length > 0
        ? device['Open Ports'].join(', ')
        : 'None'}
    </p>
  </div>
);

const ScannerPage = () => {
  const [devices, setDevices] = useState([]); // State to hold the devices
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch devices
  const fetchDevices = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      const data = await fetchNetworkScan(); // Fetch the devices using the API
      setDevices(data.devices || []); // Set the devices into state
    } catch (err) {
      setError('Error fetching devices'); // Handle error
      console.error(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className='scanner-page-container'>
      <h2>Network Devices</h2>

      {/* Loading state */}
      {loading && <p className='loading-message'>Loading devices...</p>}

      {/* Error message */}
      {error && <p className='error-message'>{error}</p>}

      {/* Fetch Devices Button */}
      <button onClick={fetchDevices} disabled={loading}>
        {loading ? 'Fetching Devices...' : 'Get Devices List'}
      </button>

      {/* Device List */}
      {devices.length > 0 ? (
        <div className='device-list-container'>
          {devices.map((device, index) => {
            if (isTV(device)) {
              return <TVDevice key={index} device={device} />;
            }
            if (isRouter(device)) {
              return <RouterDevice key={index} device={device} />;
            }
            return (
              <div key={index} className='device-item'>
                <h3>{device.IP}</h3>
                <p>
                  <strong>Hostnames:</strong>{' '}
                  {device.Hostnames.join(', ') || 'N/A'}
                </p>
                <p>
                  <strong>OS:</strong> {device.OS || 'Unknown'}
                </p>
                <p>
                  <strong>Open Ports:</strong>{' '}
                  {device['Open Ports'].length > 0
                    ? device['Open Ports'].join(', ')
                    : 'None'}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && <p>No devices found.</p> // If no devices, show this message
      )}
    </div>
  );
};

export default ScannerPage;

// import React, { useState } from 'react';
// import { fetchNetworkScan } from '../api/ipService'; // Import the function to fetch network devices
// import './ScannerPage.css';

// const ScannerPage = () => {
//   const [devices, setDevices] = useState([]); // State to hold the devices
//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState(null); // Error state

//   // Function to fetch devices
//   const fetchDevices = async () => {
//     setLoading(true); // Start loading
//     setError(null); // Clear previous errors
//     try {
//       const data = await fetchNetworkScan(); // Fetch the devices using the API
//       setDevices(data.devices || []); // Set the devices into state
//     } catch (err) {
//       setError('Error fetching devices'); // Handle error
//       console.error(err);
//     } finally {
//       setLoading(false); // Stop loading
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

//       {/* Device List */}
//       {devices.length > 0 ? (
//         <div className='device-list-container'>
//           {devices.map((device, index) => (
//             <div key={index} className='device-item'>
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
//         !loading && <p>No devices found.</p> // If no devices, show this message
//       )}
//     </div>
//   );
// };

// export default ScannerPage;
