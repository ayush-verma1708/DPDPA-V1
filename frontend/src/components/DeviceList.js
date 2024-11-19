// import React, { useState } from 'react';
// import { fetchNetworkScan } from '../api/ipService'; // Import the new API function

// const DeviceList = () => {
//   const [devices, setDevices] = useState([]); // State to hold the list of devices
//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState(null); // Error state

//   const fetchDevices = async () => {
//     setLoading(true); // Start loading
//     setError(null); // Clear previous errors
//     try {
//       const data = await fetchNetworkScan(); // Fetch devices using the API
//       setDevices(data.devices || []); // Set the devices into the state
//     } catch (err) {
//       setError('Error fetching devices'); // Handle error
//       console.error(err);
//     } finally {
//       setLoading(false); // Stop loading once done
//     }
//   };

//   return (
//     <div className='device-list-container'>
//       <h2>Network Devices</h2>
//       {loading && <p>Loading devices...</p>} {/* Show loading text */}
//       {error && <p style={{ color: 'red' }}>{error}</p>}{' '}
//       {/* Show error message */}
//       <button onClick={fetchDevices} disabled={loading}>
//         {loading ? 'Fetching Devices...' : 'Get Devices List'}
//       </button>
//       {/* Display list of devices if available */}
//       {devices.length > 0 ? (
//         <ul>
//           {devices.map((device, index) => (
//             <li key={index} className='device-item'>
//               <strong>IP Address:</strong> {device.IP}
//               <br />
//               <strong>Hostnames:</strong> {device.Hostnames.join(', ') || 'N/A'}
//               <br />
//               <strong>OS:</strong> {device.OS || 'Unknown'}
//               <br />
//               <strong>Open Ports:</strong>{' '}
//               {device['Open Ports'].length > 0
//                 ? device['Open Ports'].join(', ')
//                 : 'None'}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         !loading && <p>No devices found.</p> // If no devices, show this message
//       )}
//     </div>
//   );
// };

// export default DeviceList;
